import { useEffect, useRef, useState } from "react";
import { useCatalog } from "../data/useCatalog";
import { matchCourses, DOMAIN_LABELS } from "../lib/matchCourses";
import { isVoiceSupported, startDictation } from "../lib/speech";
import BackRow from "../components/BackRow";
import CourseSheet from "../components/CourseSheet";

const SUGGESTIONS = [
  "Borne 22 kW en copropriété",
  "PAC air/eau en relève de chaudière",
  "Erreur sur une borne EVlink",
  "Mise en service witty Hager",
];

/**
 * Interroge l'assistant conversationnel s'il est configuré côté serveur.
 * Retourne null si l'endpoint n'existe pas ou n'est pas activé : dans ce cas
 * seule la recommandation locale est affichée, ce qui reste utile.
 */
async function askRemoteAssistant(question, candidates) {
  try {
    const res = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, candidates }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.reply === "string" && data.reply ? data.reply : null;
  } catch {
    return null;
  }
}

export default function Assistant({ onBack, go, initialQuery = "" }) {
  const { courses } = useCatalog();
  const [input, setInput] = useState("");
  const [exchanges, setExchanges] = useState([]);
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [selected, setSelected] = useState(null);
  const [voiceError, setVoiceError] = useState("");

  const stopRef = useRef(null);
  const bottomRef = useRef(null);
  const askedInitial = useRef(false);
  const voiceOk = isVoiceSupported();

  const ask = async (rawQuery) => {
    const question = rawQuery.trim();
    if (!question || thinking) return;

    const result = matchCourses(question, courses);
    const entry = {
      question,
      ...result,
      reply: null,
    };

    setExchanges((prev) => [...prev, entry]);
    setInput("");
    setThinking(true);

    // L'assistant distant enrichit la réponse quand il est configuré ;
    // la recommandation locale est déjà affichée entre-temps.
    const candidates = [...result.videos, ...result.training];
    const reply = await askRemoteAssistant(question, candidates);

    setExchanges((prev) =>
      prev.map((e, i) => (i === prev.length - 1 ? { ...e, reply } : e))
    );
    setThinking(false);
  };

  // Question transmise depuis l'accueil.
  useEffect(() => {
    if (initialQuery && !askedInitial.current && courses.length > 0) {
      askedInitial.current = true;
      ask(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery, courses.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [exchanges, thinking]);

  useEffect(() => () => stopRef.current?.(), []);

  const toggleVoice = () => {
    if (listening) {
      stopRef.current?.();
      setListening(false);
      return;
    }
    setVoiceError("");
    setListening(true);
    stopRef.current = startDictation(
      (text, isFinal) => {
        setInput(text);
        if (isFinal) {
          setListening(false);
          ask(text);
        }
      },
      (reason, message) => {
        setListening(false);
        // "done" et "aborted" sont des fins normales, pas des erreurs.
        if (reason !== "done" && message) setVoiceError(message);
      }
    );
  };

  return (
    <div className="view active">
      <div className="view-pad">
        <BackRow onBack={onBack} title="Assistant terrain" />

        {exchanges.length === 0 && (
          <>
            <p className="view-intro">
              Décris ton chantier ou ton problème. L'assistant te renvoie vers
              les vidéos et formations correspondantes.
            </p>
            <div className="suggest-grid">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="suggest-chip" onClick={() => ask(s)}>
                  {s}
                </button>
              ))}
            </div>
          </>
        )}

        {exchanges.map((e, i) => (
          <div key={i} className="exchange">
            <div className="bubble-user">{e.question}</div>

            <div className="bubble-bot">
              {e.domains.length > 0 && (
                <div className="bot-understood">
                  Sujet identifié :{" "}
                  <strong>
                    {e.domains
                      .slice(0, 2)
                      .map((d) => DOMAIN_LABELS[d] || d)
                      .join(", ")}
                  </strong>
                </div>
              )}

              {e.reply && <p className="bot-reply">{e.reply}</p>}

              {!e.hasMatch && (
                <p className="bot-reply">
                  Rien dans le catalogue ne correspond à cette demande. Le
                  catalogue couvre pour l'instant l'IRVE, les pompes à chaleur,
                  la domotique, les tableaux et le photovoltaïque. Pour un
                  problème produit précis, la hotline du fabricant sera plus
                  rapide.
                </p>
              )}

              {e.videos.length > 0 && (
                <>
                  <div className="bot-section">À regarder maintenant</div>
                  {e.videos.map((c) => (
                    <ResultRow
                      key={c.id}
                      course={c}
                      onOpen={() => setSelected(c)}
                    />
                  ))}
                </>
              )}

              {e.hasMatch && e.videos.length === 0 && (
                <div className="bot-note">
                  Pas encore de vidéo courte sur ce sujet au catalogue.
                </div>
              )}

              {e.training.length > 0 && (
                <>
                  <div className="bot-section">Pour aller plus loin</div>
                  {e.training.map((c) => (
                    <ResultRow key={c.id} course={c} onOpen={() => setSelected(c)} />
                  ))}
                </>
              )}

              {/* Trois portes de sortie : se former, demander à un pair,
                  ou appeler le fabricant si le problème est produit. */}
              <div className="bot-section">Et maintenant</div>
              <div className="next-actions">
                <button className="next-btn na-blue" onClick={() => go("videos")}>
                  <span className="na-emoji">▶</span>
                  <span className="na-label">Tutos vidéo</span>
                </button>
                <button
                  className="next-btn na-violet"
                  onClick={() => go("community")}
                >
                  <span className="na-emoji">👷</span>
                  <span className="na-label">Demander à un pair</span>
                </button>
                <button
                  className="next-btn na-orange"
                  onClick={() => go("hotline")}
                >
                  <span className="na-emoji">📞</span>
                  <span className="na-label">Hotline fabricant</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {thinking && (
          <div className="bubble-bot thinking">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="ask-bar">
        {voiceError && <div className="voice-error">{voiceError}</div>}
        {listening && (
          <div className="listening-hint">
            <span className="rec-dot" /> À l'écoute…
          </div>
        )}
        <div className="input-row">
          <input
            className="ec-input"
            placeholder="Décris ton chantier…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask(input)}
            aria-label="Poser une question à l'assistant"
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
            onClick={() => ask(input)}
            disabled={!input.trim() || thinking}
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
      </div>

      {selected && (
        <CourseSheet course={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

const SHORT_FORMATS = ["Vidéo", "Micro-learning"];

/**
 * Une vidéo s'ouvre directement : sur un chantier, une boîte de dialogue
 * intermédiaire est un clic de trop. Les formations longues gardent leur
 * fiche, où l'on a besoin de connaître durée, niveau et prérequis.
 */
function ResultRow({ course, onOpen }) {
  const isVideo = SHORT_FORMATS.includes(course.format);
  const openDirect = isVideo && course.url;

  const content = (
    <>
      <span className="result-emoji">{openDirect ? "▶" : course.emoji}</span>
      <span className="result-text">
        <span className="result-title">{course.title}</span>
        <span className="result-meta">
          {course.sourceLabel} · {course.duration}
          {openDirect ? " · ouvre la vidéo" : ""}
        </span>
      </span>
    </>
  );

  return (
    <div className="result-row">
      {openDirect ? (
        <a
          className="result-main"
          href={course.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      ) : (
        <button className="result-main" onClick={onOpen}>
          {content}
        </button>
      )}
    </div>
  );
}
