import { Link } from "react-router-dom";

export default function PhrasesIndex() {
  return (
    <section>
      <h1 className="text-2xl font-heading text-primary">Phrases</h1>
      <p className="mt-2 text-gray-700">
        Everyday Thai phrases with audio and usage notes.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border p-4">
          <div className="text-lg font-semibold text-primary">Greetings</div>
          <p className="text-sm text-gray-600 mt-1">สวัสดีครับ / ค่ะ, ขอบคุณ…</p>
        </div>
        <div className="rounded-2xl border p-4">
          <div className="text-lg font-semibold text-primary">Family & Friends</div>
          <p className="text-sm text-gray-600 mt-1">Polite particles, small talk.</p>
        </div>
        <div className="rounded-2xl border p-4">
          <div className="text-lg font-semibold text-primary">Travel</div>
          <p className="text-sm text-gray-600 mt-1">Directions, prices, help.</p>
        </div>
      </div>
    </section>
  );
}
