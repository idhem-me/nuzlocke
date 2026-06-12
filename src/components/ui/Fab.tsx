import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { stateLayer } from "@/lib/utils/state-layer";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const fabClassName = cn(
  stateLayer(),
  "fixed z-30 inline-flex items-center justify-center gap-2",
  "size-[var(--fab-size)] rounded-[var(--md-shape-corner-large)]",
  "bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)]",
  "shadow-[var(--md-elevation-3)] md-label-large",
  "right-4 bottom-[calc(var(--nav-height)+env(safe-area-inset-bottom,0px)+16px)]",
  "lg:right-[calc(50%-512px+16px)] lg:bottom-6",
);

interface FabLinkProps {
  href: string;
  "aria-label": string;
  children: ReactNode;
  className?: string;
}

interface FabButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: undefined;
  "aria-label": string;
  children: ReactNode;
}

type FabProps = FabLinkProps | FabButtonProps;

export function Fab({ className, children, ...props }: FabProps) {
  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    return (
      <Link href={href} className={cn(fabClassName, className)} {...rest}>
        {children}
      </Link>
    );
  }

  const { ...buttonProps } = props as FabButtonProps;
  return (
    <button type="button" className={cn(fabClassName, className)} {...buttonProps}>
      {children}
    </button>
  );
}
