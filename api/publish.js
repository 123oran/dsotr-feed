// ============================================================================
// POST /api/publish  —  Dark Side of the Rainbow · Instagram carousel publish
// ----------------------------------------------------------------------------
// Publishes the poster the user built as a 2-video Instagram carousel:
//   slide 1 = the light "problem" poster loop,  slide 2 = the dark "solution".
// The caption is the user's story (or the issue's default).
//
// Input (JSON body):  { issue, model, caption }
//   issue  — one of: suicide | bullying | identity | safety | politics
//   model  — one of: head | fist | eye | hand | mouth
//   caption— free text (the user's story)
// Output (JSON):      { id, permalink, lightUrl, darkUrl }  or  { error }
//
// The two clips are NOT taken from the request — they are looked up from the
// whitelisted issue+model keys as  /media/<issue>-<model>-{light,dark}.mp4  on
// this same deployment. That keeps the video URLs under our control (no SSRF)
// and means the caption is the only free-form input that reaches Instagram.
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
  const asError = (json, status) => {
    const g = json && json.error;
    return new Error(g ? `Instagram: ${g.message}${g.error_user_msg ? " — " + g.error_user_msg : ""}` : `Graph request failed (${status})`);
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
  // Poll container(s) until Instagram finishes ingesting the video(s).
  const waitFinished = async (ids, timeoutMs = 55000, intervalMs = 3000) => {
    const deadline = Date.now() + timeoutMs;
    const pending = new Set(ids);
    while (pending.size) {
      for (const id of [...pending]) {
        const { status_code } = await graphGET(id, { fields: "status_code" });
        if (status_code === "FINISHED") pending.delete(id);
        else if (status_code === "ERROR" || status_code === "EXPIRED") {
          throw new Error(`Instagram could not process a video (status ${status_code}). Check the clip is a public MP4/H.264.`);
        }
      }
      if (!pending.size) break;
      if (Date.now() > deadline) {
        throw new Error("Instagram is still processing the videos. Give it a moment and press Share again.");
      }
      await sleep(intervalMs);
    }
  };

  try {
    const { issue, model, caption } = await readJsonBody(req);
    if (!ISSUE_KEYS.includes(issue)) return res.status(400).json({ error: `Unknown issue "${issue}".` });
    if (!MODEL_KEYS.includes(model)) return res.status(400).json({ error: `Unknown model "${model}".` });
    const cap = (typeof caption === "string" ? caption : "").slice(0, 2200);

    const base = (process.env.PUBLIC_BASE_URL ||
      `https://${req.headers["x-forwarded-host"] || req.headers.host}`).replace(/\/+$/, "");
    // The ~55s HD clips are too big for the Vercel deployment (Hobby static cap),
    // so they live on a public host — set MEDIA_BASE_URL to e.g. the GitHub
    // Releases download base. Falls back to /media on this deployment.
    const mediaBase = (process.env.MEDIA_BASE_URL || `${base}/media`).replace(/\/+$/, "");
    const lightUrl = `${mediaBase}/${issue}-${model}-light.mp4`;
    const darkUrl = `${mediaBase}/${issue}-${model}-dark.mp4`;

    // 1 · create a container for each carousel video item
    const c1 = (await graphPOST(`${IG_USER_ID}/media`, { media_type: "VIDEO", video_url: lightUrl, is_carousel_item: "true" })).id;
    const c2 = (await graphPOST(`${IG_USER_ID}/media`, { media_type: "VIDEO", video_url: darkUrl, is_carousel_item: "true" })).id;

    // 2 · wait for both videos to finish processing
    await waitFinished([c1, c2]);

    // 3 · bundle them into a carousel container with the caption
    const carousel = (await graphPOST(`${IG_USER_ID}/media`, { media_type: "CAROUSEL", children: `${c1},${c2}`, caption: cap })).id;

    // 3b · wait for the carousel container ITSELF to finish — a video carousel is
    // not publishable the instant its child videos are FINISHED.
    await waitFinished([carousel], 40000);

    // 4 · publish (retry a few times — the container can report ready a beat early)
    let published;
    for (let attempt = 0; ; attempt++) {
      try {
        published = (await graphPOST(`${IG_USER_ID}/media_publish`, { creation_id: carousel })).id;
        break;
      } catch (e) {
        if (attempt >= 4) throw e;
        await sleep(4000);
      }
    }

    // 5 · fetch the public permalink (best-effort)
    let permalink = null;
    try { permalink = (await graphGET(published, { fields: "permalink" })).permalink; } catch { /* non-fatal */ }

    return res.status(200).json({ id: published, permalink, lightUrl, darkUrl, account: account.username || null, source: account.source });
  } catch (e) {
    console.error("publish failed:", (e && e.message) || e);
    return res.status(502).json({ error: (e && e.message) || "Publish failed" });
  }
};
