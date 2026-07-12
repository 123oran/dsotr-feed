// ============================================================================
// Upload media/*.mp4 to a GitHub Release so Instagram can fetch them by public URL.
// ----------------------------------------------------------------------------
// 50 HD clips (~1.4 GB) exceed Vercel Hobby's static limit and would bloat the
// git repo, and Google Drive links don't work for server-to-server fetch. A
// PUBLIC GitHub repo's release ASSETS are public direct URLs and keep everything
// in the one repo you already have.
//
// Prereqs:
//   - The repo must be PUBLIC (so Instagram can fetch the assets without auth).
//   - A token with `repo` scope (or `public_repo`): create at
//     github.com/settings/tokens, then:  export GITHUB_TOKEN=ghp_xxxxx
//
// Usage (from render/):
//   node upload-clips.mjs                          # repo 123oran/dsotr-feed, tag "clips"
//   node upload-clips.mjs --repo owner/name --tag clips
//
// It creates/reuses the release, replaces same-named assets (idempotent), and
// prints the MEDIA_BASE_URL to set in the Vercel project.
// ============================================================================

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MEDIA_DIR = path.resolve(__dirname, "..", "media");

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf("--" + n); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : d; };
const REPO = opt("repo", "123oran/dsotr-feed");
const TAG = opt("tag", "clips");
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
if (!TOKEN) { console.error("Set GITHUB_TOKEN (a token with 'repo' or 'public_repo' scope)."); process.exit(1); }

const API = "https://api.github.com";
const UPLOADS = "https://uploads.github.com";
const H = { Authorization: `Bearer ${TOKEN}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };

async function gh(url, opts = {}) {
  const r = await fetch(url, { ...opts, headers: { ...H, ...(opts.headers || {}) } });
  if (!r.ok) throw new Error(`${opts.method || "GET"} ${url} -> ${r.status} ${(await r.text().catch(() => "")).slice(0, 300)}`);
  return r.status === 204 ? null : r.json();
}

// 1 · find or create the release
let release;
try {
  release = await gh(`${API}/repos/${REPO}/releases/tags/${TAG}`);
} catch {
  release = await gh(`${API}/repos/${REPO}/releases`, {
    method: "POST",
    body: JSON.stringify({ tag_name: TAG, name: "DSOTR poster clips", body: "Carousel video clips for the Instagram publish feature (auto-uploaded)." }),
  });
}
console.log(`release: ${release.html_url}  (id ${release.id})`);

// 2 · index existing assets so re-runs replace rather than duplicate
const existing = new Map((await gh(`${API}/repos/${REPO}/releases/${release.id}/assets?per_page=100`)).map((a) => [a.name, a.id]));

// 3 · upload each mp4
const files = (await readdir(MEDIA_DIR)).filter((f) => f.endsWith(".mp4")).sort();
if (!files.length) { console.error(`No .mp4 in ${MEDIA_DIR} — run the renderer first.`); process.exit(1); }

let done = 0;
const failures = [];
for (const name of files) {
  if (existing.has(name)) {
    try { await gh(`${API}/repos/${REPO}/releases/assets/${existing.get(name)}`, { method: "DELETE" }); } catch (e) { /* keep going */ }
  }
  const data = await readFile(path.join(MEDIA_DIR, name));
  const r = await fetch(`${UPLOADS}/repos/${REPO}/releases/${release.id}/assets?name=${encodeURIComponent(name)}`, {
    method: "POST",
    headers: { ...H, "Content-Type": "video/mp4", "Content-Length": String(data.length) },
    body: data,
  });
  if (!r.ok) { failures.push(name); console.log(`[${++done}/${files.length}] ${name}  FAILED ${r.status}`); continue; }
  console.log(`[${++done}/${files.length}] ${name}  (${(data.length / 1e6).toFixed(1)} MB)`);
}

console.log(`\nUploaded ${files.length - failures.length}/${files.length}.`);
if (failures.length) console.log(`Failed: ${failures.join(", ")}`);
console.log(`\nSet this in the Vercel project (Settings -> Environment Variables), then redeploy:`);
console.log(`  MEDIA_BASE_URL=https://github.com/${REPO}/releases/download/${TAG}`);
