import { useState } from "react";
import { useCatalog } from "../data/useCatalog";
import { useProfile, buildExport } from "../data/profile";
import BackRow from "../components/BackRow";
import CourseSheet from "../components/CourseSheet";
import SaveButton from "../components/SaveButton";

export default function Saved({ onBack, go }) {
  const { courses } = useCatalog();
  const profile = useProfile();
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);

  const savedCourses = courses.filter((c) => profile.saved.includes(c.id));

  const share = async () => {
    const text = buildExport(courses, profile.saved);
    if (!text) return;

    // Partage natif si disponible (iOS/Android), presse-papier sinon.
    if (navigator.share) {
      try {
        await navigator.share({ title: "Mes formations", text });
        return;
      } catch {
        // Partage annulé par l'utilisateur : on retombe sur la copie.
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="view active">
      <div className="view-pad">
        <BackRow onBack={onBack} title="Mes formations">
          {savedCourses.length > 0 && (
            <span className="stat-chip">{savedCourses.length}</span>
          )}
        </BackRow>

        {savedCourses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-emoji">📋</div>
            <div className="empty-title">Aucune formation enregistrée</div>
            <div className="empty-sub">
              Ajoute des formations depuis le catalogue ou l'assistant pour les
              retrouver ici.
            </div>
            <button className="empty-reset" onClick={() => go("catalog")}>
              Parcourir le catalogue
            </button>
          </div>
        ) : (
          <>
            {savedCourses.map((c) => (
              <div key={c.id} className="tuto-card" onClick={() => setSelected(c)}>
                <div className="tuto-thumb" style={{ background: c.thumbBg }}>
                  <span className="tt-emoji">{c.emoji}</span>
                </div>
                <div className="tuto-info">
                  <div className="tuto-title">{c.title}</div>
                  <div className="tuto-meta">
                    <span className="tuto-dur">
                      {c.sourceLabel} · {c.duration}
                    </span>
                  </div>
                </div>
                <SaveButton courseId={c.id} />
              </div>
            ))}

            <button className="share-btn" onClick={share}>
              {copied ? "Copié dans le presse-papier" : "Partager ma sélection"}
            </button>

            <div className="info-note">
              Cette liste est enregistrée sur ce téléphone uniquement. La
              synchronisation avec ton compte sur la version web n'existe pas
              encore — en attendant, le bouton ci-dessus te permet de t'envoyer
              ta sélection.
            </div>
          </>
        )}
      </div>

      {selected && (
        <CourseSheet course={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
