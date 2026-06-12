import Link from "next/link";
import { getZonesForGame } from "@/data/games";
import { getGameLabel, getNuzlockProgress } from "@/lib/storage/nuzlock-store";
import { formatDateTime } from "@/lib/utils/date";
import type { Nuzlock } from "@/types/nuzlock";
import { Card } from "@/components/ui/Card";
import { LinearProgress } from "@/components/ui/ProgressIndicator";
import { stateLayer } from "@/lib/utils/state-layer";
import { cn } from "@/lib/utils/cn";

interface NuzlockCardProps {
  nuzlock: Nuzlock;
}

export function NuzlockCard({ nuzlock }: NuzlockCardProps) {
  const zones = getZonesForGame(nuzlock.gameId);
  const { filled, total } = getNuzlockProgress(nuzlock, zones.length);
  const percent = total > 0 ? Math.round((filled / total) * 100) : 0;

  return (
    <Link href={`/nuzlock/${nuzlock.id}`} className="block">
      <Card
        className={cn(
          stateLayer(),
          "p-4 transition-shadow hover:shadow-[var(--md-elevation-2)]",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="md-title-medium text-[var(--md-sys-color-on-surface)]">
              {nuzlock.name}
            </h3>
            <p className="mt-0.5 md-body-medium text-[var(--md-sys-color-on-surface-variant)]">
              {getGameLabel(nuzlock.gameId)}
            </p>
            <p className="mt-0.5 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
              Début · {formatDateTime(nuzlock.createdAt)}
            </p>
          </div>
          <span className="md-title-small tabular-nums text-[var(--md-sys-color-on-surface-variant)]">
            {percent}%
          </span>
        </div>
        <div className="mt-3">
          <LinearProgress value={filled} max={total} />
        </div>
        <p className="mt-2 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
          {filled} / {total} zones renseignées
        </p>
      </Card>
    </Link>
  );
}
