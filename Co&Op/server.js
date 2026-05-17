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

// Simple in-memory rate limiter
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 30; // max requests per window

function getClientId(req) {
  return req.ip || req.socket.remoteAddress || "unknown";
}

function checkRateLimit(req, res, next) {
  const clientId = getClientId(req);
  const now = Date.now();

  if (!requestCounts.has(clientId)) {
    requestCounts.set(clientId, []);
  }

  const timestamps = requestCounts.get(clientId);
  const validTimestamps = timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW);

  if (validTimestamps.length >= RATE_LIMIT_MAX) {
    return res.status(429).json({ error: "Too many requests, please try again later." });
  }

  validTimestamps.push(now);
  requestCounts.set(clientId, validTimestamps);

  // Cleanup old entries
  if (requestCounts.size > 1000) {
    for (const [id, times] of requestCounts.entries()) {
      const valid = times.filter((ts) => now - ts < RATE_LIMIT_WINDOW);
      if (valid.length === 0) {
        requestCounts.delete(id);
      } else {
        requestCounts.set(id, valid);
      }
    }
  }

  next();
}

// Middleware
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname));

if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY in .env");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Input validation helper
function validateInput(message) {
  // Check type
  if (typeof message !== "string") {
    return { valid: false, error: "Message must be text" };
  }

  // Trim whitespace
  const trimmed = message.trim();

  // Check empty
  if (trimmed.length === 0) {
    return { valid: false, error: "Message cannot be empty" };
  }

  // Check length (1000 char limit)
  if (trimmed.length > 1000) {
    return { valid: false, error: "Message exceeds 1000 character limit" };
  }

  return { valid: true, message: trimmed };
}

// Sanitize mode parameter
function validateMode(mode) {
  const validModes = ["rewrite", "analyze", "calm", "legal", "repair"];
  if (!mode || !validModes.includes(mode)) {
    return "rewrite";
  }
  return mode;
}

const modeInstructions = {
  rewrite: "You are Co-Op, an AI communication assistant. Help users rewrite messages clearly while preserving their original meaning and intent. Do not add new facts. Do not sound robotic. Return only the rewritten message unless the user asks for explanation.",
  analyze: "Analyze this message. Identify the underlying meaning, emotional tone, social signal, and potential impact. Be direct and concise. Format:\nMeaning: ...\nTone: ...\nPotential Impact: ...",
  calm: "Help the user rewrite this message in a calmer, more level-headed way. Remove anger, frustration, or defensiveness while keeping the core message. Make it constructive, not accusatory. Return only the rewritten message.",
  legal: "Rewrite this message in clear, professional, legally-sound language. Make it formal and unambiguous. Avoid emotional language. Focus on facts and clarity. Return only the rewritten message.",
  repair: "Rewrite this message to repair or improve the relationship. Focus on understanding, empathy, and connection. Acknowledge the other person's perspective. Make it warm but honest. Return only the rewritten message.",
};

app.post("/chat", checkRateLimit, async (req, res) => {
  try {
    const { message, mode } = req.body;

    // Validate input
    const validation = validateInput(message);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Validate and sanitize mode
    const sanitizedMode = validateMode(mode);
    const systemInstruction = modeInstructions[sanitizedMode];

    const messages = [
      {
        role: "system",
        content: systemInstruction,
      },
      {
        role: "user",
        content: validation.message,
      },
    ];

    // Make API request with timeout
    const response = await Promise.race([
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.4,
        messages: messages,
        max_tokens: 500,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), 30000)
      ),
    ]);

    const reply =
      response.choices[0]?.message?.content ||
      "Sorry, I couldn't process that. Try again.";

    // Limit reply length in response
    res.json({
      reply: reply.substring(0, 2000),
    });
  } catch (err) {
    // Log error securely (don't expose to frontend)
    console.error("Chat error:", err.message);

    // Return safe error message
    if (err.message === "Request timeout") {
      return res.status(504).json({ error: "Request timed out. Please try again." });
    }

    if (err.status === 429) {
      return res.status(429).json({ error: "API rate limit reached. Please try again later." });
    }

    if (err.status === 401) {
      console.error("Authentication failed - check your OpenAI API key");
      return res.status(500).json({ error: "Service error. Please try again." });
    }

    // Generic error for unknown issues
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

app.post("/reset", checkRateLimit, (req, res) => {
  res.json({ message: "Conversation reset" });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler (catch-all)
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(500).json({ error: "Server error. Please try again." });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
  console.log("Press Ctrl+C to stop the server");
});
