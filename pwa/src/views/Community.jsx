import BackRow from "../components/BackRow";

/**
 * Données de démonstration.
 *
 * Ces pairs n'existent pas : ils servent à illustrer la fonctionnalité lors
 * des présentations. Le bandeau « Démonstration » en tête d'écran doit rester
 * visible — un électricien en test terrain ne doit pas croire qu'il peut
 * réellement joindre quelqu'un.
 */
const PEERS = [
  {
    id: 1,
    name: "Karim B.",
    city: "Nantes (44)",
    specialty: "IRVE · Copropriétés",
    level: "Expert",
    tags: ["Schneider", "Legrand"],
    interventions: 47,
    online: true,
  },
  {
    id: 2,
    name: "Sophie M.",
    city: "Rennes (35)",
    specialty: "PAC air/eau · RGE",
    level: "Avancé",
    tags: ["Atlantic", "Daikin"],
    interventions: 62,
    online: true,
  },
  {
    id: 3,
    name: "Thierry L.",
    city: "Angers (49)",
    specialty: "Tertiaire · TGBT",
    level: "Intermédiaire",
    tags: ["Hager", "Siemens"],
    interventions: 118,
    online: false,
  },
  {
    id: 4,
    name: "Mehdi A.",
    city: "Le Mans (72)",
    specialty: "Domotique · KNX",
    level: "Avancé",
    tags: ["Legrand", "Hager"],
    interventions: 29,
    online: false,
  },
];

const THREADS = [
  {
    id: 1,
    title: "Borne 22 kW en copro : quel régime de neutre ?",
    author: "Karim B.",
    replies: 6,
    age: "il y a 2 h",
  },
  {
    id: 2,
    title: "Défaut différentiel après pose PAC Atlantic",
    author: "Sophie M.",
    replies: 11,
    age: "hier",
  },
  {
    id: 3,
    title: "Retour d'expérience witty one en habitat collectif",
    author: "Thierry L.",
    replies: 4,
    age: "il y a 3 j",
  },
];

export default function Community({ onBack }) {
  return (
    <div className="view active">
      <div className="view-pad">
        <BackRow onBack={onBack} title="Réseau de pairs">
          <span className="stat-chip chip-demo">Démo</span>
        </BackRow>

        <div className="demo-banner">
          Écran de démonstration. Les profils et discussions ci-dessous sont
          fictifs et servent à illustrer la fonctionnalité.
        </div>

        <div className="section-title">Électriciens à proximité</div>
        {PEERS.map((p) => (
          <div key={p.id} className="peer-card">
            <div className="peer-avatar">
              {p.name.split(" ")[0][0]}
              {p.name.split(" ")[1]?.[0] || ""}
              {p.online && <span className="peer-dot" />}
            </div>
            <div className="peer-info">
              <div className="peer-name">{p.name}</div>
              <div className="peer-spec">
                {p.specialty}
                {p.level && <span className="peer-niveau">{p.level}</span>}
              </div>
              <div className="peer-meta">
                {p.city} · {p.interventions} interventions
              </div>
              <div className="peer-tags">
                {p.tags.map((t) => (
                  <span key={t} className="peer-tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <button className="peer-btn" disabled title="Non disponible en démo">
              Écrire
            </button>
          </div>
        ))}

        <div className="section-title">Discussions récentes</div>
        {THREADS.map((t) => (
          <div key={t.id} className="thread-card">
            <div className="thread-title">{t.title}</div>
            <div className="thread-meta">
              {t.author} · {t.replies} réponses · {t.age}
            </div>
          </div>
        ))}

        <div className="info-note">
          À terme, ce réseau permettra de joindre un collègue ayant déjà traité
          le même cas, sur la même marque. Il demande des comptes utilisateurs
          et une modération, et se constituera avec les premiers inscrits.
        </div>
      </div>
    </div>
  );
}
