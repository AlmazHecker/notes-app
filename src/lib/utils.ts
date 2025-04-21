import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useUserPreferences } from "@/shared/hooks/useUserPreferences";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getEscapedHtml = (html: string) => {
  return html.replace(/<[^>]*>/g, "").slice(0, 100);
};

export const formatDate = (timestamp: number): string => {
  const { dateFormat } = useUserPreferences.getState();

  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  switch (dateFormat) {
    case "DD/MM/YYYY":
      return `${day}/${month}/${year}`;
    case "DD.MM.YYYY":
      return `${day}.${month}.${year}`;
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
    case "MM/DD/YYYY":
    default:
      return `${month}/${day}/${year}`;
  }
};

export const formatSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};
