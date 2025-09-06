import { useState, useId } from "react";

export default function InfoPopover({ children }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="relative">
      <button
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="inline-flex items-center justify-center rounded-full border border-gray-200 w-7 h-7 text-sm text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-accent"
        title="More info"
      >
        i
      </button>

      {open && (
        <div
          id={id}
          role="dialog"
          className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-3 shadow-lg text-sm"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}
