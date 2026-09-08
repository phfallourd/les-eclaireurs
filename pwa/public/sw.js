// ═══════════════════════════════════════════════════════
//  Les Éclaireurs! — Service Worker
//
//  Stratégies, par type de ressource :
//   • navigation (index.html) → Network First
//     Indispensable : en Cache First, un utilisateur ayant installé l'app
//     resterait bloqué sur l'ancienne version à chaque déploiement.
//   • assets hachés (/assets/*) → Cache First
//     Leur nom change à chaque build, ils sont donc immuables : aucun risque
//     de servir une version périmée.
//   • catalogue distant → Network First
//     Les formations doivent être fraîches quand le réseau est là.
//   • polices, icônes → Cache First
// ═══════════════════════════════════════════════════════

const CACHE_NAME = "eclaireurs-v2";
const OFFLINE_URL = "/offline.html";

const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/offline.html",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// ── INSTALLATION ──────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.allSettled(PRECACHE_ASSETS.map((url) => cache.add(url)))
      )
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATION ───────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── FETCH ────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  if (url.protocol === "chrome-extension:") return;

  // Navigations : toujours tenter le réseau, pour récupérer les mises à jour.
  if (request.mode === "navigate") {
    event.respondWith(networkFirstDocument(request));
    return;
  }

  // Catalogue de formations (servi par le site principal).
  if (url.pathname.endsWith("/data/catalog.json")) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Polices Google : immuables une fois récupérées.
  if (
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com"
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Assets de build (hachés) et icônes : Cache First sans risque.
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});

// ── STRATÉGIES ───────────────────────────────────────────

async function networkFirstDocument(request) {
  try {
    const fresh = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put("/index.html", fresh.clone());
    return fresh;
  } catch {
    const cached = (await caches.match("/index.html")) || (await caches.match("/"));
    return cached || caches.match(OFFLINE_URL);
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const fresh = await fetch(request);
    if (fresh.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, fresh.clone());
    }
    return fresh;
  } catch (err) {
    if (request.mode === "navigate") return caches.match(OFFLINE_URL);
    throw err;
  }
}

async function networkFirst(request) {
  try {
    const fresh = await fetch(request);
    if (fresh.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, fresh.clone());
    }
    return fresh;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === "navigate") return caches.match(OFFLINE_URL);
    throw new Error("Ressource indisponible hors ligne");
  }
}
