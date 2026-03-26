import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setReady(true);
    } else {
      // Also listen for auth state change with recovery event
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") {
          setReady(true);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setMessage("Password updated successfully. Redirecting...");
      setTimeout(() => navigate("/"), 2000);
    }
    setSubmitting(false);
  };

  return (
    <main className="pt-28 px-6 max-w-md mx-auto pb-20">
      <h1 className="font-display text-4xl tracking-wide-fashion mb-12 text-center">
        RESET PASSWORD
      </h1>

      {!ready ? (
        <p className="text-[11px] uppercase tracking-fashion text-muted-foreground text-center">
          Invalid or expired reset link. Please request a new one.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-fashion text-muted-foreground block mb-1">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-fashion text-muted-foreground block mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
              className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
            />
          </div>

          {error && <p className="text-[11px] text-destructive">{error}</p>}
          {message && <p className="text-[11px] text-muted-foreground">{message}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 text-xs font-semibold uppercase tracking-fashion bg-foreground text-background hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {submitting ? "..." : "Update Password"}
          </button>
        </form>
      )}
    </main>
  );
};

export default ResetPassword;
