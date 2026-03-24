"use client";

import { useEffect } from "react";
import useSettingsStore from "@/global-store/settings";
import { globalService } from "@/services/global";
import { countryService } from "@/services/country";
import { parseSettings } from "@/utils/parse-settings";

export const useSettings = () => {
  const {
    languages,
    currencies,
    countries,
    language,
    currency,
    country,
    settings,
    setLanguages,
    setCurrencies,
    setCountries,
    setLanguage,
    setCurrency,
    setCountry,
    setSettings,
  } = useSettingsStore();

  // Fetch settings first to get default values
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Fetch settings
        const settingsRes = await globalService.settings();
        const settingsArray = settingsRes?.data || [];
        const parsedSettings = parseSettings(settingsArray);
        
        // Lưu settings vào store
        setSettings(parsedSettings);
        
        // Fetch languages
        const langsRes = await globalService.languages();
        const langs = langsRes?.data || [];
        setLanguages(langs);
        
        // Fetch currencies
        const currsRes = await globalService.currencies();
        const currs = currsRes?.data || [];
        setCurrencies(currs);
        
        // Fetch countries
        const countriesRes = await countryService.getAll();
        setCountries(countriesRes || []);
        
        // Set default language from settings
        if (!language && parsedSettings.default_language_id) {
          const defaultLang = langs.find((l: any) => l.id === parsedSettings.default_language_id);
          if (defaultLang) setLanguage(defaultLang);
        } else if (!language && langs.length) {
          const defaultLang = langs.find((l: any) => l.default);
          if (defaultLang) setLanguage(defaultLang);
        }
        
        // Set default currency from settings
        if (!currency && parsedSettings.default_currency_id) {
          const defaultCurr = currs.find((c: any) => c.id === parsedSettings.default_currency_id);
          if (defaultCurr) setCurrency(defaultCurr);
        } else if (!currency && currs.length) {
          const defaultCurr = currs.find((c: any) => c.default);
          if (defaultCurr) setCurrency(defaultCurr);
        }
        
        // Set default country from settings
        if (!country && parsedSettings.default_country_id) {
          const defaultCountry = countriesRes?.find((c: any) => c.id === parsedSettings.default_country_id);
          if (defaultCountry) setCountry(defaultCountry);
        } else if (!country && countriesRes?.length) {
          const defaultCountry = countriesRes.find((c: any) => c.is_default);
          if (defaultCountry) setCountry(defaultCountry);
        }
        
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };
    
    // Only fetch if lists are empty
    if (languages.length === 0 || currencies.length === 0 || countries.length === 0) {
      fetchSettings();
    }
  }, [languages.length, currencies.length, countries.length]);

  return {
    // Lists
    languages,
    currencies,
    countries,
    
    // Selected
    language,
    currency,
    country,
    
    // Settings
    settings,
    
    // Actions
    setLanguage,
    setCurrency,
    setCountry,
  };
};