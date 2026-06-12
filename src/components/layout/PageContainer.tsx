import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

export function PageContainer({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1024px] px-4 py-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}
