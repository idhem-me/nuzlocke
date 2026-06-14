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

export interface GymBadge {
  id: string;
  name: string;
  leaderName: string;
  levelCap: number;
  /** Identifiant PokéAPI du type de l'arène (ex. 6 = Roche) */
  typeId: number;
}

export interface LeagueCheckpoint {
  id: string;
  name: string;
  leaderName: string;
  levelCap: number;
}

export interface Zone {
  id: string;
  name: string;
  order: number;
  category?: ZoneCategory;
  note?: string;
  /** Badge gagné à la fin de cette section de zones */
  badgeSectionId?: string;
  /** Ligue affichée à la fin de cette section de zones */
  leagueSectionId?: string;
}

export interface ZoneList {
  id: string;
  name: string;
  zones: Zone[];
  badges?: GymBadge[];
  league?: LeagueCheckpoint;
}
