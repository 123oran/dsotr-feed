// GET /api/auth/logout — disconnect the currently connected account.
const { SESSION_COOKIE, clearCookie, baseUrl } = require("../_ig.js");

module.exports = async (req, res) => {
  res.setHeader("Set-Cookie", clearCookie(SESSION_COOKIE));
  res.setHeader("Location", `${baseUrl(req)}/?ig=disconnected`);
  res.statusCode = 302;
  res.end();
};
