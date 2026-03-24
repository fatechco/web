// context/settings/index.tsx
"use client";

import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import useSettingsStore from "@/global-store/settings";
import { Setting } from "@/types/global";

interface SettingsContextType {
  settings?: Setting[];
}

const SettingsContext = createContext<SettingsContextType>({});

const SettingsProvider = ({ children }: PropsWithChildren) => {
  const settings = useSettingsStore((state) => state.settings);
  
  const contextValue = useMemo(() => ({ settings }), [settings]);

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;

export const useSettingsContext = () => useContext(SettingsContext);