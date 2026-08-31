import { useCatalog } from "../data/useCatalog";

export default function Home({ go }) {
  const { courses } = useCatalog();
  const withLink = courses.filter((c) => c.url).length;

  return (
    <div className="view active">
      <div className="home-pad">
        <div className="hero-card">
          <div className="hero-title">Trouve la bonne formation</div>
          <div className="hero-sub">
            Catalogue multi-marques : IRVE, pompes à chaleur, domotique, TGBT.
          </div>
          <button className="hero-cta" onClick={() => go("catalog")}>
            Parcourir le catalogue
          </button>
          <div className="hero-meta">
            {courses.length} formations référencées · {withLink} avec accès
            direct
          </div>
        </div>

        <div className="section-title">Accès rapide</div>
        <div className="grid2">
          <div className="action-card blue" onClick={() => go("catalog")}>
            <div className="ac-icon">
              <svg viewBox="0 0 24 24" fill="#2563eb">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
            <div className="ac-title">Formations & tutos</div>
            <div className="ac-sub">{courses.length} référencées</div>
            <span className="ac-badge badge-blue">Multi-marques</span>
          </div>

          <div className="action-card orange" onClick={() => go("hotline")}>
            <div className="ac-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f97316"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.59 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.18 6.18l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div className="ac-title">Hotline fabricant</div>
            <div className="ac-sub">Support technique direct</div>
            <span className="ac-badge badge-orange">Numéros réels</span>
          </div>

          <div className="action-card violet" onClick={() => go("community")}>
            <div className="ac-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
              </svg>
            </div>
            <div className="ac-title">Réseau de pairs</div>
            <div className="ac-sub">Entraide entre électriciens</div>
            <span className="ac-badge badge-demo">Aperçu</span>
          </div>

          <div className="action-card green" onClick={() => go("assistant")}>
            <div className="ac-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16a34a"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
              </svg>
            </div>
            <div className="ac-title">Assistant terrain</div>
            <div className="ac-sub">Orientation pédagogique</div>
            <span className="ac-badge badge-demo">Aperçu</span>
          </div>
        </div>

        <div className="info-note">
          Les Éclaireurs! n'édite pas de formations : la plateforme référence et
          oriente vers les catalogues officiels des organismes et fabricants.
        </div>
      </div>
    </div>
  );
}
