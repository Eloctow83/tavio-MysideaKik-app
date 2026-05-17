// server.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY in .env");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const allowedTones = new Set([
  "friendly",
  "professional",
  "empathetic",
  "direct",
  "confident",
  "concise",
]);

let conversationHistory = [
  {
    role: "system",
    content:
      "You are Co-Op, an AI communication assistant. Help users rewrite messages clearly while preserving their original meaning and intent. Do not add new facts. Do not sound robotic. Return only the rewritten message unless the user asks for explanation.",
  },
];

app.post("/chat", async (req, res) => {
  try {
    const { message, tone = "friendly" } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const selectedTone = allowedTones.has(tone) ? tone : "friendly";

    const userPrompt = `
Rewrite this message in a ${selectedTone} tone.

Rules:
- Keep the user's original intent.
- Do not invent new details.
- Make it clear and natural.
- Return only the rewritten message.

Message:
${message}
`;

    conversationHistory.push({
      role: "user",
      content: userPrompt,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: conversationHistory,
    });

    const reply =
      response.choices[0]?.message?.content ||
      "Sorry, I couldn’t rewrite that. Try again.";

     

    if (conversationHistory.length > 20) {
      conversationHistory = [
        conversationHistory[0],
        ...conversationHistory.slice(-18),
      ];
    }

    res.json({ reply });
  } catch (err) {
    console.error("FULL ERROR:", err);

    res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
});

app.post("/reset", (req, res) => {
  conversationHistory = [
    {
      role: "system",
      content: `
You are MySideKik, a calm and emotionally aware AI companion.

Your purpose is to help users avoid arguments, cool down tension, and communicate better.

Use a light therapist-like style, but do not sound clinical or robotic.

Keep replies short, respectful, grounded, and easy to understand.

Do not attack, shame, or escalate. Help the user pause, reframe, and respond clearly.
`
    },
  ];

  res.json({ message: "Conversation reset" });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});