// services/init.ts
import { globalService } from "./global";
import { countryService } from "./country";
import { parseSettings } from "@/utils/parse-settings";

export interface InitData {
  languages: any[];
  currencies: any[];
  settings: any;
  defaultLanguage: any;
  defaultCurrency: any;
  defaultCountry?: any;
}

export const initService = {
  async getInitData(): Promise<InitData> {
    const [languagesRes, currenciesRes, settingsRes] = await Promise.allSettled([
      globalService.languages(),
      globalService.currencies(),
      globalService.settings(),
    ]);

    // Process languages
    const languages = languagesRes.status === 'fulfilled' ? languagesRes.value?.data || [] : [];
    const defaultLanguage = languages.find((lang: any) => lang.default);

    // Process currencies
    const currencies = currenciesRes.status === 'fulfilled' ? currenciesRes.value?.data || [] : [];
    const defaultCurrency = currencies.find((curr: any) => curr.default);

    // Process settings
    const settingsData = settingsRes.status === 'fulfilled' ? settingsRes.value?.data : null;
    const parsedSettings = parseSettings(settingsData || []);

    // Get default country from settings
    let defaultCountry = null;
    if (parsedSettings?.default_country_id) {
      try {
        defaultCountry = await countryService.get(Number(parsedSettings.default_country_id));
      } catch (error) {
        console.error("Failed to fetch default country:", error);
      }
    }

    return {
      languages,
      currencies,
      settings: parsedSettings,
      defaultLanguage,
      defaultCurrency,
      defaultCountry,
    };
  },
};