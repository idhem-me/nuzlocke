"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GAMES } from "@/data/games";
import { FormColumn } from "@/components/layout/FormColumn";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { cn } from "@/lib/utils/cn";
import { stateLayer } from "@/lib/utils/state-layer";
import type { CreateNuzlockInput } from "@/types/nuzlock";

interface CreateNuzlockFormProps {
  onSubmit: (input: CreateNuzlockInput) => Promise<unknown>;
}

export function CreateNuzlockForm({ onSubmit }: CreateNuzlockFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [gameId, setGameId] = useState(GAMES[0].id);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedGame = GAMES.find((g) => g.id === gameId)!;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Donnez un nom à votre Nuzlocke.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const created = (await onSubmit({
        name: name.trim(),
        gameId,
        zoneListId: selectedGame.zoneListId,
      })) as { id: string };
      router.push(`/nuzlock/${created.id}`);
    } catch {
      setError("Impossible de créer le Nuzlocke.");
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-1 flex-col min-h-0 w-full"
    >
      <FormColumn className="flex flex-1 flex-col min-h-0 gap-0">
        <div className="shrink-0 px-4 pt-6 pb-4">
          <TextField
            label="Nom du Nuzlocke"
            placeholder="Ex. : Mon aventure Sinnoh"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!error && !name.trim()}
            helperText="Un nom pour identifier votre run"
            autoFocus
          />
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-2">
          <fieldset className="flex flex-col gap-3 border-0 p-0 m-0">
            <legend className="md-label-large text-[var(--md-sys-color-on-surface-variant)] mb-1">
              Jeu
            </legend>
            {GAMES.map((game) => (
              <label
                key={game.id}
                className={cn(
                  stateLayer(),
                  "flex items-center gap-3 p-4 min-h-14 rounded-[var(--md-shape-corner-medium)] cursor-pointer",
                  "border transition-colors",
                  gameId === game.id
                    ? "border-[var(--md-sys-color-primary)] bg-[var(--md-sys-color-primary-container)]"
                    : "border-[var(--md-sys-color-outline-variant)]",
                )}
              >
                <input
                  type="radio"
                  name="game"
                  value={game.id}
                  checked={gameId === game.id}
                  onChange={() => setGameId(game.id)}
                  className="size-[18px] accent-[var(--md-sys-color-primary)]"
                />
                <div>
                  <span className="md-title-small text-[var(--md-sys-color-on-surface)]">
                    {game.name}
                  </span>
                  <p className="md-body-small text-[var(--md-sys-color-on-surface-variant)] mt-0.5">
                    Nintendo Switch
                  </p>
                </div>
              </label>
            ))}
          </fieldset>
        </div>

        <div
          className={cn(
            "shrink-0 z-20",
            "bg-[var(--md-sys-color-surface)]/95 backdrop-blur-sm",
            "border-t border-[var(--md-sys-color-surface-container-highest)]",
            "fixed left-0 right-0 bottom-[calc(var(--nav-height)+env(safe-area-inset-bottom,0px))]",
            "lg:static lg:bottom-auto",
          )}
        >
          <div className="mx-auto w-full max-w-[var(--form-max-width)] px-4 pt-4 pb-4 lg:pb-6">
            {error && name.trim() && (
              <p
                className="md-body-medium text-[var(--md-sys-color-error)] mb-3"
                role="alert"
              >
                {error}
              </p>
            )}
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Création…" : "Commencer le Nuzlocke"}
            </Button>
          </div>
        </div>

        {/* Espace réservé pour le CTA fixe sur mobile */}
        <div aria-hidden className="shrink-0 h-[4.5rem] lg:hidden" />
      </FormColumn>
    </form>
  );
}
