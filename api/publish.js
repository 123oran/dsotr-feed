// ============================================================================
// POST /api/publish  —  Dark Side of the Rainbow · Instagram carousel publish
// ----------------------------------------------------------------------------
// Publishes the poster the user built as a 2-video Instagram carousel:
//   slide 1 = the light "problem" poster loop,  slide 2 = the dark "solution".
// The caption is the user's story (or the issue's default).
//
// Because Instagram ingests each ~55s HD video asynchronously (often longer than
// a serverless function is allowed to run — 60s on Vercel Hobby), we do NOT block
// one request until the post is live. Instead the browser drives a small state
// machine, one short call per phase (each returns in a second or two):
//
//   { phase:"create",   issue, model }        -> { containers:[c1,c2], lightUrl, darkUrl }
//   { phase:"status",   ids:[...] }            -> { statuses, ready, error? }
//   { phase:"carousel", containers, caption }  -> { carousel }
//   { phase:"publish",  carousel }             -> { id, permalink }
//
// The client loops the "status" phase between create→carousel and carousel→publish
// until Instagram reports FINISHED, so no single invocation waits on ingestion.
//
// The two clips are NOT taken from the request — they are looked up from the
// whitelisted issue+model keys as  /media/<issue>-<model>-{light,dark}.mp4  on
// this same deployment. That keeps the video URLs under our control (no SSRF)
// and means the caption is the only free-form input that reaches Instagram.
// Container ids DO come back from the client between phases, but every Graph call
// runs against the session's own token, so a caller can only ever touch their own
// containers; ids are still validated as bare numerics as defence-in-depth.
//
// Instagram's Graph API *pulls* each video from a PUBLIC url, so this only
// works from a deployed origin (the Vercel URL) where /media/*.mp4 is publicly
// reachable — not from http://localhost. See README → "Publishing to Instagram".
//
// Posts as the account the visitor connected via Instagram Login (session cookie —
// see api/_ig.js + api/auth/*), OR the env-configured DEFAULT account when nobody
// is connected. Env for the default account (set in Vercel, never in the client):
//   IG_USER_ID       default Instagram Business/Creator user-id
//   IG_ACCESS_TOKEN  default long-lived Instagram-Login token (instagram_business_content_publish)
//   MEDIA_BASE_URL   where the clips are hosted (e.g. the GitHub Releases base)
// ============================================================================

const { getAccount, IG_BASE } = require("./_ig.js");

const ISSUE_KEYS = ["suicide", "bullying", "identity", "safety", "politics"];
const MODEL_KEYS = ["head", "fist", "eye", "hand", "mouth"];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Read a JSON body whether or not the platform pre-parsed it.
async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString("utf8");
  try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}

module.exports = async (req, res) => {
  // Same-origin in production; permissive CORS lets `vercel dev` on another port work too.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Post as the connected account (Instagram Login session) if there is one,
  // otherwise the env-configured default account.
  const account = getAccount(req);
  if (!account) {
    return res.status(500).json({ error: "No Instagram account available — connect one, or set IG_USER_ID + IG_ACCESS_TOKEN." });
  }
  const IG_USER_ID = account.igUserId;
  const TOKEN = account.token;
  const GRAPH = IG_BASE; // graph.instagram.com (Instagram Login)

  // --- Graph API helpers (token injected here, never exposed to the client) ---
  // Surface Meta's error code/subcode too — the message alone ("API access blocked")
  // is rarely enough to tell a expired token from an app-permission/App-Review block.
  const asError = (json, status) => {
    const g = json && json.error;
    if (!g) return new Error(`Graph request failed (${status})`);
    const codes = [g.code != null ? `code ${g.code}` : null, g.error_subcode ? `subcode ${g.error_subcode}` : null].filter(Boolean).join(" / ");
    const parts = [g.message, g.error_user_msg, codes ? `(${codes})` : null].filter(Boolean);
    return new Error(`Instagram: ${parts.join(" — ")}`);
  };
  const graphGET = async (path, params = {}) => {
    const qs = new URLSearchParams({ ...params, access_token: TOKEN });
    const r = await fetch(`${GRAPH}/${path}?${qs}`);
    const json = await r.json().catch(() => ({}));
    if (!r.ok || json.error) throw asError(json, r.status);
    return json;
  };
  const graphPOST = async (path, params = {}) => {
    const body = new URLSearchParams({ ...params, access_token: TOKEN });
    const r = await fetch(`${GRAPH}/${path}`, { method: "POST", body });
    const json = await r.json().catch(() => ({}));
    if (!r.ok || json.error) throw asError(json, r.status);
    return json;
  };
  // Container/media ids come back to us from the client between phases; only ever
  // accept a bare numeric id so nothing else can be smuggled into a Graph path.
  const isId = (v) => typeof v === "string" && /^\d{1,32}$/.test(v);

  try {
    const body = await readJsonBody(req);
    const phase = body.phase || "create";

    // ── Phase 1 · create one container per carousel video item ───────────────
    if (phase === "create") {
      const { issue, model } = body;
      if (!ISSUE_KEYS.includes(issue)) return res.status(400).json({ error: `Unknown issue "${issue}".` });
      if (!MODEL_KEYS.includes(model)) return res.status(400).json({ error: `Unknown model "${model}".` });

      const base = (process.env.PUBLIC_BASE_URL ||
        `https://${req.headers["x-forwarded-host"] || req.headers.host}`).replace(/\/+$/, "");
      // The ~55s HD clips are too big for the Vercel deployment (Hobby static cap),
      // so they live on a public host — set MEDIA_BASE_URL to e.g. the GitHub
      // Releases download base. Falls back to /media on this deployment.
      const mediaBase = (process.env.MEDIA_BASE_URL || `${base}/media`).replace(/\/+$/, "");
      const lightUrl = `${mediaBase}/${issue}-${model}-light.mp4`;
      const darkUrl = `${mediaBase}/${issue}-${model}-dark.mp4`;

      const c1 = (await graphPOST(`${IG_USER_ID}/media`, { media_type: "VIDEO", video_url: lightUrl, is_carousel_item: "true" })).id;
      const c2 = (await graphPOST(`${IG_USER_ID}/media`, { media_type: "VIDEO", video_url: darkUrl, is_carousel_item: "true" })).id;
      return res.status(200).json({ containers: [c1, c2], lightUrl, darkUrl });
    }

    // ── Phase 2 · report container status (the client polls this) ────────────
    // Works for both the child video containers and the carousel container.
    if (phase === "status") {
      const ids = (Array.isArray(body.ids) ? body.ids : []).filter(isId).slice(0, 3);
      if (!ids.length) return res.status(400).json({ error: "No container ids to check." });
      const statuses = {};
      for (const id of ids) {
        const { status_code } = await graphGET(id, { fields: "status_code" });
        statuses[id] = status_code;
        if (status_code === "ERROR" || status_code === "EXPIRED") {
          return res.status(200).json({ statuses, ready: false, error: `Instagram could not process a video (status ${status_code}). Check the clip is a public MP4/H.264.` });
        }
      }
      const ready = ids.every((id) => statuses[id] === "FINISHED");
      return res.status(200).json({ statuses, ready });
    }

    // ── Phase 3 · bundle the finished videos into a carousel container ───────
    if (phase === "carousel") {
      const children = (Array.isArray(body.containers) ? body.containers : []).filter(isId);
      if (children.length < 2) return res.status(400).json({ error: "Need two finished video containers." });
      const cap = (typeof body.caption === "string" ? body.caption : "").slice(0, 2200);
      const carousel = (await graphPOST(`${IG_USER_ID}/media`, { media_type: "CAROUSEL", children: children.join(","), caption: cap })).id;
      return res.status(200).json({ carousel });
    }

    // ── Phase 4 · publish the carousel ───────────────────────────────────────
    // The client has already polled the carousel container to FINISHED, but it can
    // report ready a beat early — a couple of short retries covers that race.
    if (phase === "publish") {
      const carousel = body.carousel;
      if (!isId(carousel)) return res.status(400).json({ error: "Missing carousel container id." });
      let published;
      for (let attempt = 0; ; attempt++) {
        try {
          published = (await graphPOST(`${IG_USER_ID}/media_publish`, { creation_id: carousel })).id;
          break;
        } catch (e) {
          if (attempt >= 2) throw e;
          await sleep(3000);
        }
      }
      let permalink = null;
      try { permalink = (await graphGET(published, { fields: "permalink" })).permalink; } catch { /* non-fatal */ }
      return res.status(200).json({ id: published, permalink, account: account.username || null, source: account.source });
    }

    return res.status(400).json({ error: `Unknown phase "${phase}".` });
  } catch (e) {
    console.error("publish failed:", (e && e.message) || e);
    return res.status(502).json({ error: (e && e.message) || "Publish failed" });
  }
};
