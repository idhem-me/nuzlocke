import { indexedDbStorage } from "./indexeddb";
import type { StorageAdapter } from "./types";

/**
 * Point d'entrée unique du stockage.
 * Remplacer `indexedDbStorage` par une autre implémentation si besoin (ex. sync cloud).
 */
export const storage: StorageAdapter = indexedDbStorage;

export type { StorageAdapter } from "./types";
