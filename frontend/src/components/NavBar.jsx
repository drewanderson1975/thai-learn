import { NavLink } from "react-router-dom";

export default function NavBar() {
  const base =
    "relative px-1 pb-1 text-primary transition-colors " +
    "after:content-[''] after:absolute after:left-0 after:bottom-0 " +
    "after:h-[2px] after:bg-accent after:transition-all after:duration-300";

  const active = "text-accent font-semibold after:w-full";
  const inactive = "hover:text-accent after:w-0 hover:after:w-full";

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-6xl px-6 py-3 flex gap-6">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          Home
        </NavLink>

        <NavLink
          to="/lessons"
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          Lessons
        </NavLink>

        <NavLink
          to="/alphabet"
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          Alphabet
        </NavLink>

        <NavLink
          to="/words"
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          Words
        </NavLink>

        <NavLink
          to="/phrases"
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          Phrases
        </NavLink>

        <NavLink
          to="/progress"
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          Progress
        </NavLink>
      </div>
    </nav>
  );
}
