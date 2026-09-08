import { useState } from "react";
import { useProfile, setIdentity, initials, SPECIALTIES, oublierLocalement } from "../data/profile";
import {
  useSession,
  seConnecter,
  sInscrire,
  seDeconnecter,
  motDePasseOublie,
  emailUtilisateur,
} from "../data/compte";

export default function ProfileBar() {
  const profile = useProfile();
  const session = useSession();
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(profile.name);
  const [draftSpecialty, setDraftSpecialty] = useState(profile.specialty);

  // Formulaire de compte
  const [modeCompte, setModeCompte] = useState(null); // null | "connexion" | "inscription"
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState(null);
  const [info, setInfo] = useState(null);
  const [enCours, setEnCours] = useState(false);

  const open = () => {
    setDraftName(profile.name);
    setDraftSpecialty(profile.specialty);
    setErreur(null);
    setInfo(null);
    setModeCompte(null);
    setEditing(true);
  };

  const save = () => {
    setIdentity({ name: draftName.trim(), specialty: draftSpecialty });
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

  const displayName = profile.name || "Identifie-toi";

  return (
    <>
      <button className="profile-bar" onClick={open}>
        <span className="pb-avatar">{initials(profile.name)}</span>
        <span className="pb-text">
          <span className="pb-name">{displayName}</span>
          <span className="pb-status">{profile.specialty}</span>
        </span>
        <span className="pb-edit">{session ? "Mon compte" : "Modifier"}</span>
      </button>

      {editing && (
        <div
          className="sheet-overlay"
          onClick={(e) => e.target === e.currentTarget && setEditing(false)}
        >
          <div className="sheet" role="dialog" aria-modal="true">
            <div className="sheet-grip" />
            <div className="sheet-body">
              <h2 className="sheet-title">Mon profil</h2>

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
