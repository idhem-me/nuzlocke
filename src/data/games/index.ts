import type { Game, ZoneList } from "@/types/game";
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
];

const ZONE_LISTS: Record<string, ZoneList> = {
  "sinnoh-bdsp": sinnohBdspZones,
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
