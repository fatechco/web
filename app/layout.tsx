import "bootstrap/dist/css/bootstrap.min.css";
import "swiper/css";
import "remixicon/fonts/remixicon.css";
import "@/public/scss/main.scss";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { cookies } from "next/headers";
import clsx from "clsx";
import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";
import {
  DEFAULT_LANGUAGE_CODE,
  DEFAULT_PRIMARY_BUTTON_FONT_COLOR,
  DEFAULT_PRIMARY_COLOR,
} from "@/config/global";
import { initService } from "@/services/init";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const generateMetadata = async (): Promise<Metadata> => {
  const initData = await initService.getInitData();

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000"),
    title: {
      template: `%s | ${initData.settings.title}`,
      default: initData.settings.title || "Real Estate",
    },
    icons: initData.settings.favicon,
    description: initData.settings.description || "Find your dream property",
    openGraph: {
      images: [{ url: initData.settings.logo || "/images/logo.png" }],
      title: initData.settings.title || "Real Estate",
      description: initData.settings.description || "Find your dream property",
    },
  };
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const initData = await initService.getInitData();

  const cookieStore = await cookies();
  const selectedLocale = cookieStore.get("lang")?.value || "en";
  const selectedDirection = cookieStore.get("dir")?.value;

  const locale = selectedLocale || initData.defaultLanguage?.locale || DEFAULT_LANGUAGE_CODE;

  const primaryColor = initData.settings?.primary_color || DEFAULT_PRIMARY_COLOR;
  const primaryButtonFontColor =
    initData.settings?.primary_button_font_color || DEFAULT_PRIMARY_BUTTON_FONT_COLOR;

  const cssVariables = `:root {
    --primary: ${primaryColor};
    --primary-button-font-color: ${primaryButtonFontColor};
  }`;

  return (
    <html
      lang={locale}
      dir={selectedDirection || (initData.defaultLanguage?.backward ? "rtl" : "ltr")}
    >
      <head>
        <style>{cssVariables}</style>
      </head>
      <body className={clsx(inter.className)}>
        <div id="portal" />
        <Providers
          currencies={initData.currencies}
          defaultCurrency={initData.defaultCurrency}
          defaultLanguage={initData.defaultLanguage}
          settings={initData.settings}
          defaultCountry={initData.defaultCountry}
        >
          {children}
          <NextTopLoader color={primaryColor} showSpinner={false} />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;