"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { stateLayer } from "@/lib/utils/state-layer";

export interface MenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  destructive?: boolean;
  onClick: () => void;
}

interface MenuProps {
  open: boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
  items: MenuItem[];
  onClose: () => void;
  className?: string;
}

export function Menu({ open, anchorRef, items, onClose, className }: MenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        menuRef.current?.contains(target) ||
        anchorRef.current?.contains(target)
      ) {
        return;
      }
      onClose();
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return (
    <div
      ref={menuRef}
      role="menu"
      className={cn(
        "absolute right-0 top-full z-50 mt-1 min-w-[180px] py-2",
        "rounded-[var(--md-shape-corner-extra-small)]",
        "bg-[var(--md-sys-color-surface-container)]",
        "shadow-[var(--md-elevation-2)]",
        "border border-[var(--md-sys-color-outline-variant)]",
        className,
      )}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="menuitem"
          className={cn(
            stateLayer(),
            "flex w-full min-h-12 items-center gap-3 px-4 text-left md-body-large",
            item.destructive
              ? "text-[var(--md-sys-color-error)]"
              : "text-[var(--md-sys-color-on-surface)]",
          )}
          onClick={() => {
            item.onClick();
            onClose();
          }}
        >
          {item.icon && <span className="shrink-0 opacity-80">{item.icon}</span>}
          {item.label}
        </button>
      ))}
    </div>
  );
}
