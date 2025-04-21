import { useThemeStore } from "@/shared/hooks/useTheme";
import React, { useEffect } from "react";

const ThemeProvider: React.FC = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    const isDarkPreferred = () =>
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const setBodyClass = (isDark: boolean) => {
      document.body.classList.toggle("dark", isDark);
      document.body.classList.toggle("light", !isDark);
    };

    const applyTheme = () => {
      if (theme === "light") setBodyClass(false);
      else if (theme === "dark") setBodyClass(true);
      else setBodyClass(isDarkPreferred());
    };

    applyTheme();

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => {
      if (theme === "system") setBodyClass(e.matches);
    };

    if (theme === "system") media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme]);

  return null;
};

export default ThemeProvider;
