import { useSyncExternalStore } from "react";
import {
  session,
  surChangementSession,
  connexion as seConnecter,
  inscription as sInscrire,
  deconnexion as seDeconnecter,
  motDePasseOublie,
} from "../lib/supabase";

/**
 * Compte de l'électricien.
 *
 * Le même compte Supabase sert au site web et à l'application : le profil et
 * les formations enregistrées suivent la personne d'un appareil à l'autre.
 * Sans compte, l'application continue de fonctionner entièrement en local.
 */

const ecouteurs = new Set();
let courant = session();

surChangementSession((s) => {
  courant = s;
  ecouteurs.forEach((l) => l());
});

function subscribe(l) {
  ecouteurs.add(l);
  return () => ecouteurs.delete(l);
}

function getSnapshot() {
  return courant;
}

export function useSession() {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

export { seConnecter, sInscrire, seDeconnecter, motDePasseOublie };

export function estConnecte() {
  return Boolean(session());
}

export function idUtilisateur() {
  return session()?.user?.id ?? null;
}

export function emailUtilisateur() {
  return session()?.user?.email ?? null;
}
