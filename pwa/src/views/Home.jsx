import { useEffect, useRef, useState } from "react";
import { useCatalog } from "../data/useCatalog";
import { useProfile } from "../data/profile";
import { isVoiceSupported, startDictation } from "../lib/speech";

export default function Home({ go, onAsk }) {
  const { courses } = useCatalog();
  const profile = useProfile();
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const stopRef = useRef(null);
  const voiceOk = isVoiceSupported();

  useEffect(() => () => stopRef.current?.(), []);

  const submit = (text) => {
    const q = (text ?? input).trim();
    if (!q) return;
    onAsk(q);
  };

  const toggleVoice = () => {
    if (listening) {
      stopRef.current?.();
      setListening(false);
      return;
    }
    setListening(true);
    stopRef.current = startDictation(
      (text, isFinal) => {
        setInput(text);
        if (isFinal) {
          setListening(false);
          submit(text);
        }
      },
      () => setListening(false)
    );
  };

  const videoCount = courses.filter((c) =>
    ["Vidéo", "Micro-learning"].includes(c.format)
  ).length;

  return (
    <div className="view active">
      <div className="home-pad">
        {/* ── Zone de dialogue : entrée principale de l'application ── */}
        <div className="agent-card">
          <div className="agent-header">
            <div className="agent-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="2" />
                <path
                  d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <div className="agent-label">
                {profile.name ? `Bonjour ${profile.name.split(" ")[0]}` : "Assistant terrain"}
              </div>
              <div className="agent-sub">
                Quel produit dois-tu installer aujourd'hui ?
              </div>
            </div>
          </div>

          <div className="input-row">
            <input
              className="ec-input"
              placeholder="Ex : borne 22 kW en copro, PAC air/eau…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              aria-label="Décrire ton besoin"
            />
            {voiceOk && (
              <button
                className={`mic-btn ${listening ? "rec" : ""}`}
                onClick={toggleVoice}
                aria-label={listening ? "Arrêter la dictée" : "Dicter"}
              >
                <svg viewBox="0 0 24 24" fill="#fff">
                  <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
                  <path
                    d="M19 10v1a7 7 0 0 1-14 0v-1M12 19v3M8 22h8"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </button>
            )}
            <button
              className="send-btn"
              onClick={() => submit()}
              disabled={!input.trim()}
              aria-label="Envoyer"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="agent-hint">
            {listening ? (
              <>
                <span className="rec-dot" /> À l'écoute…
              </>
            ) : voiceOk ? (
              <>
                Tape ta question ou appuie sur le <b>micro</b>
              </>
            ) : (
              <>Décris ton chantier en langage courant</>
            )}
          </div>
        </div>

        <div className="section-title">Accès rapide</div>
        <div className="grid2">
          <div className="action-card blue" onClick={() => go("videos")}>
            <div className="ac-icon">
              <svg viewBox="0 0 24 24" fill="#2563eb">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
            <div className="ac-title">Tutos vidéo</div>
            <div className="ac-sub">{videoCount} vidéos courtes</div>
            <span className="ac-badge badge-blue">Sur le chantier</span>
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
            <span className="ac-badge badge-demo">Démo</span>
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
            <div className="ac-sub">Support technique</div>
            <span className="ac-badge badge-orange">Appel direct</span>
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
