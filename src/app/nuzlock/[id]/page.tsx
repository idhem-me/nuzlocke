"use client";

import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { getZonesForGame } from "@/data/games";
import { areAllZonesCollapsed, isZoneCollapsed } from "@/lib/nuzlock/zones";
import { getGameLabel } from "@/lib/storage/nuzlock-store";
import { formatDateTime } from "@/lib/utils/date";
import { ZoneRow } from "@/components/nuzlock/ZoneRow";
import { PageContainer } from "@/components/layout/PageContainer";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { Dialog } from "@/components/ui/Dialog";
import { IconButton } from "@/components/ui/IconButton";
import {
  IconArrowBack,
  IconDelete,
  IconMoreVert,
  IconUnfoldLess,
  IconUnfoldMore,
} from "@/components/ui/Icons";
import { Menu } from "@/components/ui/Menu";
import { LinearProgress } from "@/components/ui/ProgressIndicator";
import { NuzlockCardSkeleton } from "@/components/ui/Skeleton";
import { useSnackbar } from "@/components/ui/Snackbar";
import { useNuzlock } from "@/hooks/useNuzlock";
import { useNuzlocks } from "@/hooks/useNuzlocks";
import { usePokemonSpecies } from "@/hooks/usePokemonSpecies";

export default function NuzlockDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const {
    nuzlock,
    loading,
    error,
    saveCapture,
    clearZone,
    toggleZoneCollapsed,
    toggleAllZonesCollapsed,
  } = useNuzlock(id);
  const { remove } = useNuzlocks();
  const { search, loading: speciesLoading, progress } = usePokemonSpecies();
  const { show: showSnackbar } = useSnackbar();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuAnchorRef = useRef<HTMLDivElement>(null);

  const zones = nuzlock ? getZonesForGame(nuzlock.gameId) : [];
  const zoneIds = zones.map((zone) => zone.id);
  const showCollapseToggle = zones.length > 0;
  const allZonesCollapsed = nuzlock
    ? areAllZonesCollapsed(nuzlock, zoneIds)
    : false;

  async function handleDelete() {
    await remove(id);
    showSnackbar("Nuzlocke supprimé");
    router.push("/");
  }

  return (
    <>
      <TopAppBar
        title={nuzlock?.name ?? "Nuzlocke"}
        subtitle={
          nuzlock
            ? `${getGameLabel(nuzlock.gameId)} · Début ${formatDateTime(nuzlock.createdAt)}`
            : undefined
        }
        navigationIcon={
          <IconButton
            variant="standard"
            aria-label="Retour"
            onClick={() => router.push("/")}
          >
            <IconArrowBack />
          </IconButton>
        }
        actions={
          nuzlock && (
            <>
              {showCollapseToggle && (
                <IconButton
                  variant="standard"
                  aria-label={
                    allZonesCollapsed
                      ? "Déplier toutes les zones"
                      : "Replier toutes les zones"
                  }
                  onClick={() =>
                    toggleAllZonesCollapsed(zoneIds, !allZonesCollapsed)
                  }
                >
                  {allZonesCollapsed ? (
                    <IconUnfoldMore />
                  ) : (
                    <IconUnfoldLess />
                  )}
                </IconButton>
              )}
              <div ref={menuAnchorRef} className="relative">
                <IconButton
                  variant="standard"
                  aria-label="Plus d'actions"
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  onClick={() => setMenuOpen((o) => !o)}
                >
                  <IconMoreVert />
                </IconButton>
                <Menu
                  open={menuOpen}
                  anchorRef={menuAnchorRef}
                  onClose={() => setMenuOpen(false)}
                  items={[
                    {
                      id: "delete",
                      label: "Supprimer",
                      icon: <IconDelete size={20} />,
                      destructive: true,
                      onClick: () => setDeleteOpen(true),
                    },
                  ]}
                />
              </div>
            </>
          )
        }
      />

      {speciesLoading && progress && (
        <div className="mx-auto max-w-[1024px] px-4 pt-2">
          <LinearProgress value={progress.loaded} max={progress.total} />
          <p className="mt-1 md-body-small text-center text-[var(--md-sys-color-on-surface-variant)]">
            Chargement des Pokémon… {progress.loaded}/{progress.total}
          </p>
        </div>
      )}

      <PageContainer>
        {loading && (
          <div className="flex flex-col gap-3" aria-busy="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <NuzlockCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && !loading && (
          <p className="md-body-medium text-[var(--md-sys-color-error)] text-center py-12">
            {error}
          </p>
        )}

        {nuzlock && (
          <div className="flex flex-col gap-3">
            {zones.map((zone) => (
              <ZoneRow
                key={zone.id}
                zone={zone}
                capture={nuzlock.captures[zone.id] ?? null}
                collapsed={isZoneCollapsed(nuzlock, zone.id)}
                onToggleCollapse={(collapsed) =>
                  toggleZoneCollapsed(zone.id, collapsed)
                }
                onSave={async (capture) => {
                  await saveCapture(zone.id, capture);
                }}
                onReset={async () => {
                  await clearZone(zone.id);
                }}
                searchPokemon={search}
              />
            ))}
          </div>
        )}
      </PageContainer>

      <Dialog
        open={deleteOpen}
        title="Supprimer ce Nuzlocke ?"
        description="Cette action est irréversible. Toutes les données de ce run seront perdues."
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}
