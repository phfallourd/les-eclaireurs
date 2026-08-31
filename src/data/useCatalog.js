import { useEffect, useState } from "react";
import fallback from "./catalog-fallback.json";

/**
 * Le catalogue est produit par le repo principal (les-eclaireurs), qui le
 * publie en JSON statique. On le récupère au runtime pour qu'une nouvelle
 * formation apparaisse dans la PWA sans avoir à la redéployer.
 *
 * Trois niveaux de repli, du plus frais au plus robuste :
 *   1. réseau        → données à jour
 *   2. localStorage  → dernier catalogue vu par cet appareil
 *   3. bundle        → snapshot figé au build (premier lancement hors ligne)
 */
const CATALOG_URL =
  import.meta.env.VITE_CATALOG_URL ||
  "https://les-eclaireurs-two.vercel.app/data/catalog.json";

const CACHE_KEY = "eclaireurs:catalog";

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Quota plein ou mode privé : on continue sans cacher, ce n'est pas bloquant.
  }
}

/**
 * Plusieurs écrans consomment le catalogue. On partage une seule requête au
 * niveau du module pour ne pas la déclencher une fois par composant monté.
 */
let inFlight = null;

function fetchCatalog() {
  if (!inFlight) {
    inFlight = (async () => {
      const res = await fetch(CATALOG_URL, { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data.courses)) throw new Error("format inattendu");
      return data;
    })().catch((err) => {
      // On relâche la promesse en cache pour permettre une nouvelle tentative
      // lors du prochain montage (retour du réseau, par exemple).
      inFlight = null;
      throw err;
    });
  }
  return inFlight;
}

export function useCatalog() {
  const [catalog, setCatalog] = useState(() => readCache() || fallback);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    fetchCatalog()
      .then((data) => {
        if (cancelled) return;
        setCatalog(data);
        writeCache(data);
        setStatus("fresh");
      })
      .catch(() => {
        if (cancelled) return;
        // Pas de réseau : on garde ce qui est déjà affiché (cache ou bundle).
        setStatus(readCache() ? "cached" : "offline");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    courses: catalog.courses || [],
    sources: catalog.sources || [],
    themes: catalog.themes || [],
    formats: catalog.formats || [],
    generatedAt: catalog.generatedAt,
    status,
  };
}
