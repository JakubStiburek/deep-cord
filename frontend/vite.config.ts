import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    hmr: {
      overlay: true, // Povolení HMR bez přerušení
    },
    proxy: {
      // Proxy API požadavků na /api k jinému serveru
      //   "/api": {
      //     target: "http://localhost:3000", // Backendový server
      //     changeOrigin: true, // Změní origin požadavku na backend
      //   },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
