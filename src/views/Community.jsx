import BackRow from "../components/BackRow";

/**
 * Le réseau de pairs suppose des comptes, une modération et un backend.
 * On affiche l'intention plutôt que de faux profils : montrer « 23 pairs en
 * ligne » à des électriciens en test réel serait trompeur, et fausserait
 * complètement la mesure d'intérêt pour la fonctionnalité.
 */
export default function Community({ onBack }) {
  return (
    <div className="view active">
      <div className="view-pad">
        <BackRow onBack={onBack} title="Réseau de pairs">
          <span className="stat-chip chip-demo">Aperçu</span>
        </BackRow>

        <div className="preview-card">
          <div className="preview-emoji">👷</div>
          <div className="preview-title">En cours de construction</div>
          <p className="preview-text">
            L'idée : pouvoir joindre un collègue qui a déjà rencontré le même
            problème que toi, sur la même marque, plutôt que de chercher seul
            sur un forum.
          </p>
          <p className="preview-text">
            Le réseau n'a pas encore de membres — il se constituera avec les
            premiers utilisateurs de la plateforme.
          </p>
        </div>

        <div className="info-note">
          Intéressé pour en faire partie ? C'est exactement le retour dont nous
          avons besoin à ce stade.
        </div>
      </div>
    </div>
  );
}
