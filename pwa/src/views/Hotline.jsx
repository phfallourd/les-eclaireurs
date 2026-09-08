import BackRow from "../components/BackRow";

/**
 * Numéros de support technique publics des fabricants.
 * À revérifier périodiquement — ils changent sans préavis.
 */
const BRANDS = [
  {
    name: "Schneider Electric",
    phone: "0800002050",
    display: "0 800 002 050",
    hours: "Lun–Ven 8h–18h · Gratuit",
    cls: "bc-sch",
  },
  {
    name: "Legrand",
    phone: "0555068787",
    display: "05 55 06 87 87",
    hours: "Lun–Ven 8h–18h",
    cls: "bc-leg",
  },
  {
    name: "Hager",
    phone: "0388698000",
    display: "03 88 69 80 00",
    hours: "Lun–Ven 8h–17h",
    cls: "bc-hag",
  },
  {
    name: "Siemens",
    phone: "0800200486",
    display: "0 800 200 486",
    hours: "Lun–Ven 8h30–17h30",
    cls: "bc-sie",
  },
];

export default function Hotline({ onBack }) {
  return (
    <div className="view active">
      <div className="view-pad">
        <BackRow onBack={onBack} title="Hotline fabricants" />
        <p className="view-intro">
          Support technique des fabricants. L'appel ouvre directement le
          composeur de ton téléphone.
        </p>

        {BRANDS.map((b) => (
          <div key={b.name} className={`brand-card ${b.cls}`}>
            <div className="bc-top">
              <span className="bc-name">{b.name}</span>
            </div>
            <div className="bc-num">{b.display}</div>
            <div className="bc-hrs">{b.hours}</div>
            <a className="call-btn" href={`tel:${b.phone}`}>
              <svg viewBox="0 0 24 24">
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.59 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.18 6.18l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              Appeler
            </a>
          </div>
        ))}

        <div className="info-note">
          Numéros publics relevés sur les sites des fabricants. Signale-nous
          toute erreur ou changement.
        </div>
      </div>
    </div>
  );
}
