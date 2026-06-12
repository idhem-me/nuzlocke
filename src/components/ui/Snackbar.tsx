"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils/cn";
import { IconClose } from "./Icons";
import { IconButton } from "./IconButton";

interface SnackbarMessage {
  id: number;
  text: string;
}

interface SnackbarContextValue {
  show: (text: string) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<SnackbarMessage | null>(null);

  const show = useCallback((text: string) => {
    setMessage({ id: Date.now(), text });
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <SnackbarContext.Provider value={{ show }}>
      {children}
      {message && (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "fixed z-50 left-4 right-4 bottom-[calc(var(--nav-height)+env(safe-area-inset-bottom,0px)+8px)]",
            "lg:left-auto lg:right-6 lg:bottom-6 lg:max-w-sm",
            "flex items-center gap-2 px-4 py-3 min-h-12",
            "rounded-[var(--md-shape-corner-extra-small)]",
            "bg-[var(--md-sys-color-inverse-surface)] text-[var(--md-sys-color-inverse-on-surface)]",
            "shadow-[var(--md-elevation-3)]",
          )}
        >
          <p className="flex-1 md-body-medium">{message.text}</p>
          <IconButton
            variant="standard"
            size="small"
            aria-label="Fermer"
            className="text-inherit"
            onClick={() => setMessage(null)}
          >
            <IconClose size={20} />
          </IconButton>
        </div>
      )}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const ctx = useContext(SnackbarContext);
  if (!ctx) {
    throw new Error("useSnackbar doit être utilisé dans SnackbarProvider");
  }
  return ctx;
}
