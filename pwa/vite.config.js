import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    // Horodatage du build : joint à chaque retour de testeur, pour savoir
    // sur quelle version il est tombé sur le problème.
    __VERSION__: JSON.stringify(new Date().toISOString().slice(0, 16).replace("T", " ")),
  },
  build: {
    outDir: "dist",
    // Le service worker et le manifest sont servis tels quels depuis public/
    assetsDir: "assets",
  },
});
