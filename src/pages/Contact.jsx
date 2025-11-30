import React from "react";
import ContactForm from "../components/ContactForm";
import { useTranslation } from "react-i18next";

export default function Contact() {
    const { t } = useTranslation();

    return (
        <section className="container-max py-12 grid gap-8 lg:grid-cols-2">
            <ContactForm />
            <div className="card overflow-hidden">
                <iframe
                    title={t("contact.mapTitle")}
                    className="w-full h-full min-h-80"
                    src="https://maps.google.com/maps?q=Tetovo&t=&z=13&ie=UTF8&iwloc=&output=embed"
                    loading="lazy"
                />
            </div>
        </section>
    );
}