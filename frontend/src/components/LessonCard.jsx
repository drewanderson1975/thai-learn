import { Link } from "react-router-dom";

const badgeStyles = {
  Core: "bg-primary text-white",
  Practice: "bg-secondary text-white",
  Phrasebook: "bg-accent text-black",
};

export default function LessonCard({
  title,
  description,
  level = "Beginner",
  href = "#",
  badge = "Core",
  locked = false,
}) {
  const Wrapper = locked ? "div" : Link;

  return (
    <Wrapper
      to={locked ? undefined : href}
      aria-disabled={locked}
      className={[
        "block rounded-2xl border border-gray-200 p-5 transition",
        "hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-accent",
        locked ? "opacity-60 pointer-events-none" : "hover:-translate-y-0.5",
      ].join(" ")}
    >
      <div className="flex items-start justify-between">
        <span
          className={`inline-flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded-full ${
            badgeStyles[badge] || "bg-gray-200 text-gray-800"
          }`}
        >
          {badge}
        </span>
        <span className="text-xs text-gray-500">{level}</span>
      </div>

      <h3 className="mt-3 text-lg font-heading text-primary">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>

      <div className="mt-4 text-sm font-semibold text-primary">
        {locked ? "Coming soon" : "Start →"}
      </div>
    </Wrapper>
  );
}
