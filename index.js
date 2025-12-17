import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// ⚠️ Render impose ce port
const PORT = process.env.PORT || 3000;

// VARIABLES (Render Environment)
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WA_TOKEN = process.env.WA_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

/**
 * Vérification Webhook (Meta)
 */
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook vérifié");
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

/**
 * Réception messages entrants
 */
app.post("/webhook", async (req, res) => {
  console.log("📩 Payload reçu :", JSON.stringify(req.body, null, 2));

  const message =
    req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (message) {
    const from = message.from;
    const text = message.text?.body;

    console.log("📞 De :", from);
    console.log("💬 Message :", text);

    // Réponse automatique
    await sendMessage(from, "Message bien reçu ✅");
  }

  res.sendStatus(200);
});

/**
 * Envoi message WhatsApp
 */
async function sendMessage(to, body) {
  const url = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`;

  await fetch(url, {
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
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
