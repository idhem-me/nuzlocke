import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface TopAppBarProps {
  title: string;
  subtitle?: string;
  navigationIcon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function TopAppBar({
  title,
  subtitle,
  navigationIcon,
  actions,
  className,
}: TopAppBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 safe-top",
        "bg-[var(--md-sys-color-surface)]/95 backdrop-blur-sm",
        "border-b border-[var(--md-sys-color-surface-container-highest)]",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[1024px] items-center gap-1 px-1",
          "min-h-[var(--md-top-app-bar-height)]",
          navigationIcon ? "pl-0" : "pl-4",
          actions ? "pr-0" : "pr-4",
        )}
      >
        {navigationIcon && (
          <div className="shrink-0">{navigationIcon}</div>
        )}
        <div className="flex min-w-0 flex-1 flex-col justify-center py-2">
          <h1 className="md-title-large truncate text-[var(--md-sys-color-on-surface)]">
            {title}
          </h1>
          {subtitle && (
            <p className="md-body-small truncate text-[var(--md-sys-color-on-surface-variant)]">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-0">{actions}</div>
        )}
      </div>
    </header>
  );
}
