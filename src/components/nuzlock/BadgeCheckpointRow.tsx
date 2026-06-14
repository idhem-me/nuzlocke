import type { GymBadge, LeagueCheckpoint } from "@/types/game";
import { getPokemonTypeInfo } from "@/lib/pokemon/type-sprites";
import { PokemonTypeIcon } from "@/components/nuzlock/PokemonTypeIcon";

export function LeagueCheckpointRow({
  league,
}: {
  league: LeagueCheckpoint;
}) {
  const label = `${league.name} · ${league.leaderName} · Niv. max ${league.levelCap}`;

  return (
    <div
      role="separator"
      aria-label={`${league.name}, champion ${league.leaderName}, niveau maximum ${league.levelCap}`}
      className="flex items-center gap-3 py-1"
    >
      <div
        aria-hidden
        className="h-px flex-1 bg-[var(--md-sys-color-outline-variant)]"
      />
      <p className="shrink-0 px-1 text-center md-label-medium text-[var(--md-sys-color-on-surface-variant)]">
        {label}
      </p>
      <div
        aria-hidden
        className="h-px flex-1 bg-[var(--md-sys-color-outline-variant)]"
      />
    </div>
  );
}

interface BadgeCheckpointRowProps {
  badge: GymBadge;
}

export function BadgeCheckpointRow({ badge }: BadgeCheckpointRowProps) {
  const type = getPokemonTypeInfo(badge.typeId);
  const typeLabel = type?.nameFr ?? "Type";

  return (
    <div
      role="separator"
      aria-label={`Badge ${badge.name}, type ${typeLabel}, champion ${badge.leaderName}, niveau maximum ${badge.levelCap}`}
      className="flex items-center gap-3 py-1"
    >
      <div
        aria-hidden
        className="h-px flex-1 bg-[var(--md-sys-color-outline-variant)]"
      />
      <div className="flex shrink-0 items-center gap-2 px-1">
        <span className="md-label-medium text-[var(--md-sys-color-on-surface-variant)]">
          {badge.name}
        </span>
        <PokemonTypeIcon typeId={badge.typeId} />
        <span className="md-label-medium text-[var(--md-sys-color-on-surface-variant)]">
          · {badge.leaderName} · Niv. max {badge.levelCap}
        </span>
      </div>
      <div
        aria-hidden
        className="h-px flex-1 bg-[var(--md-sys-color-outline-variant)]"
      />
    </div>
  );
}

interface ZoneSectionHeaderProps {
  label: string;
  id?: string;
}

export function ZoneSectionHeader({ label, id }: ZoneSectionHeaderProps) {
  return (
    <div className="pt-1 pb-1">
      <p
        id={id}
        className="md-title-small text-[var(--md-sys-color-on-surface-variant)]"
      >
        {label}
      </p>
    </div>
  );
}
