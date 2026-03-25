const express = require("express");
const app = express();
app.use(express.json());

const VERIFY_TOKEN = "EAARwYZCiEjFUBQDl0CH95o4hRUlop59JW7MKeMQM12NOZBYVIrPrbH2OnBIyZAZCZBASNJku0Tj5VAs8NITrkPj3JYXkVVvSZBamYulkfvxYZChmZCH9SNZB3VvY40K1uwJUiuYVtD18w1zdPZCt6vZA2IgWyYtUcsyaLNgr3sgPTAuYTkPrIGuP9FiuM7jl6bz9weDRiGe1i705kDPVd7Uij93qlukFlB6u9RqBa3ZBBXD5gQxD4PRb1fFrhQwmaqTxZCtvipKUdpCSzZBcDwOqnvve6YxCA9nR5CP8Mm3ZAqnsbUZD";

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
