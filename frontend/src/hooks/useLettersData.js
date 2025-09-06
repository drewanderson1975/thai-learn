import { useEffect, useMemo, useState } from "react";
import baseline from "../data/alphabet/letters.json"; // baseline generated JSON
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

/**
 * Merge helper: shallow-merge letter objects, but also merge nested fields
 * we care about (tip, review, audio) so overrides win.
 */
function mergeLetter(b, o) {
  if (!o) return b;
  return {
    ...b,
    ...o,
    // nested merges where override should win but keep structure
    tip: o.tip ?? b.tip,
    review: { ...(b.review || {}), ...(o.review || {}) },
    audio: { ...(b.audio || {}), ...(o.audio || {}) },
  };
}

/**
 * useLettersData({ consonantClass })
 * - Loads baseline letters.json
 * - Subscribes to Firestore `letters` and overlays any matching IDs
 * - Optional filter by consonantClass: "High" | "Mid" | "Low"
 */
export default function useLettersData({ consonantClass } = {}) {
  const [overrides, setOverrides] = useState(null); // Map<string, docData>
  const [error, setError] = useState(null);

  // Subscribe to Firestore letters collection (live)
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, "letters"), (snap) => {
        const map = new Map();
        snap.forEach((doc) => {
          const data = doc.data();
          // normalize id (prefer doc.id if missing)
          const id = (data?.id || doc.id || "").toString();
          if (id) map.set(id, data);
        });
        setOverrides(map);
      }, (err) => setError(err));
      return () => unsub();
    } catch (e) {
      setError(e);
      return () => {};
    }
  }, []);

  // Merge baseline + overrides
  const letters = useMemo(() => {
    const list = (baseline || []).map((b) => {
      const id = (b.id || "").toString();
      const o = overrides?.get(id);
      return mergeLetter(b, o);
    });

    // Optional filter by class
    return consonantClass
      ? list.filter((l) => l.consonantClass === consonantClass)
      : list;
  }, [overrides, consonantClass]);

  const loading = overrides === null; // until first snapshot arrives

  return { letters, loading, error };
}
