/**
 * Liens de l'application vers le site web.
 *
 * Le site est l'endroit où l'on choisit une formation complète (durée,
 * financement, organisme). L'application y renvoie avec le thème de la
 * question déjà sélectionné, pour que l'électricien arrive directement sur
 * les formations qui le concernent.
 *
 * Les paramètres `utm_*` permettent de compter, côté site, les visites qui
 * viennent de l'application — c'est l'indicateur de trafic du pilote.
 */
export const SITE_URL = "https://les-eclaireurs-two.vercel.app/";

export function lienFormations({ theme, recherche, origine = "app" } = {}) {
  const u = new URL(SITE_URL);
  u.searchParams.set("page", "formations");
  if (theme) u.searchParams.set("theme", theme);
  else if (recherche) u.searchParams.set("q", recherche);
  u.searchParams.set("utm_source", "app");
  u.searchParams.set("utm_medium", origine);
  return u.toString();
}
