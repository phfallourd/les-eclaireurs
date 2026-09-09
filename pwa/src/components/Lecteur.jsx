import { useEffect } from "react";

/**
 * Lecteur vidéo intégré (remarque 9).
 *
 * Une vidéo de tuto s'ouvrait sur YouTube : l'électricien y trouvait la
 * colonne de recommandations, et repartait rarement. On la joue donc ici, dans
 * un cadre qui ne propose rien d'autre. Le plein écran reste disponible.
 *
 * Le domaine utilisé est `youtube-nocookie.com` : YouTube n'y dépose pas de
 * cookie de suivi tant que la lecture n'a pas démarré. C'est le minimum quand
 * la vidéo s'affiche dans notre interface et non plus chez eux — et cela
 * devra figurer dans la politique de confidentialité avant le pilote réel.
 */

/** Identifiant d'une vidéo YouTube, quelle que soit la forme de l'adresse. */
export function idYouTube(url = "") {
  const m = String(url).match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

export default function Lecteur({ course, onClose }) {
  const id = idYouTube(course?.url);

  useEffect(() => {
    const auClavier = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", auClavier);
    return () => window.removeEventListener("keydown", auClavier);
  }, [onClose]);

  if (!id) return null;

  return (
    <div
      className="lecteur-voile"
      role="dialog"
      aria-modal="true"
      aria-label={course.title}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="lecteur-panneau">
        <div className="lecteur-tete">
          <div className="lecteur-titre">{course.title}</div>
          <button className="lecteur-fermer" onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </div>
        <div className="lecteur-cadre">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`}
            title={course.title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <div className="lecteur-pied">
          <span>
            {course.sourceLabel}
            {course.duration ? ` · ${course.duration}` : ""}
          </span>
          <a
            href={course.url}
            target="_blank"
            rel="noopener noreferrer"
            className="lecteur-lien"
          >
            Ouvrir sur YouTube ↗
          </a>
        </div>
      </div>
    </div>
  );
}
