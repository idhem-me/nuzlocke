import { cn } from "@/lib/utils/cn";
import { stateLayer } from "@/lib/utils/state-layer";
import type { ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "standard" | "filled" | "tonal" | "outlined";
  size?: "default" | "small";
  "aria-label": string;
}

const variantStyles = {
  standard: "text-[var(--md-sys-color-on-surface-variant)]",
  filled:
    "bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)]",
  tonal:
    "bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]",
  outlined:
    "border border-[var(--md-sys-color-outline)] text-[var(--md-sys-color-on-surface-variant)]",
};

const sizeStyles = {
  default: "size-12 min-w-12 min-h-12",
  small: "size-10 min-w-10 min-h-10",
};

export function IconButton({
  variant = "standard",
  size = "default",
  className,
  disabled,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        stateLayer(),
        "inline-flex items-center justify-center shrink-0 rounded-[var(--md-shape-corner-full)]",
        "transition-colors disabled:opacity-[0.38] disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
