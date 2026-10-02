import BackRow from "../components/BackRow";
import { useCatalog } from "../data/useCatalog";

/**
 * Hotline fabricants.
 *
 * La liste des marques n'est plus écrite en dur : elle suit le catalogue, pour
 * qu'un fabricant ajouté en base apparaisse ici sans intervention (remarque 7).
 *
 * RÈGLE : un numéro n'entre ici que s'il a été lu sur la page officielle du
 * fabricant ET composé une fois. Le 02/10, un test a montré que deux des
 * quatre numéros affichés étaient faux (l'un menait chez un opérateur télécom,
 * l'autre n'était pas attribué) ; aucun n'avait de source. Ils ont tous été
 * retirés : sur un chantier, un mauvais numéro coûte plus cher que pas de
 * numéro du tout.
 *
 * En attendant des numéros confirmés, chaque marque renvoie vers sa page de
 * contact officielle — l'adresse, elle, est vérifiable. Pour rétablir un
 * bouton d'appel : ajouter `phone`, `display`, `hours` et `verifieLe`.
 */
const NUMEROS = {
  schneider: {
    couleur: "#3db83d",
    contact: "https://www.se.com/fr/fr/work/support/customer-care/contact-schneider-electric.jsp",
  },
  legrand: {
    couleur: "#e05a0c",
    contact: "https://www.legrand.fr/pro/nous-contacter",
  },
  hager: {
    couleur: "#c8000a",
    contact: "https://hager.com/fr/contact",
  },
  siemens: { couleur: "#009999" },
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
    const rang = (m) => (m.phone ? 0 : m.contact ? 1 : 2);
    return rang(a) - rang(b) || a.nom.localeCompare(b.nom, "fr");
  });
  const joignables = marques.filter((m) => m.phone || m.contact).length;

  return (
    <div className="view active">
      <div className="view-pad">
        <BackRow onBack={onBack} title="Hotline fabricants">
          <span className="stat-chip">{joignables}</span>
        </BackRow>
        <p className="view-intro">
          Support technique des fabricants du catalogue. Les numéros directs
          sont en cours de vérification : en attendant, chaque lien ouvre la
          page de contact officielle du fabricant.
        </p>

        {marques.map((m) => (
          <div
            key={m.id}
            className={`marque-ligne ${m.phone || m.contact ? "" : "sans-numero"}`}
            style={m.couleur ? { borderLeftColor: m.couleur } : undefined}
          >
            <div className="ml-texte">
              <div className="ml-nom">{m.nom}</div>
              {m.phone ? (
                <div className="ml-num">
                  {m.display} <span className="ml-hrs">· {m.hours}</span>
                </div>
              ) : m.contact ? (
                <div className="ml-hrs">Page de contact officielle</div>
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
            ) : m.contact ? (
              <a
                className="ml-contact"
                href={m.contact}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ouvrir la page de contact de ${m.nom}`}
              >
                Contact ↗
              </a>
            ) : (
              <span className="ml-appel inactif" aria-hidden="true">
                <IconePhone />
              </span>
            )}
          </div>
        ))}

        <div className="info-note">
          Un numéro n'est affiché ici qu'après avoir été vérifié à la source
          et testé. Si tu connais le bon numéro de support d'un fabricant,
          dis-le nous par le bouton « Un retour ? ».
        </div>
      </div>
    </div>
  );
}
