export interface PokemonSpeciesEntry {
  id: number;
  nameFr: string;
  nameEn: string;
}

export interface PokeApiSpeciesListItem {
  name: string;
  url: string;
}

export interface PokeApiSpeciesList {
  count: number;
  results: PokeApiSpeciesListItem[];
}

export interface PokeApiSpecies {
  id: number;
  name: string;
  names: { name: string; language: { name: string } }[];
  varieties: { is_default: boolean; pokemon: { url: string } }[];
}

export interface PokeApiPokemon {
  id: number;
  sprites: {
    front_default: string | null;
  };
}
