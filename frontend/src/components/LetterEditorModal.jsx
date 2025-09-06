import { useEffect, useMemo, useRef, useState } from "react";
import { db, storage } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// --- Tiny tab button helper ---
function TabBtn({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="tab"
      aria-selected={active}
      className={
        "px-3 py-2 text-sm rounded-md cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/50 " +
        (active ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100")
      }
    >
      {children}
    </button>
  );
}

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms: ${label}`)), ms)
    ),
  ]);
}

function deriveOverall(noteStatus, audioStatus) {
  if (noteStatus === "Done" && audioStatus === "Done") return "Complete";
  if (noteStatus === "Being reviewed" || audioStatus === "Being reviewed") return "In progress";
  return "Outstanding";
}

export default function LetterEditorModal({ open, onClose, letter }) {
  // Lock background scroll when modal is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [open]);

  const [tab, setTab] = useState("note"); // note | audio | status
  const [saving, setSaving] = useState(false);

  // NOTE
  const [note, setNote] = useState(letter?.tip || "");
  const [noteStatus, setNoteStatus] = useState(letter?.review?.noteStatus || "Outstanding");

  // AUDIO
  const [audioUrl, setAudioUrl] = useState(letter?.audio?.glyph || ""); // preview URL (https: or blob:)
  const [audioFile, setAudioFile] = useState(null);                     // File | Blob for upload
  const [audioStatus, setAudioStatus] = useState(letter?.review?.audioStatus || "Outstanding");
  const audioEl = useRef(null);

  // MediaRecorder
  const [recorderSupported, setRecorderSupported] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);

  const [uploadPct, setUploadPct] = useState(0);

  useEffect(() => {
    setRecorderSupported(!!(navigator.mediaDevices && window.MediaRecorder));
  }, []);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      chunksRef.current = [];
      mr.ondataavailable = (e) => e.data && e.data.size && chunksRef.current.push(e.data);
      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm;codecs=opus" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setAudioFile(blob);   // keep the blob for upload
        setAudioStatus("Being reviewed");
        // stop mic tracks
        if (mr.stream) mr.stream.getTracks().forEach((t) => t.stop());
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
    if (mr && mr.state !== "inactive") mr.stop();
    setIsRecording(false);
  }

  function onPickFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setAudioFile(file);   // keep the File for upload
    setAudioStatus("Being reviewed");
  }

  function playPause() {
    const el = audioEl.current;
    if (!el) return;
    if (el.paused) el.play();
    else el.pause();
  }

  const overall = useMemo(() => {
    return letter?.review?.letterStatus || deriveOverall(noteStatus, audioStatus);
  }, [letter?.review?.letterStatus, noteStatus, audioStatus]);

  function guessExtFromType(t) {
    if (!t) return "webm";
    if (t.includes("webm")) return "webm";
    if (t.includes("wav")) return "wav";
    if (t.includes("mpeg") || t.includes("mp3")) return "mp3";
    if (t.includes("ogg")) return "ogg";
    return "webm";
  }

  async function onSave() {
    const id = String(letter?.id || "").trim();
    if (!id) {
      alert("Missing letter id on this tile. (Parent must pass `id`.)");
      return;
    }

    setSaving(true);
    const started = performance.now();
    console.log("[LetterEditor] Saving …", { id, note, noteStatus, audioStatus, hasFile: !!audioFile, audioUrl });

    try {
      // 1) Upload audio if we have a newly recorded/uploaded file
      let publicAudioUrl = letter?.audio?.glyph || "";

      if (audioFile) {
        const type = audioFile.type || "audio/webm";
        const ext =
          type.includes("webm") ? "webm" :
          type.includes("wav")  ? "wav"  :
          (type.includes("mpeg") || type.includes("mp3")) ? "mp3" :
          type.includes("ogg")  ? "ogg"  : "webm";

        const safeId = id.replace(/[^a-z0-9_-]/gi, "_");
        const filename = `${safeId}.${ext}`;
        const file = audioFile instanceof File
          ? audioFile
          : new File([audioFile], filename, { type });

        const path = `letters/${filename}`;
        const storageRef = ref(storage, path);

        console.log("[LetterEditor] Uploading (simple)…", { path, type, size: file.size });

        if (!file.size) {
          throw new Error("Recorded/uploaded audio file is empty (size=0). Did you stop recording?");
        }

        await withTimeout(uploadBytes(storageRef, file, { contentType: type }), 15000, "uploadBytes");
        publicAudioUrl = await withTimeout(getDownloadURL(storageRef), 10000, "getDownloadURL");
        console.log("[LetterEditor] Storage URL:", publicAudioUrl);
      }

      // 2) Build Firestore payload
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

      console.log("[LetterEditor] Writing Firestore …", { id, payload });
      await withTimeout(setDoc(doc(db, "letters", id), payload, { merge: true }), 12000, "setDoc");
      console.log("✅ Saved to Firestore in", Math.round(performance.now() - started), "ms");

      setSaving(false);
      onClose?.();
      setAudioFile(null);
    } catch (e) {
      console.error("❌ Save failed:", e);
      setSaving(false);
      alert(`Save failed: ${e.code || ""} ${e.message || e}`);
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
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/50"
            >
              Close
            </button>
          </div>
        </div>

        {/* tabs */}
        <div className="px-5 pt-4">
          <div className="flex gap-2" role="tablist" aria-label="Letter editor tabs">
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
                  className="rounded-md border px-2 py-1 text-sm cursor-pointer"
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
                      "rounded-md px-3 py-2 text-sm cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/50 " +
                      (isRecording ? "bg-rose-600 text-white" : "bg-primary/10 text-primary hover:bg-primary/20")
                    }
                    title={isRecording ? "Stop recording" : "Record from mic"}
                    disabled={!recorderSupported && !isRecording}
                  >
                    {isRecording ? "Stop" : "Record"}
                  </button>

                  <label className="rounded-md px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 cursor-pointer focus-within:outline focus-within:outline-2 focus-within:outline-primary/50">
                    Upload
                    <input type="file" accept="audio/*" onChange={onPickFile} className="hidden" />
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">Audio status</label>
                  <select
                    className="rounded-md border px-2 py-1 text-sm cursor-pointer"
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
                    type="button"
                    onClick={playPause}
                    className="rounded-md px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/50"
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
                    className="w-full rounded-md border px-2 py-1 text-sm cursor-pointer"
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
                    className="w-full rounded-md border px-2 py-1 text-sm cursor-pointer"
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
          <div className="text-xs text-gray-500">{saving ? "Saving…" : " "}</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className={`rounded-md px-4 py-2 text-sm bg-primary text-white hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/50 ${
                saving ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
          <div className="text-xs text-gray-500">
            {saving ? (uploadPct ? `Uploading… ${uploadPct}%` : "Saving…") : " "}
          </div>
        </div>
      </div>
    </div>
  );
}
