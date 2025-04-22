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

type AppearanceSettingsProps = {};

const AppearanceSettings: React.FC<AppearanceSettingsProps> = () => {
  const userPreferences = useUserPreferences();
  const { t } = useTranslation();

  // useEffect(() => {
  //   // Base font size: 1rem = 16px
  //   // We'll go from 0.75rem (12px) to 1.25rem (20px) using this logic
  //   const scale = [0.75, 0.875, 1, 1.125, 1.25];
  //   document.documentElement.style.fontSize = `${scale[fontSize - 1]}rem`;
  // }, [userPreferences.fontSize]);

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
          <CardTitle>Theme</CardTitle>
          <CardDescription>Customize how the application looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Theme Mode */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Mode</h3>
            <div className="grid grid-cols-3 gap-4">
              {THEMES.map(({ label, value, icon, bg }) => (
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
                    className={`h-24 w-full rounded-md ${bg} border border-gray-200 mb-2 flex items-center justify-center`}
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
            <h3 className="text-lg font-medium">Font Size</h3>
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
                Adjust the font size used throughout the application
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearanceSettings;

const THEMES = [
  {
    label: "Light",
    value: "light",
    icon: <Sun size={24} className="text-yellow-500" />,
    bg: "bg-white",
  },
  {
    label: "Dark",
    value: "dark",
    icon: <Moon size={24} className="text-gray-400" />,
    bg: "bg-gray-900",
  },
  {
    label: "System",
    value: "system",
    icon: <Laptop size={24} className="text-blue-500" />,
    bg: "bg-gradient-to-r from-white to-gray-900",
  },
];
