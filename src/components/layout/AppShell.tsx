import { BottomNav } from "./BottomNav";
import { SideNav } from "./SideNav";

interface AppShellProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

export function AppShell({ children, hideNav }: AppShellProps) {
  return (
    <div className="min-h-full">
      {!hideNav && <SideNav />}
      <div
        className={
          hideNav ? "min-w-0" : "min-w-0 lg:pl-[var(--nav-rail-width)]"
        }
      >
        <main
          className="pb-[calc(var(--nav-height)+env(safe-area-inset-bottom,0px))] lg:pb-0"
        >
          {children}
        </main>
        {!hideNav && <BottomNav />}
      </div>
    </div>
  );
}
