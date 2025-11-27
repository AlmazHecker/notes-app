import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { ArrowLeft, Laptop, Moon, Sun } from "lucide-react";
import {
  FontSizeLevel,
  Theme,
  useUserPreferences,
} from "@/shared/hooks/useUserPreferences";
import React from "react";
import { Link } from "@/shared/ui/link";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";

type AppearanceSettingsProps = {};

const AppearanceSettings: React.FC<AppearanceSettingsProps> = () => {
  const userPreferences = useUserPreferences();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <Link to="/" size="icon" variant="outline">
          <ArrowLeft />
        </Link>
        <h1 className="text-2xl font-bold">{t("settings.appearance.title")}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.appearance.theme")}</CardTitle>
          <CardDescription>
            {t("settings.appearance.themeDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Theme Mode */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {t("settings.appearance.mode")}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {getThemes(t).map(({ label, value, icon, bg }) => (
                <div
                  key={value}
                  className={`relative cursor-pointer rounded-lg border-2 ${
                    userPreferences.theme === value
                      ? "border-blue-500"
                      : "border-gray-200 dark:border-gray-800"
                  } p-4 flex flex-col items-center`}
                  onClick={() => userPreferences.setTheme(value as Theme)}
                >
                  <div
                    className={`aspect-square w-4/5 rounded-md border border-gray-200 mb-2 flex items-center justify-center ${bg}`}
                  >
                    {icon}
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                  {userPreferences.theme === value && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {t("settings.appearance.fontSize")}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-sm">A</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={userPreferences.fontSize}
                  onChange={(e) =>
                    userPreferences.setFontSize(
                      Number(e.target.value) as FontSizeLevel
                    )
                  }
                  className="mx-4 w-full"
                />
                <span className="text-lg">A</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("settings.appearance.fontSizeDescription")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearanceSettings;

const getThemes = (t: TFunction) => {
  return [
    {
      label: t("settings.appearance.modes.light"),
      value: "light",
      icon: <Sun size={24} className="text-yellow-500" />,
      bg: "bg-white",
    },
    {
      label: t("settings.appearance.modes.dark"),
      value: "dark",
      icon: <Moon size={24} className="text-gray-400" />,
      bg: "bg-gray-900",
    },
    {
      label: t("settings.appearance.modes.system"),
      value: "system",
      icon: <Laptop size={24} className="text-blue-500" />,
      bg: "bg-gradient-to-r from-white to-gray-900",
    },
  ];
};
