import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="py-20 px-6 flex flex-col items-center gap-6">
      {/* Logo */}
      <button onClick={scrollToTop} className="mb-2">
        <img
          src="/panapp-logo.png"
          alt="PANAPP"
          className="h-[225px] w-auto object-contain"
        />
      </button>

      <p className="text-[10px] uppercase tracking-wide-fashion text-center max-w-lg">
        It's Time For Africa
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
