import type { Capture } from "@/types/capture";
import type { Zone } from "@/types/game";
import type { Nuzlock } from "@/types/nuzlock";

export function normalizeForSearch(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

export function matchesZoneSearch(zone: Zone, query: string): boolean {
  const normalizedQuery = normalizeForSearch(query.trim());
  if (!normalizedQuery) return true;

  const haystack = normalizeForSearch(
    `${zone.name} ${zone.note ?? ""} ${zone.id.replace(/-/g, " ")}`,
  );

  return haystack.includes(normalizedQuery);
}

export function filterZonesByQuery(zones: Zone[], query: string): Zone[] {
  return zones.filter((zone) => matchesZoneSearch(zone, query));
}

export function isZoneFilled(capture: Capture | null | undefined): boolean {
  if (!capture) return false;
  return capture.captureFailed || capture.speciesName.trim().length > 0;
}

export function getCaptureDisplayName(capture: Capture): string {
  if (capture.captureFailed) {
    const speciesName = capture.speciesName.trim();
    if (speciesName) return speciesName;
    return "Échec de capture";
  }
  const nickname = capture.nickname.trim();
  if (nickname) return nickname;
  return capture.speciesName.trim() || "Pokémon";
}

export function getFilledZoneIds(nuzlock: Nuzlock): string[] {
  return Object.entries(nuzlock.captures)
    .filter(([, capture]) => isZoneFilled(capture))
    .map(([zoneId]) => zoneId);
}

export function isZoneCollapsed(nuzlock: Nuzlock, zoneId: string): boolean {
  return nuzlock.collapsedZones?.[zoneId] === true;
}

export function areAllZonesCollapsed(
  nuzlock: Nuzlock,
  zoneIds: string[],
): boolean {
  if (zoneIds.length === 0) return false;
  return zoneIds.every((id) => isZoneCollapsed(nuzlock, id));
}
