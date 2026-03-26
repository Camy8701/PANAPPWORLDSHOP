import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        navigate("/");
      }
    } else {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        setError(error.message);
      } else {
        setMessage("Check your email to confirm your account.");
      }
    }
    setSubmitting(false);
  };

  return (
    <main className="pt-28 px-6 max-w-md mx-auto pb-20">
      <h1 className="font-display text-4xl tracking-wide-fashion mb-12 text-center">
        {mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div>
            <label className="text-[10px] uppercase tracking-fashion text-muted-foreground block mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
            />
          </div>
        )}

        <div>
          <label className="text-[10px] uppercase tracking-fashion text-muted-foreground block mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-fashion text-muted-foreground block mb-1">
            Password
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

        {error && (
          <p className="text-[11px] text-destructive">{error}</p>
        )}
        {message && (
          <p className="text-[11px] text-muted-foreground">{message}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 text-xs font-semibold uppercase tracking-fashion bg-foreground text-background hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {submitting ? "..." : mode === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>

      <div className="mt-8 text-center">
        <button
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError("");
            setMessage("");
          }}
          className="text-[10px] uppercase tracking-fashion text-muted-foreground hover:text-foreground transition-colors"
        >
          {mode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
};

export default Auth;
