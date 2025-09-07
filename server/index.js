// server/index.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");

// ✅ Use your real TTS helpers (Thai-only voices + caching)
const { listVoices, synthesize } = require("./tts");

const app = express();

// --- Middleware ---
app.use(cors()); // keep permissive in dev; tighten in prod
app.use(bodyParser.json({ limit: "1mb" }));
app.use(morgan("dev"));

// --- Health ---
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// --- Voices (Thai-only; cached in tts.js) ---
app.get("/api/tts/voices", async (_req, res) => {
  try {
    const voices = await listVoices();
    res.json({ voices });
  } catch (e) {
    console.error("[voices] error:", e);
    res.status(500).json({ error: "Failed to list voices" });
  }
});

// --- Synthesize ---
// body: { text, voiceName?, speakingRate?, pitch?, audioEncoding? }
// returns: audio bytes with appropriate Content-Type
app.post("/api/tts/synthesize", async (req, res) => {
  try {
    const { text, voiceName, speakingRate, pitch, audioEncoding } = req.body || {};
    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: "Missing required field: text" });
    }

    const { audioBuffer, contentType, voice } = await synthesize({
      text,
      voiceName,
      speakingRate,
      pitch,
      audioEncoding, // defaults to MP3 inside tts.js
    });

    // Helpful debug header (visible in Network tab)
    if (voice?.name) res.setHeader("X-Voice-Name", voice.name);

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "no-store");
    return res.send(audioBuffer);
  } catch (e) {
    console.error("[synthesize] error:", e);
    const code = e.statusCode || 500;
    res.status(code).json({ error: e.message || "Failed to synthesize audio" });
  }
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`TTS API listening on http://localhost:${PORT}`);
  console.log("GET  /api/tts/voices");
  console.log("POST /api/tts/synthesize");
});
