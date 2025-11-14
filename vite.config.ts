import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { dynamicManifestPlugin } from "./vite-plugins/dynamicManifest";

export default defineConfig(({ mode }) => {
  const BASE = mode === "gh-pages" ? "/notes-app/" : "/";

  const manifest = {
    name: "Notes App",
    short_name: "Notes App",
    description: "Idk",
    theme_color: "#ffffff",
    start_url: BASE,
    id: BASE,
    display: "standalone",
    icons: [
      {
        src: `${BASE}android-chrome-144.png`,
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: `${BASE}android-chrome-192.png`,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: `${BASE}android-chrome-512.png`,
        sizes: "512x512",
        type: "image/png",
      },
    ],

    screenshots: [
      {
        src: `${BASE}screenshot1.png`,
        sizes: "1185x945",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: `${BASE}screenshot2.png`,
        sizes: "458x945",
        type: "image/png",
        form_factor: "narrow",
      },
    ],

    file_handlers: [
      {
        action: BASE,
        accept: { "application/json": [".azych"] },
        icons: [
          {
            src: `${BASE}android-chrome-192.png`,
            sizes: "192x192",
            type: "image/png",
          },
        ],
        launch_type: "single-client",
      },
    ],
  };

  return {
    plugins: [
      react(),
      tailwindcss(),
      dynamicManifestPlugin(manifest, "manifest.json"),
    ],

    server: { port: 3000 },
    build: { outDir: "dist", emptyOutDir: true },
    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") },
    },
    base: BASE,
  };
});
