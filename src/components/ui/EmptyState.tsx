import type { ReactNode } from "react";
import { IconEmpty } from "./Icons";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="mb-4 text-[var(--md-sys-color-on-surface-variant)] opacity-60">
        {icon ?? <IconEmpty size={48} />}
      </div>
      <h2 className="md-title-large text-[var(--md-sys-color-on-surface)]">{title}</h2>
      <p className="mt-2 max-w-sm md-body-medium text-[var(--md-sys-color-on-surface-variant)]">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
