import i18n from "i18next";
import Backend from "i18next-xhr-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "zh-TW",
    supportedLngs: ["zh-TW", "ja", "en"],
    debug: true,
    detection: {
      order: ["querystring", "localStorage"],
      caches: ["localStorage"],
      lookupQuerystring: "lang",
      lookupLocalStorage: "Lang",
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
