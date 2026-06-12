"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getCachedSpecies,
  loadAndCacheSpecies,
  searchSpecies,
} from "@/lib/pokemon/cache";
import type { PokemonSpeciesEntry } from "@/lib/pokemon/types";

export function usePokemonSpecies() {
  const [species, setSpecies] = useState<PokemonSpeciesEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<{ loaded: number; total: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const cached = await getCachedSpecies();
        if (!cancelled) {
          setSpecies(cached);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("Impossible de charger la liste des Pokémon.");
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    setProgress({ loaded: 0, total: 0 });
    try {
      const data = await loadAndCacheSpecies((loaded, total) => {
        setProgress({ loaded, total });
      });
      setSpecies(data);
    } catch {
      setError("Échec du chargement depuis PokéAPI.");
    } finally {
      setLoading(false);
      setProgress(null);
    }
  }, []);

  const search = useCallback(
    (query: string) => searchSpecies(species, query),
    [species],
  );

  return { species, loading, progress, error, reload, search };
}
