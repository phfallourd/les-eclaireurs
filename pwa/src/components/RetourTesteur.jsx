import { useEffect, useRef, useState } from 'react'
import { pgInsert, session } from '../lib/supabase'

/**
 * Bouton de retour testeur — identique sur le site et sur l'application.
 *
 * Le testeur ne renseigne que trois choses : le type, la gravité et son
 * message. Tout le contexte technique (écran, URL, navigateur, taille d'écran,
 * version déployée) est capté automatiquement — c'est justement ce qu'un
 * testeur ne pense jamais à écrire, et ce qui fait la valeur du retour.
 *
 * Fonctionne sans compte : un testeur bloqué à la connexion doit pouvoir le
 * signaler. Dans ce cas un e-mail facultatif permet de lui répondre.
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
.rt-identite{margin:12px 0 0;padding:8px 11px;border-radius:9px;background:#eef3fd;
  color:#1a56db;font-size:.82rem}
.rt-identite strong{font-weight:800}
.rt-actions{display:flex;gap:9px;margin-top:18px}
.rt-envoyer{flex:1;min-height:46px;border:0;border-radius:10px;background:#1a56db;color:#fff;
  font:700 15px/1 inherit;cursor:pointer}
.rt-envoyer:disabled{opacity:.55;cursor:not-allowed}
.rt-annuler{min-height:46px;padding:0 16px;border:1px solid #d8dee7;border-radius:10px;
  background:#fff;color:#14202e;font:600 15px/1 inherit;cursor:pointer}
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

/** Version déployée, injectée au build (voir vite.config.js). */
const VERSION = typeof __VERSION__ === 'string' ? __VERSION__ : 'inconnue'

export default function RetourTesteur({ application, ecran, decalageBas = 14 }) {
  const [ouvert, setOuvert] = useState(false)
  const [type, setType] = useState('bug')
  const [gravite, setGravite] = useState('genant')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
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
      await pgInsert(
        'retours',
        [
          {
            application,
            type,
            gravite: type === 'bug' ? gravite : null,
            message: message.trim(),
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

                {connecte ? (
                  <p className="rt-identite">
                    Envoyé en tant que <strong>{nom}</strong>
                  </p>
                ) : (
                  <>
                    <label className="rt-label" htmlFor="rt-email">
                      Votre e-mail (facultatif)
                    </label>
                    <input
                      id="rt-email"
                      type="email"
                      className="rt-champ"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="pour vous répondre"
                      autoComplete="email"
                    />
                    <p className="rt-aide">
                      Vous n’êtes pas connecté : sans e-mail, ce retour arrivera
                      anonyme et nous ne pourrons pas vous répondre.
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
