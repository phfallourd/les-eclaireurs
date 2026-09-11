/**
 * Régénère les données de secours du catalogue depuis Supabase.
 *
 * Pourquoi. `src/data/catalog.js` est le filet : si Supabase est injoignable,
 * c'est lui que le site affiche. Tenu à la main, il dérive — le 11/09/2026 il
 * annonçait encore « éligible CPF » sur des formations dont l'éligibilité
 * n'était pas établie, alors que la base avait été corrigée. Un secours qui
 * ment est pire qu'une page vide.
 *
 * Ce script fait donc de ce fichier un artefact de build : la base est la seule
 * source, le fichier n'en est qu'un instantané.
 *
 * Si l'appel échoue (réseau coupé, projet en pause), on n'écrase rien et on
 * n'échoue pas le build : l'instantané précédent reste en place, et le message
 * le dit clairement.
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const racine = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const URL_BASE = process.env.VITE_SUPABASE_URL || 'https://eutjonpxqoxldrkhxjzt.supabase.co'
const CLE = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_EJr8VnCNYyJGFFTwH81JlQ_-ithQD1C'

let doc
try {
  const r = await fetch(`${URL_BASE}/rest/v1/rpc/catalogue_json`, {
    headers: { apikey: CLE, Authorization: `Bearer ${CLE}` },
  })
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`)
  doc = await r.json()
  if (!Array.isArray(doc.courses) || doc.courses.length === 0) throw new Error('catalogue vide')
} catch (e) {
  console.warn(`[catalogue] Supabase injoignable (${e.message}) — l'instantané précédent est conservé.`)
  process.exit(0)
}

const js = `/* ─────────────────────────────────────────────────────────────
   CATALOGUE — INSTANTANÉ DE SECOURS, NE PAS ÉDITER À LA MAIN
   Généré par scripts/sync-catalog.mjs depuis Supabase.
   Source de vérité : la table public.formations, modifiable par
   l'écran /admin-catalogue.html.
   Ce fichier ne sert que si Supabase est injoignable au chargement.
   Généré le ${doc.generatedAt}
   ───────────────────────────────────────────────────────────── */

export const SOURCES=${JSON.stringify(doc.sources)};
export const THEMES=${JSON.stringify(doc.themes)};
export const FORMATS=${JSON.stringify(doc.formats)};
export const REGIONS=${JSON.stringify(doc.regions)};
export const COURSES=${JSON.stringify(doc.courses, null, 1)};
`

writeFileSync(resolve(racine, 'src/data/catalog.js'), js, 'utf8')
mkdirSync(resolve(racine, 'public/data'), { recursive: true })
writeFileSync(resolve(racine, 'public/data/catalog.json'), JSON.stringify(doc, null, 1), 'utf8')

console.log(`[catalogue] instantané régénéré : ${doc.courses.length} formations, ${doc.sources.length - 1} organismes.`)
