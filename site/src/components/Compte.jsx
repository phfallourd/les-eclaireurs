import { useEffect, useRef, useState } from "react";
import {
  session,
  surChangementSession,
  connexion,
  inscription,
  motDePasseOublie,
  deconnexion,
  monProfil,
} from "../lib/supabase";

/**
 * Compte utilisateur du site.
 *
 * Le site n'avait pas d'écran de connexion : seule l'application mobile en
 * proposait un, alors que les deux partagent le même compte et la même base.
 * D'où des retours anonymes, impossibles à rattacher à quelqu'un et auxquels on
 * ne peut pas répondre.
 *
 * L'accès reste libre : on invite, on ne bloque pas. Tant que la
 * réinitialisation de mot de passe ne fonctionne pas (SMTP mutualisé de
 * Supabase, limité à quelques envois par heure), fermer la porte à quelqu'un
 * qui a oublié son mot de passe reviendrait à le perdre pour le pilote.
 */

const CSS = `
.cpt-bouton{display:inline-flex;align-items:center;gap:7px;background:none;border:1.5px solid var(--border);
  padding:8px 15px;border-radius:9px;font:600 .82rem/1 'Plus Jakarta Sans',sans-serif;color:var(--text);
  cursor:pointer;transition:all .18s}
.cpt-bouton:hover{border-color:var(--blue);color:var(--blue)}
.cpt-pastille{width:24px;height:24px;border-radius:50%;background:var(--blue);color:#fff;
  display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:800;flex-shrink:0}
.cpt-voile{position:fixed;inset:0;z-index:10000;background:rgba(15,23,42,.55);
  display:flex;align-items:center;justify-content:center;padding:16px}
.cpt-modale{width:100%;max-width:420px;max-height:92vh;overflow-y:auto;background:#fff;border-radius:16px;
  padding:22px;box-shadow:0 20px 60px rgba(15,23,42,.3)}
.cpt-titre{font-size:1.25rem;font-weight:800;letter-spacing:-.02em;margin:0 0 4px;color:var(--text)}
.cpt-sous{font-size:.85rem;color:var(--text2);margin:0 0 16px;line-height:1.55}
.cpt-onglets{display:flex;gap:6px;margin-bottom:14px}
.cpt-onglet{flex:1;padding:9px;border:1.5px solid var(--border);border-radius:9px;background:#fff;
  font:700 .82rem/1 'Plus Jakarta Sans',sans-serif;color:var(--text2);cursor:pointer}
.cpt-onglet[aria-pressed="true"]{border-color:var(--blue);background:var(--blue-lt);color:var(--blue)}
.cpt-label{display:block;font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;
  color:var(--text2);margin:12px 0 5px}
.cpt-champ{width:100%;box-sizing:border-box;padding:10px 12px;border:1.5px solid var(--border);
  border-radius:9px;font:400 .92rem 'Plus Jakarta Sans',sans-serif;color:var(--text);background:#fff}
.cpt-champ:focus{outline:none;border-color:var(--blue);box-shadow:0 0 0 3px rgba(26,86,219,.12)}
.cpt-envoyer{width:100%;margin-top:18px;min-height:46px;border:0;border-radius:10px;background:var(--blue);
  color:#fff;font:800 .95rem 'Plus Jakarta Sans',sans-serif;cursor:pointer}
.cpt-envoyer:disabled{opacity:.55;cursor:not-allowed}
.cpt-lien{background:none;border:0;color:var(--blue);font:600 .82rem 'Plus Jakarta Sans',sans-serif;
  cursor:pointer;padding:0;text-decoration:underline;text-underline-offset:2px}
.cpt-pied{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:14px;flex-wrap:wrap}
.cpt-msg{margin-top:12px;padding:10px 12px;border-radius:9px;font-size:.85rem;line-height:1.5}
.cpt-ko{background:#fdecea;color:#b42318}
.cpt-ok{background:#e8f5ec;color:#15803d}
.cpt-invite{display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:var(--blue-lt);
  border:1.5px solid #c7d7f7;border-radius:var(--rl);padding:12px 16px;margin:0 0 1.5rem}
.cpt-invite p{margin:0;flex:1;min-width:220px;font-size:.85rem;color:var(--text);line-height:1.5}
.cpt-invite strong{font-weight:800}
.cpt-invite-actions{display:flex;gap:8px;flex-wrap:wrap}
.cpt-invite-fermer{background:none;border:0;color:var(--text2);font-size:1.1rem;cursor:pointer;line-height:1}
`;

function injecter() {
  if (typeof document === "undefined" || document.getElementById("cpt-styles")) return;
  const s = document.createElement("style");
  s.id = "cpt-styles";
  s.textContent = CSS;
  document.head.appendChild(s);
}

const initiales = (nom = "") =>
  nom
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((m) => m[0].toUpperCase())
    .join("") || "?";

/** Hook partagé : la session courante et le profil applicatif associé. */
export function useCompte() {
  const [sess, setSess] = useState(() => session());
  const [profil, setProfil] = useState(null);

  useEffect(() => surChangementSession(setSess), []);
  useEffect(() => {
    let annule = false;
    if (!sess) return setProfil(null);
    monProfil()
      .then((p) => !annule && setProfil(p))
      .catch(() => {});
    return () => {
      annule = true;
    };
  }, [sess]);

  const nom =
    profil?.nom_complet ||
    sess?.user?.user_metadata?.nom_complet ||
    sess?.user?.email ||
    null;
  return { connecte: Boolean(sess), nom, profil };
}

/* ─────────── Modale ─────────── */

function Modale({ ongletInitial, onFermer }) {
  const [onglet, setOnglet] = useState(ongletInitial);
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [nomComplet, setNomComplet] = useState("");
  const [metier, setMetier] = useState("Électricien installateur");
  const [etat, setEtat] = useState("saisie");
  const [erreur, setErreur] = useState(null);
  const [info, setInfo] = useState(null);
  const premier = useRef(null);

  useEffect(() => {
    premier.current?.focus();
    const auClavier = (e) => e.key === "Escape" && onFermer();
    window.addEventListener("keydown", auClavier);
    return () => window.removeEventListener("keydown", auClavier);
  }, [onFermer]);

  async function envoyer(e) {
    e.preventDefault();
    setEtat("envoi");
    setErreur(null);
    setInfo(null);
    try {
      if (onglet === "connexion") {
        await connexion({ email, motDePasse });
      } else {
        await inscription({ email, motDePasse, nomComplet, metier });
      }
      onFermer();
    } catch (err) {
      setEtat("saisie");
      setErreur(err.message);
    }
  }

  async function oubli() {
    if (!email) return setErreur("Indiquez d’abord votre adresse e-mail.");
    try {
      await motDePasseOublie(email);
      setInfo(
        "Si un compte existe pour cette adresse, un lien de réinitialisation vient d’être envoyé. Pendant la phase de test, l’envoi peut échouer : prévenez Paul-Henry, il réinitialisera le mot de passe."
      );
    } catch (err) {
      setErreur(err.message);
    }
  }

  const creation = onglet === "creation";

  return (
    <div
      className="cpt-voile"
      role="presentation"
      onClick={(e) => e.target === e.currentTarget && onFermer()}
    >
      <div className="cpt-modale" role="dialog" aria-modal="true" aria-labelledby="cpt-titre">
        <h2 className="cpt-titre" id="cpt-titre">
          {creation ? "Créer mon compte" : "Se connecter"}
        </h2>
        <p className="cpt-sous">
          Un seul compte pour le site et l’application mobile : vos formations
          enregistrées vous suivent de l’un à l’autre, et vos retours nous
          parviennent signés.
        </p>

        <div className="cpt-onglets" role="group" aria-label="Connexion ou création">
          <button
            type="button"
            className="cpt-onglet"
            aria-pressed={!creation}
            onClick={() => setOnglet("connexion")}
          >
            J’ai déjà un compte
          </button>
          <button
            type="button"
            className="cpt-onglet"
            aria-pressed={creation}
            onClick={() => setOnglet("creation")}
          >
            Je crée mon compte
          </button>
        </div>

        <form onSubmit={envoyer}>
          {creation && (
            <>
              <label className="cpt-label" htmlFor="cpt-nom">
                Nom et prénom
              </label>
              <input
                id="cpt-nom"
                className="cpt-champ"
                value={nomComplet}
                onChange={(e) => setNomComplet(e.target.value)}
                autoComplete="name"
                required
                ref={premier}
              />
              <label className="cpt-label" htmlFor="cpt-metier">
                Votre métier
              </label>
              <select
                id="cpt-metier"
                className="cpt-champ"
                value={metier}
                onChange={(e) => setMetier(e.target.value)}
              >
                {[
                  "Électricien installateur",
                  "Chef d’équipe / chef de chantier",
                  "Artisan à son compte",
                  "Apprenti ou en reconversion",
                  "Formateur",
                  "Autre",
                ].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </>
          )}

          <label className="cpt-label" htmlFor="cpt-email">
            Adresse e-mail
          </label>
          <input
            id="cpt-email"
            type="email"
            className="cpt-champ"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            ref={creation ? undefined : premier}
          />

          <label className="cpt-label" htmlFor="cpt-mdp">
            Mot de passe
          </label>
          <input
            id="cpt-mdp"
            type="password"
            className="cpt-champ"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            autoComplete={creation ? "new-password" : "current-password"}
            minLength={6}
            required
          />
          {creation && (
            <p className="cpt-sous" style={{ margin: "6px 0 0", fontSize: ".78rem" }}>
              Six caractères minimum.
            </p>
          )}

          {erreur && <p className="cpt-msg cpt-ko">{erreur}</p>}
          {info && <p className="cpt-msg cpt-ok">{info}</p>}

          <button className="cpt-envoyer" disabled={etat === "envoi"}>
            {etat === "envoi"
              ? "Un instant…"
              : creation
                ? "Créer mon compte"
                : "Se connecter"}
          </button>
        </form>

        <div className="cpt-pied">
          {!creation && (
            <button type="button" className="cpt-lien" onClick={oubli}>
              Mot de passe oublié
            </button>
          )}
          <button type="button" className="cpt-lien" onClick={onFermer}>
            Continuer sans compte
          </button>
        </div>
      </div>
    </div>
  );
}

/** Ouvre la modale de compte, d'où que vienne la demande. */
export const ouvrirCompte = (onglet = "connexion") =>
  window.dispatchEvent(new CustomEvent("eclaireurs:compte", { detail: { onglet } }));

/* ─────────── Modale, montée une seule fois ─────────── */

/**
 * Le bouton peut apparaître à plusieurs endroits (barre de navigation, menu
 * mobile) ; la modale, elle, n'est montée qu'une fois, sinon deux exemplaires
 * s'ouvriraient l'un sur l'autre. Tout le monde passe par le même évènement.
 */
export function ModaleCompte() {
  const [ouvert, setOuvert] = useState(null);

  useEffect(injecter, []);
  useEffect(() => {
    const ouvrir = (e) => setOuvert(e.detail?.onglet === "creation" ? "creation" : "connexion");
    window.addEventListener("eclaireurs:compte", ouvrir);
    return () => window.removeEventListener("eclaireurs:compte", ouvrir);
  }, []);

  if (!ouvert) return null;
  return <Modale ongletInitial={ouvert} onFermer={() => setOuvert(null)} />;
}

/* ─────────── Bouton d'en-tête ─────────── */

export default function Compte() {
  const { connecte, nom } = useCompte();

  useEffect(injecter, []);

  if (!connecte)
    return (
      <button className="cpt-bouton" onClick={() => ouvrirCompte("connexion")}>
        Se connecter
      </button>
    );

  return (
    <button
      className="cpt-bouton"
      onClick={() => {
        if (confirm(`Se déconnecter de ${nom} ?`)) deconnexion();
      }}
      title={`Connecté en tant que ${nom}`}
    >
      <span className="cpt-pastille" aria-hidden="true">
        {initiales(nom)}
      </span>
      <span>{String(nom).split(" ")[0]}</span>
    </button>
  );
}

/* ─────────── Invitation ─────────── */

export function InvitationCompte() {
  const { connecte } = useCompte();
  const [masque, setMasque] = useState(false);

  useEffect(injecter, []);
  if (connecte || masque) return null;

  return (
    <div className="cpt-invite" role="complementary">
      <p>
        <strong>Vous testez sans compte.</strong> Créez-le en trente secondes :
        vos formations enregistrées vous suivront jusque dans l’application, et
        vos retours nous parviendront signés — nous pourrons donc vous répondre.
      </p>
      <div className="cpt-invite-actions">
        <button className="btn-primary" onClick={() => ouvrirCompte("creation")}>
          Créer mon compte
        </button>
        <button className="cpt-bouton" onClick={() => ouvrirCompte("connexion")}>
          J’ai déjà un compte
        </button>
      </div>
      <button
        className="cpt-invite-fermer"
        onClick={() => setMasque(true)}
        aria-label="Masquer cette invitation"
        title="Masquer pour cette visite"
      >
        ×
      </button>
    </div>
  );
}
