import type {
  PokeApiPokemon,
  PokeApiSpecies,
  PokeApiSpeciesList,
} from "./types";

const BASE_URL = "https://pokeapi.co/api/v2";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`PokéAPI error: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function fetchSpeciesList(): Promise<PokeApiSpeciesList> {
  return fetchJson(`${BASE_URL}/pokemon-species?limit=1025`);
}

export async function fetchSpecies(id: number): Promise<PokeApiSpecies> {
  return fetchJson(`${BASE_URL}/pokemon-species/${id}`);
}

export async function fetchPokemonSprite(
  species: PokeApiSpecies,
): Promise<string | null> {
  const variety =
    species.varieties.find((v) => v.is_default) ?? species.varieties[0];
  if (!variety) return null;

  const pokemon = await fetchJson<PokeApiPokemon>(variety.pokemon.url);
  return pokemon.sprites.front_default;
}

export function getFrenchName(species: PokeApiSpecies): string {
  return (
    species.names.find((n) => n.language.name === "fr")?.name ?? species.name
  );
}
