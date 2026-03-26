import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="border-t border-border py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
        <button
          onClick={scrollToTop}
          className="font-display text-4xl tracking-wide-fashion hover:text-accent transition-colors"
        >
          PANAPPWORLD
        </button>

        <p className="text-xs text-muted-foreground tracking-fashion text-center max-w-md uppercase">
          Redefining contemporary fashion through bold design and uncompromising quality.
        </p>

        <nav className="flex gap-6 text-xs uppercase tracking-fashion">
          <Link to="/privacy-policy" className="hover:text-accent transition-colors">
            Privacy Policy
          </Link>
          <span className="text-muted-foreground">◆</span>
          <Link to="/shipping-and-returns" className="hover:text-accent transition-colors">
            Shipping & Returns
          </Link>
          <span className="text-muted-foreground">◆</span>
          <Link to="/terms-of-service" className="hover:text-accent transition-colors">
            Terms of Service
          </Link>
        </nav>

        <p className="text-[10px] text-muted-foreground tracking-fashion">
          © {new Date().getFullYear()} PANAPPWORLD. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
