"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createEmptyCapture, stampCaptureTime } from "@/types/capture";
import type { Capture } from "@/types/capture";
import { formatDateTime } from "@/lib/utils/date";
import { getCaptureDisplayName, isZoneFilled } from "@/lib/nuzlock/zones";
import type { Zone } from "@/types/game";
import type { PokemonSpeciesEntry } from "@/lib/pokemon/types";
import { getSpriteForSpecies } from "@/lib/pokemon/cache";
import { debounce } from "@/lib/utils/debounce";
import { cn } from "@/lib/utils/cn";
import { stateLayer } from "@/lib/utils/state-layer";
import { IconButton } from "@/components/ui/IconButton";
import {
  IconExpandLess,
  IconExpandMore,
  IconRefresh,
} from "@/components/ui/Icons";
import { Checkbox } from "@/components/ui/Checkbox";
import { TextField } from "@/components/ui/TextField";
import { PokemonAutocomplete } from "./PokemonAutocomplete";
import { PokemonSprite } from "./PokemonSprite";

const COLLAPSE_DURATION_MS = 300;

function CollapsibleSection({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows] duration-300 ease-in-out",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

function normalizeCapture(capture: Capture): Capture {
  const legacy = capture as Capture & { updatedAt?: string };
  return {
    ...capture,
    capturedAt: capture.capturedAt ?? legacy.updatedAt ?? null,
  };
}

interface ZoneRowProps {
  zone: Zone;
  capture: Capture | null;
  collapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
  onSave: (capture: Capture | null) => Promise<void>;
  onReset: () => Promise<void>;
  searchPokemon: (query: string) => PokemonSpeciesEntry[];
}

export function ZoneRow({
  zone,
  capture,
  collapsed,
  onToggleCollapse,
  onSave,
  onReset,
  searchPokemon,
}: ZoneRowProps) {
  const [local, setLocal] = useState<Capture>(() =>
    capture ? normalizeCapture(capture) : createEmptyCapture(),
  );
  const [resetting, setResetting] = useState(false);
  const [formOpen, setFormOpen] = useState(!collapsed);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFailed = local.captureFailed;
  const isDisabled = isFailed;
  const hasData = isZoneFilled(capture);
  const isCollapsed = collapsed;

  useEffect(() => {
    setLocal(capture ? normalizeCapture(capture) : createEmptyCapture());
  }, [capture]);

  useEffect(() => {
    if (collapsed) {
      setFormOpen(false);
      return;
    }
    setFormOpen(false);
    const frame = requestAnimationFrame(() => setFormOpen(true));
    return () => cancelAnimationFrame(frame);
  }, [collapsed]);

  useEffect(
    () => () => {
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    },
    [],
  );

  function handleCollapse() {
    setFormOpen(false);
    if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    collapseTimerRef.current = setTimeout(() => {
      onToggleCollapse(true);
    }, COLLAPSE_DURATION_MS);
  }

  function handleExpand() {
    if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    onToggleCollapse(false);
  }

  const debouncedSave = useRef(
    debounce((data: Capture) => {
      const hasContent =
        data.captureFailed || data.speciesName.trim().length > 0;
      onSave(hasContent ? data : null);
    }, 300),
  ).current;

  const update = useCallback(
    (patch: Partial<Capture>) => {
      setLocal((prev) => {
        const next = {
          ...prev,
          ...stampCaptureTime(prev, patch),
        };
        debouncedSave(next);
        return next;
      });
    },
    [debouncedSave],
  );

  async function handleSelect(species: PokemonSpeciesEntry) {
    const spriteUrl = await getSpriteForSpecies(species.id);
    update({
      speciesId: species.id,
      speciesName: species.nameFr,
      spriteUrl,
    });
  }

  async function handleReset() {
    setResetting(true);
    try {
      await onReset();
      setLocal(createEmptyCapture());
    } finally {
      setResetting(false);
    }
  }

  const cardClassName = cn(
    "rounded-[var(--md-shape-corner-medium)] border transition-colors",
    isFailed
      ? "border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-low)]"
      : "border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface)]",
  );

  const formFields = (
    <div className="flex items-start gap-3">
      <PokemonSprite
        src={local.spriteUrl}
        name={local.speciesName || "Pokémon"}
        className={cn("mt-6 shrink-0", isFailed && "opacity-50")}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <PokemonAutocomplete
          value={local.speciesName}
          disabled={isDisabled}
          onChange={(v) =>
            update({
              speciesName: v,
              speciesId: null,
              spriteUrl: null,
            })
          }
          onSelect={handleSelect}
          search={searchPokemon}
        />
        <TextField
          label="Surnom"
          placeholder="Facultatif"
          value={local.nickname}
          disabled={isDisabled}
          onChange={(e) => update({ nickname: e.target.value })}
        />
        <Checkbox
          label="Échec de capture"
          checked={local.captureFailed}
          disabled={false}
          onChange={(e) => {
            const failed = e.target.checked;
            update({
              captureFailed: failed,
              ...(failed
                ? {
                    speciesId: null,
                    speciesName: "",
                    spriteUrl: null,
                    nickname: "",
                  }
                : {}),
            });
          }}
        />
      </div>
    </div>
  );

  if (isCollapsed) {
    return (
      <div className={cardClassName}>
        <button
          type="button"
          onClick={handleExpand}
          className={cn(
            stateLayer(),
            "flex w-full min-h-12 items-center gap-3 px-4 py-2 text-left",
            "rounded-[var(--md-shape-corner-medium)]",
            "transition-colors",
          )}
          aria-expanded={false}
          aria-label={`Déplier ${zone.name}`}
        >
          <span
            className={cn(
              "md-title-small shrink-0",
              isFailed
                ? "line-through text-[var(--md-sys-color-on-surface-disabled)]"
                : "text-[var(--md-sys-color-on-surface)]",
            )}
          >
            {zone.name}
          </span>
          <span
            className="mx-1 h-4 w-px shrink-0 bg-[var(--md-sys-color-outline-variant)]"
            aria-hidden
          />
          {hasData ? (
            <>
              {!isFailed && (
                <PokemonSprite
                  src={local.spriteUrl}
                  name={local.speciesName || "Pokémon"}
                  size={32}
                  className="shrink-0"
                />
              )}
              <span
                className={cn(
                  "md-body-medium min-w-0 flex-1 truncate",
                  isFailed
                    ? "text-[var(--md-sys-color-on-surface-disabled)]"
                    : "text-[var(--md-sys-color-on-surface)]",
                )}
              >
                {getCaptureDisplayName(local)}
              </span>
              {isFailed && (
                <span className="md-label-small shrink-0 rounded-[var(--md-shape-corner-small)] border border-[var(--md-sys-color-outline-variant)] px-2 py-0.5 text-[var(--md-sys-color-on-surface-variant)]">
                  Échec
                </span>
              )}
            </>
          ) : (
            <span className="md-body-medium min-w-0 flex-1 truncate text-[var(--md-sys-color-on-surface-variant)]">
              Non renseignée
            </span>
          )}
          <IconExpandMore
            size={20}
            className="shrink-0 text-[var(--md-sys-color-on-surface-variant)]"
          />
        </button>
      </div>
    );
  }

  return (
    <div className={cn(cardClassName, "p-4")}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              "md-title-small",
              isFailed
                ? "line-through text-[var(--md-sys-color-on-surface-disabled)]"
                : "text-[var(--md-sys-color-on-surface)]",
            )}
          >
            {zone.name}
          </h3>
          {zone.note && (
            <p className="mt-0.5 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
              {zone.note}
            </p>
          )}
          {local.capturedAt && (
            <p className="mt-0.5 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
              {local.captureFailed ? "Échec" : "Capture"} ·{" "}
              {formatDateTime(local.capturedAt)}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center">
          <IconButton
            variant="standard"
            size="small"
            aria-label="Replier la zone"
            aria-expanded
            onClick={handleCollapse}
          >
            <IconExpandLess size={20} />
          </IconButton>
          {hasData && (
            <IconButton
              variant="standard"
              size="small"
              aria-label="Réinitialiser la zone"
              onClick={handleReset}
              disabled={resetting}
            >
              <IconRefresh size={20} />
            </IconButton>
          )}
        </div>
      </div>

      <CollapsibleSection open={formOpen}>{formFields}</CollapsibleSection>
    </div>
  );
}
