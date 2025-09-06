import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export function useIsAdmin() {
  const [state, setState] = useState({ loading: true, isAdmin: false, user: null, error: null });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) return setState({ loading: false, isAdmin: false, user: null, error: null });
        const snap = await getDoc(doc(db, "admins", user.uid));
        setState({ loading: false, isAdmin: snap.exists(), user, error: null });
      } catch (e) {
        setState({ loading: false, isAdmin: false, user: null, error: e?.message || String(e) });
      }
    });
    return () => unsub();
  }, []);

  return state;
}

export function AdminAuthPanel() {
  const { loading, isAdmin, user, error } = useIsAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  if (loading) return <div className="text-xs text-gray-500">Checking admin…</div>;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // onAuthStateChanged will refresh the UI
    } catch (e) {
      setSubmitError(e?.message || "Sign-in failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (!user || !isAdmin) {
    return (
      <form
        className="flex items-center gap-2 pointer-events-auto"
        onSubmit={handleSubmit}
        role="form"
      >
        <input
          className="border rounded px-2 py-1 text-sm"
          placeholder="Admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <input
          className="border rounded px-2 py-1 text-sm"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className={`px-3 py-1 rounded text-sm bg-primary text-white hover:bg-primary/90 cursor-pointer ${submitting ? "opacity-60" : ""}`}
          disabled={submitting}
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
        {(submitError || error) && (
          <span className="text-xs text-rose-600 ml-2 max-w-[16rem] truncate" title={submitError || error}>
            {submitError || error}
          </span>
        )}
      </form>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-600">Signed in as {user.email}</span>
      <button
        type="button"
        onClick={() => signOut(auth)}
        className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer"
      >
        Sign out
      </button>
    </div>
  );
}
