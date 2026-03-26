import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

const Header = ({ cartCount, onCartClick }: HeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 header-blend overflow-hidden">
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
            style={{ top: "-240px" }}
          >
            <img
              src="/panapp-logo.png"
              alt="PANAPP"
              className="w-[280px] md:w-[420px] h-auto object-contain pointer-events-auto"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>

          {/* Right: Cart + Nav */}
          <div className="flex flex-col items-end">
            <button
              onClick={onCartClick}
              className="text-[11px] font-semibold uppercase tracking-fashion"
            >
              Cart ({cartCount})
            </button>
            <nav className="hidden md:flex flex-col items-end gap-0 mt-1">
              <Link
                to="/collection"
                className="text-[10px] font-semibold uppercase tracking-fashion leading-relaxed"
              >
                Collection
              </Link>
              <Link
                to="/lookbook"
                className="text-[10px] font-semibold uppercase tracking-fashion leading-relaxed"
              >
                Lookbook
              </Link>
              {user ? (
                <>
                  <Link
                    to="/account"
                    className="text-[10px] font-semibold uppercase tracking-fashion leading-relaxed"
                  >
                    Account
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="text-[10px] font-semibold uppercase tracking-fashion leading-relaxed"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="text-[10px] font-semibold uppercase tracking-fashion leading-relaxed"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="text-[10px] font-semibold uppercase tracking-fashion leading-relaxed"
                >
                  Account
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

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
