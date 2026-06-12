"use client";

import Link from "next/link";
import { NuzlockCard } from "@/components/nuzlock/NuzlockCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { NuzlockCardSkeleton } from "@/components/ui/Skeleton";
import { useNuzlocks } from "@/hooks/useNuzlocks";

export default function HomePage() {
  const { nuzlocks, loading, error } = useNuzlocks();

  return (
    <>
      <TopAppBar
        title="Nuzlockes"
        subtitle="Suivez vos aventures Pokémon"
      />
      <PageContainer>
        {loading && (
          <ul className="flex flex-col gap-3" aria-busy="true" aria-label="Chargement">
            {Array.from({ length: 3 }).map((_, i) => (
              <li key={i}>
                <NuzlockCardSkeleton />
              </li>
            ))}
          </ul>
        )}

        {error && (
          <p className="md-body-medium text-[var(--md-sys-color-error)] text-center py-12">
            {error}
          </p>
        )}

        {!loading && !error && nuzlocks.length === 0 && (
          <EmptyState
            title="Aucun Nuzlocke en cours"
            description="Créez votre premier Nuzlocke pour commencer à suivre vos captures zone par zone."
            action={
              <Link href="/nouveau">
                <Button>Créer un Nuzlocke</Button>
              </Link>
            }
          />
        )}

        {!loading && nuzlocks.length > 0 && (
          <ul className="flex flex-col gap-3">
            {nuzlocks.map((nuzlock) => (
              <li key={nuzlock.id}>
                <NuzlockCard nuzlock={nuzlock} />
              </li>
            ))}
          </ul>
        )}
      </PageContainer>
    </>
  );
}
