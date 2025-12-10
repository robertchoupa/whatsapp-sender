// Import Express.js
const express = require('express');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

// --- WEBHOOK VERIFICATION (GET) ---
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('Webhook verified successfully.');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// --- RECEIVE MESSAGES (POST) ---
app.post('/webhook', (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

  console.log(`\n\n📩 Webhook received at ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2));

  res.sendStatus(200);
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
