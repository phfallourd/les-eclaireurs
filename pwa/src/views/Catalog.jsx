import { useMemo, useState } from "react";
import { useCatalog } from "../data/useCatalog";
import CourseSheet from "../components/CourseSheet";
import Lecteur, { idYouTube } from "../components/Lecteur";
import BackRow from "../components/BackRow";

const BRAND_COLORS = {
  schneider: "#3db83d",
  legrand: "#e05a0c",
  hager: "#c8000a",
  siemens: "#009999",
  rexel: "#0046ad",
  atlantic: "#0284c7",
  mitsubishielectric: "#e60027",
  daikin: "#005cab",
  enedis: "#0072bc",
};

const SHORT_FORMATS = ["Vidéo", "Micro-learning"];
const isShort = (c) => SHORT_FORMATS.includes(c.format);

/**
 * Durée en minutes, extraite d'un libellé libre : « ~6 min », « 1h30 », « 2h ».
 * Renvoie l'infini quand rien n'est lisible, pour que ces contenus se rangent
 * en fin de liste plutôt que d'être présentés comme les plus courts.
 */
function minutes(libelle = "") {
  const s = String(libelle).toLowerCase();
  const h = s.match(/(\d+)\s*h\s*(\d+)?/);
  if (h) return Number(h[1]) * 60 + Number(h[2] || 0);
  const m = s.match(/(\d+)\s*min/);
  if (m) return Number(m[1]);
  return Infinity;
}

/* Ce qu'un électricien cherche sur un chantier vient en premier : le conseil
   d'appoint, puis la vidéo qu'on regarde pendant une pause, puis le contenu
   qu'on garde pour le soir (remarque 13). */
const PALIERS = [
  { max: 3, titre: "Le conseil en moins de 3 minutes" },
  { max: 10, titre: "Moins de 10 minutes" },
  { max: Infinity, titre: "Pour aller plus loin" },
];

function grouperParDuree(liste) {
  const tri = [...liste].sort((a, b) => minutes(a.duration) - minutes(b.duration));
  return PALIERS.map((p, i) => ({
    titre: p.titre,
    items: tri.filter((c) => {
      const m = minutes(c.duration);
      const plancher = i === 0 ? -1 : PALIERS[i - 1].max;
      return m > plancher && m <= p.max;
    }),
  })).filter((g) => g.items.length);
}

/**
 * Une vidéo disposant d'un lien s'ouvre directement, sans fiche intermédiaire :
 * sur un chantier, c'est un clic de trop. Les formations longues gardent leur
 * fiche, où durée, niveau et prérequis comptent avant de s'engager.
 */
const isDirect = (c) => isShort(c) && Boolean(c.url) && !idYouTube(c.url);

/** Rend la carte cliquable en lien ou en bouton selon la destination. */
function CardWrapper({ course, onOpen, children }) {
  if (isDirect(course)) {
    return (
      <a
        className="tuto-card"
        href={course.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }
  return (
    <div className="tuto-card" onClick={onOpen}>
      {children}
    </div>
  );
}

/** Pastilles courtes : les libellés complets débordent sur un écran de téléphone. */
function shortTheme(theme) {
  const map = {
    "PAC / Pompes à chaleur": "PAC",
    "Domotique / Wiser": "Domotique",
    "TGBT Intelligent": "TGBT",
    "GTB / GTC": "GTB",
    "Solaire PV": "Solaire",
    "Efficacité énergie": "Énergie",
    "PME Supervision": "Supervision",
    "IoT / Réseau": "IoT",
  };
  return map[theme] || theme;
}

/**
 * @param {"videos"|"training"} initialMode  Vue d'entrée selon la tuile cliquée.
 */
export default function Catalog({ onBack, go, initialMode = "videos" }) {
  const { courses, themes, status, generatedAt } = useCatalog();
  const [mode, setMode] = useState(initialMode);
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("Tous");
  const [selected, setSelected] = useState(null);
  const [video, setVideo] = useState(null);

  const pool = useMemo(
    () => courses.filter((c) => (mode === "videos" ? isShort(c) : !isShort(c))),
    [courses, mode]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pool.filter((c) => {
      if (theme !== "Tous" && !(c.themes || []).includes(theme)) return false;
      if (!q) return true;
      return [
        c.title,
        c.desc,
        c.sourceLabel,
        c.format,
        c.level,
        ...(c.themes || []),
        ...(c.objectives || []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [pool, query, theme]);

  // Un thème sans contenu dans le mode courant ne doit pas être proposé :
  // cliquer dessus ne renverrait rien, ce qui donne l'impression d'un bug.
  const usableThemes = useMemo(
    () =>
      themes.filter(
        (t) => t === "Tous" || pool.some((c) => (c.themes || []).includes(t))
      ),
    [themes, pool]
  );

  /* Les deux modes sont deux écrans de l'application : « videos » et « catalog ».
     Basculer sans le dire au conteneur laissait la barre du bas allumée sur le
     mauvais onglet, l'historique désynchronisé, et la recherche précédente
     active sur un contenu qui ne la contenait pas — d'où l'impression de bug
     (remarque 10). On passe donc par la navigation, ce qui remonte l'écran
     proprement. */
  const switchMode = (next) => {
    if (next === mode) return;
    if (go) return go(next === "videos" ? "videos" : "catalog");
    setMode(next);
    setQuery("");
    setTheme("Tous");
  };

  return (
    <div className="view active">
      <div className="view-pad">
        <BackRow
          onBack={onBack}
          title={mode === "videos" ? "Tutos vidéo" : "Formations"}
        >
          <span className="stat-chip">{pool.length}</span>
        </BackRow>

        <div className="segmented">
          <button
            className={mode === "videos" ? "seg on" : "seg"}
            onClick={() => switchMode("videos")}
          >
            Vidéos courtes
          </button>
          <button
            className={mode === "training" ? "seg on" : "seg"}
            onClick={() => switchMode("training")}
          >
            Formations
          </button>
        </div>

        <div className="input-row" style={{ marginBottom: 10 }}>
          <input
            className="ec-input"
            placeholder={
              mode === "videos" ? "Produit, marque…" : "Certification, marque…"
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Rechercher"
          />
          {query && (
            <button
              className="scan-btn"
              onClick={() => setQuery("")}
              aria-label="Effacer la recherche"
              style={{ fontSize: 18, color: "var(--text2)" }}
            >
              ×
            </button>
          )}
        </div>

        <div className="pills">
          {usableThemes.map((t) => (
            <div
              key={t}
              className={`pill ${theme === t ? "on" : ""}`}
              onClick={() => setTheme(t)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setTheme(t)}
            >
              {shortTheme(t)}
            </div>
          ))}
        </div>

        <div className="result-line">
          {filtered.length === 0
            ? "Aucun résultat"
            : `${filtered.length} résultat${filtered.length > 1 ? "s" : ""}`}
          {filtered.length > 0 && (
            <span className="result-sub">
              {" · "}
              {filtered.filter((c) => c.url).length} avec lien officiel
            </span>
          )}
        </div>

        {status === "offline" && (
          <div className="offline-note">
            Hors ligne — catalogue embarqué, il peut ne pas être à jour.
          </div>
        )}
        {status === "cached" && (
          <div className="offline-note">
            Hors ligne — dernier catalogue téléchargé sur cet appareil.
          </div>
        )}

        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-emoji">🔍</div>
            <div className="empty-title">Rien ne correspond</div>
            <div className="empty-sub">
              Essaie un autre mot-clé, ou retire le filtre de thème.
            </div>
            {(query || theme !== "Tous") && (
              <button
                className="empty-reset"
                onClick={() => {
                  setQuery("");
                  setTheme("Tous");
                }}
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}

        {/* En mode vidéos, l'ordre est celui de la durée : on cherche d'abord
            le geste rapide (remarque 13). En mode formations, l'ordre reste
            celui du catalogue. */}
        {(mode === "videos"
          ? grouperParDuree(filtered)
          : [{ titre: null, items: filtered }]
        ).map((groupe) => (
          <div key={groupe.titre || "tout"}>
            {groupe.titre && <div className="palier-titre">{groupe.titre}</div>}
            {groupe.items.map((c) => (
              <CardWrapper
                key={c.id}
                course={c}
                onOpen={() => (idYouTube(c.url) ? setVideo(c) : setSelected(c))}
              >
                <div className="tuto-thumb" style={{ background: c.thumbBg }}>
                  <span className="tt-emoji">{c.emoji}</span>
                </div>
                <div className="tuto-info">
                  <div className="tuto-title">{c.title}</div>
                  <div className="tuto-meta">
                    <span
                      className="brand-tag"
                      style={{
                        background: `${BRAND_COLORS[c.source] || "#64748b"}18`,
                        color: BRAND_COLORS[c.source] || "#64748b",
                      }}
                    >
                      {c.sourceLabel}
                    </span>
                    <span className="tuto-dur">{c.duration}</span>
                    {c.url && <span className="link-dot" title="Lien officiel" />}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "var(--text3)" }}>
                  {idYouTube(c.url) ? "▶" : isDirect(c) ? "↗" : "›"}
                </div>
              </CardWrapper>
            ))}
          </div>
        ))}

        {generatedAt && filtered.length > 0 && (
          <div className="catalog-stamp">
            Catalogue mis à jour le{" "}
            {new Date(generatedAt).toLocaleDateString("fr-FR")}
          </div>
        )}
      </div>

      {video && <Lecteur course={video} onClose={() => setVideo(null)} />}

      {selected && (
        <CourseSheet course={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
