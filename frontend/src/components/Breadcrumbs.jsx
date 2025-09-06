import { Link, useLocation } from "react-router-dom";

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length < 2) return null; // only show when at least /section/sub

  const crumbs = [];
  let href = "";
  parts.forEach((p, i) => {
    href += `/${p}`;
    const label = p === "alphabet" ? "Alphabet"
      : p === "mid" ? "Middle Class"
      : p === "high" ? "High Class"
      : p === "low" ? "Low Class"
      : p === "words" ? "Words"
      : p === "phrases" ? "Phrases"
      : p;
    const isLast = i === parts.length - 1;
    crumbs.push(
      isLast
        ? <span key={href} className="text-neutral">{label}</span>
        : <Link key={href} to={href} className="text-primary hover:text-accent">{label}</Link>
    );
  });

  return (
    <nav className="mb-4 text-sm flex items-center gap-2">
      <Link to="/" className="text-primary hover:text-accent">Home</Link>
      <span>›</span>
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-2">
          {c}{i < crumbs.length - 1 && <span>›</span>}
        </span>
      ))}
    </nav>
  );
}
