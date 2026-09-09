/**
 * Accès à Supabase sans dépendance npm : l'API REST (PostgREST) et l'API Auth
 * sont appelées directement en fetch. Zéro paquet à installer, zéro poids
 * ajouté au bundle, et le même compte que l'application mobile.
 *
 * La clé publiable est publique par conception : la sécurité repose sur les
 * policies RLS de la base, pas sur le secret de la clé.
 */
export const SUPABASE_URL =
  import.meta.env?.VITE_SUPABASE_URL || 'https://eutjonpxqoxldrkhxjzt.supabase.co'
export const SUPABASE_CLE =
  import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_EJr8VnCNYyJGFFTwH81JlQ_-ithQD1C'

const CLE_STOCKAGE = 'eclaireurs-auth'

/* ─────────── Session ─────────── */

/** Session telle qu'elle est stockée, même périmée : c'est elle qui porte le
 *  jeton de rafraîchissement. */
function sessionStockee() {
  try {
    const brut = localStorage.getItem(CLE_STOCKAGE)
    return brut ? JSON.parse(brut) : null
  } catch {
    return null
  }
}

const perimee = (s, marge = 0) =>
  Boolean(s?.expires_at) && s.expires_at * 1000 - marge <= Date.now()

export function session() {
  const s = sessionStockee()
  if (!s || perimee(s)) return null
  return s
}

/**
 * Le jeton d'accès Supabase ne vit qu'une heure. Sans renouvellement, un
 * utilisateur se retrouve déconnecté au bout d'une heure sans avoir rien fait
 * et sans comprendre pourquoi. Le jeton de rafraîchissement, lui, est valable
 * bien plus longtemps : on l'échange contre un nouveau jeton d'accès dès que
 * l'ancien approche de sa fin.
 */
let renouvellementEnCours = null

function normaliser(d) {
  if (!d?.access_token) return null
  return {
    ...d,
    expires_at: d.expires_at ?? Math.floor(Date.now() / 1000) + (d.expires_in ?? 3600),
  }
}

export async function sessionValide() {
  const s = sessionStockee()
  if (!s) return null
  // Marge d'une minute : mieux vaut renouveler un peu tôt que d'essuyer un 401.
  if (!perimee(s, 60_000)) return s
  if (!s.refresh_token) {
    enregistrerSession(null)
    return null
  }
  if (!renouvellementEnCours) {
    renouvellementEnCours = (async () => {
      try {
        const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
          method: 'POST',
          headers: { apikey: SUPABASE_CLE, 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: s.refresh_token }),
        })
        if (!r.ok) {
          // Jeton révoqué ou expiré : il faut vraiment se reconnecter.
          enregistrerSession(null)
          return null
        }
        const nouvelle = normaliser(await r.json())
        enregistrerSession(nouvelle)
        return nouvelle
      } catch {
        // Panne réseau : on garde la session en place et on retentera plus tard
        // plutôt que de déconnecter quelqu'un parce que le wifi a sauté.
        return s
      } finally {
        renouvellementEnCours = null
      }
    })()
  }
  return renouvellementEnCours
}

function enregistrerSession(s) {
  try {
    if (s) localStorage.setItem(CLE_STOCKAGE, JSON.stringify(s))
    else localStorage.removeItem(CLE_STOCKAGE)
  } catch {
    /* stockage indisponible : la session ne survit pas au rechargement */
  }
  abonnes.forEach((fn) => fn(s))
}

const abonnes = new Set()
export function surChangementSession(fn) {
  abonnes.add(fn)
  return () => abonnes.delete(fn)
}

async function jeton() {
  const s = await sessionValide()
  return s?.access_token || SUPABASE_CLE
}

/* ─────────── Données (PostgREST) ─────────── */

async function entetes(extra = {}) {
  return {
    apikey: SUPABASE_CLE,
    Authorization: `Bearer ${await jeton()}`,
    Accept: 'application/json',
    ...extra,
  }
}

/**
 * Lecture d'une table.
 * pg('formations', { select: 'id,titre', statut: 'eq.publiee', order: 'titre' })
 */
export async function pg(table, params = {}) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`)
  for (const [cle, valeur] of Object.entries(params)) {
    if (valeur !== undefined && valeur !== null) url.searchParams.set(cle, valeur)
  }
  const reponse = await fetch(url, { headers: await entetes() })
  if (!reponse.ok) {
    throw new Error(`${table} : ${reponse.status} ${await reponse.text()}`)
  }
  return reponse.json()
}

/** Écriture (insertion) dans une table. */
export async function pgInsert(table, lignes, { retour = true, ignorerDoublons = false } = {}) {
  const prefer = [
    retour ? 'return=representation' : 'return=minimal',
    ignorerDoublons ? 'resolution=ignore-duplicates' : null,
  ]
    .filter(Boolean)
    .join(',')
  const reponse = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: await entetes({ 'Content-Type': 'application/json', Prefer: prefer }),
    body: JSON.stringify(lignes),
  })
  if (!reponse.ok) throw new Error(`${table} : ${reponse.status} ${await reponse.text()}`)
  return retour ? reponse.json() : null
}

/** Suppression ciblée : pgDelete('inscriptions', { formation_id: 'eq.' + id }) */
export async function pgDelete(table, filtres) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`)
  for (const [cle, valeur] of Object.entries(filtres)) url.searchParams.set(cle, valeur)
  const reponse = await fetch(url, { method: 'DELETE', headers: await entetes() })
  if (!reponse.ok) throw new Error(`${table} : ${reponse.status} ${await reponse.text()}`)
}

/** Mise à jour ciblée : pgUpdate('profils', { id: 'eq.' + uid }, { metier: 'électricien' }) */
export async function pgUpdate(table, filtres, champs) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`)
  for (const [cle, valeur] of Object.entries(filtres)) url.searchParams.set(cle, valeur)
  const reponse = await fetch(url, {
    method: 'PATCH',
    headers: await entetes({ 'Content-Type': 'application/json', Prefer: 'return=representation' }),
    body: JSON.stringify(champs),
  })
  if (!reponse.ok) throw new Error(`${table} : ${reponse.status} ${await reponse.text()}`)
  return reponse.json()
}

/* ─────────── Authentification ─────────── */

async function auth(chemin, corps) {
  const reponse = await fetch(`${SUPABASE_URL}/auth/v1/${chemin}`, {
    method: 'POST',
    headers: { apikey: SUPABASE_CLE, 'Content-Type': 'application/json' },
    body: JSON.stringify(corps),
  })
  const data = await reponse.json().catch(() => ({}))
  if (!reponse.ok) throw new Error(traduire(data.error_description || data.msg || data.message))
  return data
}

export async function inscription({ email, motDePasse, nomComplet, metier }) {
  const data = await auth('signup', {
    email,
    password: motDePasse,
    data: { nom_complet: nomComplet, metier, role: 'apprenant' },
  })
  if (data.access_token) enregistrerSession(data)
  return data
}

export async function connexion({ email, motDePasse }) {
  const data = await auth('token?grant_type=password', { email, password: motDePasse })
  enregistrerSession(data)
  return data
}

export async function motDePasseOublie(email) {
  return auth('recover', { email })
}

export function deconnexion() {
  const s = sessionStockee()
  if (s?.access_token) {
    fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_CLE,
        Authorization: `Bearer ${s.access_token}`,
      },
    }).catch(() => {})
  }
  enregistrerSession(null)
}

export function utilisateur() {
  return session()?.user ?? null
}

/** Profil applicatif (table profils), créé automatiquement à l'inscription. */
export async function monProfil() {
  const u = utilisateur()
  if (!u) return null
  const lignes = await pg('profils', { select: '*', id: `eq.${u.id}` })
  return lignes[0] ?? null
}

export async function majMonProfil(champs) {
  const u = utilisateur()
  if (!u) throw new Error('Non connecté')
  const lignes = await pgUpdate('profils', { id: `eq.${u.id}` }, champs)
  return lignes[0] ?? null
}

function traduire(message = '') {
  const m = String(message).toLowerCase()
  if (m.includes('invalid login')) return 'Adresse e-mail ou mot de passe incorrect.'
  if (m.includes('email not confirmed'))
    return "Adresse e-mail non confirmée : vérifiez votre boîte mail."
  if (m.includes('already registered') || m.includes('already exists'))
    return 'Un compte existe déjà pour cette adresse.'
  if (m.includes('password')) return 'Mot de passe trop court (6 caractères minimum).'
  if (m.includes('rate limit') || m.includes('too many'))
    return 'Trop de tentatives. Réessayez dans quelques minutes.'
  return message || 'Une erreur est survenue.'
}

/* ─────────── Entretien de la session ───────────
 *
 * Au chargement, puis chaque fois que l'onglet redevient visible : un
 * ordinateur mis en veille pendant deux heures retrouve sa session au réveil
 * au lieu de renvoyer vers l'écran de connexion.
 */
if (typeof window !== 'undefined') {
  sessionValide().catch(() => {})
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) sessionValide().catch(() => {})
  })
}
