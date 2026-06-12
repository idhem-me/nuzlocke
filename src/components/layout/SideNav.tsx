"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  NavigationRail,
  NavigationRailDestination,
} from "@/components/ui/NavigationRail";
import { NAV_ITEMS } from "./NavItems";

export function SideNav() {
  const pathname = usePathname();

  return (
    <NavigationRail
      aria-label="Navigation principale"
      className={cn("hidden lg:flex")}
    >
      {NAV_ITEMS.map((item) => {
        const active = item.match
          ? item.match(pathname)
          : pathname === item.href;
        return (
          <NavigationRailDestination
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={active}
          />
        );
      })}
    </NavigationRail>
  );
}
