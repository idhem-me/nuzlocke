"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { NavigationBar, NavigationDestination } from "@/components/ui/NavigationBar";
import { NAV_ITEMS } from "./NavItems";

export function BottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/nuzlock/")) return null;

  return (
    <NavigationBar
      aria-label="Navigation principale"
      className={cn("fixed bottom-0 left-0 right-0 z-40 lg:hidden")}
    >
      {NAV_ITEMS.map((item) => {
        const active = item.match
          ? item.match(pathname)
          : pathname === item.href;
        return (
          <NavigationDestination
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={active}
          />
        );
      })}
    </NavigationBar>
  );
}
