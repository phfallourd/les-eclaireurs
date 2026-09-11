import { pg, SUPABASE_URL, SUPABASE_CLE } from './supabase'
import * as CATALOG from '../data/catalog.js'
import * as SECOURS from './secours'

/**
 * Couche de données du site.
 *
 * `D` est rempli une fois, avant le premier rendu (voir main.jsx), puis lu par
 * les composants exactement comme les anciennes constantes.
 *
 * Le catalogue vient de la fonction SQL `catalogue_json()`, qui renvoie le même
 * document que `data/catalog.js` — c'est la source unique partagée avec la PWA.
 * Si Supabase est injoignable, on retombe sur les fichiers locaux : une
 * démonstration ne doit jamais afficher une page vide.
 */
export const D = {
  catalogue: {
    SOURCES: CATALOG.SOURCES,
    THEMES: CATALOG.THEMES,
    FORMATS: CATALOG.FORMATS,
    REGIONS: CATALOG.REGIONS,
    COURSES: CATALOG.COURSES,
  },
  parcours: SECOURS.PARCOURS,
  financement: SECOURS.FINANCEMENT,
  events: SECOURS.EVENTS,
  forumCats: SECOURS.FORUM_CATS,
  forumPosts: SECOURS.FORUM_POSTS,
  origine: 'local',
}

const PARCOURS_ICON_BG = {
  '00': '#dcfce7',
  '01': '#dbeafe',
  '02': '#ede9fe',
  '03': '#ffedd5',
}

/** "Il y a 12 min" / "Il y a 2h" / "Il y a 3 j" */
export function tempsRelatif(iso) {
  if (!iso) return ''
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  if (minutes < 1) return "À l'instant"
  if (minutes < 60) return `Il y a ${minutes} min`
  const heures = Math.round(minutes / 60)
  if (heures < 24) return `Il y a ${heures}h`
  const jours = Math.round(heures / 24)
  if (jours < 31) return `Il y a ${jours} j`
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(iso))
}

/* ── Chargement ── */

/** Le catalogue complet en une seule requête, au format exact de data/catalog.js. */
async function chargerCatalogue() {
  const reponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/catalogue_json`, {
    headers: { apikey: SUPABASE_CLE, Authorization: `Bearer ${SUPABASE_CLE}` },
  })
  if (!reponse.ok) throw new Error(`catalogue : ${reponse.status}`)
  const doc = await reponse.json()
  if (!Array.isArray(doc.courses) || doc.courses.length === 0) {
    throw new Error('catalogue vide')
  }
  return {
    SOURCES: doc.sources,
    THEMES: doc.themes,
    FORMATS: doc.formats,
    REGIONS: doc.regions,
    COURSES: doc.courses,
  }
}

async function chargerParcours() {
  /* Les etapes viennent avec le parcours : un parcours sans etapes n'est qu'une
     promesse, et c'est exactement ce que le site affichait jusqu'ici. */
  const data = await pg('parcours', {
    select:
      'numero,titre,sous_titre,icone,couleur,couleur_fond,themes_abordes,resume_libelle,' +
      'parcours_etapes(ordre,titre,description,obligatoire,' +
      'formations(id,titre,duree_libelle,prix_eur,url_source,organisations(nom)))',
    statut: 'eq.publiee',
    numero: 'not.is.null',
    order: 'numero',
  })
  return (data ?? []).map((p) => ({
    num: p.numero,
    icon: p.icone,
    bg: p.couleur_fond,
    iconBg: PARCOURS_ICON_BG[p.numero] ?? '#e5e7eb',
    barColor: p.couleur,
    title: p.titre,
    sub: p.sous_titre,
    topics: p.themes_abordes ?? [],
    count: p.resume_libelle,
    etapes: (p.parcours_etapes ?? [])
      .slice()
      .sort((a, b) => a.ordre - b.ordre)
      .map((e) => ({
        ordre: e.ordre,
        titre: e.titre,
        description: e.description,
        obligatoire: e.obligatoire,
        // Une etape peut n'etre qu'un jalon : un prerequis qu'aucune formation
        // du catalogue ne couvre encore. On l'affiche comme tel.
        formation: e.formations
          ? {
              id: e.formations.id,
              titre: e.formations.titre,
              duree: e.formations.duree_libelle,
              prix: e.formations.prix_eur,
              url: e.formations.url_source,
              organisme: e.formations.organisations?.nom,
            }
          : null,
      })),
  }))
}

async function chargerFinancement() {
  const data = await pg('financements', {
    select: 'icone,titre,description,montant,ordre',
    order: 'ordre',
  })
  return (data ?? []).map((f) => ({
    icon: f.icone,
    title: f.titre,
    desc: f.description,
    amount: f.montant,
  }))
}

async function chargerEvenements() {
  const data = await pg('evenements', {
    select: '*',
    statut: 'eq.publiee',
    order: 'date_evenement',
  })
  return (data ?? []).map((e) => ({
    id: e.id,
    orga: e.organisateur,
    orga_type: e.organisateur_type,
    orga_color: e.organisateur_couleur,
    orga_icon: e.organisateur_icone,
    title: e.titre,
    desc: e.description,
    date: e.date_evenement,
    time: e.heure,
    duration: e.duree,
    format: e.format,
    lieu: e.lieu,
    places: e.places,
    places_dispo: e.places_dispo,
    themes: e.themes ?? [],
    type: e.type,
    gratuit: e.gratuit,
    prix: e.prix ?? undefined,
  }))
}

async function chargerForum() {
  const [cats, sujets] = await Promise.all([
    pg('forum_categories', { select: '*', order: 'ordre' }),
    pg('forum_sujets', {
      select:
        'id,titre,corps,tags,resolu,likes,created_at,auteur_nom,auteur_avatar,auteur_role,' +
        'forum_categories(code),' +
        'forum_reponses(id,corps,likes,meilleure_reponse,created_at,auteur_nom,auteur_avatar,auteur_role)',
      order: 'created_at.desc',
    }),
  ])

  const posts = (sujets ?? []).map((s) => ({
    id: s.id,
    cat: s.forum_categories?.code ?? 'all',
    author: s.auteur_nom,
    avatar: s.auteur_avatar,
    role: s.auteur_role,
    time: tempsRelatif(s.created_at),
    title: s.titre,
    body: s.corps,
    tags: s.tags ?? [],
    replies: (s.forum_reponses ?? []).length,
    likes: s.likes,
    solved: s.resolu,
    answers: (s.forum_reponses ?? [])
      .slice()
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .map((r) => ({
        author: r.auteur_nom,
        avatar: r.auteur_avatar,
        role: r.auteur_role,
        time: tempsRelatif(r.created_at),
        body: r.corps,
        likes: r.likes,
        best: r.meilleure_reponse,
      })),
  }))

  // "Dernière activité" calculée, plutôt qu'écrite en dur
  const dernier = (code) => {
    const duCat = posts.filter((p) => p.cat === code)
    return duCat.length ? duCat[0].time : '—'
  }

  const categories = [
    {
      id: 'all',
      icon: '💬',
      label: 'Tous les sujets',
      color: 'var(--blue)',
      bg: 'var(--blue-lt)',
      count: posts.length,
      last: posts.length ? posts[0].time : '—',
    },
    ...(cats ?? []).map((c) => ({
      id: c.code,
      icon: c.icone,
      label: c.libelle,
      color: c.couleur,
      bg: c.couleur_fond,
      count: c.compteur_affiche ?? posts.filter((p) => p.cat === c.code).length,
      last: dernier(c.code),
    })),
  ]

  return { categories, posts }
}

/**
 * Charge tout en parallèle. Ne rejette jamais.
 * Le catalogue et le reste échouent indépendamment : une panne sur le forum
 * ne prive pas le site de son catalogue à jour.
 */
export async function chargerDonnees() {
  const [catalogue, parcours, financement, events, forum] = await Promise.allSettled([
    chargerCatalogue(),
    chargerParcours(),
    chargerFinancement(),
    chargerEvenements(),
    chargerForum(),
  ])

  if (catalogue.status === 'fulfilled') {
    D.catalogue = catalogue.value
    D.origine = 'supabase'
  } else {
    console.warn('[Données] catalogue indisponible, version locale utilisée.', catalogue.reason)
  }

  if (parcours.status === 'fulfilled' && parcours.value.length) D.parcours = parcours.value
  if (financement.status === 'fulfilled' && financement.value.length) {
    D.financement = financement.value
  }
  if (events.status === 'fulfilled' && events.value.length) D.events = events.value
  if (forum.status === 'fulfilled' && forum.value.posts.length) {
    D.forumCats = forum.value.categories
    D.forumPosts = forum.value.posts
  }

  return D
}
