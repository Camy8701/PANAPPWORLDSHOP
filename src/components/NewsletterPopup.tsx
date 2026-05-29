import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "panapp-newsletter-popup";
const DISCOUNT_CODE = "WELCOME10";
const DELAY_MS = 15000;

export default function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    const timer = window.setTimeout(() => setOpen(true), DELAY_MS);

    const handleExitIntent = (e: MouseEvent) => {
      if (e.clientY <= 0 && !localStorage.getItem(STORAGE_KEY)) {
        setOpen(true);
      }
    };
    document.addEventListener("mouseleave", handleExitIntent);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseleave", handleExitIntent);
    };
  }, []);

  const dismiss = () => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch {}
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
      localStorage.setItem("panapp-discount", DISCOUNT_CODE);
    } catch {}
    setSubmitted(true);
    toast.success(`Code ${DISCOUNT_CODE} unlocked — apply at checkout`);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 animate-in fade-in"
      onClick={dismiss}
    >
      <div
        className="relative w-full max-w-md bg-background border border-border p-8 md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 p-2 hover:opacity-60 transition-opacity"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <>
            <p className="text-[10px] uppercase tracking-fashion text-[#990000] mb-4">
              Members only
            </p>
            <h2 className="font-display text-3xl md:text-4xl tracking-wide-fashion leading-tight mb-3">
              10% OFF YOUR FIRST ORDER
            </h2>
            <p className="text-[11px] uppercase tracking-fashion text-muted-foreground mb-6">
              Join the list. Early drops, no spam.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border bg-transparent px-3 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
              />
              <button
                type="submit"
                className="w-full py-3 text-xs font-semibold uppercase tracking-fashion bg-foreground text-background hover:opacity-80 transition-opacity"
              >
                Unlock 10% off
              </button>
            </form>
            <button
              onClick={dismiss}
              className="mt-4 w-full text-[10px] uppercase tracking-fashion text-muted-foreground hover:text-foreground transition-colors"
            >
              No thanks
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-[10px] uppercase tracking-fashion text-[#990000] mb-3">
              You're in
            </p>
            <h2 className="font-display text-3xl tracking-wide-fashion mb-4">
              YOUR CODE
            </h2>
            <div className="border border-foreground py-4 px-6 inline-block mb-4">
              <span className="font-display text-2xl tracking-wide-fashion">
                {DISCOUNT_CODE}
              </span>
            </div>
            <p className="text-[11px] uppercase tracking-fashion text-muted-foreground">
              Apply at checkout
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
