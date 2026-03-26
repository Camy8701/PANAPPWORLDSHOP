import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  blendMode?: boolean;
}

const Header = ({ cartCount, onCartClick, blendMode = false }: HeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-5 flex items-start justify-between ${
          blendMode ? "mix-blend-difference text-white" : "text-foreground"
        }`}
      >
        {/* Left: Brand */}
        <Link to="/" className="font-display text-2xl tracking-fashion leading-none md:block hidden">
          PANAPP<br />WORLD
        </Link>

        {/* Center: Logo */}
        <Link
          to="/"
          className="font-display text-xl md:text-3xl tracking-wide-fashion md:absolute md:left-1/2 md:-translate-x-1/2"
        >
          PANAPPWORLD
        </Link>

        {/* Right: Cart + Nav */}
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={onCartClick}
            className="text-xs font-semibold uppercase tracking-fashion hover:text-accent transition-colors"
          >
            Cart ({cartCount})
          </button>
          <nav className="hidden md:flex gap-4 text-xs font-semibold uppercase tracking-fashion">
            <Link to="/collection" className="hover:text-accent transition-colors">
              Collection
            </Link>
            <Link to="/lookbook" className="hover:text-accent transition-colors">
              Lookbook
            </Link>
          </nav>
          <button
            className="md:hidden mt-1"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-accent flex flex-col items-center justify-center text-accent-foreground">
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-5 right-6"
          >
            <X size={24} />
          </button>
          <nav className="flex flex-col items-center gap-8 font-display text-4xl tracking-wide-fashion">
            <Link to="/collection" onClick={() => setMobileOpen(false)}>
              Collection
            </Link>
            <Link to="/lookbook" onClick={() => setMobileOpen(false)}>
              Lookbook
            </Link>
            <button
              onClick={() => {
                setMobileOpen(false);
                onCartClick();
              }}
            >
              Cart ({cartCount})
            </button>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
