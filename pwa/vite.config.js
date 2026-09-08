import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    // Le service worker et le manifest sont servis tels quels depuis public/
    assetsDir: "assets",
  },
});
