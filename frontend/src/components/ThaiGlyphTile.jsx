import InfoPopover from "./InfoPopover";
import { useState, useMemo, useRef, useEffect } from "react";
import LetterEditorModal from "./LetterEditorModal";
import { useIsAdmin } from "./AdminGate"; // adjust path if needed
import { Badge, Button, Card } from "../design-system";

// --- Custom playback speed control (matches LetterEditorModal) ---
function SpeedControl({ audioRef, disabled }) {
  const [open, setOpen] = useState(false);
  const [rate, setRate] = useState(1);
  const rates = [0.75, 1, 1.25, 1.5, 2];

  useEffect(() => {
    if (audioRef?.current) audioRef.current.playbackRate = rate;
  }, [rate, audioRef]);

  // Reapply rate if src changes
  useEffect(() => {
    if (audioRef?.current) audioRef.current.playbackRate = rate;
  }, [audioRef?.current?.src]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title="Playback speed"
        className={
          "rounded-md px-2.5 py-1 text-xs sm:text-sm cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/50 " +
          (disabled ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400" : "bg-gray-100 hover:bg-gray-200")
        }
      >
        {rate}×
      </button>

      {open && !disabled && (
        <ul
          role="listbox"
          className="absolute right-0 mt-1 w-24 sm:w-28 rounded-md border bg-white shadow-lg z-10 py-1"
        >
          {rates.map((r) => (
            <li key={r}>
              <button
                type="button"
                role="option"
                aria-selected={rate === r}
                onClick={() => {
                  setRate(r);
                  setOpen(false);
                }}
                className={
                  "block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 cursor-pointer " +
                  (rate === r ? "font-semibold" : "")
                }
              >
                {r}×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Map consonant class to badge variant
const classBadgeVariant = (consonantClass) => {
  switch (consonantClass) {
    case "High": return "high";
    case "Mid": return "mid";
    case "Low": return "low";
    default: return "secondary";
  }
};

// Map status to badge variant
const statusBadgeVariant = (status) => {
  switch (status) {
    case "Outstanding": return "outstanding";
    case "In progress": return "inProgress";
    case "Complete": return "complete";
    default: return "secondary";
  }
};

export default function ThaiGlyphTile(props) {
  const {
    id,
    glyph,
    consonantClass,
    nameThai,
    nameRtgs,
    nameGloss,
    tip,
    rtgs,
    ipa,
    ipaNote,
    initial,
    final,
    src,
    review, // <-- pass this from parent: item.review
  } = props;

  const [open, setOpen] = useState(false);

  // real admin check
  const { isAdmin } = useIsAdmin();

  // Derive overall status if not explicitly provided
  const overallStatus = useMemo(() => {
    if (review?.letterStatus) return review.letterStatus;
    const note = review?.noteStatus || "Outstanding";
    const audio = review?.audioStatus || "Outstanding";
    if (note === "Done" && audio === "Done") return "Complete";
    if (note === "Being reviewed" || audio === "Being reviewed") return "In progress";
    return "Outstanding";
  }, [review]);

  const letterForEditor = {
    id,
    glyph,
    consonantClass,
    nameThai,
    nameRtgs,
    nameGloss,
    tip,
    rtgs,
    ipa,
    ipaNote,
    initial,
    final,
    audio: { glyph: src },
    review: review || {
      noteStatus: "Outstanding",
      audioStatus: "Outstanding",
      letterStatus: overallStatus,
    },
  };

  // audio ref to control playbackRate via custom SpeedControl
  const audioEl = useRef(null);

  return (
    <Card 
      size="md"
      className="relative grid grid-rows-[auto,1fr,auto] gap-2 h-full"
    >
      {/* Header row: left (badges) / right (Edit + Info) */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Badge
            variant={classBadgeVariant(consonantClass)}
            size="sm"
          >
            {consonantClass} class
          </Badge>

          {/* Admin-only overall status pill */}
          {isAdmin && (
            <Badge
              variant={statusBadgeVariant(overallStatus)}
              size="sm"
              title="Overall review status"
            >
              {overallStatus}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(true)}
              aria-label="Edit letter"
            >
              Edit
            </Button>
          )}

          {/* Info icon / popover trigger (ensure InfoPopover applies aria-label to its trigger) */}
          <InfoPopover aria-label="Letter info">
            <div className="space-y-1 text-gray-700">
              <div>
                <strong>RTGS:</strong> {rtgs}
              </div>
              <div>
                <strong>IPA:</strong> {ipa}
                {ipaNote ? ` (${ipaNote})` : ""}
              </div>
              <div>
                <strong>Initial:</strong> {initial}
              </div>
              <div>
                <strong>Final:</strong> {final}
              </div>
            </div>
          </InfoPopover>
        </div>
      </div>

      {/* Middle content area */}
      <div className="flex flex-col items-stretch gap-3 -mt-1">
        {/* Big glyph */}
        <div className="thai-glyph text-primary text-center leading-none">{glyph}</div>

        {/* Centered name line */}
        <div className="text-sm text-gray-700 text-center">
          <span className="font-thai">{nameThai}</span>
          <span className="mx-1">•</span>
          <span>{nameRtgs}</span>
          {nameGloss ? <span className="text-gray-500"> ({nameGloss})</span> : null}
        </div>

        {/* Tip / note (enlarged for readability) */}
        {tip && (
          <p className="text-base font-sm leading-relaxed text-gray-600 text-left">
            {tip}
          </p>
        )}
      </div>

      {/* Footer anchored at bottom */}
      <footer className="mt-auto pt-3 flex items-center justify-between gap-2">
        {/* Audio element: hide native menu & download, keep standard controls */}
        <audio
          ref={audioEl}
          controls
          src={src}
          preload="metadata"
          className="w-full max-w-[280px] mx-auto flex-1"
          // Hide browser download + native playback-rate entry (we show our own speed control)
          controlsList="nodownload noplaybackrate"
        />
        {/* Custom speed button (placed where the menu normally appears, on the right) */}
        <SpeedControl audioRef={audioEl} disabled={!src} />
      </footer>

      {/* Editor Modal */}
      <LetterEditorModal
        open={open}
        onClose={() => setOpen(false)}
        letter={letterForEditor}
      />
    </Card>
  );
}
