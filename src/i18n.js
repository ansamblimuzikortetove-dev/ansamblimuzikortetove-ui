import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";
import al from "./locales/al/translation.json";
import mk from "./locales/mk/translation.json";

const savedLang = localStorage.getItem("lang") || "en";

i18n
    .use(initReactI18next)
    .init({
        resources: { en: { translation: en }, sq: { translation: al }, mk: { translation: mk } },
        lng: savedLang,
        fallbackLng: "en",
        interpolation: { escapeValue: false },
    });

export default i18n;