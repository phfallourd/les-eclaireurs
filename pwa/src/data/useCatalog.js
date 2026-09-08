import { useEffect, useState } from "react";
import fallback from "./catalog-fallback.json";
import { SUPABASE_URL, SUPABASE_CLE } from "../lib/supabase";

/**
 * Le catalogue vient désormais de la base Supabase, source unique partagée
 * avec le site web : une formation ajoutée en base apparaît dans les deux
 * applications sans redéploiement ni synchronisation de fichier.
 *
 * La fonction SQL `catalogue_json()` renvoie exactement le même document que
 * l'ancien /data/catalog.json — le contrat de données n'a pas changé.
 *
 * Trois niveaux de repli, du plus frais au plus robuste :
 *   1. réseau        → données à jour
 *   2. localStorage  → dernier catalogue vu par cet appareil
 *   3. bundle        → snapshot figé au build (premier lancement hors ligne)
 */
const CATALOG_URL =
  import.meta.env.VITE_CATALOG_URL || `${SUPABASE_URL}/rest/v1/rpc/catalogue_json`;

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
      const res = await fetch(CATALOG_URL, {
        cache: "no-cache",
        headers: { apikey: SUPABASE_CLE, Authorization: `Bearer ${SUPABASE_CLE}` },
      });
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
