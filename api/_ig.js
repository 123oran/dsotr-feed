// Shared helpers for the Instagram Login (OAuth) flow + publishing.
// Underscore-prefixed → Vercel does NOT route this as an endpoint; it's imported
// by the /api/auth/* functions and /api/publish.js. No secrets live here — the
// only secret is SESSION_SECRET (env), used to encrypt the session cookie.

const crypto = require("crypto");

// Instagram Login uses graph.instagram.com (NOT graph.facebook.com).
const IG_BASE = "https://graph.instagram.com";
const AUTH_URL = "https://www.instagram.com/oauth/authorize";
const SHORT_TOKEN_URL = "https://api.instagram.com/oauth/access_token";
const SCOPES = "instagram_business_basic,instagram_business_content_publish";
const SESSION_COOKIE = "ig_session";
const STATE_COOKIE = "ig_oauth_state";

// ---- session cookie encryption (AES-256-GCM) ------------------------------
const key = () => crypto.createHash("sha256").update(process.env.SESSION_SECRET || "dev-insecure-secret-change-me").digest();

function seal(obj) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([c.update(JSON.stringify(obj), "utf8"), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), data]).toString("base64url");
}
function open(str) {
  try {
    const b = Buffer.from(str, "base64url");
    const iv = b.subarray(0, 12), tag = b.subarray(12, 28), data = b.subarray(28);
    const d = crypto.createDecipheriv("aes-256-gcm", key(), iv);
    d.setAuthTag(tag);
    return JSON.parse(Buffer.concat([d.update(data), d.final()]).toString("utf8"));
  } catch { return null; }
}

// ---- cookies --------------------------------------------------------------
function parseCookies(req) {
  const out = {};
  (req.headers.cookie || "").split(";").forEach((p) => {
    const i = p.indexOf("=");
    if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  });
  return out;
}
function serializeCookie(name, value, opts = {}) {
  const parts = [`${name}=${value}`, `Path=${opts.path || "/"}`, `SameSite=${opts.sameSite || "Lax"}`];
  if (opts.maxAge != null) parts.push(`Max-Age=${opts.maxAge}`);
  if (opts.httpOnly !== false) parts.push("HttpOnly");
  if (opts.secure !== false) parts.push("Secure");
  return parts.join("; ");
}
const sessionCookie = (data, maxAgeSec) => serializeCookie(SESSION_COOKIE, seal(data), { maxAge: maxAgeSec });
const clearCookie = (name) => serializeCookie(name, "", { maxAge: 0 });

// ---- misc -----------------------------------------------------------------
function baseUrl(req) {
  if (process.env.PUBLIC_BASE_URL) return process.env.PUBLIC_BASE_URL.replace(/\/+$/, "");
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}`;
}
const redirectUri = (req) => `${baseUrl(req)}/api/auth/callback`;

// Read a valid (non-expired) connected session, or null.
function readSession(req) {
  const c = parseCookies(req)[SESSION_COOKIE];
  if (!c) return null;
  const s = open(c);
  if (!s || !s.token || !s.igUserId) return null;
  if (s.exp && Date.now() > s.exp) return null;
  return s; // { igUserId, token, username, exp }
}

// The account /api/publish should post as: a connected session if present,
// otherwise the env-configured default account.
function getAccount(req) {
  const s = readSession(req);
  if (s) return { igUserId: s.igUserId, token: s.token, username: s.username || null, source: "session" };
  if (process.env.IG_USER_ID && process.env.IG_ACCESS_TOKEN) {
    return { igUserId: process.env.IG_USER_ID, token: process.env.IG_ACCESS_TOKEN, username: process.env.IG_DEFAULT_USERNAME || null, source: "default" };
  }
  return null;
}

module.exports = {
  IG_BASE, AUTH_URL, SHORT_TOKEN_URL, SCOPES, SESSION_COOKIE, STATE_COOKIE,
  seal, open, parseCookies, serializeCookie, sessionCookie, clearCookie,
  baseUrl, redirectUri, readSession, getAccount,
};
