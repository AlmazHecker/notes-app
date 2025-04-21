import { useUserPreferences } from "@/shared/hooks/useUserPreferences";
import React, { useEffect } from "react";

const UserPreferenceProvider: React.FC = () => {
  const userPreferences = useUserPreferences();

  useEffect(() => {
    const scale = [0.75, 0.875, 1, 1.125, 1.25];
    document.documentElement.style.fontSize = `${scale[userPreferences.fontSize - 1]}rem`;

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

    if (userPreferences.theme === "system")
      media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [userPreferences.theme, userPreferences.fontSize]);

  return null;
};

export default UserPreferenceProvider;
