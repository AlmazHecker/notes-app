import { isCyrillic } from "@/lib/utils";
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

    const setBodyClass = (isDark: boolean) => {
      document.body.classList.toggle("dark", isDark);
      document.body.classList.toggle("light", !isDark);
    };

    const applyTheme = () => {
      if (userPreferences.theme === "light") setBodyClass(false);
      else if (userPreferences.theme === "dark") setBodyClass(true);
      else setBodyClass(isDarkPreferred());
    };

    applyTheme();

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => {
      if (userPreferences.theme === "system") setBodyClass(e.matches);
    };

    if (userPreferences.theme === "system") {
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  }, [userPreferences.theme]);

  return null;
};

export default UserPreferenceProvider;
