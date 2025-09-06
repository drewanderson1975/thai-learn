import lessons from "../data/lessons.json";
import LessonCard from "../components/LessonCard";

export default function Lessons() {
  return (
    <section>
      <h1 className="text-2xl font-heading text-primary mb-4">Lessons</h1>
      <p className="mb-6 text-gray-700">
        Start with the alphabet and tones, then build up to words and common phrases.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((l) => (
          <LessonCard
            key={l.slug}
            title={l.title}
            description={l.description}
            level={l.level}
            badge={l.badge}
            locked={l.locked}
            href={`/lessons/${l.slug}`}
          />
        ))}
      </div>
    </section>
  );
}
