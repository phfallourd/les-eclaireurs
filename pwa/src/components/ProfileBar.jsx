import { useState } from "react";
import { useProfile, setIdentity, initials, SPECIALTIES } from "../data/profile";

export default function ProfileBar() {
  const profile = useProfile();
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(profile.name);
  const [draftSpecialty, setDraftSpecialty] = useState(profile.specialty);

  const open = () => {
    setDraftName(profile.name);
    setDraftSpecialty(profile.specialty);
    setEditing(true);
  };

  const save = () => {
    setIdentity({ name: draftName.trim(), specialty: draftSpecialty });
    setEditing(false);
  };

  const displayName = profile.name || "Identifie-toi";

  return (
    <>
      <button className="profile-bar" onClick={open}>
        <span className="pb-avatar">{initials(profile.name)}</span>
        <span className="pb-text">
          <span className="pb-name">{displayName}</span>
          <span className="pb-status">{profile.specialty}</span>
        </span>
        <span className="pb-edit">Modifier</span>
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

              <div className="info-note">
                Ces informations restent sur ce téléphone. Elles ne sont pas
                envoyées sur un serveur et ne sont pas encore partagées avec la
                version web.
              </div>
            </div>

            <div className="sheet-actions">
              <button className="sheet-cta" onClick={save}>
                Enregistrer
              </button>
              <button
                className="sheet-close"
                onClick={() => setEditing(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
