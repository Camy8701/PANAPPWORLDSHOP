import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="py-20 px-6 flex flex-col items-center gap-6">
      {/* Logo icon */}
      <button onClick={scrollToTop} className="mb-2">
        <svg width="60" height="80" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="30" cy="30" r="18" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <line x1="30" y1="12" x2="30" y2="0" stroke="currentColor" strokeWidth="1.5" />
          <line x1="30" y1="48" x2="30" y2="80" stroke="currentColor" strokeWidth="1.5" />
          <line x1="12" y1="30" x2="0" y2="30" stroke="currentColor" strokeWidth="1.5" />
          <line x1="48" y1="30" x2="60" y2="30" stroke="currentColor" strokeWidth="1.5" />
          <line x1="17" y1="17" x2="8" y2="8" stroke="currentColor" strokeWidth="1.5" />
          <line x1="43" y1="17" x2="52" y2="8" stroke="currentColor" strokeWidth="1.5" />
          <line x1="17" y1="43" x2="8" y2="52" stroke="currentColor" strokeWidth="1.5" />
          <line x1="43" y1="43" x2="52" y2="52" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="30" cy="30" r="4" fill="currentColor" />
        </svg>
      </button>

      <p className="text-[10px] uppercase tracking-wide-fashion text-center max-w-lg">
        Redefining contemporary fashion through bold design and uncompromising quality
      </p>

      <nav className="flex gap-8 text-[10px] uppercase tracking-fashion font-medium">
        <Link to="/terms-of-service" className="hover:opacity-60 transition-opacity">
          Terms of Service
        </Link>
        <Link to="/privacy-policy" className="hover:opacity-60 transition-opacity">
          Privacy Policy
        </Link>
        <Link to="/shipping-and-returns" className="hover:opacity-60 transition-opacity">
          Shipping and Returns
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;
