const express = require("express");
const rbx = require("noblox.js");
const app = express();

const port = 3000;
var groupId = process.env.group
var cookie = "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_09F83E7A04EE825DC1BEE09EA9385B4FB73AD3C46C7FF3D60EB148F115DACDCC4EBC58C8F03558EEDF5B787C13BA9B188782314B0800474924E901528BF6A17582571448931757AAC43EF8197A7322F594F380A09DCE54401EED9350CDCF05A3602C9CF58B39C1B9D27E8FC1BDC0B2CC06B0095CFB409257AC4A782D1B4ABFACA73D0444274CBEB772BB5875CCB70E3164BB79B0DE6294C721EC315BDEE9DD96A6572110742FD7A7C9BD45D4CB86B778EBE8E8300B7BF0C98E64696D6FE268DE10A4AB5137BAA0F7D22E2A42BB0D75A82DD81EF713F128D2D885EFDC172E8335598A148366B852D2615896355A3050F0E3B8110B7F612A6638799A2B2DB76B872EBDE5C5C8DDABC6CB22A213D9490F136B9004A7CF519D035F23DC5C40637D4836F3F6A37CB4E9D2AFF33CB07FAE361D260777B5B4EA42D9FFE9460DF629AAFB650FDE98E63A7395C349B455AF4FDE23524E271291D21747C7CAB31CE9D73678A4615D596BAC4568F5A03545D42BB5A7C8CB041971D411593352333AB6A98C6DAD0668D15D7DE628B0158EFAC3478077765B7E8070D77E425BA3A966E0D3B25081E26252DA3D265396F0EBD6EA3F730286A747D726D75F93A04A0F774F6A2A4BE5963B3FBD605C22BC817CECB588030A1B65A7EE3D7A821D41A32348DD368186827CF4E4CD98A301BC2986565EFD14D0BE627DB40A8458C5E340A026B8EFD39EF5AD0E18C1E999E24187DB436910F3EB788D6A8E8CFEB6E82632A4AF78B593574FA89B54D0E6D59EC60650247C6B8EDCEC7A2D71E4BDFF2A5F6C8F0964892E384C130C1AE635B55B1A28FE19F8A558547C29CD9A5A04A3C94626D441758D39CE2D1CE5301058108F34D9EBA8FBF2B2E9787E2F7B72A2CB8C078021D07C68D59D0D7E363137552B4D8F755F18CE3581CEFCCBE9C438DB364EF0D787B1BF279A891D512F3511B007B9644ED8D564C5D6D3D767AA3F8F86D0C936B4994F9362C3F8166FED8595EEE626A3FD0C5792BAEDA3EEB2B7CBBA1A730A14E45F3CD9FACA3F158CD6936FBAEE3E8F8F3856CEECBF7F8D11FAAD890C323B1EBA87F6980EA51B369CE10FC09CFC76FF5D5DA7C6AF5B1C81438D80"
const key = process.env.key;

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
