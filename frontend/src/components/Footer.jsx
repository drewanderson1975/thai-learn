export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-gray-600 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Thai Learn. All rights reserved.</p>
        <nav className="flex gap-4">
          <a href="/lessons" className="hover:text-primary">Lessons</a>
          <a href="/review" className="hover:text-primary">Review</a>
          <a href="/progress" className="hover:text-primary">Progress</a>
        </nav>
      </div>
    </footer>
  );
}
