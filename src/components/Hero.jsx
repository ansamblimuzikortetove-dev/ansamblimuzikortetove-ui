import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden h-[100vh] flex items-center">
      {/* animated gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_20%,rgba(234,179,8,0.18),rgba(0,0,0,0))]"></div>
      <div className="pointer-events-none absolute -inset-x-1 -top-24 h-48 opacity-20">
        <div className="h-px w-1/2 bg-gradient-to-r from-transparent via-accent to-transparent animate-shimmer"></div>
      </div>

      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('https://picsum.photos/1600/900?blur=2')" }}
      />

      <div className="relative container-max text-white">
        <motion.h1
          className="h-serif text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight max-w-5xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {t("hero.title")}
        </motion.h1>
        <motion.p
          className="mt-4 max-w-2xl text-white/85"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
        >
          {t("hero.subtitle")}
        </motion.p>
        <motion.div
          className="mt-8 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <NavLink to="/events" className="btn btn-primary hover:shadow-gold">
            {t("hero.ctaPrimary")}
          </NavLink>
          <NavLink to="/about" className="btn btn-ghost">
            {t("hero.ctaSecondary")}
          </NavLink>
        </motion.div>
      </div>
    </section>
  );
}
