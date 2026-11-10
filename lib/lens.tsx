"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lens } from "./projects";

const KEY = "sk-lens";
const Ctx = createContext<{ lens: Lens; setLens: (l: Lens) => void }>({ lens: "business", setLens: () => {} });

export function LensProvider({ children }: { children: ReactNode }) {
  const [lens, setLensState] = useState<Lens>("business");
  useEffect(() => {
    try {
      const v = window.localStorage.getItem(KEY);
      if (v === "business" || v === "technical") setLensState(v);
    } catch {
      /* storage unavailable */
    }
  }, []);
  const setLens = (l: Lens) => {
    setLensState(l);
    try {
      window.localStorage.setItem(KEY, l);
    } catch {
      /* ignore */
    }
  };
  return <Ctx.Provider value={{ lens, setLens }}>{children}</Ctx.Provider>;
}

export const useGlobalLens = () => useContext(Ctx);

/** Local lens that follows the global one until the user picks locally. */
export function useLocalLens() {
  const { lens: global } = useGlobalLens();
  const [local, setLocal] = useState<Lens | null>(null);
  useEffect(() => setLocal(null), [global]);
  return [local ?? global, setLocal] as const;
}
