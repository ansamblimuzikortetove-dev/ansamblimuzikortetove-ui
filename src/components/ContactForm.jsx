import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ContactForm() {
    const { t } = useTranslation();

    const [form, setForm] = useState({ name: "", email: "", message: "" });

    const handle = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const submit = (e) => {
        e.preventDefault();
    };

    return (
        <form onSubmit={submit} className="card p-6 grid gap-4">
            {/* NAME */}
            <div>
                <label className="text-sm font-medium">{t("contact.name")}</label>
                <input
                    name="name"
                    value={form.name}
                    onChange={handle}
                    className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2"
                    placeholder={t("contact.placeholderName")}
                />
            </div>

            {/* EMAIL */}
            <div>
                <label className="text-sm font-medium">{t("contact.email")}</label>
                <input
                    name="email"
                    value={form.email}
                    onChange={handle}
                    type="email"
                    className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2"
                    placeholder={t("contact.placeholderEmail")}
                />
            </div>

            {/* MESSAGE */}
            <div>
                <label className="text-sm font-medium">{t("contact.message")}</label>
                <textarea
                    name="message"
                    value={form.message}
                    onChange={handle}
                    rows="5"
                    className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2"
                    placeholder={t("contact.placeholderMessage")}
                />
            </div>

            {/* SEND BUTTON */}
            <button className="rounded-xl bg-accent text-slate-900 px-5 py-2 font-semibold">
                {t("contact.send")}
            </button>
        </form>
    );
}