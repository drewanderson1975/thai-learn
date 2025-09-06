import { Link } from "react-router-dom";

export default function WordsIndex() {
  return (
    <section>
      <h1 className="text-2xl font-heading text-primary">Words</h1>
      <p className="mt-2 text-gray-700">
        Browse common Thai words. We’ll group by topic and show audio + romanization.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border p-4">
          <div className="text-lg font-semibold text-primary">By Topic</div>
          <p className="text-sm text-gray-600 mt-1">Food, family, travel…</p>
        </div>
        <div className="rounded-2xl border p-4">
          <div className="text-lg font-semibold text-primary">By Letter</div>
          <p className="text-sm text-gray-600 mt-1">Words starting/ending with ก, ข, …</p>
        </div>
        <div className="rounded-2xl border p-4">
          <div className="text-lg font-semibold text-primary">Search</div>
          <p className="text-sm text-gray-600 mt-1">Find by Thai or romanization.</p>
        </div>
      </div>
    </section>
  );
}
