import { isCyrillic } from "@/shared/lib/utils";
import { useUserPreferences } from "@/shared/hooks/useUserPreferences";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const UserPreferenceProvider: React.FC = () => {
  const userPreferences = useUserPreferences();
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(userPreferences.language);
    if (isCyrillic(userPreferences.language)) {
      document.body.classList.remove("geist-mono");
    } else {
      document.body.classList.add("geist-mono");
    }
  }, [userPreferences.language]);

  useEffect(() => {
    const scale = [0.75, 0.875, 1, 1.125, 1.25];
    document.documentElement.style.fontSize = `${scale[userPreferences.fontSize - 1]}rem`;
  }, [userPreferences.fontSize]);

  useEffect(() => {
    const isDarkPreferred = () =>
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const setBodyClassAndMeta = (isDark: boolean) => {
      document.body.classList.toggle("dark", isDark);
      document.body.classList.toggle("light", !isDark);

      const themeColor = isDark ? "oklch(0.147 0.004 49.25)" : "oklch(1 0 0)";
      const meta = document.querySelector("meta[name='theme-color']");
      if (meta) meta.setAttribute("content", themeColor);
    };

    const applyTheme = () => {
      if (userPreferences.theme === "light") setBodyClassAndMeta(false);
      else if (userPreferences.theme === "dark") setBodyClassAndMeta(true);
      else setBodyClassAndMeta(isDarkPreferred());
    };

    applyTheme();

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => {
      if (userPreferences.theme === "system") setBodyClassAndMeta(e.matches);
    };

    if (userPreferences.theme === "system") {
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  }, [userPreferences.theme]);

  return null;
};

export default UserPreferenceProvider;
