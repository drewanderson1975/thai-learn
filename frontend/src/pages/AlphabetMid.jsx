import { Link } from "react-router-dom";
import ThaiGlyphTile from "../components/ThaiGlyphTile";
import letters from "../data/alphabet/letters.json";
import Breadcrumbs from "../components/Breadcrumbs";

export default function ReviewLettersMid() {
  const midLetters = letters.filter(
    (l) => l.type === "consonant" && l.consonantClass === "Mid"
  );

  return (
    <section>
      <Breadcrumbs />

      <h1 className="text-2xl font-heading text-primary">
        Thai Consonants – Middle Class
      </h1>

      {/* Rules section */}
      <h2 className="mt-6 text-xl font-heading text-primary">Middle Class Rules</h2>
      <div className="mt-2 text-gray-700 space-y-2">
        <p>
          Thai consonants are divided into three classes: high, middle, and low.
          Middle class consonants form the reference group for the tone rules.
        </p>
        <p>
          When a middle class consonant is used with a <strong>live syllable</strong>
          (ending in a vowel or sonorant), the default tone is <em>mid tone</em>.
        </p>
        <p>
          With a <strong>dead syllable</strong> (ending in a stop or short vowel),
          the default tone is <em>low tone</em>.
        </p>
        <p>
          Tone marks placed on middle class consonants create all four other tones
          (low, falling, high, rising), which is why they’re considered the
          “reference” group for tone rules.
        </p>
      </div>

      {/* Tile grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {midLetters.map((item) => (
          <ThaiGlyphTile
            key={item.id}
            id={item.id} 
            glyph={item.glyph}
            consonantClass={item.consonantClass}
            nameThai={item.nameThai}
            nameRtgs={item.nameRtgs}
            nameGloss={item.nameGloss}
            tip={item.tip}
            rtgs={item.rtgs}
            ipa={item.ipa}
            ipaNote={item.ipaNote}
            initial={item.initial}
            final={item.final}
            src={item.audio?.glyph}
            review={item.review}
          />
        ))}
      </div>
    </section>
  );
}
