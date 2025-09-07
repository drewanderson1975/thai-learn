// server/index.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Inline handlers so we know the routes exist
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "1mb" }));

// Health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Voices
app.get("/api/tts/voices", async (_req, res) => {
  try {
    // Temporary stub so we can verify the route works
    res.json({ voices: [{ name: "stub-voice", languageCodes: ["th-TH"], ssmlGender: "FEMALE" }] });
  } catch (e) {
    res.status(500).json({ error: "Failed to list voices" });
  }
});

// Synthesize
app.post("/api/tts/synthesize", async (req, res) => {
  try {
    // Temporary stub so we can verify the route works
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(Buffer.alloc(0)); // empty MP3 payload just for routing check
  } catch (e) {
    res.status(500).json({ error: "Failed to synthesize audio" });
  }
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`TTS API listening on http://localhost:${PORT}`);
});
