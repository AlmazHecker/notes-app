import { create } from "zustand";

export type Theme = "light" | "dark" | "system";
export type FontSizeLevel = 1 | 2 | 3 | 4 | 5;
export type DateFormat =
  | "MM/DD/YYYY"
  | "DD/MM/YYYY"
  | "YYYY-MM-DD"
  | "DD.MM.YYYY";
export type Language = "en" | "jp" | "kg" | "fr"; // for now...

type UserPreferencesState = {
  theme: Theme;
  fontSize: FontSizeLevel;
  dateFormat: DateFormat;
  language: Language;

  setTheme: (theme: Theme) => void;
  setFontSize: (level: FontSizeLevel) => void;
  setDateFormat: (format: DateFormat) => void;
  setLanguage: (lang: Language) => void;
};

const getLocal = <T,>(key: string, fallback: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? (stored as unknown as T) : fallback;
};

export const useUserPreferences = create<UserPreferencesState>((set) => ({
  theme: getLocal<Theme>("theme", "system"),
  fontSize: parseInt(localStorage.getItem("fontSize") || "3") as FontSizeLevel,
  dateFormat: getLocal<DateFormat>("dateFormat", "DD.MM.YYYY"),
  language: getLocal<Language>("language", "en"),

  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    set({ theme });
  },
  setFontSize: (level) => {
    localStorage.setItem("fontSize", level.toString());
    set({ fontSize: level });
  },
  setDateFormat: (format) => {
    localStorage.setItem("dateFormat", format);
    set({ dateFormat: format });
  },
  setLanguage: (lang) => {
    localStorage.setItem("language", lang);
    set({ language: lang });
  },
}));
