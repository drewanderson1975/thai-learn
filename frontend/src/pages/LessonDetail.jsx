import { useParams, Link } from "react-router-dom";
import lessonsIndex from "../data/lessons.json";
import { lessonRegistry } from "../content/lessons";
import Breadcrumbs from "../components/Breadcrumbs";

export default function LessonDetail() {
  const { slug } = useParams();
  const meta = lessonsIndex.find((l) => l.slug === slug);
  const content = lessonRegistry[slug];

  if (!meta || !content) {
    return (
      <Breadcrumbs />
    );
  }

  return (
    <section>
      <nav className="mb-4 text-sm">
        <Link to="/lessons" className="text-primary hover:text-accent">← Back to lessons</Link>
      </nav>

      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-heading text-primary">{content.title}</h1>
        <span className="text-xs text-gray-500">{meta.level || content.level}</span>
      </div>

      <p className="mt-2 text-gray-700">{meta.description}</p>

      <div className="mt-6 space-y-6">
        {content.sections.map((sec) => (
          <section key={sec.heading} className="space-y-3">
            <h2 className="text-xl font-heading text-primary">{sec.heading}</h2>
            <div>{sec.body}</div>
          </section>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <Link to="/lessons" className="rounded-2xl border border-primary px-4 py-2 text-primary hover:bg-primary/5">
          Back to lessons
        </Link>
        {content.next && (
          <Link to={content.next} className="rounded-2xl bg-primary px-4 py-2 text-white hover:opacity-90">
            Next lesson →
          </Link>
        )}
      </div>
    </section>
  );
}
