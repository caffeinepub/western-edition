import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const isHome = currentPath === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Shop", href: "/shop", ocid: "nav.shop_link" },
    { label: "About", href: "/about", ocid: "nav.about_link" },
  ];

  const isActive = (href: string) => currentPath === href;

  // On homepage: transparent until scrolled; on other pages: always opaque
  const isTransparent = isHome && !scrolled && !mobileOpen;

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: isTransparent
            ? "transparent"
            : "oklch(0.995 0.002 75)",
          borderBottom: isTransparent
            ? "1px solid transparent"
            : "1px solid oklch(0.91 0.003 75)",
        }}
      >
        <nav className="relative max-w-[1400px] mx-auto px-6 md:px-12 h-[72px] flex items-center justify-between">
          {/* Left — brand name */}
          <Link
            to="/"
            data-ocid="nav.home_link"
            className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-60"
            aria-label="Western Edition — Home"
          >
            <span
              className="font-serif tracking-[0.15em] uppercase text-[13px]"
              style={{
                color: isTransparent
                  ? "rgba(255,255,255,0.9)"
                  : "oklch(0.12 0 0)",
                transition: "color 0.5s ease",
              }}
            >
              Western Edition
            </span>
          </Link>

          {/* Centre — primary nav (desktop only) */}
          <ul className="hidden md:flex items-center justify-center gap-10 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <li key={link.ocid}>
                <Link
                  to={link.href}
                  data-ocid={link.ocid}
                  className="relative text-[11px] tracking-[0.18em] uppercase transition-colors duration-200 group"
                  style={{
                    color: isTransparent
                      ? "rgba(255,255,255,0.8)"
                      : isActive(link.href)
                        ? "oklch(0.12 0 0)"
                        : "oklch(0.52 0 0)",
                  }}
                >
                  {link.label}
                  <span
                    className="absolute -bottom-0.5 left-0 h-px transition-all duration-300"
                    style={{
                      width: isActive(link.href) ? "100%" : "0%",
                      backgroundColor: isTransparent
                        ? "white"
                        : "oklch(0.12 0 0)",
                    }}
                  />
                  <span
                    className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                    style={{
                      backgroundColor: isTransparent
                        ? "white"
                        : "oklch(0.12 0 0)",
                    }}
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* Right — icons */}
          <div className="flex items-center gap-5">
            {/* Mobile hamburger — always pinned to the right edge */}
            <button
              type="button"
              data-ocid="nav.menu_button"
              className="md:hidden transition-opacity duration-200 hover:opacity-50 flex items-center justify-center w-10 h-10"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              style={{
                color:
                  isTransparent && !mobileOpen ? "white" : "oklch(0.12 0 0)",
              }}
            >
              {mobileOpen ? (
                <X size={20} strokeWidth={1.5} />
              ) : (
                <Menu size={20} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen overlay */}
      <div
        className="fixed inset-0 z-40 flex flex-col transition-all duration-500"
        style={{
          backgroundColor: "oklch(0.995 0.002 75)",
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
          transform: mobileOpen ? "translateY(0)" : "translateY(-8px)",
        }}
      >
        <div className="flex flex-col items-start justify-center flex-1 px-10 gap-1 pt-24">
          {navLinks.map((link, i) => (
            <Link
              key={link.ocid}
              to={link.href}
              data-ocid={link.ocid}
              onClick={() => setMobileOpen(false)}
              className="font-serif text-[2.8rem] text-foreground leading-tight hover:opacity-40 transition-opacity duration-200"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div
          className="px-10 py-8 text-[10px] tracking-[0.3em] uppercase font-sans"
          style={{
            color: "oklch(0.6 0 0)",
            borderTop: "1px solid oklch(0.91 0.003 75)",
          }}
        >
          Western Edition — Mumbai
        </div>
      </div>
    </>
  );
}
