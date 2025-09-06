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
    <div className="relative rounded-2xl border border-gray-200 p-4 flex flex-col gap-3 h-full bg-white">
      {/* Admin-only Edit button (top-right) */}
      {isAdmin && (
        <button
          onClick={() => setOpen(true)}
          className="absolute right-2 top-2 z-10 rounded-md px-2 py-1 text-xs bg-primary/10 text-primary hover:bg-primary/20"
          title="Edit letter"
        >
          Edit
        </button>
      )}

      {/* Header row: class badge (left) + info (right) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${classBadge(consonantClass)}`}> 
            {consonantClass} class
          </span>

          {/* Admin-only overall status pill */}
          {isAdmin && (
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyles[overallStatus] || "bg-gray-100 text-gray-700"}`}
              title="Overall review status"
            >
              {overallStatus}
            </span>
          )}
        </div>

        <InfoPopover>
          <div className="space-y-1 text-gray-700">
            <div><strong>RTGS:</strong> {rtgs}</div>
            <div><strong>IPA:</strong> {ipa}{ipaNote ? ` (${ipaNote})` : ""}</div>
            <div><strong>Initial:</strong> {initial}</div>
            <div><strong>Final:</strong> {final}</div>
          </div>
        </InfoPopover>
      </div>

      {/* Big glyph */}
      <div className="thai-glyph text-primary text-center">{glyph}</div>

      {/* Centered name line */}
      <div className="text-sm text-gray-700 text-center">
        <span className="font-thai">{nameThai}</span>
        <span className="mx-1">•</span>
        <span>{nameRtgs}</span>
        {nameGloss ? <span className="text-gray-500"> ({nameGloss})</span> : null}
      </div>

      {/* Tip */}
      {tip && <p className="text-sm text-gray-700 text-left">{tip}</p>}

      {/* Footer */}
      <footer className="mt-auto pt-3 border-t border-gray-200 flex flex-col items-center gap-2">
        <audio controls src={src} className="w-full max-w-[280px]" />
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