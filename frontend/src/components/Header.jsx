import { AdminAuthPanel } from "./AdminGate";

export default function Header({
  title = "Thai Learn",
  subtitle = "Master Thai — from alphabet & tones to everyday phrases.",
}) {
  return (
    <header className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl md:text-5xl font-heading text-primary tracking-tight">
            {title}
          </h1>
          <p className="text-base md:text-lg text-gray-700 max-w-2xl">
            {subtitle}
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href="/lessons"
              className="inline-block rounded-2xl bg-primary px-5 py-3 text-white font-semibold hover:opacity-90"
            >
              Start lessons
            </a>
          </div>
          <div className="flex items-center justify-between">
          <AdminAuthPanel />
          </div>
        </div>
      </div>
    </header>
  );
}


