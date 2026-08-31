import { useCallback, useEffect, useState } from "react";
import Home from "./views/Home";
import Catalog from "./views/Catalog";
import Assistant from "./views/Assistant";
import Community from "./views/Community";
import Hotline from "./views/Hotline";

const SCREENS = ["home", "catalog", "assistant", "community", "hotline"];

const NAV = [
  {
    id: "home",
    label: "Accueil",
    icon: (
      <>
        <path
          d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <polyline
          points="9,22 9,12 15,12 15,22"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    id: "catalog",
    label: "Formations",
    icon: (
      <polygon
        points="5,3 19,12 5,21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    id: "community",
    label: "Pairs",
    icon: (
      <path
        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    ),
  },
  {
    id: "hotline",
    label: "Hotline",
    icon: (
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.59 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.18 6.18l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    ),
  },
];

/** Le raccourci du manifest peut ouvrir l'app directement sur un écran. */
function initialScreen() {
  const param = new URLSearchParams(window.location.search).get("screen");
  return SCREENS.includes(param) ? param : "home";
}

export default function App() {
  const [screen, setScreen] = useState(initialScreen);

  const go = useCallback((next) => {
    setScreen(next);
    // Historique : le bouton retour du téléphone revient à l'écran précédent
    // au lieu de quitter l'application.
    window.history.pushState({ screen: next }, "");
  }, []);

  useEffect(() => {
    const onPop = (e) => {
      const target = e.state?.screen;
      setScreen(SCREENS.includes(target) ? target : "home");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const goHome = useCallback(() => go("home"), [go]);

  return (
    <div className="phone">
      <div className="header">
        <div className="logo">
          <div className="logo-mark">⚡</div>
          <div className="logo-name">
            Les Éclaireurs<span>!</span>
          </div>
        </div>
      </div>

      <div className="screen">
        {screen === "home" && <Home go={go} />}
        {screen === "catalog" && <Catalog onBack={goHome} />}
        {screen === "assistant" && <Assistant onBack={goHome} go={go} />}
        {screen === "community" && <Community onBack={goHome} />}
        {screen === "hotline" && <Hotline onBack={goHome} />}
      </div>

      <nav className="nav-bar">
        {NAV.map((n) => (
          <button
            key={n.id}
            className={`ni ${screen === n.id ? "on" : ""}`}
            onClick={() => go(n.id)}
            aria-current={screen === n.id ? "page" : undefined}
          >
            <svg viewBox="0 0 24 24" fill="none">
              {n.icon}
            </svg>
            <span>{n.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
