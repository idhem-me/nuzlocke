import { getGameById } from "@/data/games";
import { generateId } from "@/lib/utils/id";
import type { Capture } from "@/types/capture";
import type { CreateNuzlockInput, Nuzlock } from "@/types/nuzlock";
import { storage } from "./index";

function withoutZoneCollapse(
  collapsedZones: Record<string, boolean> | undefined,
  ...zoneIds: string[]
): Record<string, boolean> | undefined {
  if (!collapsedZones) return undefined;
  const next = { ...collapsedZones };
  for (const zoneId of zoneIds) {
    delete next[zoneId];
  }
  return Object.keys(next).length > 0 ? next : undefined;
}

export async function getAllNuzlocks(): Promise<Nuzlock[]> {
  const nuzlocks = await storage.getAllNuzlocks();
  return nuzlocks.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function getNuzlock(id: string): Promise<Nuzlock | undefined> {
  return storage.getNuzlock(id);
}

export async function createNuzlock(input: CreateNuzlockInput): Promise<Nuzlock> {
  const now = new Date().toISOString();
  const nuzlock: Nuzlock = {
    id: generateId(),
    name: input.name.trim(),
    gameId: input.gameId,
    zoneListId: input.zoneListId,
    createdAt: now,
    updatedAt: now,
    captures: {},
  };
  await storage.saveNuzlock(nuzlock);
  return nuzlock;
}

export async function updateNuzlock(nuzlock: Nuzlock): Promise<Nuzlock> {
  const updated: Nuzlock = {
    ...nuzlock,
    updatedAt: new Date().toISOString(),
  };
  await storage.saveNuzlock(updated);
  return updated;
}

export async function deleteNuzlock(id: string): Promise<void> {
  await storage.deleteNuzlock(id);
}

export async function updateZoneCapture(
  nuzlockId: string,
  zoneId: string,
  capture: Capture | null,
): Promise<Nuzlock | undefined> {
  const nuzlock = await storage.getNuzlock(nuzlockId);
  if (!nuzlock) return undefined;

  const updated: Nuzlock = {
    ...nuzlock,
    captures: {
      ...nuzlock.captures,
      [zoneId]: capture,
    },
    collapsedZones: nuzlock.collapsedZones,
    updatedAt: new Date().toISOString(),
  };
  await storage.saveNuzlock(updated);
  return updated;
}

export async function resetZone(nuzlockId: string, zoneId: string) {
  return updateZoneCapture(nuzlockId, zoneId, null);
}

export async function setZoneCollapsed(
  nuzlockId: string,
  zoneId: string,
  collapsed: boolean,
): Promise<Nuzlock | undefined> {
  const nuzlock = await storage.getNuzlock(nuzlockId);
  if (!nuzlock) return undefined;

  const nextCollapsed = { ...nuzlock.collapsedZones };
  if (collapsed) {
    nextCollapsed[zoneId] = true;
  } else {
    delete nextCollapsed[zoneId];
  }

  const updated: Nuzlock = {
    ...nuzlock,
    collapsedZones:
      Object.keys(nextCollapsed).length > 0 ? nextCollapsed : undefined,
    updatedAt: new Date().toISOString(),
  };
  await storage.saveNuzlock(updated);
  return updated;
}

export async function setAllZonesCollapsed(
  nuzlockId: string,
  zoneIds: string[],
  collapsed: boolean,
): Promise<Nuzlock | undefined> {
  const nuzlock = await storage.getNuzlock(nuzlockId);
  if (!nuzlock) return undefined;
  if (zoneIds.length === 0) return nuzlock;

  const updated: Nuzlock = {
    ...nuzlock,
    collapsedZones: collapsed
      ? Object.fromEntries(zoneIds.map((id) => [id, true]))
      : withoutZoneCollapse(nuzlock.collapsedZones, ...zoneIds),
    updatedAt: new Date().toISOString(),
  };
  await storage.saveNuzlock(updated);
  return updated;
}

export function getNuzlockProgress(nuzlock: Nuzlock, totalZones: number) {
  const filled = Object.values(nuzlock.captures).filter(
    (c) => c !== null && c !== undefined,
  ).length;
  return { filled, total: totalZones };
}

export function getGameLabel(gameId: string): string {
  return getGameById(gameId)?.shortName ?? gameId;
}
