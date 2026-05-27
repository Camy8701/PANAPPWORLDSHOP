import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const EmailCaptureBand = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    // TODO: persist to newsletter_signups table in a follow-up step.
    await new Promise((r) => setTimeout(r, 400));
    toast({
      title: "Welcome to PANAPPWORLD",
      description: "Check your inbox for 10% off your first order.",
    });
    setEmail("");
    setSubmitting(false);
  };

  return (
    <section className="px-4 py-20 lg:py-28 bg-foreground text-background">
      <div className="max-w-2xl mx-auto text-center">
        <p
          className="text-[10px] uppercase tracking-fashion mb-3"
          style={{ color: "#cc3333" }}
        >
          Join the world
        </p>
        <h2
          className="uppercase tracking-fashion mb-6"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            lineHeight: 1,
          }}
        >
          10% off your first order
        </h2>
        <p className="text-[11px] uppercase tracking-fashion text-background/60 mb-8">
          New drops, early access, members-only releases.
        </p>
        <form
          onSubmit={onSubmit}
          className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="EMAIL ADDRESS"
            className="flex-1 bg-transparent border border-background/40 px-4 py-3 text-[11px] uppercase tracking-fashion placeholder:text-background/40 focus:outline-none focus:border-background"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-background text-foreground px-6 py-3 text-[11px] font-semibold uppercase tracking-fashion hover:bg-background/90 disabled:opacity-60"
          >
            {submitting ? "..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EmailCaptureBand;
