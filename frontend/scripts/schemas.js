// frontend/scripts/schemas.js
// Zod schemas for validating content files (letters, words, phrases)

import { z } from "zod";

/** ----- Shared primitives ----- */
export const ConsonantClass = z.enum(["High", "Mid", "Low"]);
export const ReviewSubStatus = z.enum(["Outstanding", "Being reviewed", "Done"]);
export const LetterOverallStatus = z.enum(["Outstanding", "In progress", "Complete"]);
export const ItemId = z.string().min(1, "id is required");
export const UrlPath = z.string().min(1);

/** ----- Letter schema (consonants & vowels) ----- */
export const LetterSchema = z.object({
  id: ItemId,
  glyph: z.string().min(1),
  type: z.enum(["consonant", "vowel"]),
  consonantClass: ConsonantClass.optional(),

  nameThai: z.string().min(1),
  nameRtgs: z.string().min(1),
  nameGloss: z.string().optional(),

  rtgs: z.string().optional(),
  ipa: z.string().optional(),
  ipaNote: z.string().optional(),
  initial: z.string().optional(),
  final: z.string().optional(),

  // NEW
  tip: z.string().optional(),

  // NEW: richer audio metadata (all optional)
  audio: z.object({
    glyph: UrlPath.optional(),       // public path or https URL
    durationSec: z.number().optional(),
    source: z.enum(["tts","human"]).optional(),
    recordedBy: z.string().optional(),   // uid or name
    ttsProvider: z.string().optional(),  // e.g., "google-tts"
    ttsVoice: z.string().optional(),     // e.g., "th-TH-Neural2-C"
    updatedAt: z.string().optional()     // ISO timestamp
  }).optional(),

  // NEW: review statuses (all optional)
  review: z.object({
    noteStatus: ReviewSubStatus.optional(),
    audioStatus: ReviewSubStatus.optional(),
    letterStatus: LetterOverallStatus.optional(),
    updatedBy: z.string().optional(),
    updatedAt: z.string().optional()
  }).optional(),
}).superRefine((val, ctx) => {
  if (val.type === "consonant" && !val.consonantClass) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "consonantClass is required when type = 'consonant'",
      path: ["consonantClass"],
    });
  }
});

/** ----- Word schema ----- */
export const WordSchema = z.object({
  id: ItemId,
  thai: z.string().min(1),
  rtgs: z.string().min(1),
  ipa: z.string().optional(),
  audio: UrlPath.optional(),
  meaning: z.string().min(1),         // English gloss
  pos: z.string().optional(),         // "noun", "verb", ...
  topic: z.string().optional(),       // "food", "greetings", ...
  // Optional richer breakdown (future-friendly)
  syllables: z
    .array(z.object({
      initialConsonant: z.string().optional(),
      vowel: z.string().optional(),
      finalConsonant: z.string().optional(),
      toneMark: z.string().optional(),
      tone: z.string().optional(),
    }))
    .optional(),
  register: z.string().optional(),    // "neutral", "formal", "slang"
  notes: z.string().optional(),
});

/** ----- Phrase schema ----- */
export const PhraseSchema = z.object({
  id: ItemId,
  thai: z.string().min(1),
  rtgs: z.string().min(1),
  translation: z.string().min(1),
  audio: UrlPath.optional(),
  topic: z.string().optional(),
  formality: z.string().optional(), // "formal", "neutral"
  variants: z
    .array(z.object({
      id: ItemId.optional(),
      thai: z.string().min(1),
      rtgs: z.string().min(1),
      translation: z.string().optional(),
      audio: UrlPath.optional(),
    }))
    .optional(),
  notes: z.string().optional(),
});

/** ----- Collections (for bundling) ----- */
export const LettersCollection = z.array(LetterSchema);
export const WordsCollection = z.array(WordSchema);
export const PhrasesCollection = z.array(PhraseSchema);
