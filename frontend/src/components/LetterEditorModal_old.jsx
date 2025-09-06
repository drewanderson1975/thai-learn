import { useEffect, useMemo, useRef, useState } from "react";
import { db, storage } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


// tiny tab btn
function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={
        "px-3 py-2 text-sm rounded-md " +
        (active ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100")
      }
      type="button"
    >
      {children}
    </button>
  );
}

// derive overall status from sub-statuses (UI-side)
function deriveOverall(noteStatus, audioStatus) {
  if (noteStatus === "Done" && audioStatus === "Done") return "Complete";
  if (noteStatus === "Being reviewed" || audioStatus === "Being reviewed") return "In progress";
  return "Outstanding";
}

export default function LetterEditorModal({ open, onClose, letter }) {
  // lock background scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [open]);

  const [tab, setTab] = useState("note"); // "note" | "audio" | "status"

  // Local working copy (so you can cancel)
  const [note, setNote] = useState(letter?.tip || "");
  const [noteStatus, setNoteStatus] = useState(letter?.review?.noteStatus || "Outstanding");

  // Audio panel state
  const [audioUrl, setAudioUrl] = useState(letter?.audio?.glyph || "");
  const [audioStatus, setAudioStatus] = useState(letter?.review?.audioStatus || "Outstanding");
  const audioEl = useRef(null);

  // Simple Record (MediaRecorder) — optional for now
  const [recorderSupported, setRecorderSupported] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);

  // Keep a real File/Blob for upload
  const [audioFile, setAudioFile] = useState(null); // File or Blob or null


  useEffect(() => {
    setRecorderSupported(!!(navigator.mediaDevices && window.MediaRecorder));
  }, []);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url); // local preview URL (not persisted yet)
        setAudioFile(blob);               // <-- keep blob for upload
        setAudioStatus("Being reviewed");
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setIsRecording(true);
    } catch (e) {
      console.error("Mic error:", e);
      alert("Could not access microphone.");
    }
  }

  function stopRecording() {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== "inactive") {
      mr.stop();
      mr.stream.getTracks().forEach((t) => t.stop());
    }
    setIsRecording(false);
  }

  // Upload flow (choose file)
 function onPickFile(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  setAudioUrl(url);
  setAudioFile(file);               // <-- keep file for upload
  setAudioStatus("Being reviewed");
}


  // (Next step we’ll add trimming; for now, preview only)
  function playPause() {
    const el = audioEl.current;
    if (!el) return;
    if (el.paused) el.play();
    else el.pause();
  }

  async function blobUrlToFile(url, filename = "clip.webm") {
    if (!url || !url.startsWith("blob:")) return null;
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || "audio/webm" });
  }


  // Overall status (read-only pill here; auto-derived live)
  const overall = useMemo(
    () => letter?.review?.letterStatus || deriveOverall(noteStatus, audioStatus),
    [letter?.review?.letterStatus, noteStatus, audioStatus]
  );

  
  async function onSave() {
    try {
      const id = String(letter?.id || "").trim();
      if (!id) {
        alert("Missing letter id.");
        return;
      }

      // 1) Upload audio only if we have a newly recorded/uploaded file
      let publicAudioUrl = letter?.audio?.glyph || ""; // keep existing if none uploaded

      if (audioFile) {
        // Pick extension from file type; default to webm/mp3
        const ext =
          (audioFile.type && audioFile.type.includes("webm")) ? "webm" :
          (audioFile.type && audioFile.type.includes("wav"))  ? "wav"  :
          (audioFile.type && audioFile.type.includes("mpeg")) ? "mp3"  :
          "webm";

        const safeId = id.replace(/[^a-z0-9_-]/gi, "_");
        const path = `letters/${safeId}.${ext}`;
        const storageRef = ref(storage, path);

        await uploadBytes(storageRef, audioFile, { contentType: audioFile.type || undefined });
        publicAudioUrl = await getDownloadURL(storageRef);
      }

      // 2) Build Firestore payload (note + statuses + audio metadata)
      const letterStatus =
        (noteStatus === "Done" && audioStatus === "Done")
          ? "Complete"
          : (noteStatus === "Being reviewed" || audioStatus === "Being reviewed")
          ? "In progress"
          : "Outstanding";

      const payload = {
        id,
        tip: note,
        audio: {
          ...(letter?.audio || {}),
          glyph: publicAudioUrl || letter?.audio?.glyph || "",
          source: audioFile ? "human" : (letter?.audio?.source || "tts"),
          updatedAt: new Date().toISOString(),
        },
        review: {
          noteStatus,
          audioStatus,
          letterStatus,
          updatedAt: new Date().toISOString(),
        },
      };

      // 3) Save/merge into Firestore: letters/{id}
      await setDoc(doc(db, "letters", id), payload, { merge: true });

      console.log("✅ Saved to Firestore:", payload);
      onClose();
    } catch (e) {
      console.error(e);
      alert(`Save failed: ${e?.message || e}`);
    }
  }


  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

      {/* panel */}
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-primary">
              Edit Letter — <span className="font-thai text-2xl">{letter?.glyph}</span>
            </h3>
            <p className="text-xs text-gray-500">id: {letter?.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={
                "text-xs font-semibold px-2 py-0.5 rounded-full " +
                (overall === "Complete"
                  ? "bg-emerald-100 text-emerald-700"
                  : overall === "In progress"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-amber-100 text-amber-700")
              }
              title="Overall status (auto)"
            >
              {overall}
            </span>
            <button onClick={onClose} className="rounded-md px-3 py-1 text-sm text-gray-600 hover:bg-gray-100">
              Close
            </button>
          </div>
        </div>

        {/* tabs */}
        <div className="px-5 pt-4">
          <div className="flex gap-2">
            <TabBtn active={tab === "note"} onClick={() => setTab("note")}>Note</TabBtn>
            <TabBtn active={tab === "audio"} onClick={() => setTab("audio")}>Audio</TabBtn>
            <TabBtn active={tab === "status"} onClick={() => setTab("status")}>Status</TabBtn>
          </div>
        </div>

        {/* body */}
        <div className="p-5">
          {tab === "note" && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Short Note (shown on tile)</label>
              <textarea
                className="w-full rounded-md border p-2 text-sm"
                rows={5}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="E.g., Unaspirated /t/; final becomes unreleased /t/."
              />
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-700">Note status</label>
                <select
                  className="rounded-md border px-2 py-1 text-sm"
                  value={noteStatus}
                  onChange={(e) => setNoteStatus(e.target.value)}
                >
                  <option>Outstanding</option>
                  <option>Being reviewed</option>
                  <option>Done</option>
                </select>
              </div>
            </div>
          )}

          {tab === "audio" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={
                      "rounded-md px-3 py-2 text-sm " +
                      (isRecording ? "bg-rose-600 text-white" : "bg-primary/10 text-primary hover:bg-primary/20")
                    }
                    title={isRecording ? "Stop recording" : "Record from mic"}
                  >
                    {isRecording ? "Stop" : "Record"}
                  </button>

                  <label className="rounded-md px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 cursor-pointer">
                    Upload
                    <input type="file" accept="audio/*" onChange={onPickFile} className="hidden" />
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">Audio status</label>
                  <select
                    className="rounded-md border px-2 py-1 text-sm"
                    value={audioStatus}
                    onChange={(e) => setAudioStatus(e.target.value)}
                  >
                    <option>Outstanding</option>
                    <option>Being reviewed</option>
                    <option>Done</option>
                  </select>
                </div>
              </div>

              {/* Preview */}
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700 truncate">
                    {audioUrl ? audioUrl : "No audio selected"}
                  </div>
                  <button
                    onClick={playPause}
                    className="rounded-md px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200"
                    disabled={!audioUrl}
                  >
                    Play/Pause
                  </button>
                </div>
                <audio ref={audioEl} src={audioUrl || undefined} className="w-full mt-2" controls />
                <p className="mt-2 text-xs text-gray-500">
                  (Next step: add waveform + trimming. For now, you can preview the selected recording/upload.)
                </p>
              </div>
            </div>
          )}

          {tab === "status" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Note status</div>
                  <select
                    className="w-full rounded-md border px-2 py-1 text-sm"
                    value={noteStatus}
                    onChange={(e) => setNoteStatus(e.target.value)}
                  >
                    <option>Outstanding</option>
                    <option>Being reviewed</option>
                    <option>Done</option>
                  </select>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Audio status</div>
                  <select
                    className="w-full rounded-md border px-2 py-1 text-sm"
                    value={audioStatus}
                    onChange={(e) => setAudioStatus(e.target.value)}
                  >
                    <option>Outstanding</option>
                    <option>Being reviewed</option>
                    <option>Done</option>
                  </select>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="text-sm font-medium text-gray-700 mb-1">Overall (auto)</div>
                <div
                  className={
                    "inline-block text-xs font-semibold px-2 py-0.5 rounded-full " +
                    (overall === "Complete"
                      ? "bg-emerald-100 text-emerald-700"
                      : overall === "In progress"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-amber-100 text-amber-700")
                  }
                >
                  {overall}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Overall becomes <strong>In progress</strong> if any sub-status is “Being reviewed”, and
                  <strong> Complete</strong> when both sub-statuses are “Done”.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t">
          <div className="text-xs text-gray-500">
            Changes aren’t persisted yet. Next step we’ll save to Firebase.
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Cancel
            </button>
            <button
              onClick={onSave}
              className="rounded-md px-4 py-2 text-sm bg-primary text-white hover:bg-primary/90"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
