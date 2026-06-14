"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IconButton } from "@/components/ui/IconButton";
import { IconClose, IconSearch } from "@/components/ui/Icons";
import { cn } from "@/lib/utils/cn";
import { stateLayer } from "@/lib/utils/state-layer";

const fabAnchorClassName = cn(
  "fixed z-50 flex flex-col items-end gap-2",
  "right-[max(1rem,env(safe-area-inset-right,0px))]",
  "bottom-[max(1rem,env(safe-area-inset-bottom,0px))]",
  "lg:right-[max(1.5rem,calc(50%-512px+16px))] lg:bottom-6",
);

interface ZoneSearchFabProps {
  open: boolean;
  query: string;
  resultCount: number;
  onOpenChange: (open: boolean) => void;
  onQueryChange: (query: string) => void;
}

export function ZoneSearchFab({
  open,
  query,
  resultCount,
  onOpenChange,
  onQueryChange,
}: ZoneSearchFabProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onQueryChange("");
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onOpenChange, onQueryChange]);

  function closeSearch() {
    onQueryChange("");
    onOpenChange(false);
  }

  if (!mounted) return null;

  const trimmedQuery = query.trim();
  const showEmptyState = open && trimmedQuery.length > 0 && resultCount === 0;

  const content = (
    <div className={fabAnchorClassName}>
      {open && showEmptyState && (
        <p
          role="status"
          className={cn(
            "max-w-[min(calc(100vw-2rem),20rem)]",
            "rounded-[var(--md-shape-corner-medium)] px-4 py-2 text-right",
            "bg-[var(--md-sys-color-inverse-surface)] text-[var(--md-sys-color-inverse-on-surface)]",
            "md-body-small shadow-[var(--md-elevation-2)]",
          )}
        >
          Aucune zone ne correspond à « {trimmedQuery} »
        </p>
      )}

      {!open ? (
        <button
          type="button"
          aria-label="Rechercher une zone"
          className={cn(
            stateLayer(),
            "inline-flex items-center justify-center",
            "size-[var(--fab-size)] rounded-[var(--md-shape-corner-large)]",
            "bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)]",
            "shadow-[var(--md-elevation-3)]",
          )}
          onClick={() => onOpenChange(true)}
        >
          <IconSearch size={24} />
        </button>
      ) : (
        <div
          className={cn(
            "flex w-[min(calc(100vw-2rem),28rem)] items-center gap-1",
            "rounded-[var(--md-shape-corner-full)]",
            "bg-[var(--md-sys-color-surface-container-high)]",
            "shadow-[var(--md-elevation-3)]",
            "pl-4 pr-1 h-14",
          )}
          role="search"
        >
          <IconSearch
            size={24}
            className="shrink-0 text-[var(--md-sys-color-on-surface-variant)]"
          />
          <label htmlFor={inputId} className="sr-only">
            Rechercher une zone
          </label>
          <input
            ref={inputRef}
            id={inputId}
            type="search"
            value={query}
            enterKeyHint="search"
            autoComplete="off"
            placeholder="Rechercher une zone…"
            className={cn(
              "min-w-0 flex-1 bg-transparent outline-none",
              "text-[var(--md-sys-color-on-surface)] md-body-large",
              "placeholder:text-[var(--md-sys-color-on-surface-variant)]",
            )}
            onChange={(event) => onQueryChange(event.target.value)}
          />
          <IconButton
            variant="standard"
            size="small"
            aria-label="Fermer la recherche"
            onClick={closeSearch}
          >
            <IconClose size={20} />
          </IconButton>
        </div>
      )}
    </div>
  );

  return createPortal(content, document.body);
}
