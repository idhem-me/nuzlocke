import { cn } from "./cn";

export function stateLayer(className?: string) {
  return cn(
    "md-state-layer",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-primary)] focus-visible:ring-offset-2",
    className,
  );
}
