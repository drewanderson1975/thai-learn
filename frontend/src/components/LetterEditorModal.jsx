import { useEffect, useMemo, useRef, useState } from "react";
import { db, storage } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/** ---------------- Tab button ---------------- **/
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

/** ---------------- Utilities ---------------- **/
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

/** WAV encoder for an AudioBuffer (44.1kHz+). */
function audioBufferToWav(buffer) {
  const numOfChan = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const length = buffer.length * numOfChan * 2 + 44;
  const bufferArray = new ArrayBuffer(length);
  const view = new DataView(bufferArray);

  let offset = 0;

  function writeString(s) {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
    offset += s.length;
  }

  function floatTo16BitPCM(output, offsetPCM, input) {
    for (let i = 0; i < input.length; i++, offsetPCM += 2) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(offsetPCM, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
  }

  writeString("RIFF");
  view.setUint32(offset, length - 8, true); offset += 4;
  writeString("WAVE");
  writeString("fmt ");
  view.setUint32(offset, 16, true); offset += 4;
  view.setUint16(offset, 1, true); offset += 2; // PCM
  view.setUint16(offset, numOfChan, true); offset += 2;
  view.setUint32(offset, sampleRate, true); offset += 4;
  view.setUint32(offset, sampleRate * numOfChan * 2, true); offset += 4;
  view.setUint16(offset, numOfChan * 2, true); offset += 2;
  view.setUint16(offset, 16, true); offset += 2;
  writeString("data");
  view.setUint32(offset, length - 44, true); offset += 4;

  const channels = [];
  for (let i = 0; i < numOfChan; i++) channels.push(buffer.getChannelData(i));

  let interleaved;
  if (numOfChan === 2) {
    const L = channels[0], R = channels[1];
    interleaved = new Float32Array(L.length + R.length);
    let idx = 0, inputIdx = 0;
    while (idx < interleaved.length) {
      interleaved[idx++] = L[inputIdx];
      interleaved[idx++] = R[inputIdx];
      inputIdx++;
    }
  } else {
    interleaved = channels[0];
  }

  floatTo16BitPCM(view, offset, interleaved);
  return bufferArray;
}

/** ---------------- Playback speed control ---------------- **/
function SpeedControl({ audioRef, disabled }) {
  const [open, setOpen] = useState(false);
  const [rate, setRate] = useState(1);
  const rates = [0.75, 1, 1.25, 1.5, 2];

  useEffect(() => {
    if (audioRef?.current) audioRef.current.playbackRate = rate;
  }, [rate, audioRef]);

  useEffect(() => {
    if (audioRef?.current) audioRef.current.playbackRate = rate;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioRef?.current?.src]);

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={
          "rounded-md px-3 py-1 text-sm cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/50 " +
          (disabled ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400" : "bg-gray-100 hover:bg-gray-200")
        }
        title="Playback speed"
      >
        {rate}×
      </button>

      {open && !disabled && (
        <ul role="listbox" className="absolute right-0 mt-1 w-28 rounded-md border bg-white shadow-lg z-10 py-1">
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

/** ---------------- Main component ---------------- **/
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

  // for reset if user clips then wants to revert (this session only)
  const originalUrlRef = useRef(null);
  useEffect(() => {
    if (open) {
      originalUrlRef.current = letter?.audio?.glyph || "";
    }
  }, [open, letter?.audio?.glyph]);

  // MediaRecorder
  const [recorderSupported, setRecorderSupported] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);

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
        setAudioFile(blob);
        setAudioStatus("Being reviewed");
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
    setAudioFile(file);
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

  /** ------------ Audio clipping state & logic ------------ **/
  const [duration, setDuration] = useState(0);
  const [clipStart, setClipStart] = useState(0);
  const [clipEnd, setClipEnd] = useState(0);
  const [clipping, setClipping] = useState(false);

  useEffect(() => {
    const el = audioEl.current;
    if (!el) return;
    const onLoaded = () => {
      const d = Number.isFinite(el.duration) ? el.duration : 0;
      setDuration(d || 0);
      setClipStart(0);
      setClipEnd(d || 0);
    };
    el.addEventListener("loadedmetadata", onLoaded);
    return () => el.removeEventListener("loadedmetadata", onLoaded);
  }, [audioUrl]);

  function setStartToCurrent() {
    if (!audioEl.current) return;
    const t = Math.max(0, Math.min(audioEl.current.currentTime, clipEnd));
    setClipStart(t);
  }

  function setEndToCurrent() {
    if (!audioEl.current) return;
    const t = Math.min(duration, Math.max(audioEl.current.currentTime, clipStart));
    setClipEnd(t);
  }

  async function applyClip() {
    if (!audioUrl || clipEnd <= clipStart) {
      alert("Invalid clip range.");
      return;
    }
    try {
      setClipping(true);
      // Fetch the current audio (works for https: and blob:)
      const res = await fetch(audioUrl);
      const arr = await res.arrayBuffer();

      const ctx = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(
        1,  // we'll render mono to keep file small; original channel count is preserved only for 2+ if desired
        44100 * (clipEnd - clipStart),
        44100
      );
      const decodeCtx = new (window.AudioContext || window.webkitAudioContext)();
      const decoded = await decodeCtx.decodeAudioData(arr);
      const sampleRate = decoded.sampleRate;

      const startFrame = Math.floor(clipStart * sampleRate);
      const endFrame = Math.floor(clipEnd * sampleRate);
      const frames = Math.max(0, endFrame - startFrame);

      const out = ctx.createBuffer(decoded.numberOfChannels, frames, sampleRate);
      for (let ch = 0; ch < decoded.numberOfChannels; ch++) {
        const chan = decoded.getChannelData(ch);
        out.getChannelData(ch).set(chan.subarray(startFrame, endFrame));
      }

      // Render not strictly necessary since we already copied samples, but ensures consistency
      // with OfflineAudioContext pipeline if we later add processing.
      // For simplicity, skip offline rendering graph & just encode the buffer.
      const wavBuffer = audioBufferToWav(out);
      const wavBlob = new Blob([wavBuffer], { type: "audio/wav" });
      const url = URL.createObjectURL(wavBlob);
      setAudioUrl(url);
      setAudioFile(wavBlob);
      setAudioStatus("Being reviewed");
    } catch (e) {
      console.error("Clip failed:", e);
      alert("Clipping failed. Try a smaller range or different source.");
    } finally {
      setClipping(false);
    }
  }

  function revertToOriginal() {
    const url = originalUrlRef.current || "";
    setAudioUrl(url);
    setAudioFile(null);
    setAudioStatus("Outstanding");
  }

  /** ------------ Google TTS preview UI & logic ------------ **/
  const [voices, setVoices] = useState([]);
  const [voicesLoading, setVoicesLoading] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("");
  const [speakingRate, setSpeakingRate] = useState(1.0); // 0.25–4.0 (GCP range)
  const [pitch, setPitch] = useState(0);                 // -20.0–20.0 semitones
  const [ttsBusy, setTtsBusy] = useState(false);

  async function loadVoices() {
    setVoicesLoading(true);
    setVoiceError("");
    try {
      const r = await fetch("/api/tts/voices");
      if (!r.ok) throw new Error(`Voices error ${r.status}`);
      const data = await r.json();
      setVoices(Array.isArray(data.voices) ? data.voices : []);
      if (Array.isArray(data.voices) && data.voices.length) {
        setSelectedVoice(data.voices[0].name || "");
      }
    } catch (e) {
      console.error(e);
      setVoiceError("Could not load voices. Server endpoint not configured?");
    } finally {
      setVoicesLoading(false);
    }
  }

  useEffect(() => {
    if (open && tab === "audio") loadVoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tab]);

  async function previewTts() {
    if (!selectedVoice) {
      alert("Pick a voice first.");
      return;
    }
    try {
      setTtsBusy(true);
      setVoiceError("");
      const text = letter?.ttsText || letter?.glyph || ""; // prefer a dedicated ttsText if you have one
      const r = await fetch("/api/tts/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voiceName: selectedVoice,
          speakingRate: Number(speakingRate),
          pitch: Number(pitch),
        }),
      });
      if (!r.ok) throw new Error(`TTS error ${r.status}`);
      const blob = await r.blob(); // e.g., audio/mp3 or audio/wav
      const url = URL.createObjectURL(blob);
      // Set URL for preview, but *do not* mark as final until user clicks "Use this audio"
      setAudioUrl(url);
      // Stash blob so Save uploads it if they choose "Use this audio"
      setAudioFile(blob);
      setAudioStatus("Being reviewed");
    } catch (e) {
      console.error(e);
      setVoiceError("Could not synthesize audio. Check server logs/config.");
    } finally {
      setTtsBusy(false);
    }
  }

  /** ------------ Save ------------ **/
  async function onSave() {
    const id = String(letter?.id || "").trim();
    if (!id) {
      alert("Missing letter id on this tile. (Parent must pass `id`.)");
      return;
    }

    setSaving(true);
    try {
      // Upload audio if new
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

        await withTimeout(uploadBytes(storageRef, file, { contentType: type }), 15000, "uploadBytes");
        publicAudioUrl = await withTimeout(getDownloadURL(storageRef), 10000, "getDownloadURL");
      }

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
          source: audioFile ? "human_or_tts" : (letter?.audio?.source || "tts"),
          updatedAt: new Date().toISOString(),
        },
        review: {
          noteStatus,
          audioStatus,
          letterStatus,
          updatedAt: new Date().toISOString(),
        },
      };

      await withTimeout(setDoc(doc(db, "letters", id), payload, { merge: true }), 12000, "setDoc");
      setSaving(false);
      onClose?.();
      setAudioFile(null);
    } catch (e) {
      console.error("Save failed:", e);
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
            <div className="space-y-5">
              {/* Record / upload + status */}
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

              {/* Preview + Custom controls */}
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm text-gray-700 truncate">
                    {audioUrl ? audioUrl : "No audio selected"}
                  </div>
                  <div className="flex items-center gap-2">
                    <SpeedControl audioRef={audioEl} disabled={!audioUrl} />
                    <button
                      type="button"
                      onClick={playPause}
                      className="rounded-md px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/50"
                      disabled={!audioUrl}
                    >
                      Play/Pause
                    </button>
                  </div>
                </div>

                <audio
                  ref={audioEl}
                  src={audioUrl || undefined}
                  className="w-full mt-2"
                  controls
                  preload="metadata"
                  controlsList="nodownload noplaybackrate"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Tip: We show a custom playback speed so it’s always available (recorded blobs or Firebase URLs).
                </p>
              </div>

              {/* --- New: Clip tool --- */}
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-700">Clip audio</div>
                  <div className="text-xs text-gray-500">
                    {duration ? `${clipStart.toFixed(2)}s – ${clipEnd.toFixed(2)}s / ${duration.toFixed(2)}s` : "—"}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Start</label>
                    <input
                      type="range"
                      min={0}
                      max={duration || 0}
                      step="0.01"
                      value={clipStart}
                      onChange={(e) => setClipStart(Math.min(parseFloat(e.target.value), clipEnd))}
                      className="w-full"
                      disabled={!audioUrl || !duration}
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="number"
                        min={0}
                        max={duration || 0}
                        step="0.01"
                        value={clipStart}
                        onChange={(e) => setClipStart(Math.min(parseFloat(e.target.value || 0), clipEnd))}
                        className="w-28 rounded-md border px-2 py-1 text-sm"
                        disabled={!audioUrl || !duration}
                      />
                      <button
                        type="button"
                        onClick={setStartToCurrent}
                        className="rounded-md px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200"
                        disabled={!audioUrl || !duration}
                        title="Set start to current playhead"
                      >
                        Set to current
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">End</label>
                    <input
                      type="range"
                      min={0}
                      max={duration || 0}
                      step="0.01"
                      value={clipEnd}
                      onChange={(e) => setClipEnd(Math.max(parseFloat(e.target.value), clipStart))}
                      className="w-full"
                      disabled={!audioUrl || !duration}
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="number"
                        min={0}
                        max={duration || 0}
                        step="0.01"
                        value={clipEnd}
                        onChange={(e) => setClipEnd(Math.max(parseFloat(e.target.value || 0), clipStart))}
                        className="w-28 rounded-md border px-2 py-1 text-sm"
                        disabled={!audioUrl || !duration}
                      />
                      <button
                        type="button"
                        onClick={setEndToCurrent}
                        className="rounded-md px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200"
                        disabled={!audioUrl || !duration}
                        title="Set end to current playhead"
                      >
                        Set to current
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={applyClip}
                    className="rounded-md px-3 py-1.5 text-sm bg-primary text-white hover:bg-primary/90 disabled:opacity-60"
                    disabled={!audioUrl || !duration || clipping}
                    title="Replace the current audio with the clipped segment"
                  >
                    {clipping ? "Clipping…" : "Apply clip"}
                  </button>
                  <button
                    type="button"
                    onClick={revertToOriginal}
                    className="rounded-md px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-60"
                    disabled={!originalUrlRef.current}
                    title="Revert to originally loaded audio for this session"
                  >
                    Revert to original
                  </button>
                </div>
              </div>

              {/* --- New: TTS voice try-outs --- */}
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-700">Try other voices (Google TTS)</div>
                  {voicesLoading && <div className="text-xs text-gray-500">Loading voices…</div>}
                </div>

                {voiceError && (
                  <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-2 py-1">
                    {voiceError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Voice</label>
                    <select
                      className="w-full rounded-md border px-2 py-1.5 text-sm"
                      value={selectedVoice}
                      onChange={(e) => setSelectedVoice(e.target.value)}
                    >
                      {voices.map((v) => (
                        <option key={v.name} value={v.name}>
                          {v.name} {v.ssmlGender ? `(${v.ssmlGender})` : ""} {v.languageCodes?.[0] ? `— ${v.languageCodes[0]}` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Rate</label>
                    <input
                      type="number"
                      step="0.05"
                      min="0.25"
                      max="4"
                      value={speakingRate}
                      onChange={(e) => setSpeakingRate(parseFloat(e.target.value || "1"))}
                      className="w-full rounded-md border px-2 py-1.5 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Pitch</label>
                    <input
                      type="number"
                      step="0.5"
                      min="-20"
                      max="20"
                      value={pitch}
                      onChange={(e) => setPitch(parseFloat(e.target.value || "0"))}
                      className="w-full rounded-md border px-2 py-1.5 text-sm"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={previewTts}
                      className="rounded-md px-3 py-1.5 text-sm bg-primary text-white hover:bg-primary/90 disabled:opacity-60"
                      disabled={!selectedVoice || ttsBusy}
                    >
                      {ttsBusy ? "Generating…" : "Preview with selected voice"}
                    </button>
                    <span className="text-xs text-gray-500">
                      Text used: <code className="bg-gray-50 px-1 py-0.5 rounded">{letter?.ttsText || letter?.glyph || "—"}</code>
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  The preview replaces the current audio in the player above. Click <strong>Save</strong> to upload.
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
            {saving ? "Saving…" : " "}
          </div>
        </div>
      </div>
    </div>
  );
}
