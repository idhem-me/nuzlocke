import { TopAppBar } from "@/components/ui/TopAppBar";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  navigationIcon?: ReactNode;
  action?: ReactNode;
  /** @deprecated Utiliser navigationIcon */
  backLink?: ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  navigationIcon,
  action,
  backLink,
}: PageHeaderProps) {
  return (
    <TopAppBar
      title={title}
      subtitle={subtitle}
      navigationIcon={navigationIcon ?? backLink}
      actions={action}
    />
  );
}
