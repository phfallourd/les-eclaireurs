import { useEffect, useRef } from "react";
import { fenetreOuverte } from "../lib/modale";

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
 *
 * Le lecteur occupe tout l'écran, et non plus un cadre en bas de page : une
 * vidéo de geste technique regardée sur un chantier doit être grande. On
 * demande le plein écran natif et le passage en paysage ; les deux peuvent
 * être refusés selon le navigateur, d'où la mise en page qui remplit déjà
 * l'écran par elle-même.
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

  const panneau = useRef(null);

  // Le bouton flottant « Un retour ? » passait par-dessus la barre du lecteur.
  useEffect(fenetreOuverte, []);

  useEffect(() => {
    const auClavier = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", auClavier);
    return () => window.removeEventListener("keydown", auClavier);
  }, [onClose]);

  useEffect(() => {
    if (!id) return;
    const el = panneau.current;
    let actif = true;
    (async () => {
      try {
        await el?.requestFullscreen?.();
        if (actif) await screen.orientation?.lock?.("landscape");
      } catch {
        // Refusé (iOS, navigateur de bureau, geste non reconnu) : tant pis,
        // la mise en page remplit déjà l'écran.
      }
    })();
    return () => {
      actif = false;
      try {
        screen.orientation?.unlock?.();
        if (document.fullscreenElement) document.exitFullscreen?.();
      } catch {
        /* rien à faire */
      }
    };
  }, [id]);

  if (!id) return null;

  return (
    <div
      className="lecteur-voile"
      role="dialog"
      aria-modal="true"
      aria-label={course.title}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="lecteur-panneau" ref={panneau}>
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
