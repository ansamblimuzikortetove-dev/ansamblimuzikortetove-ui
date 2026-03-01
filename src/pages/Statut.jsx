import React from "react";
import { useTranslation } from "react-i18next";

export default function Statut() {
    const { t } = useTranslation();

    return (
        <div className="bg-black text-white">
            <section className="container-max py-20 text-center">
                <h1 className="text-4xl font-bold text-accent mb-6">
                    {t("statut.title")}
                </h1>

                <p className="text-slate-400 mb-10 max-w-xl mx-auto">
                    {t("statut.description")}
                </p>

                <a
                    href="/statut-nu-muzicki-ansambl-tetovo.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                >
                    {t("statut.open")}
                </a>
            </section>
        </div>
    );
}