// GET /api/auth/callback — finish Instagram Business Login.
// Verifies CSRF state, exchanges the code for a short- then long-lived token,
// reads the account id + username, stores it in an encrypted httpOnly session
// cookie, and redirects back to the app. The token never reaches the browser.
const { IG_BASE, SHORT_TOKEN_URL, STATE_COOKIE, parseCookies, sessionCookie, clearCookie, baseUrl, redirectUri } = require("../_ig.js");

module.exports = async (req, res) => {
  const back = (params) => {
    res.setHeader("Location", `${baseUrl(req)}/?${new URLSearchParams(params)}`);
    res.statusCode = 302;
    res.end();
  };
  try {
    const q = req.query || {};
    if (q.error) return back({ ig: "denied" });
    if (!q.code) return back({ ig: "error" });
    if (!q.state || q.state !== parseCookies(req)[STATE_COOKIE]) return back({ ig: "state" });

    const IG_APP_ID = process.env.IG_APP_ID, IG_APP_SECRET = process.env.IG_APP_SECRET;
    if (!IG_APP_ID || !IG_APP_SECRET) return back({ ig: "unconfigured" });

    // 1 · code -> short-lived token (+ app-scoped user id)
    const shortRes = await fetch(SHORT_TOKEN_URL, {
      method: "POST",
      body: new URLSearchParams({
        client_id: IG_APP_ID, client_secret: IG_APP_SECRET,
        grant_type: "authorization_code", redirect_uri: redirectUri(req), code: q.code,
      }),
    });
    const sj = await shortRes.json().catch(() => ({}));
    const pick = (k) => sj[k] != null ? sj[k] : (sj.data && sj.data[0] ? sj.data[0][k] : undefined);
    const short = pick("access_token");
    let igUserId = pick("user_id");
    if (!short) return back({ ig: "token" });

    // 2 · short -> long-lived token (60 days)
    const longRes = await fetch(`${IG_BASE}/access_token?` + new URLSearchParams({
      grant_type: "ig_exchange_token", client_secret: IG_APP_SECRET, access_token: short,
    }));
    const lj = await longRes.json().catch(() => ({}));
    const token = lj.access_token || short;
    const expiresIn = Number(lj.expires_in) || 3600;

    // 3 · account id + username
    let username = null;
    try {
      const meRes = await fetch(`${IG_BASE}/me?fields=user_id,username&access_token=${encodeURIComponent(token)}`);
      const me = await meRes.json().catch(() => ({}));
      username = me.username || null;
      igUserId = me.user_id || me.id || igUserId;
    } catch { /* fall back to the token-exchange id */ }
    if (!igUserId) return back({ ig: "account" });

    // 4 · store the session (encrypted, httpOnly) and clear the state cookie
    const exp = Date.now() + Math.max(60, expiresIn - 60) * 1000;
    res.setHeader("Set-Cookie", [
      sessionCookie({ igUserId: String(igUserId), token, username, exp }, expiresIn),
      clearCookie(STATE_COOKIE),
    ]);
    return back({ ig: "connected" });
  } catch (e) {
    return back({ ig: "error" });
  }
};
