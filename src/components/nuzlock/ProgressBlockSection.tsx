import type { ProgressBlock, ProgressCheckpoint } from "@/lib/nuzlock/badges";
import type { Capture } from "@/types/capture";
import type { Nuzlock } from "@/types/nuzlock";
import type { PokemonSpeciesEntry } from "@/lib/pokemon/types";
import { isZoneCollapsed } from "@/lib/nuzlock/zones";
import {
  BadgeCheckpointRow,
  LeagueCheckpointRow,
  ZoneSectionHeader,
} from "@/components/nuzlock/BadgeCheckpointRow";
import { ZoneRow } from "@/components/nuzlock/ZoneRow";

interface ProgressBlockSectionProps {
  block: ProgressBlock;
  nuzlock: Nuzlock;
  onToggleCollapse: (zoneId: string, collapsed: boolean) => void;
  onSave: (zoneId: string, capture: Capture | null) => Promise<unknown>;
  onReset: (zoneId: string) => Promise<unknown>;
  searchPokemon: (query: string) => PokemonSpeciesEntry[];
}

function CheckpointRow({ checkpoint }: { checkpoint: ProgressCheckpoint }) {
  if (checkpoint.kind === "league") {
    return <LeagueCheckpointRow league={checkpoint.league} />;
  }

  return <BadgeCheckpointRow badge={checkpoint.badge} />;
}

export function ProgressBlockSection({
  block,
  nuzlock,
  onToggleCollapse,
  onSave,
  onReset,
  searchPokemon,
}: ProgressBlockSectionProps) {
  return (
    <section aria-labelledby={`block-${block.id}`} className="flex flex-col gap-2">
      <ZoneSectionHeader label={block.header} id={`block-${block.id}`} />
      <div className="flex flex-col gap-3 rounded-[var(--md-shape-corner-medium)] border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-lowest)] p-3">
        {block.zones.map((zone) => (
          <ZoneRow
            key={zone.id}
            zone={zone}
            capture={nuzlock.captures[zone.id] ?? null}
            collapsed={isZoneCollapsed(nuzlock, zone.id)}
            onToggleCollapse={(collapsed) =>
              onToggleCollapse(zone.id, collapsed)
            }
            onSave={async (capture) => {
              await onSave(zone.id, capture);
            }}
            onReset={async () => {
              await onReset(zone.id);
            }}
            searchPokemon={searchPokemon}
          />
        ))}
      </div>
      {block.checkpoint && <CheckpointRow checkpoint={block.checkpoint} />}
    </section>
  );
}
