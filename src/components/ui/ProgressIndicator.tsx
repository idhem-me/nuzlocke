import { cn } from "@/lib/utils/cn";

interface LinearProgressProps {
  value?: number;
  max?: number;
  indeterminate?: boolean;
  className?: string;
}

export function LinearProgress({
  value,
  max = 100,
  indeterminate,
  className,
}: LinearProgressProps) {
  const percent =
    value !== undefined ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn(
        "h-1 w-full overflow-hidden rounded-[var(--md-shape-corner-full)]",
        "bg-[var(--md-sys-color-surface-container-highest)]",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-[var(--md-shape-corner-full)] bg-[var(--md-sys-color-primary)]",
          indeterminate
            ? "w-1/3 animate-[md-progress-indeterminate_1.5s_ease-in-out_infinite]"
            : "transition-[width] duration-300",
        )}
        style={indeterminate ? undefined : { width: `${percent}%` }}
      />
    </div>
  );
}

interface CircularProgressProps {
  size?: number;
  className?: string;
}

export function CircularProgress({ size = 40, className }: CircularProgressProps) {
  return (
    <div
      role="progressbar"
      aria-label="Chargement"
      className={cn("inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        className="animate-spin"
        width={size}
        height={size}
        viewBox="0 0 40 40"
        aria-hidden
      >
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke="var(--md-sys-color-surface-container-highest)"
          strokeWidth="4"
        />
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke="var(--md-sys-color-primary)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="60 100"
        />
      </svg>
    </div>
  );
}
