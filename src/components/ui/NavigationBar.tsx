import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { stateLayer } from "@/lib/utils/state-layer";
import type { ReactNode } from "react";

interface NavigationDestinationProps {
  href: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
}

/** Destination MD3 — gélule active autour de l'icône uniquement, label stable en dessous. */
export function NavigationDestination({
  href,
  label,
  icon,
  active = false,
}: NavigationDestinationProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center",
        "pt-3.5 pb-3.5 gap-1",
      )}
    >
      <span
        className={cn(
          stateLayer(),
          "relative flex h-8 w-16 shrink-0 items-center justify-center",
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
          "md-nav-label max-w-full px-1 text-center",
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

interface NavigationBarProps {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}

export function NavigationBar({
  children,
  className,
  "aria-label": ariaLabel,
}: NavigationBarProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "border-t border-[var(--md-sys-color-surface-container-highest)]",
        "bg-[var(--md-sys-color-surface)] safe-bottom overflow-visible",
        className,
      )}
    >
      <div className="mx-auto flex min-h-[var(--nav-height)] max-w-[1024px] items-stretch overflow-visible">
        {children}
      </div>
    </nav>
  );
}
