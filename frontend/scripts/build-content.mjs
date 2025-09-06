// frontend/scripts/build-content.mjs
// Build-time script: read YAML content, validate with Zod, emit JSON bundles.

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import YAML from "yaml";
import {
  LetterSchema,
  WordSchema,
  PhraseSchema,
  LettersCollection,
  WordsCollection,
  PhrasesCollection,
} from "./schemas.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, "..");          // .../frontend
const CONTENT_DIR = path.join(ROOT, "content");
const OUT_DIR = path.join(ROOT, "src", "data");

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      yield* walk(p);
    } else {
      yield p;
    }
  }
}

async function loadYamlFiles(dir) {
  const items = [];
  try {
    for await (const file of walk(dir)) {
      if (file.endsWith(".yaml") || file.endsWith(".yml")) {
        const raw = await fs.readFile(file, "utf8");
        const parsed = YAML.parse(raw);
        items.push({ file, data: parsed });
      }
    }
  } catch (err) {
    console.error(`Failed walking ${dir}:`, err);
    process.exit(1);
  }
  return items;
}

function validateItems(items, schema, label) {
  const out = [];
  let errors = 0;

  for (const { file, data } of items) {
    const result = schema.safeParse(data);
    if (!result.success) {
      errors++;
      console.error(`\n❌ ${label} validation failed for: ${file}`);
      for (const issue of result.error.issues) {
        console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
      }
    } else {
      out.push(result.data);
    }
  }

  if (errors > 0) {
    console.error(`\n${errors} ${label.toLowerCase()} file(s) had errors. Aborting.`);
    process.exit(1);
  }
  return out;
}

async function writeJson(dest, data) {
  await ensureDir(path.dirname(dest));
  await fs.writeFile(dest, JSON.stringify(data, null, 2), "utf8");
  console.log(`✅ Wrote ${dest}`);
}

async function main() {
  console.log("🔎 Reading content from:", CONTENT_DIR);

  // Letters
  const lettersFiles = await loadYamlFiles(path.join(CONTENT_DIR, "alphabet"));
  const letters = validateItems(lettersFiles, LetterSchema, "Letter");
  LettersCollection.parse(letters); // collection-level sanity
  await writeJson(path.join(OUT_DIR, "alphabet", "letters.json"), letters);

  // Words
  const wordsFiles = await loadYamlFiles(path.join(CONTENT_DIR, "lexicon"));
  const words = validateItems(wordsFiles, WordSchema, "Word");
  WordsCollection.parse(words);
  await writeJson(path.join(OUT_DIR, "lexicon", "words.json"), words);

  // Phrases
  const phrasesFiles = await loadYamlFiles(path.join(CONTENT_DIR, "phrasebook"));
  const phrases = validateItems(phrasesFiles, PhraseSchema, "Phrase");
  PhrasesCollection.parse(phrases);
  await writeJson(path.join(OUT_DIR, "phrasebook", "phrases.json"), phrases);

  console.log("\n🎉 Content build complete.");
}

main().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
