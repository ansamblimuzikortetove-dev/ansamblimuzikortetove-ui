import React, { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import logoAL from "../assets/logo-al.png";
import logoMK from "../assets/logo-mk.png";
import {FlagIcon} from "./FlagIcon.jsx";

const links = [
  { to: "/", key: "home" },
  { to: "/about", key: "about" },
  {
    key: "events",
    children: [
      { to: "/events", key: "upcomingEvents" },
      { to: "/past-events", key: "past" },
    ],
  },
  { to: "/reports", key: "reports" },
  { to: "/gallery", key: "gallery" },
  { to: "/contact", key: "contact" },
];

const langs = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "sq", label: "AL", flag: "🇦🇱" },
  { code: "mk", label: "MK", flag: "🇲🇰" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const hoverTimeout = useRef(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);

  const { t, i18n } = useTranslation();
  const currentLogo = i18n.language === "mk" ? logoMK : logoAL;

  /* ---------------- DELAYED DROPDOWN CLOSE ---------------- */
  const openDropdown = (key) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoveredDropdown(key);
  };
  const closeDropdown = () => {
    hoverTimeout.current = setTimeout(() => setHoveredDropdown(null), 120);
  };

  /* ---------------- CHANGE LANG ---------------- */
  const changeLang = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
    setLangOpen(false);
  };

  return (
      <header className="sticky top-0 z-[999] backdrop-blur-2xl bg-black/40 border-b border-white/10 shadow-[0_0_30px_rgba(255,215,0,0.15)]">

        <div className="container-max flex items-center justify-between py-4">

          {/* LOGO */}
          <NavLink to="/" className="flex items-center gap-3 hover:scale-[1.03] transition-transform">
            <img
                src={currentLogo}
                alt="Logo"
                className="h-12 w-auto drop-shadow-[0_4px_10px_rgba(255,215,0,0.35)]"
            />
          </NavLink>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-10">

            {links.map((link) =>
                link.children ? (
                    <div
                        key={link.key}
                        className="relative group"
                        onMouseEnter={() => openDropdown(link.key)}
                        onMouseLeave={closeDropdown}
                    >
                      <button
                          className={`relative text-sm font-medium flex items-center gap-1 transition duration-300 
                    ${hoveredDropdown === link.key ? "text-accent scale-[1.05]" : "text-slate-300 hover:text-accent"}`}
                      >
                        {t(`nav.${link.key}`)}

                        {/* underline */}
                        <span
                            className={`absolute -bottom-1 left-0 h-[2px] bg-accent rounded-full transition-all duration-300
                    ${hoveredDropdown === link.key ? "w-full opacity-100" : "w-0 opacity-0"}`}
                        />

                        {/* arrow */}
                        <svg
                            className={`h-4 w-4 transition-transform ${
                                hoveredDropdown === link.key ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Dropdown */}
                      <div
                          onMouseEnter={() => openDropdown(link.key)}
                          onMouseLeave={closeDropdown}
                          className={`absolute left-0 top-full mt-2 w-52 rounded-xl border border-white/10
                    bg-black/80 backdrop-blur-xl p-2 shadow-xl transition-all duration-300 origin-top
                    ${
                              hoveredDropdown === link.key
                                  ? "opacity-100 scale-100"
                                  : "opacity-0 scale-95 pointer-events-none"
                          }`}
                      >
                        {link.children.map((child) => (
                            <NavLink
                                key={child.to}
                                to={child.to}
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded-lg text-sm transition
                        ${isActive ? "text-accent bg-white/5" : "text-slate-200 hover:bg-white/10"}`
                                }
                            >
                              {t(`nav.${child.key}`)}
                            </NavLink>
                        ))}
                      </div>
                    </div>
                ) : (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            `relative text-sm font-medium transition duration-300
                  ${isActive ? "text-accent scale-[1.05]" : "text-slate-300 hover:text-accent"}`
                        }
                    >
                      {({ isActive }) => (
                          <>
                            {t(`nav.${link.key}`)}
                            <span
                                className={`absolute -bottom-1 left-0 h-[2px] bg-accent rounded-full transition-all duration-300
                      ${isActive ? "w-full opacity-100" : "w-0 opacity-0"}`}
                            />
                          </>
                      )}
                    </NavLink>
                )
            )}

            {/* LANGUAGE SELECTOR — CLEAN WITH REACT-COUNTRY-FLAG */}
            {/* LANGUAGE SELECTOR — MATCHES link.children UI */}
            <div className="relative">
              <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10
               bg-black/40 backdrop-blur-xl text-slate-200 hover:text-accent transition font-medium"
              >
                <FlagIcon code={i18n.language} />

                <span className="text-sm font-medium uppercase tracking-wide">
      {i18n.language}
    </span>

                <svg
                    className={`h-4 w-4 transition-transform ${langOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {langOpen && (
                  <div
                      className="absolute right-0 mt-3 w-44 rounded-xl border border-white/10 bg-black/80
                 backdrop-blur-xl p-2 shadow-xl transition-all duration-200"
                  >
                    {langs.map((l) => (
                        <button
                            key={l.code}
                            onClick={() => changeLang(l.code)}
                            className={`
            w-full px-3 py-2 rounded-lg text-sm flex items-center justify-between transition
            ${
                                i18n.language === l.code
                                    ? "text-accent bg-white/5"      /* SAME AS selected child link */
                                    : "text-slate-200 hover:bg-white/10"  /* SAME AS hover child link */
                            }
          `}
                        >
          <span className="flex items-center gap-2">
            <FlagIcon code={l.code} />
            {l.label}
          </span>
                        </button>
                    ))}
                  </div>
              )}
            </div>





          </div>

          {/* MOBILE MENU BUTTON */}
          <button
              className="md:hidden p-2 rounded-lg border border-white/20 hover:bg-white/10 transition"
              onClick={() => setOpen(!open)}
          >
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-accent to-transparent"></div>

        {/* MOBILE MENU */}
        {open && (
            <div className="md:hidden border-t border-white/10 bg-black/80 backdrop-blur-xl">
              <nav className="container-max py-4 grid gap-3 animate-[fadeDown_0.25s_ease-out]">

                {links.map((link) => (
                    <div key={link.key || link.to}>
                      {link.children ? (
                          <>
                            <button
                                onClick={() =>
                                    setMobileDropdown(mobileDropdown === link.key ? null : link.key)
                                }
                                className="w-full flex justify-between items-center py-2 text-slate-200 hover:text-accent"
                            >
                              {t(`nav.${link.key}`)}
                              <svg
                                  className={`h-4 w-4 transition-transform ${mobileDropdown === link.key ? "rotate-180" : ""}`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                              </svg>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 
                        ${
                                    mobileDropdown === link.key
                                        ? "max-h-40 opacity-100"
                                        : "max-h-0 opacity-0"
                                }`}
                            >
                              {link.children.map((child) => (
                                  <NavLink
                                      key={child.to}
                                      to={child.to}
                                      onClick={() => setOpen(false)}
                                      className={({ isActive }) =>
                                          `block py-1.5 pl-6 text-sm transition
     ${isActive ? "text-accent" : "text-slate-200 hover:text-accent"}`
                                      }
                                  >
                                    {t(`nav.${child.key}`)}
                                  </NavLink>

                              ))}
                            </div>
                          </>
                      ) : (
                          <NavLink
                              to={link.to}
                              onClick={() => setOpen(false)}
                              className={({ isActive }) =>
                                  `block py-2 text-sm transition
     ${isActive ? "text-accent" : "text-slate-200 hover:text-accent"}`
                              }
                          >
                            {t(`nav.${link.key}`)}
                          </NavLink>

                      )}
                    </div>
                ))}
                {/* MOBILE LANG — clean, bordered, small, modern */}
                <div className="grid grid-cols-3 gap-2 pt-3">

                  {langs.map((l) => (
                      <button
                          key={l.code}
                          onClick={() => {
                            changeLang(l.code);
                            setOpen(false);
                          }}
                          className={`
        py-2 px-2 rounded-md text-center text-sm transition border 
        flex flex-col items-center justify-center gap-1
        ${
                              i18n.language === l.code
                                  ? "text-accent border-accent"
                                  : "text-slate-200 border-white/20 hover:text-accent hover:border-accent/50"
                          }
      `}
                      >
                        {/* FLAG */}
                        <FlagIcon code={l.code} />

                        {/* LABEL */}
                        <span className="text-[11px] font-medium uppercase tracking-wide">
        {l.label}
      </span>
                      </button>
                  ))}

                </div>




              </nav>
            </div>
        )}
      </header>
  );
}