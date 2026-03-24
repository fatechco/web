// global-store/settings.ts
import { Currency, Language, Setting } from "@/types/global";
import { Country } from "@/types/location";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsStore {
  // Lists
  languages: Language[];
  currencies: Currency[];
  countries: Country[];
  
  // Selected
  language: any | null;
  currency: any | null;
  country: any | null;
  
  // Settings
  settings: Setting[];
  
  // Actions
  setLanguages: (languages: any[]) => void;
  setCurrencies: (currencies: any[]) => void;
  setCountries: (countries: any[]) => void;
  setLanguage: (language: any) => void;
  setCurrency: (currency: any) => void;
  setCountry: (country: any) => void;
  setSettings: (settings: any) => void;
}

const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      languages: [],
      currencies: [],
      countries: [],
      language: null,
      currency: null,
      country: null,
      settings: [],

      setLanguages: (languages) => set({ languages }),
      setCurrencies: (currencies) => set({ currencies }),
      setCountries: (countries) => set({ countries }),
      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),
      setCountry: (country) => set({ country }),
      setSettings: (settings) => set({ settings }),
    }),
    {
      name: "app-settings",
      partialize: (state) => ({
        languages: state.languages,
        currencies: state.currencies,
        countries: state.countries,
        language: state.language,
        currency: state.currency,
        country: state.country,
        settings: state.settings,
      }),
    }
  )
);

export default useSettingsStore;