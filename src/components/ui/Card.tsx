import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export function Card({ elevated = true, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--md-shape-corner-medium)] bg-[var(--md-sys-color-surface)]",
        "border border-[var(--md-sys-color-outline-variant)]",
        elevated && "shadow-[var(--md-elevation-1)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
