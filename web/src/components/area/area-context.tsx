"use client";

import { createContext, useContext } from "react";
import type { Account } from "@/lib/area-types";

const AreaDataContext = createContext<{ account: Account } | null>(null);

export function AreaDataProvider({
  account,
  children,
}: {
  account: Account;
  children: React.ReactNode;
}) {
  return (
    <AreaDataContext.Provider value={{ account }}>
      {children}
    </AreaDataContext.Provider>
  );
}

export function useAreaData() {
  const ctx = useContext(AreaDataContext);
  if (!ctx) {
    throw new Error("useAreaData deve essere usato dentro <AreaDataProvider>");
  }
  return ctx;
}
