import React from "react";
import { useTranslation } from "react-i18next";

export default function DocumentPage({
                                         titleKey,
                                         descriptionKey,
                                         buttonKey,
                                         pdfPath,
                                     }) {
    const { t } = useTranslation();

    return (
        <div className="bg-black text-white">
            <section className="container-max py-20 text-center">
                <h1 className="text-4xl font-bold text-accent mb-6">
                    {t(titleKey)}
                </h1>

                <p className="text-slate-400 mb-10 max-w-xl mx-auto">
                    {t(descriptionKey)}
                </p>

                <a
                    href={pdfPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                >
                    {t(buttonKey)}
                </a>
            </section>
        </div>
    );
}