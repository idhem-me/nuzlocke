import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { stateLayer } from "@/lib/utils/state-layer";
import type { ReactNode } from "react";

interface NavigationRailDestinationProps {
  href: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
}

/** Destination rail MD3 — gélule active autour de l'icône, label en dessous. */
export function NavigationRailDestination({
  href,
  label,
  icon,
  active = false,
}: NavigationRailDestinationProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        stateLayer(),
        "flex w-full flex-col items-center justify-center gap-1 py-1",
      )}
    >
      <span
        className={cn(
          "relative flex h-8 w-14 shrink-0 items-center justify-center",
          "rounded-[var(--md-shape-corner-full)]",
          active && "bg-[var(--md-sys-color-secondary-container)]",
        )}
      >
        <span
          className={cn(
            "relative flex items-center justify-center",
            active
              ? "text-[var(--md-sys-color-on-secondary-container)]"
              : "text-[var(--md-sys-color-on-surface-variant)]",
          )}
        >
          {icon}
        </span>
      </span>
      <span
        className={cn(
          "md-nav-label max-w-full px-0.5 text-center",
          active
            ? "text-[var(--md-sys-color-on-secondary-container)]"
            : "text-[var(--md-sys-color-on-surface-variant)]",
        )}
      >
        {label}
      </span>
    </Link>
  );
}

interface NavigationRailProps {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}

export function NavigationRail({
  children,
  className,
  "aria-label": ariaLabel,
}: NavigationRailProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "fixed inset-y-0 left-0 z-40",
        "flex flex-col items-center justify-center gap-2",
        "w-[var(--nav-rail-width)] shrink-0 safe-top safe-bottom",
        "border-r border-[var(--md-sys-color-surface-container-highest)]",
        "bg-[var(--md-sys-color-surface)]",
        className,
      )}
    >
      {children}
    </nav>
  );
}
