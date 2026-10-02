import { useEffect, useRef, useState } from 'react'
import { pgInsert, session, televerserPieceJointe } from '../lib/supabase'

/**
 * Bouton de retour testeur — identique sur le site et sur l'application.
 *
 * Le testeur ne renseigne que trois choses : le type, la gravité et son
 * message. Tout le contexte technique (écran, URL, navigateur, taille d'écran,
 * version déployée) est capté automatiquement — c'est justement ce qu'un
 * testeur ne pense jamais à écrire, et ce qui fait la valeur du retour.
 *
 * Un retour est signé (décision du 02/10) : il faut un compte, pour savoir qui
 * parle et pouvoir répondre. Une seule exception, volontaire : « Je n'arrive
 * pas à me connecter ». Sans elle, un testeur bloqué à la connexion ne pourrait
 * pas signaler le problème qui l'empêche justement de signaler. Dans ce cas le
 * nom et l'e-mail deviennent obligatoires : l'identification reste assurée.
 *
 * Une capture d'écran peut être jointe. Elle est réduite dans le navigateur
 * avant l'envoi (1 600 px, JPEG) : une photo de téléphone de 5 Mo deviendrait
 * sinon impossible à envoyer depuis un chantier.
 *
 * Styles autonomes et préfixés `rt-` : aucune dépendance aux feuilles de style
 * des deux applications, aucun risque de collision.
 */

const CSS = `
.rt-bouton{position:fixed;right:14px;z-index:9998;display:flex;align-items:center;gap:6px;
  min-height:44px;padding:9px 14px;border:0;border-radius:999px;cursor:pointer;
  background:#1a56db;color:#fff;font:600 13px/1 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  box-shadow:0 4px 14px rgba(26,86,219,.35)}
.rt-bouton:hover{background:#1543ad}
/* Une fenêtre de détail est ouverte : le bouton s'efface, il recouvrait ses
   commandes du bas. La classe est posée par lib/modale.js. */
.modale-ouverte .rt-bouton{display:none}
.rt-bouton:focus-visible{outline:3px solid #f59e0b;outline-offset:2px}
.rt-voile{position:fixed;inset:0;z-index:9999;background:rgba(15,23,42,.55);
  display:flex;align-items:flex-end;justify-content:center;padding:0}
@media(min-width:640px){.rt-voile{align-items:center;padding:16px}}
.rt-panneau{width:100%;max-width:460px;max-height:92vh;overflow-y:auto;background:#fff;
  border-radius:16px 16px 0 0;padding:18px 18px calc(18px + env(safe-area-inset-bottom));
  font:400 15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#14202e;
  box-shadow:0 -8px 30px rgba(15,23,42,.25)}
@media(min-width:640px){.rt-panneau{border-radius:16px}}
.rt-titre{margin:0 0 2px;font-size:1.15rem;font-weight:700;letter-spacing:-.01em}
.rt-sous{margin:0 0 14px;font-size:.85rem;color:#5a6b7d}
.rt-label{display:block;margin:12px 0 5px;font-size:.8rem;font-weight:700;
  text-transform:uppercase;letter-spacing:.03em;color:#5a6b7d}
.rt-choix{display:flex;flex-wrap:wrap;gap:7px}
.rt-puce{min-height:40px;padding:8px 13px;border:1px solid #d8dee7;border-radius:999px;
  background:#fff;color:#14202e;font:600 13px/1 inherit;cursor:pointer}
.rt-puce[aria-pressed="true"]{border-color:#1a56db;background:#eef3fd;color:#1a56db}
.rt-puce:focus-visible{outline:3px solid #f59e0b;outline-offset:2px}
.rt-champ{width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid #d8dee7;
  border-radius:10px;background:#fff;color:#14202e;font:inherit}
.rt-champ:focus{outline:none;border-color:#1a56db;box-shadow:0 0 0 3px rgba(26,86,219,.15)}
textarea.rt-champ{min-height:110px;resize:vertical}
.rt-aide{margin:6px 0 0;font-size:.78rem;color:#5a6b7d}
.rt-lien{background:none;border:0;padding:0;color:#1a56db;font:inherit;font-weight:700;
  text-decoration:underline;text-underline-offset:2px;cursor:pointer}
.rt-identite{margin:12px 0 0;padding:8px 11px;border-radius:9px;background:#eef3fd;
  color:#1a56db;font-size:.82rem}
.rt-identite strong{font-weight:800}
.rt-actions{display:flex;gap:9px;margin-top:18px}
.rt-envoyer{flex:1;min-height:46px;border:0;border-radius:10px;background:#1a56db;color:#fff;
  font:700 15px/1 inherit;cursor:pointer}
.rt-envoyer:disabled{opacity:.55;cursor:not-allowed}
.rt-annuler{min-height:46px;padding:0 16px;border:1px solid #d8dee7;border-radius:10px;
  background:#fff;color:#14202e;font:600 15px/1 inherit;cursor:pointer}
.rt-pj{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-top:12px}
.rt-pj-bouton{display:inline-flex;align-items:center;gap:6px;min-height:40px;padding:8px 13px;
  border:1px dashed #b8c2d0;border-radius:10px;background:#f7f9fc;color:#14202e;
  font:600 13px/1 inherit;cursor:pointer}
.rt-pj-bouton:focus-within{outline:3px solid #f59e0b;outline-offset:2px}
.rt-pj input{position:absolute;width:1px;height:1px;opacity:0}
.rt-pj-vignette{width:44px;height:44px;border-radius:8px;object-fit:cover;border:1px solid #d8dee7}
.rt-pj-nom{font-size:.8rem;color:#5a6b7d}
.rt-porte{padding:6px 0 2px}
.rt-porte .rt-envoyer{width:100%;margin-top:10px}
.rt-porte .rt-annuler{width:100%;margin-top:8px}
.rt-msg{margin:12px 0 0;padding:10px 12px;border-radius:10px;font-size:.88rem}
.rt-msg-ok{background:#e8f5ec;color:#15803d}
.rt-msg-ko{background:#fdecea;color:#b42318}
.rt-merci{text-align:center;padding:18px 4px}
.rt-merci-ico{font-size:2.2rem;line-height:1}
@media(prefers-reduced-motion:no-preference){
  .rt-panneau{animation:rt-monte .18s ease-out}
  @keyframes rt-monte{from{transform:translateY(14px);opacity:.6}to{transform:none;opacity:1}}
}
`

const TYPES = [
  { id: 'bug', libelle: '🐞 Un bug' },
  { id: 'evolution', libelle: '💡 Une idée' },
  { id: 'question', libelle: '❓ Une question' },
  { id: 'autre', libelle: 'Autre' },
]

const GRAVITES = [
  { id: 'bloquant', libelle: 'Ça me bloque' },
  { id: 'genant', libelle: 'C’est gênant' },
  { id: 'mineur', libelle: 'Détail' },
]

function injecterStyles() {
  if (typeof document === 'undefined' || document.getElementById('rt-styles')) return
  const s = document.createElement('style')
  s.id = 'rt-styles'
  s.textContent = CSS
  document.head.appendChild(s)
}

/**
 * Réduit une image à 1 600 px de plus grand côté et la convertit en JPEG.
 * Renvoie un Blob, ou lève une erreur si le fichier n'est pas une image lisible.
 */
async function reduireImage(fichier, cote = 1600) {
  const url = URL.createObjectURL(fichier)
  try {
    const img = await new Promise((ok, ko) => {
      const i = new Image()
      i.onload = () => ok(i)
      i.onerror = () => ko(new Error('image illisible'))
      i.src = url
    })
    const ratio = Math.min(1, cote / Math.max(img.naturalWidth, img.naturalHeight))
    const toile = document.createElement('canvas')
    toile.width = Math.round(img.naturalWidth * ratio)
    toile.height = Math.round(img.naturalHeight * ratio)
    const ctx = toile.getContext('2d')
    ctx.fillStyle = '#fff' // une capture PNG transparente deviendrait noire en JPEG
    ctx.fillRect(0, 0, toile.width, toile.height)
    ctx.drawImage(img, 0, 0, toile.width, toile.height)
    const blob = await new Promise((ok) => toile.toBlob(ok, 'image/jpeg', 0.82))
    if (!blob) throw new Error('conversion impossible')
    return blob
  } finally {
    URL.revokeObjectURL(url)
  }
}

/** Version déployée, injectée au build (voir vite.config.js). */
const VERSION = typeof __VERSION__ === 'string' ? __VERSION__ : 'inconnue'

export default function RetourTesteur({ application, ecran, decalageBas = 14 }) {
  const [ouvert, setOuvert] = useState(false)
  const [type, setType] = useState('bug')
  const [gravite, setGravite] = useState('genant')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [nomSaisi, setNomSaisi] = useState('')
  // Exception « je n'arrive pas à me connecter » : retour sans compte, mais signé.
  const [sansCompte, setSansCompte] = useState(false)
  const [pj, setPj] = useState(null) // { blob, apercu, nom }
  const [etat, setEtat] = useState('saisie') // saisie | envoi | envoye
  const [erreur, setErreur] = useState(null)
  const champMessage = useRef(null)

  useEffect(injecterStyles, [])

  useEffect(() => {
    if (!ouvert) return
    const auClavier = (e) => e.key === 'Escape' && fermer()
    window.addEventListener('keydown', auClavier)
    champMessage.current?.focus()
    return () => window.removeEventListener('keydown', auClavier)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ouvert])

  /* Qui signale : c'est ce qui manquait le plus au dépouillement. Un retour
     envoyé sans compte et sans e-mail arrive « Anonyme », et on ne peut ni
     répondre ni recouper avec d'autres remarques de la même personne. Autant
     que le testeur le voie avant d'envoyer. */
  const utilisateur = session()?.user ?? null
  const connecte = Boolean(utilisateur)
  const nom =
    utilisateur?.user_metadata?.nom_complet ||
    utilisateur?.user_metadata?.full_name ||
    utilisateur?.email ||
    null

  function fermer() {
    setOuvert(false)
    setEtat('saisie')
    setErreur(null)
    setMessage('')
    setSansCompte(false)
    if (pj) URL.revokeObjectURL(pj.apercu)
    setPj(null)
  }

  function ouvrirCompte(onglet) {
    fermer()
    window.dispatchEvent(new CustomEvent('eclaireurs:compte', { detail: { onglet } }))
  }

  async function choisirImage(e) {
    const fichier = e.target.files?.[0]
    e.target.value = ''
    if (!fichier) return
    setErreur(null)
    try {
      const blob = await reduireImage(fichier)
      if (pj) URL.revokeObjectURL(pj.apercu)
      setPj({ blob, apercu: URL.createObjectURL(blob), nom: fichier.name })
    } catch {
      setErreur("Cette image n'a pas pu être lue. Essayez une capture d'écran au format PNG ou JPEG.")
    }
  }

  async function envoyer(e) {
    e.preventDefault()
    if (message.trim().length < 5) {
      setErreur('Décrivez le problème en quelques mots — cinq caractères minimum.')
      return
    }
    setEtat('envoi')
    setErreur(null)
    try {
      // La capture part d'abord : si elle échoue, on envoie quand même le
      // retour, sans elle. Un texte sans image vaut mieux que rien du tout.
      let pjChemin = null
      let pjPerdue = false
      if (pj) {
        try {
          pjChemin = await televerserPieceJointe(pj.blob)
        } catch {
          pjPerdue = true
        }
      }
      await pgInsert(
        'retours',
        [
          {
            application,
            type,
            gravite: type === 'bug' ? gravite : null,
            message: message.trim() + (pjPerdue ? '\n\n[Une capture d’écran était jointe mais son envoi a échoué.]' : ''),
            pj_chemin: pjChemin,
            demandeur: connecte ? null : nomSaisi.trim() || null,
            ecran: ecran || document.title || null,
            url: window.location.href,
            navigateur: navigator.userAgent,
            taille_ecran: `${window.innerWidth}×${window.innerHeight}`,
            version: VERSION,
            email_contact: connecte ? null : email.trim() || null,
          },
        ],
        { retour: false }
      )
      setEtat('envoye')
    } catch (err) {
      setEtat('saisie')
      setErreur(
        /Failed to fetch|NetworkError/i.test(err.message)
          ? "Envoi impossible : pas de réseau. Réessayez une fois connecté."
          : "L'envoi a échoué. Réessayez dans un instant."
      )
    }
  }

  return (
    <>
      <button
        type="button"
        className="rt-bouton"
        style={{ bottom: decalageBas }}
        onClick={() => setOuvert(true)}
        aria-haspopup="dialog"
      >
        <span aria-hidden="true">💬</span> Un retour ?
      </button>

      {ouvert && (
        <div
          className="rt-voile"
          onClick={(e) => e.target === e.currentTarget && fermer()}
          role="presentation"
        >
          <div className="rt-panneau" role="dialog" aria-modal="true" aria-labelledby="rt-titre">
            {etat === 'envoye' ? (
              <div className="rt-merci">
                <div className="rt-merci-ico" aria-hidden="true">
                  ✅
                </div>
                <h2 className="rt-titre" id="rt-titre">
                  Merci !
                </h2>
                <p className="rt-sous">
                  Votre retour est enregistré avec le contexte technique. Il sera lu.
                </p>
                <div className="rt-actions">
                  <button type="button" className="rt-envoyer" onClick={fermer}>
                    Fermer
                  </button>
                </div>
              </div>
            ) : !connecte && !sansCompte ? (
              <div className="rt-porte">
                <h2 className="rt-titre" id="rt-titre">
                  Un retour ? Dites-nous qui vous êtes
                </h2>
                <p className="rt-sous">
                  Pour pouvoir vous répondre et suivre vos remarques, chaque retour est
                  rattaché à un compte. La création prend trente secondes.
                </p>
                <button type="button" className="rt-envoyer" onClick={() => ouvrirCompte('connexion')}>
                  Me connecter
                </button>
                <button type="button" className="rt-annuler" onClick={() => ouvrirCompte('creation')}>
                  Créer mon compte
                </button>
                <p className="rt-aide" style={{ marginTop: 14, textAlign: 'center' }}>
                  <button type="button" className="rt-lien" onClick={() => setSansCompte(true)}>
                    Je n’arrive pas à me connecter
                  </button>
                </p>
              </div>
            ) : (
              <form onSubmit={envoyer}>
                <h2 className="rt-titre" id="rt-titre">
                  Signaler quelque chose
                </h2>
                <p className="rt-sous">
                  Phase de test — vos retours servent directement à corriger et améliorer.
                </p>

                <span className="rt-label">De quoi s’agit-il ?</span>
                <div className="rt-choix">
                  {TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className="rt-puce"
                      aria-pressed={type === t.id}
                      onClick={() => setType(t.id)}
                    >
                      {t.libelle}
                    </button>
                  ))}
                </div>

                {type === 'bug' && (
                  <>
                    <span className="rt-label">Gravité</span>
                    <div className="rt-choix">
                      {GRAVITES.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          className="rt-puce"
                          aria-pressed={gravite === g.id}
                          onClick={() => setGravite(g.id)}
                        >
                          {g.libelle}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <label className="rt-label" htmlFor="rt-message">
                  {type === 'bug' ? 'Que s’est-il passé ?' : 'Dites-nous tout'}
                </label>
                <textarea
                  id="rt-message"
                  ref={champMessage}
                  className="rt-champ"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    type === 'bug'
                      ? "Ex : j'ai cliqué sur « Suivre ce parcours » et rien ne s'est passé."
                      : 'Ex : il manque un filtre par durée dans le catalogue.'
                  }
                  maxLength={4000}
                  required
                />

                <div className="rt-pj">
                  <label className="rt-pj-bouton">
                    <span aria-hidden="true">📎</span>
                    {pj ? 'Changer la capture' : 'Joindre une capture d’écran'}
                    <input type="file" accept="image/*" onChange={choisirImage} />
                  </label>
                  {pj && (
                    <>
                      <img className="rt-pj-vignette" src={pj.apercu} alt="Aperçu de la capture jointe" />
                      <button
                        type="button"
                        className="rt-lien"
                        onClick={() => {
                          URL.revokeObjectURL(pj.apercu)
                          setPj(null)
                        }}
                      >
                        Retirer
                      </button>
                    </>
                  )}
                </div>

                {connecte ? (
                  <p className="rt-identite">
                    Envoyé en tant que <strong>{nom}</strong>
                  </p>
                ) : (
                  <>
                    <label className="rt-label" htmlFor="rt-nom">
                      Votre nom
                    </label>
                    <input
                      id="rt-nom"
                      className="rt-champ"
                      value={nomSaisi}
                      onChange={(e) => setNomSaisi(e.target.value)}
                      autoComplete="name"
                      required
                    />
                    <label className="rt-label" htmlFor="rt-email">
                      Votre e-mail
                    </label>
                    <input
                      id="rt-email"
                      type="email"
                      className="rt-champ"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="pour vous répondre"
                      autoComplete="email"
                      required
                    />
                    <p className="rt-aide">
                      Retour envoyé sans compte, parce que la connexion ne fonctionne
                      pas : dites-nous dans le message ce qui bloque.
                    </p>
                  </>
                )}

                <p className="rt-aide">
                  L’écran, l’adresse de la page, votre navigateur et la version de l’application
                  sont joints automatiquement.
                </p>

                {erreur && <p className="rt-msg rt-msg-ko">{erreur}</p>}

                <div className="rt-actions">
                  <button type="submit" className="rt-envoyer" disabled={etat === 'envoi'}>
                    {etat === 'envoi' ? 'Envoi…' : 'Envoyer'}
                  </button>
                  <button type="button" className="rt-annuler" onClick={fermer}>
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
