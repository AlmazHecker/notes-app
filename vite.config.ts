import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { dynamicManifestPlugin } from "./vite-plugins/dynamicManifest";
import { getAppManifest } from "./pwa/manifest";

export default defineConfig(({ mode }) => {
  const BASE = mode === "gh-pages" ? "/notes-app/" : "/";

  return {
    plugins: [
      react(),
      tailwindcss(),
      dynamicManifestPlugin(getAppManifest(BASE), "manifest.json"),
    ],

    server: { port: 3000 },
    build: {
      outDir: "dist",
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: "./index.html",
          sw: "./pwa/service-worker.ts",
        },
        output: {
          entryFileNames(chunkInfo) {
            if (chunkInfo.name === "sw") return "sw.js";
            return "[hash].js";
          },
        },
      },
    },
    base: BASE,
    resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
    define: { __BUILD_TIMESTAMP__: `"${new Date().toISOString()}"` },
  };
});
