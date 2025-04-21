import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Laptop, Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/shared/hooks/useTheme";

type AppearanceSettingsProps = {};

const AppearanceSettings: React.FC<AppearanceSettingsProps> = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Appearance</h1>

      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Customize how the application looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Mode</h3>
            <div className="grid grid-cols-3 gap-4">
              {THEMES.map(({ label, value, icon, bg }) => (
                <div
                  key={value}
                  className={`relative cursor-pointer rounded-lg border-2 ${
                    theme === value
                      ? "border-blue-500"
                      : "border-gray-200 dark:border-gray-800"
                  } p-4 flex flex-col items-center`}
                  onClick={() => setTheme(value as typeof theme)}
                >
                  <div
                    className={`h-24 w-full rounded-md ${bg} border border-gray-200 mb-2 flex items-center justify-center`}
                  >
                    {icon}
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                  {theme === value && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Font Size</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-sm">A</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  defaultValue="3"
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
