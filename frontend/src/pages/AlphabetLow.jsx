import { Link } from "react-router-dom";
import ThaiGlyphTile from "../components/ThaiGlyphTile";
import letters from "../data/alphabet/letters.json";
import Breadcrumbs from "../components/Breadcrumbs";

export default function ReviewLettersLow() {
  const lowLetters = letters.filter(
    (l) => l.type === "consonant" && l.consonantClass === "Low"
  );

  return (
    <section>
      <Breadcrumbs />
      
      <h1 className="text-2xl font-heading text-primary">
        Thai Consonants – Low Class
      </h1>

      <h2 className="mt-6 text-xl font-heading text-primary">Low Class Rules</h2>
      <div className="mt-2 text-gray-700 space-y-2">
        <p>
          Low class initials have their own baseline tone behavior and interact with
          tone marks differently from Middle and High classes. As always, whether the
          syllable is <strong>live</strong> or <strong>dead</strong> changes the result.
        </p>
        <p>
          You’ll also see Low class consonants participate in special patterns such as
          <em> leading ห (ห นำ)</em> with another consonant to affect tone class in
          certain words—something we’ll practice later.
        </p>
        <p className="text-sm text-gray-600">
          For now, focus on recognizing each Low class letter’s sound (initial vs final)
          and get comfortable hearing it inside words before we formalize tone mappings.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lowLetters.map((item) => (
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
