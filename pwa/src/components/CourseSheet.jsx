import { useEffect } from "react";
import { fenetreOuverte } from "../lib/modale";

export default function CourseSheet({ course, onClose }) {
  // Efface le bouton flottant « Un retour ? » tant que la fiche est ouverte :
  // il se posait par-dessus les boutons du bas.
  useEffect(fenetreOuverte, []);

  // Fermeture au bouton retour Android / échap, réflexe attendu sur mobile.
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="sheet-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="sheet" role="dialog" aria-modal="true" aria-label={course.title}>
        <div className="sheet-barre">
          <span className="sheet-barre-titre">Fiche formation</span>
          <button className="sheet-x" onClick={onClose} aria-label="Fermer la fiche">
            ✕
          </button>
        </div>
        <div className="sheet-body">
          <div className="sheet-source">{course.sourceLabel}</div>
          <h2 className="sheet-title">{course.title}</h2>

          <div className="sheet-stats">
            {[
              ["Format", course.format],
              ["Durée", course.duration],
              ["Niveau", course.level],
            ].map(([k, v]) => (
              <div key={k} className="sheet-stat">
                <div className="sheet-stat-k">{k}</div>
                <div className="sheet-stat-v">{v}</div>
              </div>
            ))}
          </div>

          {course.badges?.length > 0 && (
            <div className="sheet-badges">
              {course.badges.map((b) => (
                <span key={b.t} className="sheet-badge">
                  {b.t}
                </span>
              ))}
            </div>
          )}

          <p className="sheet-desc">{course.desc}</p>

          {course.objectives?.length > 0 && (
            <>
              <div className="sheet-section">Objectifs</div>
              <ul className="sheet-objectives">
                {course.objectives.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="sheet-actions">
          {course.url ? (
            <a
              className="sheet-cta"
              href={course.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Accéder à la formation ↗
            </a>
          ) : (
            <div className="sheet-cta disabled">
              Lien officiel à venir
            </div>
          )}
          <button className="sheet-close" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
