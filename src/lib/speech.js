/**
 * Dictée vocale via l'API Web Speech du navigateur.
 *
 * Contraintes réelles rencontrées sur mobile :
 *
 * • iOS — l'API existe dans Safari, mais elle est **inopérante quand la PWA
 *   est lancée depuis l'écran d'accueil** (mode standalone). C'est une
 *   limitation connue d'iOS, pas un défaut de l'application : le micro n'est
 *   pas accordé aux web apps installées. On détecte ce cas pour afficher un
 *   message utile plutôt qu'un bouton qui ne répond pas.
 *
 * • La permission micro doit être demandée explicitement. Sans cela, sur
 *   plusieurs navigateurs, `recognition.start()` échoue en silence.
 *
 * • HTTPS obligatoire (satisfait en production, pas en http:// local).
 */

function getRecognitionClass() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPadOS se présente comme un Mac tactile
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.navigator.standalone === true ||
    window.matchMedia?.("(display-mode: standalone)").matches === true
  );
}

function isSecure() {
  if (typeof window === "undefined") return false;
  return window.isSecureContext !== false;
}

/**
 * Diagnostic du support de la dictée.
 * @returns {{ok: boolean, reason: string, message: string}}
 */
export function voiceStatus() {
  if (!getRecognitionClass()) {
    return {
      ok: false,
      reason: "unsupported",
      message:
        "Ce navigateur ne gère pas la dictée vocale. Essaie avec Chrome, ou tape ta question.",
    };
  }

  if (!isSecure()) {
    return {
      ok: false,
      reason: "insecure",
      message: "La dictée nécessite une connexion sécurisée (https).",
    };
  }

  if (isIOS() && isStandalone()) {
    return {
      ok: false,
      reason: "ios-standalone",
      message:
        "iOS ne donne pas accès au micro aux applications installées sur l'écran d'accueil. Ouvre le site dans Safari pour dicter, ou tape ta question.",
    };
  }

  return { ok: true, reason: "", message: "" };
}

export function isVoiceSupported() {
  return voiceStatus().ok;
}

/**
 * Demande la permission micro avant de lancer la reconnaissance.
 * Sans cette étape, `start()` échoue silencieusement sur plusieurs
 * navigateurs mobiles.
 */
async function ensureMicPermission() {
  if (!navigator.mediaDevices?.getUserMedia) return true; // on tente quand même
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // On relâche immédiatement : la reconnaissance ouvrira son propre flux.
    stream.getTracks().forEach((t) => t.stop());
    return true;
  } catch {
    return false;
  }
}

/**
 * Démarre une dictée. Retourne une fonction d'arrêt.
 *
 * @param {(text: string, isFinal: boolean) => void} onResult
 * @param {(reason: string, message?: string) => void} onEnd
 */
export function startDictation(onResult, onEnd) {
  const status = voiceStatus();
  if (!status.ok) {
    onEnd(status.reason, status.message);
    return () => {};
  }

  const Recognition = getRecognitionClass();
  let recognition = null;
  let stopped = false;

  (async () => {
    const granted = await ensureMicPermission();
    if (stopped) return;

    if (!granted) {
      onEnd(
        "not-allowed",
        "Accès au micro refusé. Autorise-le dans les réglages du navigateur."
      );
      return;
    }

    recognition = new Recognition();
    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = true; // retour visuel pendant que l'on parle
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let transcript = "";
      let isFinal = false;
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
        if (event.results[i].isFinal) isFinal = true;
      }
      onResult(transcript, isFinal);
    };

    recognition.onerror = (event) => {
      const code = event.error || "error";
      const messages = {
        "not-allowed":
          "Accès au micro refusé. Autorise-le dans les réglages du navigateur.",
        "service-not-allowed":
          "Le service de reconnaissance vocale est bloqué sur cet appareil.",
        "no-speech": "Rien entendu. Réessaie en parlant plus près du micro.",
        network: "La dictée nécessite une connexion internet.",
        aborted: "",
      };
      onEnd(code, messages[code] ?? "La dictée a échoué. Tape ta question.");
    };

    recognition.onend = () => onEnd("done");

    try {
      recognition.start();
    } catch {
      onEnd("error", "Impossible de démarrer la dictée. Tape ta question.");
    }
  })();

  return () => {
    stopped = true;
    try {
      recognition?.stop();
    } catch {
      // Déjà arrêtée : sans conséquence.
    }
  };
}
