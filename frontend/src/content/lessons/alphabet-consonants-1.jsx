import ThaiGlyphTile from "../../components/ThaiGlyphTile";


/* ---------- Utilities ---------- */

// Auto-wrap Thai script with .thai-text
function highlightThai(text) {
  if (typeof text !== "string") return text;
  const re = /[\u0E00-\u0E7F]+/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  while ((match = re.exec(text)) !== null) {
    const { index } = match;
    if (index > lastIndex) parts.push(text.slice(lastIndex, index));
    parts.push(
      <span key={index} className="thai-text">
        {match[0]}
      </span>
    );
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

/* ---------- Reusable mini components ---------- */

function ObjectiveList({ items = [] }) {
  const safeItems = items.filter(Boolean);
  return (
    <ul className="list-disc pl-6 space-y-1 text-gray-700">
      {safeItems.map((t, i) => (
        <li key={`${String(t)}-${i}`}>{t}</li>
      ))}
    </ul>
  );
}

function AudioRow({ label, src, helper = "Tap ▶ to hear the base sound." }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-3">
      <div>
        <div className="font-semibold text-primary">{highlightThai(label)}</div>
        <div className="text-sm text-gray-600">{helper}</div>
      </div>
      <audio controls src={src} className="max-w-[240px]" />
    </div>
  );
}

function ListenRepeatTiles() {
const items = [
  {
    glyph: "ก",
    consonantClass: "Mid",
    nameThai: "ไก่",
    nameRtgs: "kai",
    nameGloss: "chicken",
    tip: "Hard ‘g/k’ without a puff of air; at word-final it becomes a clipped, unreleased /k/.",
    rtgs: "k",
    ipa: "/k/",
    ipaNote: "unaspirated",
    initial: "/k/ (unaspirated)",
    final: "/k̚/ (unreleased stop)",
    src: "/assets/audio/ko_kai.mp3",
  },
  {
    glyph: "ข",
    consonantClass: "High",
    nameThai: "ไข่",
    nameRtgs: "khai",
    nameGloss: "egg",
    tip: "Strong puff of air on the initial; a tissue should move when you say it. Final reduces to unreleased /k/.",
    rtgs: "kh",
    ipa: "/kʰ/",
    ipaNote: "aspirated",
    initial: "/kʰ/ (aspirated)",
    final: "/k̚/ (unreleased stop)",
    src: "/assets/audio/kho_khai.mp3",
  },
  {
    glyph: "ค",
    consonantClass: "Low",
    nameThai: "ควาย",
    nameRtgs: "khwai",
    nameGloss: "buffalo",
    tip: "Same base sound as ข: aspirated /kʰ/ initially; word-final becomes unreleased /k/.",
    rtgs: "kh",
    ipa: "/kʰ/",
    ipaNote: "aspirated",
    initial: "/kʰ/ (aspirated)",
    final: "/k̚/ (unreleased stop)",
    src: "/assets/audio/kho_khuat.mp3",
  },
  {
    glyph: "ง",
    consonantClass: "Low",
    nameThai: "งู",
    nameRtgs: "ngu",
    nameGloss: "snake",
    tip: "Like ‘ng’ in “sing”. Thai allows it initially; same /ŋ/ sound in final position.",
    rtgs: "ng",
    ipa: "/ŋ/",
    ipaNote: "velar nasal",
    initial: "/ŋ/",
    final: "/ŋ/",
    src: "/assets/audio/ngo_nguu.mp3",
  },
  {
    glyph: "จ",
    consonantClass: "Mid",
    nameThai: "จาน",
    nameRtgs: "chan",
    nameGloss: "plate",
    tip: "Between ‘j’ and ‘ch’ (t + sh ≈ tɕ). Word-final reduces to a clipped, unreleased /t/.",
    rtgs: "ch",
    ipa: "/tɕ/",
    ipaNote: "alveolo-palatal affricate",
    initial: "/tɕ/ (between ‘j’ and ‘ch’)",
    final: "/t̚/ (unreleased stop)",
    src: "/assets/audio/cho_chan.mp3",
  },
];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <ThaiGlyphTile key={it.glyph} {...it} />
      ))}
    </div>
  );
}


function QuizMCQ({ question, options, answerIndex, onResult }) {
  const handleClick = (i) => onResult?.(i === answerIndex);
  return (
    <div className="rounded-2xl border border-gray-200 p-4">
      <div className="font-semibold text-primary">{question}</div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((opt, i) => (
          <button
            key={opt ?? `opt-${i}`}
            onClick={() => handleClick(i)}
            className="rounded-xl border border-gray-200 px-3 py-2 text-left hover:border-primary"
          >
            {opt ?? "—"}
          </button>
        ))}
      </div>
    </div>
  );
}

export default {
  title: "Thai Alphabet: Consonants (Part 1)",
  level: "Beginner",
  next: "/lessons/alphabet-vowels-1",
  sections: [
    {
      heading: "Overview",
      body: (
        <p className="text-gray-700">
          In this lesson you’ll meet some core Thai consonants and their base sounds.
          Focus on the sound—exact letter names come later as you internalize them.
        </p>
      ),
    },
    {
      heading: "Objectives",
      body: (
        <ObjectiveList
          items={[
            "Recognize 5 core consonant letters",
            "Understand consonant class (High/Mid/Low) at a glance",
            "Differentiate initial vs final consonant sounds",
          ]}
        />
      ),
    },
    {
      heading: "Listen & Repeat",
      body: <ListenRepeatTiles />,
    },
    {
      heading: "Minimal Pairs (Ear Training)",
      body: (
        <div className="rounded-2xl border border-gray-200 p-4 space-y-3">
          <p className="text-gray-700">Play each pair and say which consonant you hear first.</p>
          <div className="grid gap-3">
            <AudioRow label="ก vs ข" src="/assets/audio/minpair_ko_vs_kho.mp3" />
            <AudioRow label="จ vs ง" src="/assets/audio/minpair_cho_vs_ngo.mp3" />
          </div>
        </div>
      ),
    },
    {
      heading: "Quick Check",
      body: (
        <QuizMCQ
          question="Which letter represents the /ŋ/ sound?"
          options={["ก (ko kai)", "ง (ngo nguu)", "จ (cho chan)", "ข (kho khai)"]}
          answerIndex={1}
          onResult={(correct) => alert(correct ? "✅ Correct!" : "❌ Try again")}
        />
      ),
    },
  ],
};
