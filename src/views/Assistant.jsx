import BackRow from "../components/BackRow";

/**
 * L'agent conversationnel nécessite un backend (une clé d'API ne peut pas
 * vivre dans du code client). Tant qu'il n'existe pas, on présente
 * honnêtement la fonctionnalité au lieu de simuler des réponses : en test
 * terrain, un faux assistant produirait des retours faussés.
 */
export default function Assistant({ onBack, go }) {
  return (
    <div className="view active">
      <div className="view-pad">
        <BackRow onBack={onBack} title="Assistant terrain">
          <span className="stat-chip chip-demo">Aperçu</span>
        </BackRow>

        <div className="preview-card">
          <div className="preview-emoji">🧭</div>
          <div className="preview-title">Pas encore actif</div>
          <p className="preview-text">
            L'assistant doit permettre de décrire un chantier en langage
            courant — « borne 22 kW en copropriété », « PAC air/eau en
            rénovation » — et d'être orienté vers la bonne formation ou le bon
            interlocuteur.
          </p>
          <p className="preview-text">
            Il demande une infrastructure serveur qui n'est pas encore en
            place. En attendant, la recherche du catalogue couvre déjà
            l'essentiel du besoin.
          </p>
          <button className="preview-cta" onClick={() => go("catalog")}>
            Chercher dans le catalogue
          </button>
        </div>

        <div className="info-note">
          Tu testes une version préliminaire. Dis-nous quelles questions tu
          poserais à cet assistant sur un chantier — ça orientera sa
          conception.
        </div>
      </div>
    </div>
  );
}
