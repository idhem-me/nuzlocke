import { cn } from "@/lib/utils/cn";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[var(--md-shape-corner-medium)]",
        "bg-[var(--md-sys-color-surface-container-high)]",
        className,
      )}
      aria-hidden
    />
  );
}

export function NuzlockCardSkeleton() {
  return (
    <div
      className={cn(
        "rounded-[var(--md-shape-corner-medium)] border border-[var(--md-sys-color-outline-variant)]",
        "bg-[var(--md-sys-color-surface)] p-4",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <Skeleton className="h-5 w-10" />
      </div>
      <Skeleton className="mt-3 h-1.5 w-full rounded-full" />
      <Skeleton className="mt-2 h-3 w-1/4" />
    </div>
  );
}
