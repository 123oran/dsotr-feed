// ============================================================================
// DSOTR Feed - batch clip renderer (full-res, uniform ~target-length seamless loops)
// ----------------------------------------------------------------------------
// Renders ONE full, seamless rotation of every poster (issue x model x mode) to
// ../media/<issue>-<model>-<mode>.mp4 at native 1080x1350 - the files
// /api/publish hands to Instagram and the Share button maps to.
//
// Two things make this non-trivial and drive the design:
//  - The art is a cross-origin iframe, so in-page capture is blank. We drive a
//    headless Chromium (Playwright), which records composited pixels (cross-
//    origin WebGL included), then transcode with a bundled ffmpeg.
//  - The model auto-rotates via three.js OrbitControls: one turn takes
//    3600/rotateSpeed animation FRAMES, so the wall-clock period = frames/fps.
//    Headless full-res fps differs per model (heavy head ~30fps, light models
//    faster), so a single rotateSpeed would give wildly different clip lengths.
//    We therefore PROBE each model's fps once and set a per-model rotateSpeed so
//    every clip lands at ~--target seconds - a consistent, slow, dramatic pace.
//  - Seamlessness: capture just over one turn and DETECT the loop point by
//    autocorrelation, then trim there (frame-rate independent). A hard --maxlen
//    keeps every clip under IG's 60s carousel cap.
//
// Usage (from render/):
//   npm install && npx playwright install chromium   (once)
//   npm run render                       # all 50 -> ../media  (~75 min)
//   node render-clips.mjs --only suicide-head        # one combo (both sides)
//   node render-clips.mjs --target 55 --maxlen 59
//   node render-clips.mjs --spin 2.0                 # skip calibration, fixed spin
//   node render-clips.mjs --list                     # print combos, render none
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

const TARGET = Number(opt("target", 54));   // aim every clip at ~this many seconds (slow, under 60)
const MAXLEN = Number(opt("maxlen", 59));   // hard cap so no clip exceeds IG's 60s carousel limit
const MARGIN = Number(opt("margin", 11));   // extra seconds recorded beyond the target (detection overlap)
const WARMUP = Number(opt("warmup", 8));    // seconds after the spin-override reload before capturing
const FPS = Number(opt("fps", 30));         // output fps
const OUT_W = Number(opt("width", 1080));
const OUT_H = Number(opt("height", 1350));
const [BASE_W, BASE_H] = String(opt("base", "360x450")).split("x").map(Number);
const PORT = Number(opt("port", 5599));
const HEADED = flag("headed");
const KEEP = flag("keep-webm");
const MIN_SEC = Number(opt("min", 2.5));
const SPIN_OVERRIDE = opt("spin", null);    // fixed rotateSpeed for all models (skip calibration)
const PROBE_SPIN = 14;                       // fast spin used only to measure a model's fps
const PROBE_CAP = 18;                        // seconds recorded during an fps probe

let combos = [];
for (const issue of ISSUES) for (const model of MODELS) for (const mode of MODES) combos.push({ issue, model, mode });
const only = opt("only", null);
if (only) { const [i, m] = only.split("-"); combos = combos.filter((c) => c.issue === i && c.model === m); }
if (opt("issue", null)) combos = combos.filter((c) => c.issue === opt("issue", null));
if (opt("model", null)) combos = combos.filter((c) => c.model === opt("model", null));
if (opt("mode", null)) combos = combos.filter((c) => c.mode === opt("mode", null));

if (flag("list")) { console.log(combos.map((c) => `${c.issue}-${c.model}-${c.mode}`).join("\n")); process.exit(0); }
if (!ffmpegPath) { console.error("ffmpeg-static missing a binary. Run `npm install` here first."); process.exit(1); }
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
  p.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`${path.basename(cmd)} exited ${code}\n${err.slice(-700)}`))));
});
const runCapture = (cmd, args) => new Promise((resolve, reject) => {
  const p = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
  const out = []; let err = "";
  p.stdout.on("data", (d) => out.push(d));
  p.stderr.on("data", (d) => (err += d));
  p.on("close", (code) => (code === 0 ? resolve(Buffer.concat(out)) : reject(new Error(`${path.basename(cmd)} exited ${code}\n${err.slice(-700)}`))));
});

// Detect the rotation period by AUTOCORRELATION over the last `captureSec` of the
// webm (see the git history for the why). Returns { seconds, seam } or null.
const PROBE_FPS = 8, PW = 24, PH = 30, FSZ = PW * PH;
async function detectPeriod(webm, captureSec) {
  const buf = await runCapture(ffmpegPath, [
    "-v", "error", "-sseof", String(-captureSec), "-i", webm, "-t", String(captureSec),
    "-vf", `fps=${PROBE_FPS},scale=${PW}:${PH},format=gray`, "-f", "rawvideo", "-",
  ]);
  const n = Math.floor(buf.length / FSZ);
  if (n < PROBE_FPS * (MIN_SEC + 2)) return null;
  const frame = (i) => buf.subarray(i * FSZ, (i + 1) * FSZ);
  const minLag = Math.max(1, Math.floor(MIN_SEC * PROBE_FPS));
  const maxLag = n - Math.floor(PROBE_FPS * 1.3);
  if (maxLag <= minLag) return null;

  const ac = new Array(n).fill(Infinity);
  for (let lag = minLag; lag <= maxLag; lag++) {
    let e = 0, cnt = 0;
    for (let i = 0; i + lag < n; i++) {
      const a = frame(i), b = frame(i + lag);
      let s = 0;
      for (let p = 0; p < FSZ; p++) { const d = a[p] - b[p]; s += d * d; }
      e += s; cnt++;
    }
    ac[lag] = e / cnt;
  }
  let sum = 0, c = 0;
  for (let lag = minLag; lag <= maxLag; lag++) { sum += ac[lag]; c++; }
  const mean = sum / c || 1;
  if (process.env.DEBUG_AC) {
    const rows = [];
    for (let lag = minLag; lag <= maxLag; lag++) rows.push(`${(lag / PROBE_FPS).toFixed(2)}=${(ac[lag] / mean).toFixed(2)}`);
    console.error("\nAC curve (lag_s=norm):\n" + rows.join(" "));
  }
  const thr = 0.5 * mean;
  const finish = (lag) => {
    const a = ac[lag - 1], b = ac[lag], cc = ac[lag + 1];
    let rl = lag;
    const denom = a - 2 * b + cc;
    if (isFinite(a) && isFinite(cc) && denom > 0) rl = lag + Math.max(-0.5, Math.min(0.5, 0.5 * (a - cc) / denom));
    return { seconds: rl / PROBE_FPS, seam: b / mean };
  };
  for (let lag = minLag + 1; lag < maxLag; lag++) {
    if (ac[lag] < thr && ac[lag] <= ac[lag - 1] && ac[lag] <= ac[lag + 1]) return finish(lag);
  }
  let best = minLag, bv = Infinity;
  for (let lag = minLag; lag <= maxLag; lag++) if (ac[lag] < bv) { bv = ac[lag]; best = lag; }
  return finish(best);
}

// ---- render ---------------------------------------------------------------
await mkdir(MEDIA_DIR, { recursive: true });
await mkdir(TMP_DIR, { recursive: true });

const browser = await chromium.launch({ headless: !HEADED });

// Record one poster into a webm, detect its loop period. If `out` is given, also
// transcode the seamless loop [0, min(period, MAXLEN)] to that mp4.
async function renderClip({ issue, model, mode, spin, captureSec, out }) {
  const ctx = await browser.newContext({
    viewport: { width: OUT_W, height: OUT_H },
    deviceScaleFactor: 1,
    recordVideo: { dir: TMP_DIR, size: { width: OUT_W, height: OUT_H } },
  });
  try {
    const page = await ctx.newPage();
    const url = `${ORIGIN}/render/poster.html?issue=${issue}&model=${model}&mode=${mode}` +
      `&w=${OUT_W}&h=${OUT_H}&bw=${BASE_W}&bh=${BASE_H}&spin=${spin}`;
    await page.goto(url, { waitUntil: "load" });
    await page.waitForFunction(() => window.__posterReady === true, undefined, { timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(WARMUP * 1000);
    await page.waitForTimeout(captureSec * 1000);
    const video = page.video();
    await ctx.close();
    const webm = await video.path();
    const det = await detectPeriod(webm, captureSec);
    if (!out) { if (!KEEP) await rm(webm, { force: true }); return det; }
    let T = det ? det.seconds : TARGET;
    const capped = T > MAXLEN;
    if (capped) T = MAXLEN;
    await run(ffmpegPath, [
      "-y", "-sseof", String(-captureSec), "-i", webm, "-t", T.toFixed(3),
      "-an", "-vf", `scale=${OUT_W}:${OUT_H}:flags=lanczos,fps=${FPS},format=yuv420p`,
      "-c:v", "libx264", "-profile:v", "high", "-preset", "medium", "-crf", "23",
      "-movflags", "+faststart", out,
    ]);
    if (!KEEP) await rm(webm, { force: true });
    return { ...(det || {}), T, capped };
  } catch (e) {
    try { await ctx.close(); } catch {}
    throw e;
  }
}

// 1 - calibrate a per-model rotateSpeed so every clip lands ~TARGET seconds.
const modelsInUse = [...new Set(combos.map((c) => c.model))];
const modelSpin = {};
console.log(`calibrating per-model spin for ~${TARGET}s clips ...`);
for (const model of modelsInUse) {
  if (SPIN_OVERRIDE) { modelSpin[model] = Number(SPIN_OVERRIDE); console.log(`  ${model}: spin ${modelSpin[model]} (override)`); continue; }
  const issue = combos.find((c) => c.model === model).issue;
  let fps = 32;
  try {
    const det = await renderClip({ issue, model, mode: "light", spin: PROBE_SPIN, captureSec: PROBE_CAP });
    if (det && det.seconds > 0.5) fps = (3600 / PROBE_SPIN) / det.seconds;
  } catch (e) { console.log(`  ${model}: probe failed (${String(e).split("\n")[0]}) - assuming ${fps}fps`); }
  const spin = Math.max(0.5, Math.min(30, 3600 / (TARGET * fps)));
  modelSpin[model] = spin;
  console.log(`  ${model}: ~${fps.toFixed(1)}fps -> spin ${spin.toFixed(2)}`);
}

// 2 - render every clip at its model's calibrated spin.
console.log(`\nrendering ${combos.length} clip(s) @ ${OUT_W}x${OUT_H}, ${FPS}fps, target ~${TARGET}s (cap ${MAXLEN}s)\n`);
let done = 0;
const failures = [];
for (const { issue, model, mode } of combos) {
  const name = `${issue}-${model}-${mode}`;
  process.stdout.write(`[${String(++done).padStart(2)}/${combos.length}] ${name} ... `);
  try {
    const r = await renderClip({ issue, model, mode, spin: modelSpin[model], captureSec: TARGET + MARGIN, out: path.join(MEDIA_DIR, `${name}.mp4`) });
    console.log(`ok  (loop ${r.T.toFixed(2)}s${r.capped ? " CAPPED" : ""}, seam ${r.seam != null ? r.seam.toFixed(3) : "n/a"})`);
  } catch (e) {
    failures.push({ name, error: (e && e.message) || String(e) });
    console.log("FAILED");
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
