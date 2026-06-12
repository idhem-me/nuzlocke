import type { Nuzlock } from "@/types/nuzlock";
import type { PokemonSpeciesEntry } from "@/lib/pokemon/types";

export const DB_NAME = "nuzlocke-tracker";
export const DB_VERSION = 1;

export const STORES = {
  nuzlocks: "nuzlocks",
  pokemonCache: "pokemon-cache",
  meta: "meta",
} as const;

export interface PokemonCacheRecord {
  id: "species";
  species: PokemonSpeciesEntry[];
  fetchedAt: string;
}

export interface MetaRecord {
  key: string;
  value: unknown;
}

export interface StorageAdapter {
  getAllNuzlocks(): Promise<Nuzlock[]>;
  getNuzlock(id: string): Promise<Nuzlock | undefined>;
  saveNuzlock(nuzlock: Nuzlock): Promise<void>;
  deleteNuzlock(id: string): Promise<void>;
  getPokemonCache(): Promise<PokemonCacheRecord | undefined>;
  savePokemonCache(cache: PokemonCacheRecord): Promise<void>;
}
