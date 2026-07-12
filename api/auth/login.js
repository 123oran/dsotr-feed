// GET /api/auth/login — start the Instagram Business Login flow.
// Sets a CSRF state cookie and redirects to Instagram's authorization page.
const { AUTH_URL, SCOPES, STATE_COOKIE, serializeCookie, redirectUri } = require("../_ig.js");
const crypto = require("crypto");

module.exports = async (req, res) => {
  const IG_APP_ID = process.env.IG_APP_ID;
  if (!IG_APP_ID) { res.statusCode = 500; return res.end("Server not configured: set IG_APP_ID."); }

  const state = crypto.randomBytes(16).toString("hex");
  const url = `${AUTH_URL}?` + new URLSearchParams({
    client_id: IG_APP_ID,
    redirect_uri: redirectUri(req),
    response_type: "code",
    scope: SCOPES,
    state,
  });

  res.setHeader("Set-Cookie", serializeCookie(STATE_COOKIE, state, { maxAge: 600, sameSite: "Lax" }));
  res.setHeader("Location", url);
  res.statusCode = 302;
  res.end();
};
