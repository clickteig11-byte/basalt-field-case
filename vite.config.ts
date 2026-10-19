import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 7713,
    strictPort: true,
    host: true,
    open: false,
  },
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 1200,
  },
});
