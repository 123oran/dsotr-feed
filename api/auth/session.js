// GET /api/auth/session — who the app will post as (for the UI). No token exposed.
const { getAccount } = require("../_ig.js");

module.exports = async (req, res) => {
  const acct = getAccount(req);
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    connected: !!acct && acct.source === "session", // a user is logged in via OAuth
    username: acct ? acct.username : null,
    source: acct ? acct.source : null,              // "session" | "default" | null
    canPost: !!acct,                                // false only if no default configured either
  });
};
