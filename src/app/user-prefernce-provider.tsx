import { isCyrillic } from "@/shared/lib/utils";
import {
  type Theme,
  useUserPreferences,
} from "@/shared/hooks/use-user-preferences";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { THEMES } from "@/shared/model/theme/themes";
import { THEME_VARIABLE_KEYS } from "@/shared/model/theme/theme";

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

    const applyTheme = (theme: Theme) => {
      document.body.classList.remove(...THEMES.map((t) => t.id));

      const effectiveThemeId =
        theme === "system" ? (isDarkPreferred() ? "dark" : "light") : theme;

      document.body.classList.add(effectiveThemeId);

      const themeDef = THEMES.find((t) => t.id === effectiveThemeId);

      THEME_VARIABLE_KEYS.forEach((v) =>
        document.documentElement.style.removeProperty(v),
      );

      if (themeDef?.variables) {
        Object.entries(themeDef.variables).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        });
      }

      // smooth syncing
      requestAnimationFrame(() => {
        const bgColor = getComputedStyle(document.body).backgroundColor;
        const meta = document.querySelector("meta[name='theme-color']");
        if (meta && bgColor) {
          meta.setAttribute("content", bgColor);
        }
      });
    };

    applyTheme(userPreferences.theme);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      if (userPreferences.theme === "system") applyTheme("system");
    };

    if (userPreferences.theme === "system") {
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  }, [userPreferences.theme]);

  return null;
};

export default UserPreferenceProvider;
