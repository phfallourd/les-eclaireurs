import { useMemo, useState } from "react";
import { useCatalog } from "../data/useCatalog";
import CourseSheet from "../components/CourseSheet";
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

/** Regroupe les thèmes du catalogue en pastilles courtes, lisibles sur mobile. */
function shortTheme(theme) {
  if (theme === "PAC / Pompes à chaleur") return "PAC";
  if (theme === "Domotique / Wiser") return "Domotique";
  if (theme === "TGBT Intelligent") return "TGBT";
  if (theme === "GTB / GTC") return "GTB";
  if (theme === "Solaire PV") return "Solaire";
  if (theme === "Efficacité énergie") return "Énergie";
  if (theme === "PME Supervision") return "Supervision";
  if (theme === "IoT / Réseau") return "IoT";
  return theme;
}

export default function Catalog({ onBack }) {
  const { courses, themes, status, generatedAt } = useCatalog();
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("Tous");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) => {
      const matchTheme =
        theme === "Tous" || (c.themes || []).includes(theme);
      if (!matchTheme) return false;
      if (!q) return true;
      const haystack = [
        c.title,
        c.desc,
        c.sourceLabel,
        c.format,
        c.level,
        ...(c.themes || []),
        ...(c.objectives || []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [courses, query, theme]);

  const withLink = filtered.filter((c) => c.url).length;

  return (
    <div className="view active">
      <div className="view-pad">
        <BackRow onBack={onBack} title="Formations & tutos">
          <span className="stat-chip">{courses.length} référencées</span>
        </BackRow>

        <div className="input-row" style={{ marginBottom: 10 }}>
          <input
            className="ec-input"
            placeholder="Référence, marque, type d'install…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Rechercher une formation"
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
          {themes.map((t) => (
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
            : `${filtered.length} formation${filtered.length > 1 ? "s" : ""}`}
          {filtered.length > 0 && (
            <span className="result-sub">
              {" · "}
              {withLink} avec lien officiel
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

        {filtered.map((c) => (
          <div
            key={c.id}
            className="tuto-card"
            onClick={() => setSelected(c)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setSelected(c)}
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
            <div style={{ fontSize: 12, color: "var(--text3)" }}>›</div>
          </div>
        ))}

        {generatedAt && filtered.length > 0 && (
          <div className="catalog-stamp">
            Catalogue mis à jour le{" "}
            {new Date(generatedAt).toLocaleDateString("fr-FR")}
          </div>
        )}
      </div>

      {selected && (
        <CourseSheet course={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
