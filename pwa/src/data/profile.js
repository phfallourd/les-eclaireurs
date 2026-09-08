import { useSyncExternalStore } from "react";

/**
 * Profil de l'électricien, stocké sur l'appareil.
 *
 * Limite importante : ce profil est **local au téléphone**. Il n'est pas
 * partagé avec la version web, qui est servie depuis un autre domaine — deux
 * origines distinctes ne peuvent pas lire le même stockage navigateur.
 * Une vraie synchronisation demandera des comptes utilisateurs côté serveur.
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

export function setIdentity({ name, specialty }) {
  write({
    ...current,
    name: name ?? current.name,
    specialty: specialty ?? current.specialty,
  });
}

export function toggleSaved(courseId) {
  const saved = current.saved.includes(courseId)
    ? current.saved.filter((id) => id !== courseId)
    : [...current.saved, courseId];
  write({ ...current, saved });
}

export function isSaved(courseId) {
  return current.saved.includes(courseId);
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

/**
 * Export texte de la sélection, en attendant la synchronisation par compte.
 * Permet à l'électricien de s'envoyer sa liste pour la retrouver sur le web.
 */
export function buildExport(courses, savedIds) {
  const selected = courses.filter((c) => savedIds.includes(c.id));
  if (selected.length === 0) return "";
  const lines = selected.map(
    (c) => `• ${c.title} (${c.sourceLabel}, ${c.duration})${c.url ? `\n  ${c.url}` : ""}`
  );
  return `Mes formations — Les Éclaireurs!\n\n${lines.join("\n")}`;
}
