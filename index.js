import express from "express";

const app = express();
app.use(express.json());

/**
 * Vérification du webhook (obligatoire)
 */
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "mon_token_secret";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook vérifié ✅");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

/**
 * Réception des messages entrants
 */
app.post("/webhook", (req, res) => {
  console.log("📩 Message entrant :", JSON.stringify(req.body, null, 2));

  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const value = changes?.value;
  const messages = value?.messages;

  if (messages) {
    const msg = messages[0];
    const from = msg.from;
    const text = msg.text?.body;

    console.log("📞 De :", from);
    console.log("💬 Message :", text);
  }

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("🚀 Webhook en écoute sur le port 3000");
});
