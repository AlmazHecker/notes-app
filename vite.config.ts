import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({ registerType: "autoUpdate", manifest }),
  ],
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: mode === "gh-pages" ? "/notes-app/" : "/",
}));

const manifest = {
  name: "Notes App",
  short_name: "Notes App",
  description: "Idk",
  // theme_color: "#ffffff",
  icons: [
    {
      src: "/android-chrome-192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "/android-chrome-192.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
};
