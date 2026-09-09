import { useEffect, useState } from "react";
import BackRow from "../components/BackRow";
import { pg } from "../lib/supabase";

/**
 * Actualités et prochains rendez-vous (remarques 1, 2, 20 et 23).
 *
 * Deux natures de contenu, et la distinction est affichée :
 *
 * - les **événements** sont réels et lus dans la base, la même que celle du
 *   site : ce qui est publié d'un côté apparaît de l'autre ;
 * - les **actualités** n'ont pas encore de source ; ce sont des exemples,
 *   marqués comme tels. Ils montrent la rubrique sans faire croire à un flux
 *   qui n'existe pas.
 */

const ACTUS_DEMO = [
  {
    id: "a1",
    tag: "Réglementation",
    titre: "IRVE : ce que change la nouvelle version de la NF C15-100",
    resume:
      "Sections de câbles, protection différentielle, communication avec le point de livraison — les points à connaître avant votre prochaine installation.",
    source: "Exemple de dépêche profession",
  },
  {
    id: "a2",
    tag: "Métier",
    titre: "Pompes à chaleur : la relève de chaudière en trois erreurs courantes",
    resume:
      "Dimensionnement, équilibrage du réseau existant, réglage de la loi d'eau : les retours de terrain des installateurs formés cette année.",
    source: "Exemple de dépêche profession",
  },
  {
    id: "a3",
    tag: "Portrait du mois",
    titre: "Un électricien, un parcours",
    resume:
      "Chaque mois, le parcours d'un électricien de la communauté : sa reconversion, ses certifications, ce qu'il ferait différemment.",
    source: "Rubrique à alimenter par la communauté",
  },
];

export default function News({ onBack }) {
  const [evenements, setEvenements] = useState(null);

  useEffect(() => {
    let annule = false;
    // « Prochains » rendez-vous : on ne remonte que ce qui est à venir. Afficher
    // un salon passé serait pire que de n'en afficher aucun.
    const aujourdhui = new Date().toISOString().slice(0, 10);
    pg("evenements", {
      select: "id,titre,date_evenement,heure,lieu,format,organisateur",
      statut: "eq.publiee",
      date_evenement: `gte.${aujourdhui}`,
      order: "date_evenement.asc",
      limit: "6",
    })
      .then((lignes) => !annule && setEvenements(lignes))
      // Hors ligne ou base injoignable : on n'affiche pas la section plutôt que
      // d'inventer des rendez-vous.
      .catch(() => !annule && setEvenements([]));
    return () => {
      annule = true;
    };
  }, []);

  return (
    <div className="view active">
      <div className="view-pad">
        <BackRow onBack={onBack} title="Actualités" />

        <div className="section-title" style={{ marginTop: 4 }}>
          Prochains rendez-vous
        </div>
        {evenements === null && <p className="view-intro">Chargement…</p>}
        {evenements !== null && evenements.length === 0 && (
          <p className="view-intro">
            Aucun rendez-vous à venir pour le moment.
          </p>
        )}
        {evenements?.map((e) => {
          const d = e.date_evenement ? new Date(e.date_evenement) : null;
          return (
            <div key={e.id} className="rdv-ligne">
              {d && (
                <div className="rdv-date">
                  <span className="rdv-jour">{d.getDate()}</span>
                  <span className="rdv-mois">
                    {new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(d)}
                  </span>
                </div>
              )}
              <div>
                <div className="rdv-titre">{e.titre}</div>
                <div className="rdv-meta">
                  {[e.heure, e.format, e.lieu, e.organisateur].filter(Boolean).join(" · ")}
                </div>
              </div>
            </div>
          );
        })}

        <div className="section-title">
          Actualités <span className="stat-chip chip-demo">Démo</span>
        </div>
        <div className="demo-banner">
          Les articles ci-dessous sont des exemples. La rubrique existe, le flux
          reste à brancher.
        </div>
        {ACTUS_DEMO.map((a) => (
          <div key={a.id} className="actu-carte">
            <span className="actu-tag">{a.tag}</span>
            <div className="actu-titre">{a.titre}</div>
            <p className="actu-resume">{a.resume}</p>
            <div className="actu-source">{a.source}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
