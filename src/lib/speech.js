/**
 * Dictée vocale via l'API Web Speech du navigateur.
 *
 * Support inégal : bon sur Chrome/Android, présent sur Safari iOS récent,
 * absent sur Firefox. D'où la détection explicite — le bouton micro doit
 * disparaître plutôt que de rester inerte sous le doigt d'un électricien
 * qui a les mains prises.
 *
 * La reconnaissance passe par les serveurs du navigateur (Google/Apple selon
 * la plateforme), pas par nos propres services.
 */

function getRecognitionClass() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function isVoiceSupported() {
  return getRecognitionClass() !== null;
}

/**
 * Démarre une dictée. Retourne une fonction d'arrêt.
 *
 * @param {(text: string, isFinal: boolean) => void} onResult
 * @param {(reason: string) => void} onEnd
 */
export function startDictation(onResult, onEnd) {
  const Recognition = getRecognitionClass();
  if (!Recognition) {
    onEnd("unsupported");
    return () => {};
  }

  const recognition = new Recognition();
  recognition.lang = "fr-FR";
  recognition.continuous = false;
  recognition.interimResults = true; // retour visuel pendant que l'on parle

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
    // "not-allowed" : micro refusé. "no-speech" : rien entendu.
    onEnd(event.error || "error");
  };

  recognition.onend = () => onEnd("done");

  try {
    recognition.start();
  } catch {
    onEnd("error");
  }

  return () => {
    try {
      recognition.stop();
    } catch {
      // Déjà arrêtée : sans conséquence.
    }
  };
}
