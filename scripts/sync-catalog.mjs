/**
 * Rafraîchit src/data/catalog-fallback.json depuis le catalogue publié.
 *
 * Ce fichier n'est qu'un filet de sécurité : il sert uniquement au tout
 * premier lancement de l'app sans réseau. En usage normal, la PWA lit le
 * catalogue en ligne. À relancer de temps en temps pour que le snapshot
 * embarqué ne dérive pas trop.
 *
 *   npm run sync-catalog
 */
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../src/data/catalog-fallback.json");

const URL_CATALOG =
  process.env.CATALOG_URL ||
  "https://les-eclaireurs-two.vercel.app/data/catalog.json";

const res = await fetch(URL_CATALOG);
if (!res.ok) {
  console.error(`Échec du téléchargement (${res.status}) : ${URL_CATALOG}`);
  process.exit(1);
}

const data = await res.json();
if (!Array.isArray(data.courses)) {
  console.error("Format inattendu : pas de tableau 'courses'.");
  process.exit(1);
}

writeFileSync(OUT, JSON.stringify(data, null, 2), "utf8");
console.log(`Snapshot mis à jour — ${data.courses.length} formations.`);
