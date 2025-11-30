import React from "react";
import { useTranslation } from "react-i18next";

export default function About() {
    const { t } = useTranslation();

    const TIMELINE = [
        { year: "1995", text: t("about.timeline.1995") },
        { year: "2005", text: t("about.timeline.2005") },
        { year: "2018", text: t("about.timeline.2018") },
        { year: "2024", text: t("about.timeline.2024") }
    ];

    return (
        <div className="container-max py-16 space-y-16">

            {/* Intro */}
            <section className="grid lg:grid-cols-2 gap-12 items-center opacity-0 animate-fadeUp">
                <div className="relative">
                    <div className="absolute -left-6 top-0 h-full w-1 bg-accent rounded-full shadow-gold-glow"></div>

                    <h1 className="text-4xl font-bold text-accent mb-4">
                        {t("about.title")}
                    </h1>

                    <p className="text-slate-300 leading-relaxed">
                        {t("about.intro1")}
                    </p>

                    <p className="text-slate-400 mt-4">
                        {t("about.intro2")}
                    </p>
                </div>

                <img
                    src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=1000&q=80"
                    alt="Orchestra hall"
                    className="rounded-3xl shadow-gold opacity-0 animate-scaleIn"
                    style={{ animationDelay: "120ms" }}
                />
            </section>

            {/* Mission & Vision */}
            <section
                className="grid md:grid-cols-2 gap-6 opacity-0 animate-fadeUp"
                style={{ animationDelay: "200ms" }}
            >
                <div className="card p-8 text-center hover:-translate-y-1 transition duration-300">
                    <h2 className="text-2xl font-semibold text-accent mb-3">
                        {t("about.missionTitle")}
                    </h2>
                    <p className="text-slate-300">{t("about.missionText")}</p>
                </div>

                <div className="card p-8 text-center hover:-translate-y-1 transition duration-300">
                    <h2 className="text-2xl font-semibold text-accent mb-3">
                        {t("about.visionTitle")}
                    </h2>
                    <p className="text-slate-300">{t("about.visionText")}</p>
                </div>
            </section>

            {/* Timeline */}
            <section className="opacity-0 animate-fadeIn" style={{ animationDelay: "300ms" }}>
                <h2 className="text-3xl font-bold text-accent mb-8 text-center">
                    {t("about.journeyTitle")}
                </h2>

                <div className="relative border-l border-accent/40 ml-4 space-y-8">
                    {TIMELINE.map((tItem, i) => (
                        <div
                            key={i}
                            className="ml-6 relative opacity-0 animate-fadeUp"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className="absolute -left-3 top-1 w-3 h-3 bg-accent rounded-full" />
                            <h3 className="text-xl font-semibold text-white ml-2">{tItem.year}</h3>
                            <p className="text-slate-400 ml-2">{tItem.text}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}