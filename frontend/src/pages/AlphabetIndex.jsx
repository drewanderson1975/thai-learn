import { Link } from "react-router-dom";

export default function AlphabetIndex() {
  return (
    <section>
      <h1 className="text-2xl font-heading text-primary">Thai Alphabet</h1>
      <p className="mt-2 text-gray-700">
        Explore Thai consonants by class. Start with Middle class if you’re new to tone rules.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/alphabet/mid" className="rounded-2xl border p-4 hover:border-primary">
          <div className="text-lg font-semibold text-primary">Middle Class</div>
          <p className="text-sm text-gray-600 mt-1">Reference class for tone rules.</p>
        </Link>
        <Link to="/alphabet/high" className="rounded-2xl border p-4 hover:border-primary">
          <div className="text-lg font-semibold text-primary">High Class</div>
          <p className="text-sm text-gray-600 mt-1">Pairs with tone marks differently.</p>
        </Link>
        <Link to="/alphabet/low" className="rounded-2xl border p-4 hover:border-primary">
          <div className="text-lg font-semibold text-primary">Low Class</div>
          <p className="text-sm text-gray-600 mt-1">Largest group; special patterns.</p>
        </Link>
        <div className="rounded-2xl border p-4 opacity-60">
          <div className="text-lg font-semibold">Vowels (coming soon)</div>
          <p className="text-sm text-gray-600 mt-1">Monophthongs & diphthongs.</p>
        </div>
      </div>
    </section>
  );
}
