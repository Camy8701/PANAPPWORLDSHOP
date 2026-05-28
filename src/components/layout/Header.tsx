import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import SearchOverlay from "./SearchOverlay";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

const Header = ({ cartCount, onCartClick }: HeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 header-blend">
        <div className="flex items-start justify-between px-2 py-2 md:px-3 md:py-3">
          {/* Left: Brand name + subtitle (desktop) */}
          <div className="hidden md:block">
            <Link
              to="/"
              className="text-[11px] font-semibold uppercase tracking-fashion leading-tight block"
            >
              PANAPP
            </Link>
            <p className="text-[9px] uppercase tracking-fashion mt-0.5 opacity-80">
              It's Time For Africa
            </p>
          </div>

          {/* Left: Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="text-[11px] font-medium uppercase tracking-fashion"
            >
              Menu
            </button>
          </div>

          {/* Center: Logo image */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ top: "-204px" }}
          >
            <img
              src="/panapp-logo.png"
              alt="PANAPP"
              className="w-[280px] md:w-[420px] h-auto object-contain pointer-events-auto"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>

          {/* Right: Nav links in a row */}
          {/* Right: Nav links in a horizontal row */}
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-4">
              <Link
                to="/collection"
                className="text-[10px] font-semibold uppercase tracking-fashion"
              >
                Collection
              </Link>
              <Link
                to="/lookbook"
                className="text-[10px] font-semibold uppercase tracking-fashion"
              >
                Lookbook
              </Link>
              {user ? (
                <>
                  <Link
                    to="/account"
                    className="text-[10px] font-semibold uppercase tracking-fashion"
                  >
                    Account
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="text-[10px] font-semibold uppercase tracking-fashion"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="text-[10px] font-semibold uppercase tracking-fashion"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="text-[10px] font-semibold uppercase tracking-fashion"
                >
                  Account
                </Link>
              )}
            </nav>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="text-[10px] font-semibold uppercase tracking-fashion flex items-center"
            >
              <Search size={14} strokeWidth={2.5} />
            </button>
            <button
              onClick={onCartClick}
              aria-label={`Cart, ${cartCount} items`}
              className="relative text-[10px] font-semibold uppercase tracking-fashion"
            >
              Cart
              {cartCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#990000] text-white text-[9px] font-bold tabular-nums align-middle">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-foreground flex flex-col items-center justify-center">
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-3 right-3 text-primary-foreground"
          >
            <X size={24} />
          </button>
          <nav className="flex flex-col items-center gap-6 text-primary-foreground">
            <Link
              to="/collection"
              onClick={() => setMobileOpen(false)}
              className="text-2xl font-bold uppercase tracking-wide-fashion"
            >
              Collection
            </Link>
            <Link
              to="/lookbook"
              onClick={() => setMobileOpen(false)}
              className="text-2xl font-bold uppercase tracking-wide-fashion"
            >
              Lookbook
            </Link>
            <button
              onClick={() => {
                setMobileOpen(false);
                onCartClick();
              }}
              className="text-2xl font-bold uppercase tracking-wide-fashion"
            >
              Cart ({cartCount})
            </button>
            {user ? (
              <>
                <Link
                  to="/account"
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-bold uppercase tracking-wide-fashion"
                >
                  Account
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="text-2xl font-bold uppercase tracking-wide-fashion"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    signOut();
                  }}
                  className="text-2xl font-bold uppercase tracking-wide-fashion"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-bold uppercase tracking-wide-fashion"
              >
                Account
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
