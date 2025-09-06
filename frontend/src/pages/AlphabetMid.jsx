import ThaiGlyphTile from "../components/ThaiGlyphTile";
import Breadcrumbs from "../components/Breadcrumbs";
import useLettersData from "../hooks/useLettersData";

export default function ReviewLettersMid() {
  const { letters = [], loading, error } = useLettersData({ consonantClass: "Mid" });

  if (loading) return <div>Loading…</div>;
  if (error) return <div className="text-red-600">Error loading letters: {String(error)}</div>;

  const midLetters = letters.filter((l) => {
    const cls = (l?.consonantClass || "").toString().toLowerCase();
    return l?.type === "consonant" && (cls === "mid" || cls === "middle");
  });

  return (
    <section>
      <Breadcrumbs />

      <h1 className="text-2xl font-heading text-primary">
        Thai Consonants – Middle Class
      </h1>

      <h2 className="mt-6 text-xl font-heading text-primary">Middle Class Rules</h2>
      <div className="mt-2 text-gray-700 space-y-2">
        <p>
          Middle class consonants form the reference pattern for tone calculation.
          They interact with tone marks and syllable openness (live vs dead) in the
          standard way that most learners encounter first.
        </p>
        <p className="text-sm text-gray-600">
          Tip: when in doubt, use Middle class mappings as your baseline and learn
          High/Low deviations afterwards. We'll show full tone mapping tables in the
          tone lessons.
        </p>
      </div>

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