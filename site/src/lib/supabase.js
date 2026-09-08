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

export function session() {
  try {
    const brut = localStorage.getItem(CLE_STOCKAGE)
    if (!brut) return null
    const s = JSON.parse(brut)
    if (s?.expires_at && s.expires_at * 1000 < Date.now()) return null
    return s
  } catch {
    return null
  }
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

function jeton() {
  return session()?.access_token || SUPABASE_CLE
}

/* ─────────── Données (PostgREST) ─────────── */

function entetes(extra = {}) {
  return {
    apikey: SUPABASE_CLE,
    Authorization: `Bearer ${jeton()}`,
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
  const reponse = await fetch(url, { headers: entetes() })
  if (!reponse.ok) {
    throw new Error(`${table} : ${reponse.status} ${await reponse.text()}`)
  }
  return reponse.json()
}

/** Écriture (insertion) dans une table. */
export async function pgInsert(table, lignes, { retour = true } = {}) {
  const reponse = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: entetes({
      'Content-Type': 'application/json',
      Prefer: retour ? 'return=representation' : 'return=minimal',
    }),
    body: JSON.stringify(lignes),
  })
  if (!reponse.ok) throw new Error(`${table} : ${reponse.status} ${await reponse.text()}`)
  return retour ? reponse.json() : null
}

/** Mise à jour ciblée : pgUpdate('profils', { id: 'eq.' + uid }, { metier: 'électricien' }) */
export async function pgUpdate(table, filtres, champs) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`)
  for (const [cle, valeur] of Object.entries(filtres)) url.searchParams.set(cle, valeur)
  const reponse = await fetch(url, {
    method: 'PATCH',
    headers: entetes({ 'Content-Type': 'application/json', Prefer: 'return=representation' }),
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
  const s = session()
  if (s?.access_token) {
    fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: entetes(),
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
