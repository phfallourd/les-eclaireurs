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

const SUPABASE_URL =
  process.env.SUPABASE_URL || "https://eutjonpxqoxldrkhxjzt.supabase.co";
const SUPABASE_CLE =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_EJr8VnCNYyJGFFTwH81JlQ_-ithQD1C";

// Le catalogue est servi par la base : source unique partagée avec le site.
const URL_CATALOG =
  process.env.CATALOG_URL || SUPABASE_URL + "/rest/v1/rpc/catalogue_json";

const res = await fetch(URL_CATALOG, {
  headers: { apikey: SUPABASE_CLE, Authorization: "Bearer " + SUPABASE_CLE },
});
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
