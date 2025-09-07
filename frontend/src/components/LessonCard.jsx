import { Link } from "react-router-dom";
import { Badge, Card } from "../design-system";

// Map lesson badge types to design system variants
const badgeVariants = {
  Core: "core",
  Practice: "practice", 
  Phrasebook: "phrasebook",
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
        "block transition hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-accent",
        locked ? "opacity-60 pointer-events-none" : "hover:-translate-y-0.5",
      ].join(" ")}
    >
      <Card size="lg" className="h-full">
        <div className="flex items-start justify-between">
          <Badge
            variant={badgeVariants[badge] || "secondary"}
            size="sm"
          >
            {badge}
          </Badge>
          <span className="text-xs text-gray-500">{level}</span>
        </div>

      <h3 className="mt-3 text-lg font-heading text-primary">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>

        <div className="mt-4 text-sm font-semibold text-primary">
          {locked ? "Coming soon" : "Start →"}
        </div>
      </Card>
    </Wrapper>
  );
}
