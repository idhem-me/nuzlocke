import { storage } from "@/lib/storage";
import type { PokemonSpeciesEntry } from "./types";
import {
  fetchPokemonSprite,
  fetchSpecies,
  fetchSpeciesList,
  getFrenchName,
} from "./api";

const CHUNK_SIZE = 25;
const spriteCache = new Map<number, string | null>();

export async function getCachedSpecies(): Promise<PokemonSpeciesEntry[]> {
  const cached = await storage.getPokemonCache();
  if (cached?.species?.length) {
    return cached.species;
  }
  return loadAndCacheSpecies();
}

export async function loadAndCacheSpecies(
  onProgress?: (loaded: number, total: number) => void,
): Promise<PokemonSpeciesEntry[]> {
  const list = await fetchSpeciesList();
  const total = list.results.length;
  const species: PokemonSpeciesEntry[] = [];

  for (let i = 0; i < list.results.length; i += CHUNK_SIZE) {
    const chunk = list.results.slice(i, i + CHUNK_SIZE);
    const details = await Promise.all(
      chunk.map(async (item) => {
        const data = await fetchSpecies(
          Number(item.url.split("/").filter(Boolean).pop()),
        );
        return {
          id: data.id,
          nameFr: getFrenchName(data),
          nameEn: data.name,
        };
      }),
    );
    species.push(...details);
    onProgress?.(Math.min(i + CHUNK_SIZE, total), total);
  }

  species.sort((a, b) => a.nameFr.localeCompare(b.nameFr, "fr"));

  await storage.savePokemonCache({
    id: "species",
    species,
    fetchedAt: new Date().toISOString(),
  });

  return species;
}

export async function getSpriteForSpecies(
  speciesId: number,
): Promise<string | null> {
  if (spriteCache.has(speciesId)) {
    return spriteCache.get(speciesId) ?? null;
  }

  try {
    const species = await fetchSpecies(speciesId);
    const sprite = await fetchPokemonSprite(species);
    spriteCache.set(speciesId, sprite);
    return sprite;
  } catch {
    return null;
  }
}

export function searchSpecies(
  species: PokemonSpeciesEntry[],
  query: string,
  limit = 8,
): PokemonSpeciesEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return species
    .filter(
      (s) =>
        s.nameFr.toLowerCase().includes(q) ||
        s.nameEn.toLowerCase().includes(q),
    )
    .slice(0, limit);
}
