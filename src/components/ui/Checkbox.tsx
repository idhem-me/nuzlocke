"use client";

import { cn } from "@/lib/utils/cn";
import { stateLayer } from "@/lib/utils/state-layer";
import { IconCheck } from "./Icons";
import type { InputHTMLAttributes } from "react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

export function Checkbox({ label, className, id, disabled, ...props }: CheckboxProps) {
  const inputId = id ?? `checkbox-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "inline-flex items-center gap-3 min-h-12 cursor-pointer select-none",
        disabled && "cursor-not-allowed opacity-38",
        className,
      )}
    >
      <span className="relative inline-flex">
        <input
          id={inputId}
          type="checkbox"
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <span
          className={cn(
            stateLayer(),
            "flex items-center justify-center size-[18px] rounded-[2px]",
            "border-2 border-[var(--md-sys-color-on-surface-variant)]",
            "peer-checked:bg-[var(--md-sys-color-primary)] peer-checked:border-[var(--md-sys-color-primary)]",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--md-sys-color-primary)] peer-focus-visible:ring-offset-2",
            "peer-disabled:border-[var(--md-sys-color-on-surface)] peer-disabled:opacity-38",
            "text-[var(--md-sys-color-on-primary)]",
            "[&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100",
          )}
          aria-hidden
        >
          <IconCheck size={14} />
        </span>
      </span>
      <span className="md-body-large text-[var(--md-sys-color-on-surface)]">{label}</span>
    </label>
  );
}
