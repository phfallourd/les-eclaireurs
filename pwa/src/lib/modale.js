/**
 * Signale au reste de l'interface qu'une fenêtre modale est ouverte, en posant
 * la classe `modale-ouverte` sur <html>.
 *
 * À quoi ça sert : le bouton flottant « Un retour ? » est volontairement très
 * au-dessus de tout (z-index 9998) pour rester atteignable partout. Quand une
 * fiche s'ouvre, il se superposait à ses boutons du bas et les rendait
 * inatteignables. On l'efface le temps de la fenêtre.
 *
 * Le compteur permet d'empiler deux fenêtres sans que la fermeture de la
 * première ne rétablisse le fond trop tôt.
 */
let ouvertes = 0

export function fenetreOuverte() {
  ouvertes += 1
  document.documentElement.classList.add("modale-ouverte")
  return () => {
    ouvertes = Math.max(0, ouvertes - 1)
    if (ouvertes === 0) document.documentElement.classList.remove("modale-ouverte")
  }
}
