/**
 * Hauteur réellement visible de l'écran, en pixels, exposée en variable CSS
 * `--vh-reel` sur <html>.
 *
 * Pourquoi ne pas se contenter de `100dvh` : sur plusieurs navigateurs mobiles
 * — Chrome Android en mode application installée en particulier — la valeur
 * rendue par `dvh` ne correspond pas à ce que l'utilisateur voit réellement
 * (barre système, barre d'adresse rétractable, clavier). Les boutons d'action
 * d'une fenêtre calée en bas d'écran se retrouvent alors hors champ.
 * `visualViewport.height` est la seule mesure fiable : c'est exactement la
 * zone visible. On la relaie en CSS, avec `dvh` comme secours.
 */
export function suivreHauteurVisible() {
  const vv = window.visualViewport
  const poser = () => {
    const h = Math.round(vv?.height || window.innerHeight)
    if (h > 0) document.documentElement.style.setProperty("--vh-reel", h + "px")
  }
  poser()
  vv?.addEventListener("resize", poser)
  vv?.addEventListener("scroll", poser)
  window.addEventListener("resize", poser)
  window.addEventListener("orientationchange", poser)
  return () => {
    vv?.removeEventListener("resize", poser)
    vv?.removeEventListener("scroll", poser)
    window.removeEventListener("resize", poser)
    window.removeEventListener("orientationchange", poser)
  }
}
