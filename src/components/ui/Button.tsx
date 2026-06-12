import { cn } from "@/lib/utils/cn";
import { stateLayer } from "@/lib/utils/state-layer";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "tonal" | "outlined" | "text" | "error";
  size?: "default" | "compact";
}

const variantStyles = {
  filled:
    "bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)]",
  tonal:
    "bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]",
  outlined:
    "border border-[var(--md-sys-color-outline)] bg-transparent text-[var(--md-sys-color-primary)]",
  text: "bg-transparent text-[var(--md-sys-color-primary)]",
  error:
    "bg-[var(--md-sys-color-error)] text-[var(--md-sys-color-on-error)]",
};

const sizeStyles = {
  default: "h-10 min-h-10 px-6",
  compact: "h-8 min-h-8 px-4",
};

export function Button({
  variant = "filled",
  size = "default",
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        stateLayer(),
        "inline-flex items-center justify-center gap-2 rounded-[var(--md-shape-corner-full)]",
        "md-label-large transition-colors",
        "disabled:text-[var(--md-sys-color-on-surface-disabled)] disabled:cursor-not-allowed",
        variant === "filled" && "disabled:bg-[var(--md-sys-color-on-surface)] disabled:opacity-[0.12]",
        variant === "tonal" && "disabled:bg-[var(--md-sys-color-on-surface)] disabled:opacity-[0.12]",
        variant === "outlined" && "disabled:border-[var(--md-sys-color-on-surface)] disabled:opacity-[0.12]",
        variant === "text" && "disabled:bg-transparent",
        variant === "error" && "disabled:opacity-40",
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
