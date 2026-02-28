import { Laptop, Moon, Sun, Zap } from "lucide-react";
import React from "react";

export interface ThemeDefinition {
  id: string;
  label: string;
  icon: React.ReactNode;
  bg: string;
}

export const THEMES: ThemeDefinition[] = [
  {
    id: "system",
    label: "System",
    icon: <Laptop size={24} className="text-blue-500" />,
    bg: "bg-gradient-to-r from-white to-gray-900",
  },
  {
    id: "light",
    label: "Light",
    icon: <Sun size={24} className="text-yellow-500" />,
    bg: "bg-white",
  },
  {
    id: "dark",
    label: "Dark",
    icon: <Moon size={24} className="text-gray-400" />,
    bg: "bg-gray-900",
  },
  {
    id: "forest",
    label: "Forest",
    icon: <Sun size={24} className="text-green-600" />,
    bg: "bg-green-100",
  },
  {
    id: "cyberpunk",
    label: "Cyberpunk",
    icon: <Zap size={24} className="text-fuchsia-500" />,
    bg: "bg-fuchsia-950",
  },
];

export type ThemeId = (typeof THEMES)[number]["id"];
