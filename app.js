const express = require("express");
const app = express();
app.use(express.json());

const VERIFY_TOKEN = "whatsapp123";

// 🔐 Vérification webhook (obligatoire Meta)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook vérifié !");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// 📩 Réception messages WhatsApp
app.post("/webhook", (req, res) => {
  console.log("Message reçu :", JSON.stringify(req.body, null, 2));

  try {
    const message =
      req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message) {
      const from = message.from;
      const text = message.text?.body;

      console.log("Client:", from);
      console.log("Message:", text);
    }
  } catch (error) {
    console.error(error);
  }

  res.sendStatus(200);
});

app.listen(3000, () => console.log("Serveur lancé sur port 3000"));
