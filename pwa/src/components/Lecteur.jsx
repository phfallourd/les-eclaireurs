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
 * vidéo de geste technique regardée sur un chantier doit être grande.
 *
 * Plein écran natif : il doit être demandé **pendant le clic** qui choisit la
 * vidéo (`ouvrirPleinEcran`, appelée par la carte). Demandé après coup, depuis
 * le rendu du lecteur, Safari le refuse — c'était le cas jusqu'ici, d'où une
 * vidéo qui restait dans la fenêtre. Sur iPhone, Safari n'accorde le plein
 * écran qu'à l'élément vidéo lui-même, inaccessible dans le cadre YouTube : la
 * mise en page remplit alors l'écran, et le bouton plein écran de YouTube
 * reste disponible. La lecture démarre d'elle-même.
 */

/**
 * À appeler de façon synchrone dans le gestionnaire de clic. On passe la page
 * entière en plein écran : le lecteur, en position fixe, la recouvre.
 */
export function ouvrirPleinEcran() {
  const el = document.documentElement;
  try {
    const demande = el.requestFullscreen
      ? el.requestFullscreen({ navigationUI: "hide" })
      : el.webkitRequestFullscreen?.();
    Promise.resolve(demande)
      .then(() => screen.orientation?.lock?.("landscape"))
      .catch(() => {
        /* Refusé : la mise en page remplit déjà l'écran. */
      });
  } catch {
    /* Navigateur sans API plein écran. */
  }
}

function quitterPleinEcran() {
  try {
    screen.orientation?.unlock?.();
    if (document.fullscreenElement) document.exitFullscreen?.();
    else if (document.webkitFullscreenElement) document.webkitExitFullscreen?.();
  } catch {
    /* rien à faire */
  }
}

/** Identifiant d'une vidéo YouTube, quelle que soit la forme de l'adresse. */
export function idYouTube(url = "") {
  const m = String(url).match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

export default function Lecteur({ course, onClose }) {
  const id = idYouTube(course?.url);
  // `onClose` change à chaque rendu du parent : le lire par une référence évite
  // de quitter le plein écran à chaque rendu.
  const fermer = useRef(onClose);
  fermer.current = onClose;

  // Le bouton flottant « Un retour ? » passait par-dessus la barre du lecteur.
  useEffect(fenetreOuverte, []);

  useEffect(() => {
    const auClavier = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", auClavier);
    return () => window.removeEventListener("keydown", auClavier);
  }, [onClose]);

  // Le plein écran a été demandé au clic ; on le quitte en fermant. Et si
  // l'utilisateur sort du plein écran (touche Échap, geste système), on
  // referme aussi le lecteur : il retrouve la liste, pas un cadre noir.
  useEffect(() => {
    if (!id) return;
    const estPlein = () =>
      Boolean(document.fullscreenElement || document.webkitFullscreenElement);
    let etaitPleinEcran = estPlein();
    const surChangement = () => {
      if (estPlein()) etaitPleinEcran = true;
      else if (etaitPleinEcran) fermer.current();
    };
    document.addEventListener("fullscreenchange", surChangement);
    document.addEventListener("webkitfullscreenchange", surChangement);
    return () => {
      document.removeEventListener("fullscreenchange", surChangement);
      document.removeEventListener("webkitfullscreenchange", surChangement);
      quitterPleinEcran();
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
      <div className="lecteur-panneau">
        <div className="lecteur-tete">
          <div className="lecteur-titre">{course.title}</div>
          <button className="lecteur-fermer" onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </div>
        <div className="lecteur-cadre">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1&autoplay=1`}
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
