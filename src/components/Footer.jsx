import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Logos
import logoAL from "../assets/logo-al.png"; // EN + SQ
import logoMK from "../assets/logo-mk.png"; // MK

// Icons
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const { t, i18n } = useTranslation();

  const currentLogo = i18n.language === "mk" ? logoMK : logoAL;

  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/about", label: t("nav.about") },
    { to: "/events", label: t("nav.upcomingEvents") },
    { to: "/past-events", label: t("nav.past") },
    { to: "/gallery", label: t("nav.gallery") },
    { to: "/reports", label: t("nav.reports") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
      <footer className="bg-black/80 border-t border-accent/20 mt-20 text-white">
        {/* Gold top border */}
        <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-accent to-transparent" />

        <div className="container-max py-14 grid md:grid-cols-3 gap-10">

          {/* Logo + About */}
          <div className="flex flex-col items-start">
            <img
                src={currentLogo}
                alt="Logo"
                className="h-16 w-auto mb-4 drop-shadow-[0_4px_10px_rgba(234,179,8,0.4)]"
            />

            <p className="text-slate-400 leading-relaxed text-sm max-w-xs">
              {t("footer.description") ||
                  "A harmonious blend of passion, precision, and tradition — bringing classical music to every generation."}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col md:items-center">
            <h3 className="text-accent text-lg font-semibold mb-4">Navigation</h3>
            <nav className="grid gap-2 text-slate-300">
              {navLinks.map((link, i) => (
                  <Link
                      key={i}
                      to={link.to}
                      className="hover:text-accent transition duration-200"
                  >
                    {link.label}
                  </Link>
              ))}
            </nav>
          </div>

          {/* Contact + Social */}
          <div className="flex flex-col md:items-end">
            <h3 className="text-accent text-lg font-semibold mb-4">Contact</h3>

            <p className="text-slate-300 text-sm">info@orchestra.com</p>
            <p className="text-slate-300 text-sm mt-1">+389 70 123 456</p>

            <div className="flex gap-4 mt-6">
              <a
                  href="#"
                  className="text-slate-300 hover:text-accent transition text-xl"
              >
                <FaFacebookF />
              </a>
              <a
                  href="#"
                  className="text-slate-300 hover:text-accent transition text-xl"
              >
                <FaInstagram />
              </a>
              <a
                  href="#"
                  className="text-slate-300 hover:text-accent transition text-xl"
              >
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-4">
          <p className="text-center text-slate-500 text-xs">
            © {new Date().getFullYear()} Philharmonic Orchestra. All rights reserved.
          </p>
        </div>
      </footer>
  );
}