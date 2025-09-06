import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section>
      <h1 className="text-3xl font-heading text-primary">Welcome to Thai Learn</h1>
      <p className="mt-3 text-gray-700">
        Start with the Thai alphabet and tones, then build up to words and common phrases.
        Use the Review area anytime and track your progress as you go.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link to="/lessons" className="block rounded-2xl border border-gray-200 p-5 hover:shadow">
          <h2 className="text-xl font-heading text-primary">Lessons</h2>
          <p className="mt-1 text-gray-600">Alphabet, tones, vocabulary, and phrases.</p>
        </Link>
        <Link to="/alphabet" className="block rounded-2xl border border-gray-200 p-5 hover:shadow">
          <h2 className="text-xl font-heading text-primary">Alphabet</h2>
          <p className="mt-1 text-gray-600">An area containing details of all Thai letters.</p>
        </Link>
        <Link to="/words" className="block rounded-2xl border border-gray-200 p-5 hover:shadow">
          <h2 className="text-xl font-heading text-primary">Words</h2>
          <p className="mt-1 text-gray-600">Thai words.</p>
        </Link>
        <Link to="/phrases" className="block rounded-2xl border border-gray-200 p-5 hover:shadow">
          <h2 className="text-xl font-heading text-primary">Phrases</h2>
          <p className="mt-1 text-gray-600">Thai phrases</p>
        </Link>
      </div>
    </section>
  );
}
