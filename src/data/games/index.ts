import type { Game, GymBadge, LeagueCheckpoint, ZoneList } from "@/types/game";
import { buildProgressBlocks } from "@/lib/nuzlock/badges";
import { galarSwshZones } from "./galar-swsh";
import { kantoLgpeZones } from "./kanto-lgpe";
import { sinnohBdspZones } from "./sinnoh-bdsp";

export const GAMES: Game[] = [
  {
    id: "bdsp-diamant",
    name: "Pokémon Diamant Étincelant",
    shortName: "Diamant Étincelant",
    zoneListId: "sinnoh-bdsp",
    platform: "switch",
  },
  {
    id: "bdsp-perle",
    name: "Pokémon Perle Scintillante",
    shortName: "Perle Scintillante",
    zoneListId: "sinnoh-bdsp",
    platform: "switch",
  },
  {
    id: "lgpe-pikachu",
    name: "Pokémon Let's Go, Pikachu",
    shortName: "Let's Go, Pikachu",
    zoneListId: "kanto-lgpe",
    platform: "switch",
  },
  {
    id: "lgpe-evoli",
    name: "Pokémon Let's Go, Évoli",
    shortName: "Let's Go, Évoli",
    zoneListId: "kanto-lgpe",
    platform: "switch",
  },
  {
    id: "swsh-epee",
    name: "Pokémon Épée",
    shortName: "Épée",
    zoneListId: "galar-swsh",
    platform: "switch",
  },
  {
    id: "swsh-bouclier",
    name: "Pokémon Bouclier",
    shortName: "Bouclier",
    zoneListId: "galar-swsh",
    platform: "switch",
  },
];

const ZONE_LISTS: Record<string, ZoneList> = {
  "sinnoh-bdsp": sinnohBdspZones,
  "kanto-lgpe": kantoLgpeZones,
  "galar-swsh": galarSwshZones,
};

export function getGameById(id: string): Game | undefined {
  return GAMES.find((g) => g.id === id);
}

export function getZoneListById(id: string): ZoneList | undefined {
  return ZONE_LISTS[id];
}

export function getZonesForGame(gameId: string) {
  const game = getGameById(gameId);
  if (!game) return [];
  const zoneList = getZoneListById(game.zoneListId);
  if (!zoneList) return [];
  return [...zoneList.zones].sort((a, b) => a.order - b.order);
}

export function getBadgesForGame(gameId: string): GymBadge[] {
  const game = getGameById(gameId);
  if (!game) return [];
  const zoneList = getZoneListById(game.zoneListId);
  return zoneList?.badges ?? [];
}

export function getLeagueForGame(gameId: string): LeagueCheckpoint | undefined {
  const game = getGameById(gameId);
  if (!game) return undefined;
  const zoneList = getZoneListById(game.zoneListId);
  return zoneList?.league;
}

export function getProgressBlocksForGame(gameId: string) {
  const zones = getZonesForGame(gameId);
  const badges = getBadgesForGame(gameId);
  const league = getLeagueForGame(gameId);
  if (!badges.length) {
    return [{ id: "all", header: "Zones", zones }];
  }
  return buildProgressBlocks(zones, badges, league);
}
