import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WA_TOKEN = process.env.WA_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

/**
 * Vérification webhook Meta
 */
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

/**
 * Lecture messages entrants
 */
app.post("/webhook", async (req, res) => {
  console.log("📩 Message entrant :", JSON.stringify(req.body, null, 2));

  const msg =
    req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (msg && msg.text) {
    const from = msg.from;
    const text = msg.text.body;

    console.log("📞 Client :", from);
    console.log("💬 Texte :", text);

    // Réponse automatique
    await sendMessage(from, "Bonjour 👋 message bien reçu");
  }

  res.sendStatus(200);
});

/**
 * Répondre au client
 */
async function sendMessage(to, body) {
  await fetch(
    `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WA_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        text: { body }
      })
    }
  );
}

app.listen(PORT, () => {
  console.log("🚀 Serveur prêt");
});
