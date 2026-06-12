"use client";

import { useEffect } from "react";
import { Button } from "./Button";
import { cn } from "@/lib/utils/cn";

interface DialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}

export function Dialog({
  open,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  variant = "default",
  onConfirm,
  onCancel,
}: DialogProps) {
  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  const descriptionId = description ? "dialog-description" : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[var(--md-sys-color-scrim)]"
        onClick={onCancel}
        aria-label="Fermer"
        tabIndex={-1}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby={descriptionId}
        className={cn(
          "relative w-full max-w-[312px] rounded-[var(--md-shape-corner-extra-large)]",
          "bg-[var(--md-sys-color-surface-container-high)] p-6",
          "shadow-[var(--md-elevation-3)]",
        )}
      >
        <h2 id="dialog-title" className="md-headline-small text-[var(--md-sys-color-on-surface)]">
          {title}
        </h2>
        {description && (
          <p
            id={descriptionId}
            className="mt-4 md-body-medium text-[var(--md-sys-color-on-surface-variant)]"
          >
            {description}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="text" autoFocus onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "danger" ? "error" : "filled"}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
