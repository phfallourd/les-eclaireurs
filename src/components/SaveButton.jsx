import { useProfile, toggleSaved } from "../data/profile";

export default function SaveButton({ courseId, wide = false }) {
  const profile = useProfile();
  const saved = profile.saved.includes(courseId);

  return (
    <button
      className={`save-btn ${saved ? "on" : ""} ${wide ? "wide" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        toggleSaved(courseId);
      }}
      aria-pressed={saved}
      aria-label={saved ? "Retirer de mes formations" : "Ajouter à mes formations"}
    >
      {saved ? "✓" : "+"}
      {wide && <span>{saved ? "Enregistrée" : "Ajouter à mes formations"}</span>}
    </button>
  );
}
