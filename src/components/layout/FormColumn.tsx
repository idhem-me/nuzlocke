import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

export function FormColumn({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[var(--form-max-width)] flex-col",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
