import type { GymBadge, LeagueCheckpoint, Zone } from "@/types/game";

export type ProgressCheckpoint =
  | { kind: "badge"; badge: GymBadge }
  | { kind: "league"; league: LeagueCheckpoint };

export type ProgressBlock = {
  id: string;
  header: string;
  zones: Zone[];
  checkpoint?: ProgressCheckpoint;
};

function getGroupKey(zone: Zone): string {
  if (zone.badgeSectionId) return `badge:${zone.badgeSectionId}`;
  if (zone.leagueSectionId) return `league:${zone.leagueSectionId}`;
  if (zone.category === "special") return "special";
  return "post-ligue";
}

function formatBadgeOrdinal(badgeNumber: number): string {
  if (badgeNumber === 1) return "1er Badge";
  return `${badgeNumber}e Badge`;
}

function getGroupHeader(zone: Zone, badges: GymBadge[]): string {
  if (zone.badgeSectionId) {
    const index = badges.findIndex((badge) => badge.id === zone.badgeSectionId);
    if (index <= 0) return "Début d'aventure";
    return `Après ${formatBadgeOrdinal(index)}`;
  }

  if (zone.leagueSectionId) {
    return badges.length > 0
      ? `Après ${formatBadgeOrdinal(badges.length)}`
      : "Vers la Ligue";
  }

  if (zone.category === "special") return "Autres";

  return "Post-ligue";
}

export function buildProgressBlocks(
  zones: Zone[],
  badges: GymBadge[],
  league: LeagueCheckpoint | undefined,
): ProgressBlock[] {
  const sorted = [...zones].sort((a, b) => a.order - b.order);
  const blocks: ProgressBlock[] = [];
  let current: ProgressBlock | undefined;

  for (const zone of sorted) {
    const groupKey = getGroupKey(zone);

    if (!current || current.id !== groupKey) {
      current = {
        id: groupKey,
        header: getGroupHeader(zone, badges),
        zones: [],
      };
      blocks.push(current);
    }

    current.zones.push(zone);
  }

  for (const block of blocks) {
    const lastZone = block.zones[block.zones.length - 1];
    if (!lastZone) continue;

    if (lastZone.leagueSectionId && league?.id === lastZone.leagueSectionId) {
      block.checkpoint = { kind: "league", league };
      continue;
    }

    if (lastZone.badgeSectionId) {
      const badge = badges.find((entry) => entry.id === lastZone.badgeSectionId);
      if (badge) {
        block.checkpoint = { kind: "badge", badge };
      }
    }
  }

  return blocks;
}
