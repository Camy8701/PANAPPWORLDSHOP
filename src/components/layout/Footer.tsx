import { Link } from "react-router-dom";

const leftLinks = [
  { label: "About Us", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Lookbook", to: "/lookbook" },
];

const rightLinks = [
  { label: "Contact Us", href: "mailto:privacy@panappworld.com" },
  { label: "Shipping", to: "/shipping-and-returns" },
  { label: "Privacy", to: "/privacy-policy" },
  { label: "Terms", to: "/terms-of-service" },
];

const copyrightLinks = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms of Use", to: "/terms-of-service" },
  { label: "Shipping", to: "/shipping-and-returns" },
];

const Footer = () => {
  return (
    <footer className="overflow-hidden border-t border-white/10 bg-[#050505] pt-24 text-white">
      <div
        className="mb-20 w-full px-4 text-center"
        style={{
          maskImage: "linear-gradient(180deg, transparent, black 0%, black 55%, transparent)",
          WebkitMaskImage: "linear-gradient(180deg, transparent, black 0%, black 55%, transparent)",
        }}
      >
        <h1 className="reveal-on-scroll select-none text-[24vw] font-bold leading-[0.7] tracking-[-0.08em] text-[#313131] mix-blend-screen md:text-[22vw] md:scale-y-110">
          PANAPP
        </h1>
      </div>

      <div className="reveal-on-scroll reveal-delay-100 grid grid-cols-1 border-t border-white/10 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-12 border-white/10 p-8 md:p-16 lg:border-r">
          <div className="flex flex-col gap-6">
            {leftLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-xs font-medium uppercase tracking-[0.28em] text-white/55 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-6">
            {rightLinks.map((link) =>
              "href" in link ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs font-medium uppercase tracking-[0.28em] text-white/55 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-xs font-medium uppercase tracking-[0.28em] text-white/55 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
        </div>

        <div className="aether-bottles relative flex h-48 w-full items-center justify-center overflow-hidden border-t border-white/10 lg:h-auto lg:border-t-0">
          <svg
            viewBox="0 0 400 120"
            className="h-[160px] w-[756px] max-h-[160px] opacity-20"
            preserveAspectRatio="xMidYMid meet"
            strokeWidth="2"
            style={{ color: "rgb(255, 255, 255)" }}
          >
            <path d="M40 100 L50 30 L90 30 L100 100" stroke="white" strokeWidth="1" fill="none" />
            <rect x="50" y="20" width="40" height="10" stroke="white" strokeWidth="1" fill="none" />

            <path d="M120 100 L130 10 L170 10 L180 100" stroke="white" strokeWidth="1" fill="none" />
            <rect x="130" y="5" width="40" height="5" stroke="white" strokeWidth="1" fill="none" />

            <g transform="translate(200, 10)" className="dropper-bottle">
              <defs>
                <clipPath id="dropper-clip-panapp">
                  <path
                    d="M15 25
                   Q15 20 20 20
                   L40 20
                   Q45 20 45 25
                   L45 80
                   Q45 90 30 90
                   Q15 90 15 80
                   Z"
                  />
                </clipPath>
              </defs>

              <path
                d="M25 0 L25 10 L20 10 L20 20 L40 20 L40 10 L35 10 L35 0 Z"
                stroke="white"
                strokeWidth="1"
                fill="none"
              />

              <path
                d="M15 25 Q15 20 20 20 L40 20 Q45 20 45 25 L45 80 Q45 90 30 90 Q15 90 15 80 Z"
                stroke="white"
                strokeWidth="1"
                fill="none"
              />

              <g clipPath="url(#dropper-clip-panapp)">
                <rect className="liquid-fill" x="15" y="60" width="30" height="30" fill="#8b1414" opacity="0.62" />
                <path
                  className="liquid-wave"
                  d="M15 60
                 Q22 55 30 57
                 Q38 59 45 56
                 L45 90
                 L15 90 Z"
                  fill="#8b1414"
                  opacity="0.92"
                />
              </g>
            </g>

            <path d="M270 100 L280 20 L320 20 L330 100" stroke="white" strokeWidth="1" fill="none" />
            <rect x="280" y="10" width="40" height="10" stroke="white" strokeWidth="1" fill="none" />

            <g transform="translate(350, 20)">
              <rect x="25" y="0" width="10" height="20" stroke="white" strokeWidth="1" fill="none" />
              <path
                d="M15 25 Q15 20 20 20 L40 20 Q45 20 45 25 L45 70 Q45 80 30 80 Q15 80 15 70 Z"
                stroke="white"
                strokeWidth="1"
                fill="none"
              />
            </g>
          </svg>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-6 border-t border-white/10 px-8 py-8 text-[10px] font-medium tracking-[0.2em] text-white/50 md:flex-row md:px-16">
        <div>2024 All rights reserved</div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {copyrightLinks.map((link) => (
            <Link key={link.to} to={link.to} className="transition-colors hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .reveal-on-scroll {
          opacity: 0;
          transform: translate3d(0, 28px, 0);
          animation: panapp-footer-reveal 0.85s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }

        .reveal-delay-100 {
          animation-delay: 0.1s;
        }

        .aether-bottles .liquid-fill,
        .aether-bottles .liquid-wave {
          transform-box: fill-box;
          transform-origin: center bottom;
        }

        .aether-bottles svg:hover .liquid-wave {
          animation: panapp-wave 1.8s ease-in-out infinite;
        }

        .aether-bottles svg:hover .liquid-fill {
          animation: panapp-fill 1.8s ease-in-out infinite;
        }

        @keyframes panapp-footer-reveal {
          from {
            opacity: 0;
            transform: translate3d(0, 28px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes panapp-wave {
          0% {
            transform: translateX(0) translateY(0);
          }
          25% {
            transform: translateX(-3px) translateY(-2px);
          }
          50% {
            transform: translateX(3px) translateY(-1px);
          }
          75% {
            transform: translateX(-2px) translateY(-3px);
          }
          100% {
            transform: translateX(0) translateY(0);
          }
        }

        @keyframes panapp-fill {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
          100% {
            transform: translateY(-2px);
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
