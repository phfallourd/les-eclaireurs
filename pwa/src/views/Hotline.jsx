import BackRow from "../components/BackRow";
import { useCatalog } from "../data/useCatalog";

/**
 * Hotline fabricants.
 *
 * La liste des marques n'est plus écrite en dur : elle suit le catalogue, pour
 * qu'un fabricant ajouté en base apparaisse ici sans intervention (remarque 7).
 *
 * Seuls les numéros vérifiés figurent ci-dessous. Une marque du catalogue dont
 * nous n'avons pas encore le support affiche « Contact à venir » plutôt qu'un
 * numéro approximatif : sur un chantier, un mauvais numéro coûte plus cher que
 * pas de numéro du tout.
 *
 * Ces numéros sont les numéros publics des fabricants. À revérifier
 * périodiquement — ils changent sans préavis.
 */
const NUMEROS = {
  schneider: {
    phone: "0800002050",
    display: "0 800 002 050",
    hours: "Lun–Ven 8h–18h · Gratuit",
    couleur: "#3db83d",
  },
  legrand: {
    phone: "0555068787",
    display: "05 55 06 87 87",
    hours: "Lun–Ven 8h–18h",
    couleur: "#e05a0c",
  },
  hager: {
    phone: "0388698000",
    display: "03 88 69 80 00",
    hours: "Lun–Ven 8h–17h",
    couleur: "#c8000a",
  },
  siemens: {
    phone: "0800200486",
    display: "0 800 200 486",
    hours: "Lun–Ven 8h30–17h30",
    couleur: "#009999",
  },
};

const IconePhone = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.59 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.18 6.18l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
      stroke="#fff"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Hotline({ onBack }) {
  const { courses } = useCatalog();

  /* Une entrée par fabricant présent au catalogue, celles dont on a le numéro
     d'abord — c'est ce qu'on cherche quand on ouvre cet écran en urgence. */
  const marques = [];
  const vus = new Set();
  for (const c of courses) {
    const id = c.source;
    if (!id || vus.has(id)) continue;
    vus.add(id);
    marques.push({ id, nom: c.sourceLabel || id, ...(NUMEROS[id] || {}) });
  }
  marques.sort((a, b) => {
    if (Boolean(a.phone) !== Boolean(b.phone)) return a.phone ? -1 : 1;
    return a.nom.localeCompare(b.nom, "fr");
  });

  const avecNumero = marques.filter((m) => m.phone).length;

  return (
    <div className="view active">
      <div className="view-pad">
        <BackRow onBack={onBack} title="Hotline fabricants">
          <span className="stat-chip">{avecNumero}</span>
        </BackRow>
        <p className="view-intro">
          Support technique des fabricants du catalogue. L'appel ouvre
          directement le composeur de ton téléphone.
        </p>

        {marques.map((m) => (
          <div
            key={m.id}
            className={`marque-ligne ${m.phone ? "" : "sans-numero"}`}
            style={m.couleur ? { borderLeftColor: m.couleur } : undefined}
          >
            <div className="ml-texte">
              <div className="ml-nom">{m.nom}</div>
              {m.phone ? (
                <div className="ml-num">
                  {m.display} <span className="ml-hrs">· {m.hours}</span>
                </div>
              ) : (
                <div className="ml-hrs">Contact à venir</div>
              )}
            </div>
            {m.phone ? (
              <a
                className="ml-appel"
                href={`tel:${m.phone}`}
                aria-label={`Appeler ${m.nom} au ${m.display}`}
              >
                <IconePhone />
              </a>
            ) : (
              <span className="ml-appel inactif" aria-hidden="true">
                <IconePhone />
              </span>
            )}
          </div>
        ))}

        <div className="info-note">
          Les numéros affichés sont les numéros de support publics des
          fabricants. Les marques sans numéro sont au catalogue mais leur
          contact n'est pas encore vérifié.
        </div>
      </div>
    </div>
  );
}
