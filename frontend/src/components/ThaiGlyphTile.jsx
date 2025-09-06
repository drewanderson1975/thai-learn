import InfoPopover from "./InfoPopover";
import { useState, useMemo } from "react";
import LetterEditorModal from "./LetterEditorModal";
import { useIsAdmin } from "./AdminGate"; // adjust path if needed

const classBadge = (consonantClass) =>
  consonantClass === "High"
    ? "bg-rose-100 text-rose-700"
    : consonantClass === "Mid"
    ? "bg-blue-100 text-blue-700"
    : "bg-emerald-100 text-emerald-700"; // Low

// Map status -> pill styles
const statusStyles = {
  Outstanding: "bg-amber-100 text-amber-700",
  "In progress": "bg-blue-100 text-blue-700",
  Complete: "bg-emerald-100 text-emerald-700",
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

  return (
    <div
      className="
        relative rounded-2xl border border-gray-200 p-4
        grid grid-rows-[auto,1fr,auto] gap-3 h-full bg-white
      "
    >
      {/* Header row: left (badges) / right (Edit + Info) */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${classBadge(
              consonantClass
            )}`}
          >
            {consonantClass} class
          </span>

            {/* Admin-only overall status pill */}
          {isAdmin && (
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                statusStyles[overallStatus] || "bg-gray-100 text-gray-700"
              }`}
              title="Overall review status"
            >
              {overallStatus}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => setOpen(true)}
              className="
                rounded-md px-2 py-1 text-xs bg-primary/10 text-primary
                hover:bg-primary/20 focus-visible:outline focus-visible:outline-2
                focus-visible:outline-primary/50 focus-visible:ring-0
                transition-colors
              "
              aria-label="Edit letter"
            >
              Edit
            </button>
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
      <div className="flex flex-col items-stretch gap-3">
        {/* Big glyph */}
        <div className="thai-glyph text-primary text-center">{glyph}</div>

        {/* Centered name line */}
        <div className="text-sm text-gray-700 text-center">
          <span className="font-thai">{nameThai}</span>
          <span className="mx-1">•</span>
          <span>{nameRtgs}</span>
          {nameGloss ? <span className="text-gray-500"> ({nameGloss})</span> : null}
        </div>

        {/* Tip / note (enlarged for readability) */}
        {tip && (
          <p className="text-base font-sm leading-relaxed text-gray-800 text-left">
            {tip}
          </p>
        )}
      </div>

      {/* Footer anchored at bottom */}
      <footer lassName="mt-auto pt-3 flex items-center justify-between">
        <audio controls src={src} className="w-full max-w-[280px] mx-auto" />
      </footer>

      {/* Editor Modal */}
      <LetterEditorModal
        open={open}
        onClose={() => setOpen(false)}
        letter={letterForEditor}
      />
    </div>
  );
}
