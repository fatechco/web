import "bootstrap/dist/css/bootstrap.min.css";
import "swiper/css";
import "remixicon/fonts/remixicon.css";
//import "./globals.css";
import "@/public/scss/main.scss";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { parseSettings } from "@/utils/parse-settings";
import { cookies } from "next/headers";
import clsx from "clsx";
import { globalService } from "@/services/global";
import NextTopLoader from "nextjs-toploader";
import { cityService, countryService } from "@/services/country";
import {
  DEFAULT_LANGUAGE_CODE,
  DEFAULT_PRIMARY_BUTTON_FONT_COLOR,
  DEFAULT_PRIMARY_COLOR,
} from "@/config/global";
import { translationService } from "@/services/translation";
import { ReactNode } from "react";
import ThemeProvider from "./theme-provider";
import Providers from "./providers";
import TranslationsProvider from "./translations-provider";
import dynamic from "next/dynamic";

const CountrySelect = dynamic(() =>
  import("@/components/country-select").then((mod) => mod.CountrySelect)
);
const LanguageSelect = dynamic(() =>
  import("@/components/language-select").then((mod) => mod.LanguageSelect)
);
const CurrencySelect = dynamic(() =>
  import("@/components/currency-select").then((mod) => mod.CurrencySelect)
);

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const generateMetadata = async (): Promise<Metadata> => {
  const settings = await globalService.settings().catch((e) => console.log(e));
  const parsedSettings = parseSettings(settings?.data);
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_WEBSITE_URL),
    title: {
      template: `%s | ${parsedSettings.title}`,
      default: parsedSettings.title,
    },
    icons: parsedSettings.favicon,
    description: "Book beauty services in your city",
    openGraph: {
      images: [
        {
          url: parsedSettings.logo,
          width: 200,
          height: 200,
        },
      ],
      title: parsedSettings.title,
      description: "Book beauty services in your city",
      siteName: parsedSettings.title,
    },
  };
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const languages = await globalService.languages().catch((e) => console.log("language error", e));
  const currencies = await globalService
    .currencies()
    .catch((e) => console.log("currency error", e));
  const selectedLocale = (await cookies()).get("lang")?.value || "en";
  const selectedDirection = (await cookies()).get("dir")?.value;

  const defaultLanguage = languages?.data?.find((lang) => Boolean(lang?.default));
  const lang = (selectedLocale || defaultLanguage?.locale || DEFAULT_LANGUAGE_CODE) as string;
  const defaultCurrency = currencies?.data?.find((currency) => Boolean(currency?.default));
  const settings = await globalService
    .settings()
    .then((res) => res.data)
    .catch((e) => console.log("settings error", e));
  const parsedSettings = parseSettings(typeof settings === "object" ? settings : []);
  if (process.env.NEXT_PUBLIC_UI_TYPE) {
    parsedSettings.ui_type = process.env.NEXT_PUBLIC_UI_TYPE;
  }
  let defaultCountry;
  if (parsedSettings?.default_country_id?.length) {
    defaultCountry = await countryService
      .get(Number(parsedSettings.default_country_id))
      .then((res) => {
        if (parsedSettings?.default_city_id?.length) {
          return cityService.get(Number(parsedSettings.default_city_id)).then((city) => {
            res.data.city = city.data;
            return res.data;
          });
        }
        return res.data;
      });
  }
  const translation = await translationService.getAll(lang).catch((error) => {
    console.log(error);
  });

  const primaryColor = parsedSettings?.primary_color || DEFAULT_PRIMARY_COLOR;
  const primaryButtonFontColor =
    parsedSettings?.primary_button_font_color || DEFAULT_PRIMARY_BUTTON_FONT_COLOR;

  const css = `:root {
  --primary: ${primaryColor};
  --primary-button-font-color: ${primaryButtonFontColor};
  }`;

  return (
    <html
      lang={selectedLocale || defaultLanguage?.locale || "en"}
      dir={selectedDirection || (defaultLanguage?.backward ? "rtl" : "ltr")}
    >
      <head>
        { /*<style>{css}</style> */ }
      </head>
      <body className={clsx(inter.className)}>
        <div id="portal" />
        <TranslationsProvider
          locale={lang}
          translation={translation?.data}
          languages={languages?.data}
        >
          <ThemeProvider attribute="class" defaultTheme="light">
            <Providers
              currencies={currencies?.data}
              defaultCurrency={defaultCurrency}
              settings={parsedSettings}
              defaultCountry={defaultCountry}
            >
              {children}
              <CountrySelect
                defaultOpen={(await cookies()).get("showCountryDialog")?.value !== "false"}
                settings={parsedSettings}
              />
              <LanguageSelect />
              <CurrencySelect />
            </Providers>
            <NextTopLoader color="#BB9B6A" showSpinner={false} />
          </ThemeProvider>
        </TranslationsProvider>
      </body>
    </html>
  );
};

export default RootLayout;
