const express = require("express");
const rbx = require("noblox.js");
const app = express();

var groupId = process.env.group
var cookie = process.env.cookie
const key = process.env.key;
const port = 3000;

app.use(express.json());

async function startApp() {
  try {
    await rbx.setCookie(cookie);
    const currentUser = await rbx.getCurrentUser();
    console.log("Logged in as " + currentUser.UserName);
  } catch (error) {
    console.error("Error logging in:", error.message);
  }
}
startApp();

function validateKey(req, res, next) {
  const receivedKey = req.query.key;
  if (receivedKey !== key) {
    res.status(403).json({ error: "Invalid key" });
  } else {
    next();
  }
}

app.get("/", (req, res) => {
  res.send('Invalid request.');
});

app.get("/promotes", validateKey, async (req, res) => {
  const userId = parseInt(req.query.userid);
  try {
    await rbx.promote(groupId, userId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error promoting user:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/demotes", validateKey, async (req, res) => {
  const userId = parseInt(req.query.userid);
  try {
    await rbx.demote(groupId, userId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error demoting user:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/ranker", validateKey, async (req, res) => {
  const userId = parseInt(req.query.userid);
  const rank = parseInt(req.query.rank);
  try {
    await rbx.setRank(groupId, userId, rank);
    res.json({ success: true });
  } catch (error) {
    console.error("Error setting rank:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/shout", validateKey, async (req, res) => {
  const shoutText = req.query.shouttext;
  try {
    await rbx.shout(groupId, shoutText);
    res.json({ success: true });
  } catch (error) {
    console.error("Error shouting:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/friend", validateKey, async (req, res) => {
  const userId = parseInt(req.query.userid);
  try {
    await rbx.sendFriendRequest(userId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error sending friend request:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

const server = app.listen(port, () => {
  console.log("Server is running on port " + server.address().port);
});

process.on("unhandledRejection", (reason, p) => {
  console.error("[Unhandled Rejection]:", reason);
});

process.on("uncaughtException", (err, origin) => {
  console.error("[Uncaught Exception]:", err);
});

process.on("multipleResolves", (type, promise, reason) => {
  console.error("[Multiple Resolves]:", type, promise, reason);
});
