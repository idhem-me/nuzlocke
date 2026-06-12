import type { Capture } from "@/types/capture";
import type { Nuzlock } from "@/types/nuzlock";

export function isZoneFilled(capture: Capture | null | undefined): boolean {
  if (!capture) return false;
  return capture.captureFailed || capture.speciesName.trim().length > 0;
}

export function getCaptureDisplayName(capture: Capture): string {
  if (capture.captureFailed) return "Échec de capture";
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
