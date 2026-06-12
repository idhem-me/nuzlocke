export type Platform = "switch" | "ds" | "gba" | "other";

export interface Game {
  id: string;
  name: string;
  shortName: string;
  zoneListId: string;
  platform: Platform;
}

export type ZoneCategory =
  | "route"
  | "lac"
  | "rive"
  | "grotte"
  | "ville"
  | "chenal"
  | "marais"
  | "mont"
  | "parc"
  | "ruines"
  | "batiment"
  | "prairie"
  | "jardin"
  | "ile"
  | "souterrain"
  | "post-ligue"
  | "special";

export interface Zone {
  id: string;
  name: string;
  order: number;
  category?: ZoneCategory;
  note?: string;
}

export interface ZoneList {
  id: string;
  name: string;
  zones: Zone[];
}
