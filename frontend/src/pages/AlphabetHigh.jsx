import { Link } from "react-router-dom";
import ThaiGlyphTile from "../components/ThaiGlyphTile";
import Breadcrumbs from "../components/Breadcrumbs";
import useLettersData from "../hooks/useLettersData";

export default function ReviewLettersHigh() {
  const { letters, loading, error } = useLettersData({ consonantClass: "High" });

  if (loading) return <div>Loading…</div>;
  if (error) return <div className="text-red-600">Error loading letters: {String(error)}</div>;

  const highLetters = letters.filter(
    (l) => l.type === "consonant" && l.consonantClass === "High"
  );

  return (
    <section>
      <Breadcrumbs />

      <h1 className="text-2xl font-heading text-primary">
        Thai Consonants – High Class
      </h1>

      <h2 className="mt-6 text-xl font-heading text-primary">High Class Rules</h2>
      <div className="mt-2 text-gray-700 space-y-2">
        <p>
          Thai consonants are grouped into High, Middle, and Low classes. The class
          affects the <em>baseline tone</em> of a syllable and how tone marks apply.
        </p>
        <p>
          For High class initials, unmarked tones behave differently from Middle class,
          and tone marks map to tones in a distinct way. Whether a syllable is{" "}
          <strong>live</strong> (ends in a vowel or a sonorant like ง /น /ม /ย /ว)
          or <strong>dead</strong> (short vowel or ends in a stop like ก/ด/บ) is
          also crucial.
        </p>
        <p className="text-sm text-gray-600">
          Practical tip: remember that High class often requires learners to rely on
          tone marks sooner, whereas Middle class serves as the “reference” pattern.
          We’ll reinforce the exact mappings in later tone lessons.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {highLetters.map((item) => (
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