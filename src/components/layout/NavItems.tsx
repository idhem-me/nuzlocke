import { IconAdd, IconList, IconRules } from "@/components/ui/Icons";
import type { ReactNode } from "react";

export interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  match?: (pathname: string) => boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Nuzlockes",
    icon: <IconList size={24} />,
    match: (p) => p === "/" || p.startsWith("/nuzlock/"),
  },
  {
    href: "/nouveau",
    label: "Nouveau",
    icon: <IconAdd size={24} />,
  },
  {
    href: "/regles",
    label: "Règles",
    icon: <IconRules size={24} />,
  },
];
