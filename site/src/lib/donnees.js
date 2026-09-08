import { pg } from './supabase'
import * as SECOURS from './secours'

/**
 * Couche de données du site.
 *
 * `D` est rempli une fois, avant le premier rendu (voir main.jsx), puis lu
 * par les composants exactement comme les anciennes constantes.
 * Si Supabase est injoignable, on retombe sur les données de secours :
 * une démonstration ne doit jamais afficher une page vide.
 */
export const D = {
  sources: SECOURS.SOURCES,
  themes: SECOURS.THEMES,
  formats: SECOURS.FORMATS,
  regions: SECOURS.REGIONS,
  courses: SECOURS.COURSES,
  parcours: SECOURS.PARCOURS,
  financement: SECOURS.FINANCEMENT,
  events: SECOURS.EVENTS,
  forumCats: SECOURS.FORUM_CATS,
  forumPosts: SECOURS.FORUM_POSTS,
  origine: 'secours',
}

/* ── Correspondances de présentation ── */

const NIVEAU_STYLE = {
  debutant: { lvlBg: 'var(--green-lt)', lvlColor: 'var(--green)' },
  intermediaire: { lvlBg: 'var(--blue-lt)', lvlColor: 'var(--blue)' },
  avance: { lvlBg: 'var(--orange-lt)', lvlColor: 'var(--orange)' },
  expert: { lvlBg: 'var(--violet-lt)', lvlColor: 'var(--violet)' },
}

const NIVEAU_LIBELLE = {
  debutant: 'Niv. 1',
  intermediaire: 'Niv. 2',
  avance: 'Niv. 3',
  expert: 'Niv. 4',
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

async function chargerCatalogue() {
  const data = await pg('formations', {
    select:
      'id,titre,resume,emoji,couleur_fond,niveau,niveau_libelle,duree_libelle,format,badges,' +
      'objectifs,certifiante,eligible_cpf,prix_eur,url_source,' +
      'organisations(slug,nom,couleur),formation_themes(themes(libelle)),' +
      'formation_regions(region_code)',
    statut: 'eq.publiee',
    emoji: 'not.is.null',
  })

  return (data ?? []).map((f) => {
    const style = NIVEAU_STYLE[f.niveau] ?? NIVEAU_STYLE.debutant
    return {
      id: f.id,
      source: f.organisations?.slug ?? '',
      sourceLabel: f.organisations?.nom ?? '',
      sourceColor: f.organisations?.couleur ?? '#64748b',
      emoji: f.emoji,
      thumbBg: f.couleur_fond,
      title: f.titre,
      desc: f.resume,
      level: f.niveau_libelle ?? NIVEAU_LIBELLE[f.niveau],
      lvlBg: style.lvlBg,
      lvlColor: style.lvlColor,
      duration: f.duree_libelle,
      format: f.format,
      badges: f.badges ?? [],
      themes: (f.formation_themes ?? []).map((t) => t.themes?.libelle).filter(Boolean),
      regions: (f.formation_regions ?? []).map((r) => r.region_code),
      objectives: f.objectifs ?? [],
    }
  })
}

async function chargerReferentiels() {
  const [sources, themes, regions, financements] = await Promise.all([
    pg('organisations', {
      select: 'slug,nom,couleur',
      type: 'in.(fabricant,institution)',
      order: 'nom',
    }),
    pg('themes', { select: 'libelle,ordre', order: 'ordre' }),
    pg('regions_fr', { select: 'code,libelle,icone,ordre', order: 'ordre' }),
    pg('financements', { select: 'icone,titre,description,montant,ordre', order: 'ordre' }),
  ])

  return {
    sources: [
      { id: 'all', label: 'Toutes' },
      ...sources.map((o) => ({ id: o.slug, label: o.nom, color: o.couleur })),
    ],
    themes: ['Tous', ...themes.map((t) => t.libelle)],
    regions: regions.map((r) => ({ id: r.code, label: r.libelle, ico: r.icone })),
    financement: financements.map((f) => ({
      icon: f.icone,
      title: f.titre,
      desc: f.description,
      amount: f.montant,
    })),
  }
}

async function chargerParcours() {
  const data = await pg('parcours', {
    select: 'numero,titre,sous_titre,icone,couleur,couleur_fond,themes_abordes,resume_libelle',
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

/** Charge tout en parallèle. Ne rejette jamais : bascule sur les données de secours. */
export async function chargerDonnees() {
  try {
    const [catalogue, referentiels, parcours, events, forum] = await Promise.all([
      chargerCatalogue(),
      chargerReferentiels(),
      chargerParcours(),
      chargerEvenements(),
      chargerForum(),
    ])

    if (!catalogue.length) throw new Error('catalogue vide')

    D.courses = catalogue
    D.sources = referentiels.sources
    D.themes = referentiels.themes
    D.regions = referentiels.regions
    D.financement = referentiels.financement
    D.parcours = parcours
    D.events = events
    D.forumCats = forum.categories
    D.forumPosts = forum.posts
    D.origine = 'supabase'
  } catch (e) {
    console.warn('[Données] Supabase injoignable, bascule sur les données locales.', e)
    D.origine = 'secours'
  }
  return D
}
