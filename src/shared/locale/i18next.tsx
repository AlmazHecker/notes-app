import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import kgJSON from "./resources/kg.json";
import ruJSON from "./resources/ru.json";
import enJSON from "./resources/en.json";

export const resources = {
  ru: { translation: ruJSON },
  kg: { translation: kgJSON },
  en: { translation: enJSON },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export const { t } = i18n;
export default i18n;
