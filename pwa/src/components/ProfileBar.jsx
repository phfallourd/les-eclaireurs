import { useEffect, useState } from "react";
import { useProfile, setIdentity, initials, SPECIALTIES, LEVELS, levelLabel, oublierLocalement } from "../data/profile";
import {
  useSession,
  seConnecter,
  sInscrire,
  seDeconnecter,
  motDePasseOublie,
  emailUtilisateur,
} from "../data/compte";
import { fenetreOuverte } from "../lib/modale";

export default function ProfileBar() {
  const profile = useProfile();
  const session = useSession();
  const [inviteMasquee, setInviteMasquee] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(profile.name);
  const [draftSpecialty, setDraftSpecialty] = useState(profile.specialty);
  const [draftLevel, setDraftLevel] = useState(profile.level || "");

  // Formulaire de compte
  const [modeCompte, setModeCompte] = useState(null); // null | "connexion" | "inscription"
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState(null);
  const [info, setInfo] = useState(null);
  const [enCours, setEnCours] = useState(false);

  const open = (mode = null) => {
    setDraftName(profile.name);
    setDraftSpecialty(profile.specialty);
    setDraftLevel(profile.level || "");
    setErreur(null);
    setInfo(null);
    setModeCompte(mode);
    setEditing(true);
  };

  const save = () => {
    setIdentity({ name: draftName.trim(), specialty: draftSpecialty, level: draftLevel });
    setEditing(false);
  };

  async function envoyerCompte(e) {
    e.preventDefault();
    setErreur(null);
    setInfo(null);
    setEnCours(true);
    try {
      if (modeCompte === "connexion") {
        await seConnecter({ email, motDePasse });
        setInfo("Connecté. Ton profil et tes formations sont synchronisés.");
      } else {
        const data = await sInscrire({
          email,
          motDePasse,
          nomComplet: draftName.trim() || profile.name,
          metier: draftSpecialty,
        });
        setInfo(
          data.access_token
            ? "Compte créé. Tes formations sont maintenant synchronisées."
            : "Compte créé. Confirme ton adresse par e-mail, puis connecte-toi."
        );
      }
      setMotDePasse("");
      setModeCompte(null);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setEnCours(false);
    }
  }

  async function deconnexion() {
    await seDeconnecter();
    oublierLocalement();
    setInfo("Déconnecté. Ce téléphone ne garde plus tes informations.");
  }

  // Même règle que la fiche formation : pas de bouton flottant par-dessus les
  // commandes de la fenêtre tant qu'elle est ouverte.
  useEffect(() => (editing ? fenetreOuverte() : undefined), [editing]);

  useEffect(() => {
    const ouvrir = (e) =>
      open(e.detail?.onglet === "creation" ? "inscription" : "connexion");
    window.addEventListener("eclaireurs:compte", ouvrir);
    return () => window.removeEventListener("eclaireurs:compte", ouvrir);
  });

  const displayName = profile.name || "Identifie-toi";

  return (
    <>
      <button className="profile-bar" onClick={() => open()}>
        <span className="pb-avatar">{initials(profile.name)}</span>
        <span className="pb-text">
          <span className="pb-name">{displayName}</span>
          <span className="pb-status">
            {profile.specialty}
            {profile.level ? ` · ${levelLabel(profile.level)}` : ""}
          </span>
        </span>
        <span className="pb-edit">{session ? "Mon compte" : "Modifier"}</span>
      </button>

      {/* On invite, on ne bloque pas : tant que la reinitialisation de mot de
          passe ne fonctionne pas, fermer la porte a quelqu'un qui l'a oublie
          reviendrait a le perdre pour le pilote. */}
      {!session && !inviteMasquee && (
        <div className="invite-compte">
          <div className="invite-texte">
            <strong>Vous n’avez pas encore de compte.</strong> Créez-le en trente
            secondes : vos formations vous suivront sur le site web et sur un
            autre téléphone, et vos retours nous parviendront signés.
          </div>
          <div className="invite-actions">
            <button
              className="invite-cta"
              onClick={() => open("inscription")}
            >
              Créer mon compte
            </button>
            <button
              className="invite-lien"
              onClick={() => open("connexion")}
            >
              J’ai déjà un compte
            </button>
          </div>
          <button
            className="invite-fermer"
            onClick={() => setInviteMasquee(true)}
            aria-label="Masquer"
            title="Masquer pour cette visite"
          >
            ×
          </button>
        </div>
      )}

      {editing && (
        <div
          className="sheet-overlay"
          onClick={(e) => e.target === e.currentTarget && setEditing(false)}
        >
          <div className="sheet" role="dialog" aria-modal="true" aria-label="Mon profil">
            <div className="sheet-barre">
              <span className="sheet-barre-titre">Mon profil</span>
              <button
                className="sheet-x"
                onClick={() => setEditing(false)}
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>
            <div className="sheet-body">
              <label className="field-label" htmlFor="pname">
                Nom
              </label>
              <input
                id="pname"
                className="ec-input field-full"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="Ton nom"
                autoFocus
              />

              <label className="field-label" htmlFor="pspec">
                Statut
              </label>
              <select
                id="pspec"
                className="ec-input field-full"
                value={draftSpecialty}
                onChange={(e) => setDraftSpecialty(e.target.value)}
              >
                {SPECIALTIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              {/* Échelle reprise de la base, pas inventée ici (retour 3). */}
              <label className="field-label" htmlFor="pb-niveau">
                Mon niveau
              </label>
              <select
                id="pb-niveau"
                className="ec-input field-full"
                value={draftLevel}
                onChange={(e) => setDraftLevel(e.target.value)}
              >
                <option value="">Je préfère ne pas le dire</option>
                {LEVELS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>

              {erreur && <div className="info-note">{erreur}</div>}
              {info && <div className="info-note">{info}</div>}

              {session ? (
                <div className="info-note">
                  Connecté avec <strong>{emailUtilisateur()}</strong>. Ton profil et tes
                  formations enregistrées sont partagés avec le site web.
                  <br />
                  <button
                    type="button"
                    className="sheet-close"
                    style={{ marginTop: 8 }}
                    onClick={deconnexion}
                  >
                    Se déconnecter
                  </button>
                </div>
              ) : modeCompte ? (
                <form onSubmit={envoyerCompte}>
                  <label className="field-label" htmlFor="pmail">
                    Adresse e-mail
                  </label>
                  <input
                    id="pmail"
                    type="email"
                    className="ec-input field-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    inputMode="email"
                    autoComplete="email"
                    required
                  />

                  <label className="field-label" htmlFor="pmdp">
                    Mot de passe
                  </label>
                  <input
                    id="pmdp"
                    type="password"
                    className="ec-input field-full"
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    autoComplete={
                      modeCompte === "connexion" ? "current-password" : "new-password"
                    }
                    minLength={6}
                    required
                  />

                  <button className="sheet-cta" type="submit" disabled={enCours}>
                    {enCours
                      ? "Un instant…"
                      : modeCompte === "connexion"
                        ? "Se connecter"
                        : "Créer mon compte"}
                  </button>

                  <button
                    type="button"
                    className="sheet-close"
                    onClick={() =>
                      setModeCompte(modeCompte === "connexion" ? "inscription" : "connexion")
                    }
                  >
                    {modeCompte === "connexion"
                      ? "Pas encore de compte ? En créer un"
                      : "J'ai déjà un compte"}
                  </button>

                  {modeCompte === "connexion" && (
                    <button
                      type="button"
                      className="sheet-close"
                      onClick={async () => {
                        if (!email) return setErreur("Renseigne ton adresse e-mail d'abord.");
                        try {
                          await motDePasseOublie(email);
                          setInfo("Si un compte existe, un lien vient d'être envoyé.");
                        } catch (err) {
                          setErreur(err.message);
                        }
                      }}
                    >
                      Mot de passe oublié
                    </button>
                  )}
                </form>
              ) : (
                <div className="info-note">
                  Sans compte, ces informations restent sur ce téléphone.
                  <br />
                  <button
                    type="button"
                    className="sheet-close"
                    style={{ marginTop: 8 }}
                    onClick={() => setModeCompte("connexion")}
                  >
                    Créer un compte ou se connecter
                  </button>
                  <br />
                  Un compte permet de retrouver ses formations sur le site web et sur un
                  autre téléphone.
                </div>
              )}
            </div>

            <div className="sheet-actions">
              <button className="sheet-cta" onClick={save}>
                Enregistrer
              </button>
              <button className="sheet-close" onClick={() => setEditing(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
