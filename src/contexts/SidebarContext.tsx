"use client";

import React, { createContext, useContext, useState } from "react";

// 3 states: "full" = 260px, "mini" = 64px (icons only), "hidden" = 0
export type SidebarState = "full" | "mini" | "hidden";

interface SidebarContextType {
  state: SidebarState;
  setState: (s: SidebarState) => void;
  cycle: () => void;           // full → mini → hidden → full
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  state: "full",
  setState: () => {},
  cycle: () => {},
  mobileOpen: false,
  setMobileOpen: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SidebarState>("full");
  const [mobileOpen, setMobileOpen] = useState(false);

  const cycle = () => {
    setState((s) => {
      if (s === "full")   return "mini";
      if (s === "mini")   return "hidden";
      return "full";
    });
  };

  return (
    <SidebarContext.Provider value={{ state, setState, cycle, mobileOpen, setMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
