"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createNuzlock,
  deleteNuzlock,
  getAllNuzlocks,
} from "@/lib/storage/nuzlock-store";
import type { CreateNuzlockInput, Nuzlock } from "@/types/nuzlock";

export function useNuzlocks() {
  const [nuzlocks, setNuzlocks] = useState<Nuzlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const data = await getAllNuzlocks();
      setNuzlocks(data);
    } catch {
      setError("Impossible de charger vos Nuzlockes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setError(null);
        const data = await getAllNuzlocks();
        if (!cancelled) setNuzlocks(data);
      } catch {
        if (!cancelled) setError("Impossible de charger vos Nuzlockes.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const add = useCallback(
    async (input: CreateNuzlockInput) => {
      const created = await createNuzlock(input);
      setNuzlocks((prev) => [created, ...prev]);
      return created;
    },
    [],
  );

  const remove = useCallback(async (id: string) => {
    await deleteNuzlock(id);
    setNuzlocks((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return { nuzlocks, loading, error, refresh, add, remove };
}
