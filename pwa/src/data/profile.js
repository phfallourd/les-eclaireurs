import { useSyncExternalStore } from "react";
import { pg, pgInsert, pgDelete, pgUpdate, session, surChangementSession } from "../lib/supabase";

/**
 * Profil de l'électricien.
 *
 * Deux modes, sans rupture d'usage :
 *   — sans compte : tout reste sur l'appareil, comme avant ;
 *   — avec un compte : le profil et les formations enregistrées sont
 *     synchronisés avec Supabase, donc partagés avec le site web et
 *     retrouvés sur un autre téléphone.
 *
 * L'écriture est toujours locale d'abord : l'interface répond immédiatement,
 * même sur un chantier sans réseau, et le serveur est mis à jour ensuite.
 */
const KEY = "eclaireurs:profile";

const DEFAULT_PROFILE = {
  name: "",
  specialty: "Électricien installateur",
  saved: [], // identifiants de formations
};

export const SPECIALTIES = [
  "Électricien installateur",
  "Artisan à son compte",
  "Chef d'équipe",
  "Apprenti / en formation",
  "Technicien de maintenance",
  "En reconversion",
];

/** Les identifiants du catalogue en base sont des UUID ; ceux du snapshot
 *  embarqué sont des entiers. On ne synchronise que les premiers. */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const estIdBase = (id) => typeof id === "string" && UUID.test(id);

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

let current = read();
const listeners = new Set();

function emit() {
  listeners.forEach((l) => l());
}

function write(next) {
  current = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Stockage indisponible (mode privé, quota) : le profil reste en mémoire
    // pour la session en cours, ce qui vaut mieux que de planter.
  }
  emit();
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return current;
}

export function useProfile() {
  return useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_PROFILE);
}

/* ─────────── Synchronisation avec le compte ─────────── */

const uid = () => session()?.user?.id ?? null;

async function pousserIdentite() {
  if (!uid()) return;
  await pgUpdate(
    "profils",
    { id: `eq.${uid()}` },
    { nom_complet: current.name || null, metier: current.specialty || null }
  );
}

/**
 * À la connexion : on récupère le profil et les formations enregistrées du
 * compte, et on les fusionne avec ce que contient l'appareil.
 * Ce qui a été fait hors connexion n'est jamais perdu.
 */
export async function synchroniser() {
  const id = uid();
  if (!id) return;

  const [profils, inscriptions] = await Promise.all([
    pg("profils", { select: "nom_complet,metier", id: `eq.${id}` }),
    pg("inscriptions", { select: "formation_id", user_id: `eq.${id}` }),
  ]);

  const distant = profils[0] ?? {};
  const enregistreesDistantes = inscriptions.map((i) => i.formation_id);
  const localesASynchroniser = current.saved.filter(
    (s) => estIdBase(s) && !enregistreesDistantes.includes(s)
  );

  // Union : le compte fait référence, l'appareil ajoute ce qu'il a en plus.
  const fusion = [...new Set([...enregistreesDistantes, ...current.saved])];

  write({
    ...current,
    name: distant.nom_complet || current.name,
    specialty: distant.metier || current.specialty,
    saved: fusion,
  });

  // Ce que l'appareil connaissait et pas le compte remonte maintenant.
  if (localesASynchroniser.length) {
    await pgInsert(
      "inscriptions",
      localesASynchroniser.map((formation_id) => ({ user_id: id, formation_id })),
      { retour: false, ignorerDoublons: true }
    );
  }
  if (!distant.nom_complet && current.name) await pousserIdentite();
}

// Une connexion (ou une reconnexion) déclenche la synchronisation.
surChangementSession((s) => {
  if (s) synchroniser().catch((e) => console.warn("[Profil] synchronisation :", e));
});

/* ─────────── Écriture ─────────── */

export function setIdentity({ name, specialty }) {
  write({
    ...current,
    name: name ?? current.name,
    specialty: specialty ?? current.specialty,
  });
  if (uid()) pousserIdentite().catch((e) => console.warn("[Profil] envoi :", e));
}

export function toggleSaved(courseId) {
  const etaitEnregistree = current.saved.includes(courseId);
  const saved = etaitEnregistree
    ? current.saved.filter((id) => id !== courseId)
    : [...current.saved, courseId];
  write({ ...current, saved });

  const id = uid();
  if (!id || !estIdBase(courseId)) return;

  const operation = etaitEnregistree
    ? pgDelete("inscriptions", { user_id: `eq.${id}`, formation_id: `eq.${courseId}` })
    : pgInsert("inscriptions", [{ user_id: id, formation_id: courseId }], {
        retour: false,
        ignorerDoublons: true,
      });

  operation.catch((e) => console.warn("[Profil] formation enregistrée :", e));
}

export function isSaved(courseId) {
  return current.saved.includes(courseId);
}

/** Après déconnexion, l'appareil repart d'un profil vierge. */
export function oublierLocalement() {
  write({ ...DEFAULT_PROFILE });
}

/** Statut affiché : dérivé de l'activité réelle, pas d'un score inventé. */
export function activityLabel(savedCount) {
  if (savedCount === 0) return "Aucune formation suivie";
  if (savedCount === 1) return "1 formation enregistrée";
  return `${savedCount} formations enregistrées`;
}

/** Initiales pour l'avatar, à partir du nom saisi. */
export function initials(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Export texte de la sélection, pratique pour se l'envoyer par message. */
export function buildExport(courses, savedIds) {
  const selected = courses.filter((c) => savedIds.includes(c.id));
  if (selected.length === 0) return "";
  const lines = selected.map(
    (c) => `• ${c.title} (${c.sourceLabel}, ${c.duration})${c.url ? `\n  ${c.url}` : ""}`
  );
  return `Mes formations — Les Éclaireurs!\n\n${lines.join("\n")}`;
}
