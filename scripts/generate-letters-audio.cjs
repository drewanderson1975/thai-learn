// scripts/generate-letters-audio.cjs
// Batch-generate MP3s for Thai letters using Google Cloud Text-to-Speech.
//
// ✔ Default text = <glyph + อ>  e.g. ก → "กอ", ข → "ขอ", ง → "งอ"
// ✔ Falls back to exemplar (nameThai) if you pass --use=name
// ✔ Writes to audio.glyph path if present; otherwise /assets/audio/letters/<slug_underscore>.mp3
//
// Usage (CMD):
//   set GOOGLE_APPLICATION_CREDENTIALS=C:\Users\...\key.json
//   cd scripts
//   node generate-letters-audio.cjs
//   node generate-letters-audio.cjs --force
//   node generate-letters-audio.cjs --only=ko-kai,kho-khai
//   set TTS_VOICE=th-TH-Neural2-C && node generate-letters-audio.cjs
//
const fs = require("fs");
const path = require("path");
const util = require("util");
const textToSpeech = require("@google-cloud/text-to-speech");

const writeFile = util.promisify(fs.writeFile);
const access = util.promisify(fs.access);

const ROOT = path.join(__dirname, "..");
const LETTERS_JSON = path.join(ROOT, "frontend", "src", "data", "alphabet", "letters.json");
const PUBLIC_LETTERS_DIR = path.join(ROOT, "frontend", "public", "assets", "audio", "letters");

// CLI / ENV
const VOICE_NAME = (process.env.TTS_VOICE || "th-TH-Chirp3-HD-Zephyr").trim();
const FORCE = process.argv.includes("--force");
const USE = (process.argv.find(a => a.startsWith("--use="))?.split("=")[1] || "glyph").toLowerCase(); // "glyph" | "name"
const ONLY = process.argv.find(a => a.startsWith("--only="))?.split("=")[1]?.split(",") || null;

function slugToFile(slug) {
  return slug.replace(/-/g, "_") + ".mp3";
}
async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}
async function fileExists(p) {
  try { await access(p, fs.constants.F_OK); return true; } catch { return false; }
}

// Build "glyph + อ" safely (works for consonants; if you later do vowels, you'll handle separately)
function glyphWithCarrier(glyph) {
  // For consonants, append อ to get the inherent -o sound (e.g., กอ, ขอ, งอ)
  // If empty or not a Thai char, just return glyph.
  if (!glyph || typeof glyph !== "string") return glyph || "";
  return glyph + "อ";
}

async function main() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error("❌ GOOGLE_APPLICATION_CREDENTIALS not set.");
    console.error("   Example (CMD): set GOOGLE_APPLICATION_CREDENTIALS=C:\\path\\to\\key.json");
    process.exit(1);
  }

  console.log("🔑 GOOGLE_APPLICATION_CREDENTIALS =", process.env.GOOGLE_APPLICATION_CREDENTIALS);
  console.log(`🗣  Voice: ${VOICE_NAME}`);
  console.log(`📝 Text source: ${USE === "name" ? "nameThai (exemplar word)" : "glyph + อ (consonant sound)"}`);

  const raw = await fs.promises.readFile(LETTERS_JSON, "utf8");
  /** @type {Array} */
  const letters = JSON.parse(raw);

  // limit to consonants for now (vowels later)
  let items = letters.filter(l => l?.type === "consonant");
  if (ONLY) {
    const set = new Set(ONLY);
    items = items.filter(l => set.has(l.id));
  }
  if (items.length === 0) {
    console.log("ℹ️ No letters to process. Check your filters.");
    return;
  }

  await ensureDir(PUBLIC_LETTERS_DIR);
  const client = new textToSpeech.TextToSpeechClient();

  let created = 0, skipped = 0, overwritten = 0, failed = 0;

  for (const l of items) {
    const baseText =
      USE === "name"
        ? (l.nameThai || l.glyph || "")
        : glyphWithCarrier(l.glyph || l.nameThai || "");

    if (!baseText) {
      console.warn(`⚠️  ${l.id}: no usable text (glyph/nameThai). Skipping.`);
      skipped++; continue;
    }

    // Choose output filename
    const configuredPath = l?.audio?.glyph; // e.g. "/assets/audio/letters/so_ruesi.mp3"
    const outfileName = configuredPath ? path.basename(configuredPath) : slugToFile(l.id);
    const outfile = path.join(PUBLIC_LETTERS_DIR, outfileName);

    if (!FORCE && await fileExists(outfile)) {
      console.log(`⏭️  ${l.id} → exists (${outfileName}), skipping (use --force to overwrite)`);
      skipped++; continue;
    }

    const request = {
      input: { text: baseText },
      voice: { languageCode: "th-TH", name: VOICE_NAME },
      audioConfig: { audioEncoding: "MP3" },
    };

    try {
      const [response] = await client.synthesizeSpeech(request);
      await writeFile(outfile, response.audioContent, "binary");
      if (FORCE) {
        console.log(`🔁 ${l.id} → ${outfileName} (overwritten)`);
        overwritten++;
      } else {
        console.log(`✅ ${l.id} → ${outfileName}`);
        created++;
      }
      if (configuredPath && !configuredPath.startsWith("/assets/audio/letters/")) {
        console.log(`   ⚠️ audio.glyph for ${l.id} points outside /assets/audio/letters/: ${configuredPath}`);
      }
    } catch (err) {
      console.error(`❌ ${l.id} failed:`, err?.message || err);
      failed++;
    }
  }

  console.log("\n📊 Summary");
  console.log(`   Created:     ${created}`);
  console.log(`   Overwritten: ${overwritten}`);
  console.log(`   Skipped:     ${skipped}`);
  console.log(`   Failed:      ${failed}`);
  console.log(`\n🎯 Files saved in: ${PUBLIC_LETTERS_DIR}`);
  console.log(`🔊 Served at: /assets/audio/letters/<filename>.mp3`);
}

main().catch(e => {
  console.error("Build failed:", e);
  process.exit(1);
});
