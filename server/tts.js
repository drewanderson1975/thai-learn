// CommonJS version of your TTS helpers that keeps your Thai-only logic and caching
// Works with server/index.js which requires { listVoices, synthesize }

const textToSpeech = require("@google-cloud/text-to-speech");

// Google TTS client (uses ADC via GOOGLE_APPLICATION_CREDENTIALS or gcloud)
const client = new textToSpeech.TextToSpeechClient();

// Cache voices so we only hit the API once per process
let cachedVoices = null;

/**
 * Return only Thai voices, cached after first fetch.
 * Shape kept similar to your original { name, languageCodes, ssmlGender, naturalSampleRateHertz }.
 */
async function listVoices() {
  if (cachedVoices) return cachedVoices;

  // Ask the API for Thai voices only
  const [result] = await client.listVoices({ languageCode: "th-TH" });

  cachedVoices = (result.voices || [])
    // Ensure they actually include th-TH
    .filter((v) => (v.languageCodes || []).includes("th-TH"))
    // Map to a tidy, predictable shape
    .map((v) => ({
      name: v.name,
      languageCodes: v.languageCodes,
      ssmlGender: v.ssmlGender,
      naturalSampleRateHertz: v.naturalSampleRateHertz,
    }));

  return cachedVoices;
}

/**
 * Synthesize speech in Thai.
 * Parameters:
 *  - text (required)
 *  - voiceName (optional, will fall back to Standard or first Thai voice)
 *  - speakingRate (default 1.0)
 *  - pitch (default 0)
 *  - audioEncoding (default "MP3"; allowed: "MP3" | "OGG_OPUS" | "LINEAR16")
 *
 * Returns:
 *  - { audioBuffer: Buffer, contentType: string, voice: {name,...}, audioEncoding }
 */
async function synthesize({
  text,
  voiceName,
  speakingRate = 1.0,
  pitch = 0,
  audioEncoding = "MP3",
}) {
  if (!text || !String(text).trim()) {
    const err = new Error("Text is required for synthesis");
    err.statusCode = 400;
    throw err;
  }

  // Get Thai voices (cached)
  const voices = await listVoices();

  // Pick specified voice if available; otherwise prefer a Standard* voice, else first available
  let selectedVoice = voices.find((v) => v.name === voiceName);
  if (!selectedVoice) {
    selectedVoice = voices.find((v) => /Standard/i.test(v.name)) || voices[0];
  }
  if (!selectedVoice) {
    const err = new Error("No Thai voices (th-TH) available from Google TTS");
    err.statusCode = 502;
    throw err;
  }

  // Map encoding to a MIME type for the HTTP response
  const encodingToMime = {
    MP3: "audio/mpeg",
    OGG_OPUS: "audio/ogg",
    LINEAR16: "audio/wav",
  };
  const contentType = encodingToMime[audioEncoding] || "application/octet-stream";

  const request = {
    input: { text },
    voice: {
      languageCode: "th-TH",
      name: selectedVoice.name,
    },
    audioConfig: {
      audioEncoding, // MP3 | OGG_OPUS | LINEAR16
      speakingRate: Number(speakingRate),
      pitch: Number(pitch),
    },
  };

  const [response] = await client.synthesizeSpeech(request);

  // response.audioContent may be a Buffer or base64 string depending on env; normalize to Buffer
  let audioBuffer;
  if (Buffer.isBuffer(response.audioContent)) {
    audioBuffer = response.audioContent;
  } else if (typeof response.audioContent === "string") {
    audioBuffer = Buffer.from(response.audioContent, "base64");
  } else {
    const err = new Error("TTS returned empty audio.");
    err.statusCode = 502;
    throw err;
  }

  return {
    audioBuffer,            // what server/index.js sends with res.send(...)
    contentType,            // what server/index.js sets as Content-Type
    voice: selectedVoice,   // keep this so the caller can see which voice was used
    audioEncoding,          // echoed back for reference
  };
}

module.exports = { listVoices, synthesize };
