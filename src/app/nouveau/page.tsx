"use client";

import { CreateNuzlockForm } from "@/components/nuzlock/CreateNuzlockForm";
import { PageContainer } from "@/components/layout/PageContainer";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { useNuzlocks } from "@/hooks/useNuzlocks";

export default function NouveauPage() {
  const { add } = useNuzlocks();

  return (
    <div className="flex flex-col h-[calc(100dvh-var(--nav-height)-env(safe-area-inset-bottom,0px))] lg:h-[calc(100dvh-env(safe-area-inset-bottom,0px))]">
      <TopAppBar
        title="Nouveau Nuzlocke"
        subtitle="Choisissez votre jeu et donnez un nom à votre run"
      />
      <PageContainer className="flex flex-1 flex-col min-h-0 !p-0">
        <CreateNuzlockForm onSubmit={add} />
      </PageContainer>
    </div>
  );
}
