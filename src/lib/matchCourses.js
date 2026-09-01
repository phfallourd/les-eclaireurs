/**
 * Mise en correspondance d'une question de terrain avec le catalogue.
 *
 * Ce n'est pas un modèle de langage : c'est un moteur lexical avec expansion
 * de synonymes métier. Il tourne dans le téléphone, sans réseau ni clé d'API,
 * et sert de socle quand l'assistant conversationnel n'est pas activé.
 *
 * Le vocabulaire ci-dessous vient du langage réel des chantiers : un
 * électricien tape « borne 22 kW copro », pas « infrastructure de recharge
 * pour véhicules électriques en habitat collectif ».
 */

const SYNONYMS = {
  irve: ["irve", "borne", "bornes", "recharge", "charge", "véhicule", "vehicule",
         "électrique", "electrique", "voiture", "wallbox", "evlink", "witty",
         "green'up", "greenup", "ve", "vé"],
  pac: ["pac", "pompe", "chaleur", "thermodynamique", "aérothermie", "aerothermie",
        "géothermie", "geothermie", "air/eau", "air-eau", "air/air", "air-air",
        "qualipac", "ecodan", "clim", "climatisation", "chauffage"],
  domotique: ["domotique", "wiser", "connecté", "connecte", "smart", "céliane",
              "celiane", "netatmo", "knx", "domovea", "volet", "éclairage",
              "eclairage", "thermostat", "scénario", "scenario"],
  tgbt: ["tgbt", "tableau", "powertag", "smartlink", "disjoncteur", "protection",
         "différentiel", "differentiel", "unifilaire", "schéma", "schema"],
  solaire: ["solaire", "photovoltaïque", "photovoltaique", "pv", "panneau",
            "onduleur", "autoconsommation"],
  gtb: ["gtb", "gtc", "supervision", "desigo", "bacnet", "modbus", "bâtiment",
        "batiment", "automate"],
  energie: ["énergie", "energie", "consommation", "efficacité", "efficacite",
            "monitoring", "compteur", "pme", "délestage", "delestage"],
};

/** Thème du catalogue correspondant à chaque famille de vocabulaire. */
const DOMAIN_TO_THEME = {
  irve: "IRVE",
  pac: "PAC / Pompes à chaleur",
  domotique: "Domotique / Wiser",
  tgbt: "TGBT Intelligent",
  solaire: "Solaire PV",
  gtb: "GTB / GTC",
  energie: "Efficacité énergie",
};

const STOPWORDS = new Set([
  "je", "j'ai", "jai", "tu", "il", "on", "un", "une", "des", "le", "la", "les",
  "de", "du", "au", "aux", "et", "ou", "à", "a", "en", "pour", "sur", "dans",
  "avec", "sans", "comment", "faire", "est", "ce", "que", "qui", "quoi", "mon",
  "ma", "mes", "cette", "ces", "d'un", "d'une", "sont", "pas", "plus", "chez",
  "installer", "installation", "poser", "besoin", "aide", "aidez", "moi",
]);

function normalize(text) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // retire les accents
    .replace(/[^a-z0-9àâçéèêëîïôûùüÿñæœ'\s-]/g, " ");
}

function tokenize(text) {
  return normalize(text)
    .split(/[\s-]+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

/**
 * Un token correspond-il à un mot du vocabulaire métier ?
 *
 * La comparaison est volontairement stricte. Une correspondance par
 * sous-chaîne libre produisait des contresens : « relève » contient « ve »
 * (IRVE), « rge » est contenu dans « recharge » — si bien qu'une question sur
 * une pompe à chaleur renvoyait des bornes de recharge.
 */
function tokenMatches(token, word) {
  if (token === word) return true;
  // Les mots très courts (ve, pv, pac) ne matchent qu'à l'identique.
  if (word.length <= 3 || token.length < 4) return false;
  // Sinon, tolérance au pluriel et aux déclinaisons, par préfixe uniquement.
  return word.startsWith(token) || token.startsWith(word);
}

/** Détecte les domaines métier évoqués par la question. */
export function detectDomains(query) {
  const tokens = tokenize(query);
  const hits = {};

  for (const [domain, words] of Object.entries(SYNONYMS)) {
    const normalized = words.map(normalize);
    let score = 0;
    for (const token of tokens) {
      if (normalized.some((w) => tokenMatches(token, w))) score += 1;
    }
    if (score > 0) hits[domain] = score;
  }

  return Object.entries(hits)
    .sort((a, b) => b[1] - a[1])
    .map(([domain]) => domain);
}

/** Score un cours face à la question. Plus le score est haut, plus c'est pertinent. */
function scoreCourse(course, tokens, domains) {
  let score = 0;

  // On compare mot à mot, jamais en sous-chaîne libre : sinon « rge » se
  // retrouve dans « Hager Charge » et une question sur la certification RGE
  // remonte un tutoriel de borne de recharge.
  const fields = [
    { tokens: tokenize(course.title), weight: 5 },
    { tokens: tokenize(course.sourceLabel), weight: 4 },
    { tokens: tokenize((course.objectives || []).join(" ")), weight: 2 },
    { tokens: tokenize(course.desc), weight: 1 },
  ];

  for (const token of tokens) {
    for (const field of fields) {
      if (field.tokens.some((w) => tokenMatches(token, w))) {
        score += field.weight;
        break; // un même mot ne compte qu'une fois par champ le plus fort
      }
    }
  }

  // Correspondance thématique : capture les cas où l'électricien emploie un
  // mot du métier qui n'apparaît nulle part tel quel dans la fiche.
  const themes = course.themes || [];
  domains.forEach((domain, index) => {
    const theme = DOMAIN_TO_THEME[domain];
    if (theme && themes.includes(theme)) {
      score += index === 0 ? 8 : 4; // le domaine dominant compte double
    }
  });

  // Un résultat hors du domaine dominant n'a pas sa place : c'est ce qui
  // faisait remonter des bornes de recharge sur une question pompe à chaleur.
  if (domains.length > 0) {
    const mainTheme = DOMAIN_TO_THEME[domains[0]];
    if (mainTheme && !themes.includes(mainTheme)) score -= 6;
  }

  // À pertinence égale, une fiche menant réellement quelque part vaut mieux.
  if (score > 0 && course.url) score += 1;

  return score;
}

/**
 * Retourne les formations pertinentes, séparées en deux usages :
 *  - `videos`   : à regarder tout de suite, sur le chantier
 *  - `training` : à programmer, souvent qualifiantes
 *
 * Mieux vaut ne rien proposer que proposer à côté : un électricien à qui l'on
 * répond « borne de recharge » alors qu'il pose une pompe à chaleur cesse de
 * faire confiance à l'outil. D'où le seuil de pertinence ci-dessous.
 */
const MIN_SCORE = 5; // en dessous : simple écho de vocabulaire, pas un vrai lien

export function matchCourses(query, courses) {
  const tokens = tokenize(query);
  const domains = detectDomains(query);

  if (tokens.length === 0) {
    return { videos: [], training: [], domains: [], hasMatch: false };
  }

  const scored = courses
    .map((course) => ({ course, score: scoreCourse(course, tokens, domains) }))
    .filter((entry) => entry.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score);

  const isShort = (c) => ["Vidéo", "Micro-learning"].includes(c.format);

  return {
    videos: scored.filter((e) => isShort(e.course)).slice(0, 3).map((e) => e.course),
    training: scored.filter((e) => !isShort(e.course)).slice(0, 3).map((e) => e.course),
    domains,
    hasMatch: scored.length > 0,
  };
}

/** Libellé lisible d'un domaine, pour expliquer ce qui a été compris. */
export const DOMAIN_LABELS = {
  irve: "borne de recharge",
  pac: "pompe à chaleur",
  domotique: "domotique",
  tgbt: "tableau électrique",
  solaire: "photovoltaïque",
  gtb: "GTB / supervision",
  energie: "efficacité énergétique",
};
