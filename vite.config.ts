import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // plugins: [react(), tailwindcss(), mkcert()],
  plugins: [react(), tailwindcss()],
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
  define: {
    __BASE_PATH__: JSON.stringify(mode === "gh-pages" ? "/notes-app/" : "/"),
  },
  base: mode === "gh-pages" ? "/notes-app/" : "/",
}));
