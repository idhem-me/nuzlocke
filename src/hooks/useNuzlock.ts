"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getNuzlock,
  resetZone,
  setAllZonesCollapsed,
  setZoneCollapsed,
  updateZoneCapture,
} from "@/lib/storage/nuzlock-store";
import type { Capture } from "@/types/capture";
import type { Nuzlock } from "@/types/nuzlock";

export function useNuzlock(id: string) {
  const [nuzlock, setNuzlock] = useState<Nuzlock | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const data = await getNuzlock(id);
      setNuzlock(data ?? null);
      if (!data) setError("Nuzlocke introuvable.");
    } catch {
      setError("Impossible de charger ce Nuzlocke.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setError(null);
        const data = await getNuzlock(id);
        if (!cancelled) {
          setNuzlock(data ?? null);
          if (!data) setError("Nuzlocke introuvable.");
        }
      } catch {
        if (!cancelled) setError("Impossible de charger ce Nuzlocke.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const saveCapture = useCallback(
    async (zoneId: string, capture: Capture | null) => {
      const updated = await updateZoneCapture(id, zoneId, capture);
      if (updated) setNuzlock(updated);
      return updated;
    },
    [id],
  );

  const clearZone = useCallback(
    async (zoneId: string) => {
      const updated = await resetZone(id, zoneId);
      if (updated) setNuzlock(updated);
      return updated;
    },
    [id],
  );

  const toggleZoneCollapsed = useCallback(
    async (zoneId: string, collapsed: boolean) => {
      const updated = await setZoneCollapsed(id, zoneId, collapsed);
      if (updated) setNuzlock(updated);
      return updated;
    },
    [id],
  );

  const toggleAllZonesCollapsed = useCallback(
    async (zoneIds: string[], collapsed: boolean) => {
      const updated = await setAllZonesCollapsed(id, zoneIds, collapsed);
      if (updated) setNuzlock(updated);
      return updated;
    },
    [id],
  );

  return {
    nuzlock,
    loading,
    error,
    refresh,
    saveCapture,
    clearZone,
    toggleZoneCollapsed,
    toggleAllZonesCollapsed,
  };
}
