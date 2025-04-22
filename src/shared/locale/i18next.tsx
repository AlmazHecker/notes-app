import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import kgJSON from "./resources/kg.json";
import ruJSON from "./resources/ru.json";
import enJSON from "./resources/en.json";
import jpJSON from "./resources/jp.json";

export const resources = {
  ru: { translation: ruJSON },
  kg: { translation: kgJSON },
  en: { translation: enJSON },
  jp: { translation: jpJSON },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export const { t } = i18n;
export default i18n;
