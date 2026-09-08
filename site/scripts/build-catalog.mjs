/**
 * Génère public/data/catalog.json à partir de src/data/catalog.js.
 *
 * Ce JSON est publié statiquement et consommé au runtime par la PWA mobile
 * (repo les-eclaireurs-pwa). Objectif : une seule source de vérité pour le
 * catalogue — on ajoute une formation dans src/data/catalog.js, et les deux
 * applications la voient.
 *
 * Lancé automatiquement avant chaque build (script "prebuild" du package.json).
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const { SOURCES, THEMES, FORMATS, REGIONS, COURSES } = await import(
  resolve(root, "src/data/catalog.js")
);

const payload = {
  // Permet à la PWA de savoir si son cache est périmé.
  generatedAt: new Date().toISOString(),
  version: 1,
  sources: SOURCES,
  themes: THEMES,
  formats: FORMATS,
  regions: REGIONS,
  courses: COURSES,
};

const outDir = resolve(root, "public/data");
mkdirSync(outDir, { recursive: true });
writeFileSync(
  resolve(outDir, "catalog.json"),
  JSON.stringify(payload, null, 2),
  "utf8"
);

console.log(
  `catalog.json généré — ${COURSES.length} formations, ${SOURCES.length - 1} sources.`
);
