import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{ backgroundColor: "oklch(0.11 0 0)" }}
      className="text-white"
    >
      {/* Main footer grid */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Col 1 — Brand */}
          <div className="lg:col-span-1">
            <p className="font-serif text-xl tracking-[0.15em] uppercase text-white mb-4">
              Western Edition
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "oklch(0.65 0 0)" }}
            >
              Architectural Minimalism for the Modern Indian Home
            </p>
            <div
              className="mt-6 h-px"
              style={{ backgroundColor: "oklch(0.25 0 0)" }}
            />
            <p
              className="mt-6 text-xs tracking-wide leading-relaxed"
              style={{ color: "oklch(0.55 0 0)" }}
            >
              Designed in Mumbai.
              <br />
              Crafted in India.
            </p>
          </div>

          {/* Col 2 — Navigation */}
          <div>
            <p
              className="text-xs tracking-[0.2em] uppercase mb-6"
              style={{ color: "oklch(0.55 0 0)" }}
            >
              Navigation
            </p>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  data-ocid="footer.home_link"
                  className="text-sm transition-opacity duration-200 hover:opacity-60"
                  style={{ color: "oklch(0.78 0 0)" }}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  data-ocid="footer.shop_link"
                  className="text-sm transition-opacity duration-200 hover:opacity-60"
                  style={{ color: "oklch(0.78 0 0)" }}
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  data-ocid="footer.about_link"
                  className="text-sm transition-opacity duration-200 hover:opacity-60"
                  style={{ color: "oklch(0.78 0 0)" }}
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 — White-Glove Installation */}
          <div>
            <p
              className="text-xs tracking-[0.2em] uppercase mb-6"
              style={{ color: "oklch(0.55 0 0)" }}
            >
              Pan-India White-Glove Installation
            </p>
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: "oklch(0.65 0 0)" }}
            >
              Every Western Edition piece arrives with our signature white-glove
              delivery and installation service — at no extra cost across all
              major Indian cities.
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "oklch(0.65 0 0)" }}
            >
              Our trained installation teams handle assembly, placement, and
              removal of your existing furniture. Mumbai, Delhi, Bengaluru,
              Hyderabad, Chennai, Pune and beyond.
            </p>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <p
              className="text-xs tracking-[0.2em] uppercase mb-6"
              style={{ color: "oklch(0.55 0 0)" }}
            >
              Visit our Showroom
            </p>
            <address
              className="not-italic text-sm leading-relaxed mb-6"
              style={{ color: "oklch(0.65 0 0)" }}
            >
              Design District
              <br />
              Lower Parel, Mumbai — 400013
              <br />
              Maharashtra, India
            </address>
            <p className="text-sm mb-4" style={{ color: "oklch(0.65 0 0)" }}>
              Mon – Sat: 10:00 – 19:00
            </p>
            <a
              href="https://wa.me/919999999999?text=Hello%2C%20I%27m%20interested%20in%20Western%20Edition%20furniture"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm transition-opacity duration-200 hover:opacity-60"
              style={{ color: "oklch(0.72 0.15 145)" }}
            >
              <MessageCircle size={14} />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTopColor: "oklch(0.22 0 0)" }} className="border-t">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "oklch(0.45 0 0)" }}>
            © {year} Western Edition. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "oklch(0.45 0 0)" }}>
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity duration-200 underline underline-offset-2"
              style={{ color: "oklch(0.55 0 0)" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
