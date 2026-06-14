const TYPE_SPRITE_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/brilliant-diamond-shining-pearl";

export interface PokemonTypeInfo {
  id: number;
  nameFr: string;
}

export const POKEMON_TYPES: Record<number, PokemonTypeInfo> = {
  1: { id: 1, nameFr: "Normal" },
  2: { id: 2, nameFr: "Combat" },
  3: { id: 3, nameFr: "Vol" },
  4: { id: 4, nameFr: "Poison" },
  5: { id: 5, nameFr: "Sol" },
  6: { id: 6, nameFr: "Roche" },
  7: { id: 7, nameFr: "Insecte" },
  8: { id: 8, nameFr: "Spectre" },
  9: { id: 9, nameFr: "Acier" },
  10: { id: 10, nameFr: "Feu" },
  11: { id: 11, nameFr: "Eau" },
  12: { id: 12, nameFr: "Plante" },
  13: { id: 13, nameFr: "Électrik" },
  14: { id: 14, nameFr: "Psy" },
  15: { id: 15, nameFr: "Glace" },
  16: { id: 16, nameFr: "Dragon" },
  17: { id: 17, nameFr: "Ténèbres" },
  18: { id: 18, nameFr: "Fée" },
};

export function getPokemonTypeInfo(typeId: number): PokemonTypeInfo | undefined {
  return POKEMON_TYPES[typeId];
}

export function getPokemonTypeIconUrl(typeId: number): string {
  return `${TYPE_SPRITE_BASE}/${typeId}.png`;
}
