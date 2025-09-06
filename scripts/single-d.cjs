// scripts/single-d.cjs
const fs = require("fs");
const path = require("path");
const util = require("util");
const textToSpeech = require("@google-cloud/text-to-speech");

(async () => {
  // voice: use one you listed (e.g. th-TH-Neural2-C)
  const VOICE = process.env.TTS_VOICE || "th-TH-Chirp3-HD-Zephyr";

  const client = new textToSpeech.TextToSpeechClient();

  // Use consonant + อ to get the bare consonant syllable "ดอ"
  const request = {
    input: { text: "ดอ" },
    voice: { languageCode: "th-TH", name: VOICE },
    audioConfig: { audioEncoding: "MP3" },
  };

  const [res] = await client.synthesizeSpeech(request);

  const outDir = path.join(__dirname, "../frontend/public/assets/audio/letters");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, "do_dek.mp3"); // pick the filename you use in data
  await util.promisify(fs.writeFile)(outPath, res.audioContent, "binary");

  console.log("✅ Wrote:", outPath);
})().catch(err => {
  console.error("❌", err.message || err);
  process.exit(1);
});
