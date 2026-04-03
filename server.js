const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let conversation = [];  // 🔥 better placement

app.use(express.static(__dirname));

// Serve your HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Chat endpoint
app.post("/chat", (req, res) => {
  const message = req.body.message;

  if (!message || message.trim() === "") {
  return res.json({ reply: "Say something first 😐" });
}

conversation.push({ role: "user", text: message });

  const msg = message.toLowerCase();

  let reply;

  if (msg.includes("hello") || msg.includes("hi")) {
    reply = "Yo 👀 what’s good?";
  } else if (msg.includes("how are you")) {
    reply = "Running on code and vibes. You?";
  } else if (msg.includes("name")) {
    reply = "I’m your sidekick. Don’t forget it.";
  } else {
    reply = `You said: "${message}"... interesting 🤔`;
  }
conversation.push({ role: "bot", text: reply });
  res.json({ reply });
});

// Fix message endpoint
app.post("/fix", (req, res) => {
  const text = req.body.text;

  const improved = `
1. I feel frustrated when this happens. Can we improve it?
2. This situation has been bothering me. Can we talk about it?
3. I'd like to communicate this better so we understand each other.
`;

  res.json({ result: improved });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});