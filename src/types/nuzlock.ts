import type { Capture } from "./capture";

export interface Nuzlock {
  id: string;
  name: string;
  gameId: string;
  zoneListId: string;
  createdAt: string;
  updatedAt: string;
  captures: Record<string, Capture | null>;
  /** Zones repliées (clé = zoneId, valeur true = repliée). */
  collapsedZones?: Record<string, boolean>;
}

export interface CreateNuzlockInput {
  name: string;
  gameId: string;
  zoneListId: string;
}
