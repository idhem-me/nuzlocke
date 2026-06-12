"use client";

import { SerwistProvider as Provider } from "@serwist/next/react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function SerwistProvider({ children }: Props) {
  return (
    <Provider
      swUrl="/sw.js"
      disable={process.env.NODE_ENV === "development"}
    >
      {children}
    </Provider>
  );
}
