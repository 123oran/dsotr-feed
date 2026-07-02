// ============================================================================
// DSOTR Feed — batch clip renderer
// ----------------------------------------------------------------------------
// Records ONE animation loop of every poster (issue × model × mode) and writes
// it to ../media/<issue>-<model>-<mode>.mp4 — the exact files /api/publish hands
// to Instagram, and that the app's Share button maps to.
//
// It can't be a browser screen-grab: the prismatic art is a cross-origin iframe,
// so in-page canvas capture comes back blank. Instead this drives a real
// (headless) Chromium via Playwright — which records rendered pixels at the
// browser level, cross-origin frames included — then transcodes to MP4/H.264
// with a bundled ffmpeg (ffmpeg-static). No system ffmpeg needed.
//
// Usage:
//   npm install                 # once, in this folder
//   npx playwright install chromium
//   npm run render              # all 50 clips  (~10-15 min)
//   node render-clips.mjs --only suicide-head     # just one combo (both sides)
//   node render-clips.mjs --issue safety          # one issue, all models/sides
//   node render-clips.mjs --seconds 5.6 --warmup 5 --fps 30
//   node render-clips.mjs --list                  # print the combo list, render nothing
//
// Flags: --seconds (loop length, default 6) · --warmup (s before recording the
// tail, default 4) · --fps (30) · --width/--height (1080×1350, IG 4:5) · --base
// (WxH the poster is laid out at before scaling, default 360x450) · --port ·
// --headed (watch it) · --keep-webm · --only/--issue/--model/--mode filters.
//
// NOTE ON SEAMLESS LOOPS: the model spins continuously, so a clip loops cleanly
// only when --seconds equals one full rotation. Eyeball one clip and nudge
// --seconds until the wrap is invisible; then render the whole set with it.
// ============================================================================

import http from "node:http";
import { mkdir, rm, stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { chromium } from "playwright";
import ffmpegPath from "ffmpeg-static";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FEED_ROOT = path.resolve(__dirname, "..");
const MEDIA_DIR = path.join(FEED_ROOT, "media");
const TMP_DIR = path.join(__dirname, ".tmp");

const ISSUES = ["suicide", "bullying", "identity", "safety", "politics"];
const MODELS = ["head", "fist", "eye", "hand", "mouth"];
const MODES = ["light", "dark"];

// ---- args -----------------------------------------------------------------
const argv = process.argv.slice(2);
const opt = (name, def) => {
  const i = argv.indexOf("--" + name);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : def;
};
const flag = (name) => argv.includes("--" + name);

const SECONDS = Number(opt("seconds", 6));
const WARMUP = Number(opt("warmup", 4));
const FPS = Number(opt("fps", 30));
const OUT_W = Number(opt("width", 1080));
const OUT_H = Number(opt("height", 1350));
const [BASE_W, BASE_H] = String(opt("base", "360x450")).split("x").map(Number);
const PORT = Number(opt("port", 5599));
const HEADED = flag("headed");
const KEEP = flag("keep-webm");

let combos = [];
for (const issue of ISSUES) for (const model of MODELS) for (const mode of MODES) combos.push({ issue, model, mode });
const only = opt("only", null);
if (only) { const [i, m] = only.split("-"); combos = combos.filter((c) => c.issue === i && c.model === m); }
if (opt("issue", null)) combos = combos.filter((c) => c.issue === opt("issue", null));
if (opt("model", null)) combos = combos.filter((c) => c.model === opt("model", null));
if (opt("mode", null)) combos = combos.filter((c) => c.mode === opt("mode", null));

if (flag("list")) {
  console.log(combos.map((c) => `${c.issue}-${c.model}-${c.mode}`).join("\n"));
  process.exit(0);
}
if (!ffmpegPath) {
  console.error("ffmpeg-static did not provide a binary. Run `npm install` in this folder first.");
  process.exit(1);
}
if (!combos.length) { console.error("No combos match those filters."); process.exit(1); }

// ---- tiny static server for the feed folder -------------------------------
const MIME = {
  ".html": "text/html", ".css": "text/css", ".js": "application/javascript",
  ".mjs": "application/javascript", ".jsx": "application/javascript",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".svg": "image/svg+xml", ".ttf": "font/ttf", ".woff": "font/woff",
  ".woff2": "font/woff2", ".mp4": "video/mp4",
};
const server = http.createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    let filePath = path.normalize(path.join(FEED_ROOT, urlPath));
    if (!filePath.startsWith(FEED_ROOT)) { res.writeHead(403); return res.end("forbidden"); }
    let s;
    try { s = await stat(filePath); } catch { res.writeHead(404); return res.end("not found"); }
    if (s.isDirectory()) filePath = path.join(filePath, "index.html");
    res.setHeader("Content-Type", MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream");
    createReadStream(filePath).pipe(res);
  } catch (e) { res.writeHead(500); res.end(String(e)); }
});
await new Promise((r) => server.listen(PORT, r));
const ORIGIN = `http://localhost:${PORT}`;

const run = (cmd, args) => new Promise((resolve, reject) => {
  const p = spawn(cmd, args, { stdio: ["ignore", "ignore", "pipe"] });
  let err = "";
  p.stderr.on("data", (d) => (err += d));
  p.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`${path.basename(cmd)} exited ${code}\n${err.slice(-800)}`))));
});

// ---- render ---------------------------------------------------------------
await mkdir(MEDIA_DIR, { recursive: true });
await mkdir(TMP_DIR, { recursive: true });

console.log(`serving ${FEED_ROOT}`);
console.log(`rendering ${combos.length} clip(s) @ ${OUT_W}×${OUT_H}, ${SECONDS}s loop (+${WARMUP}s warm-up), ${FPS}fps\n`);

const browser = await chromium.launch({ headless: !HEADED });
let done = 0;
const failures = [];
for (const { issue, model, mode } of combos) {
  const name = `${issue}-${model}-${mode}`;
  process.stdout.write(`[${String(++done).padStart(2)}/${combos.length}] ${name} … `);
  const ctx = await browser.newContext({
    viewport: { width: OUT_W, height: OUT_H },
    deviceScaleFactor: 1,
    recordVideo: { dir: TMP_DIR, size: { width: OUT_W, height: OUT_H } },
  });
  try {
    const page = await ctx.newPage();
    const url = `${ORIGIN}/render/poster.html?issue=${issue}&model=${model}&mode=${mode}` +
      `&w=${OUT_W}&h=${OUT_H}&bw=${BASE_W}&bh=${BASE_H}`;
    await page.goto(url, { waitUntil: "load" });
    await page.waitForFunction(() => window.__posterReady === true, undefined, { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(WARMUP * 1000);   // let the 3D model spin up to a steady rotation
    await page.waitForTimeout(SECONDS * 1000);  // the window we keep (taken from the tail, below)
    const video = page.video();
    await ctx.close();                          // finalizes the .webm
    const webm = await video.path();

    // Keep the LAST <SECONDS> seconds (steady rotation, past warm-up), normalize
    // to the output size, H.264 / yuv420p, no audio — Instagram-friendly MP4.
    const outMp4 = path.join(MEDIA_DIR, `${name}.mp4`);
    await run(ffmpegPath, [
      "-y", "-sseof", String(-SECONDS), "-i", webm, "-t", String(SECONDS),
      "-an",
      "-vf", `scale=${OUT_W}:${OUT_H}:flags=lanczos,fps=${FPS},format=yuv420p`,
      "-c:v", "libx264", "-profile:v", "high", "-preset", "veryfast", "-crf", "20",
      "-movflags", "+faststart",
      outMp4,
    ]);
    if (!KEEP) await rm(webm, { force: true });
    console.log("ok");
  } catch (e) {
    failures.push({ name, error: (e && e.message) || String(e) });
    console.log("FAILED");
    try { await ctx.close(); } catch {}
  }
}
await browser.close();
server.close();

console.log(`\nDone: ${done - failures.length}/${combos.length} clip(s) written to ${MEDIA_DIR}`);
if (failures.length) {
  console.log(`${failures.length} failed:`);
  for (const f of failures) console.log(`   ${f.name}: ${f.error.split("\n")[0]}`);
  process.exit(1);
}
