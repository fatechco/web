"use client";

import { I18nextProvider } from "react-i18next";
import { ReactNode, useEffect } from "react";
import { Language } from "@/types/global";
import { setCookie } from "cookies-next";
import { DEFAULT_LANGUAGE_CODE } from "@/config/global";
import useSettingsStore from "@/global-store/settings";
import i18n from "@/lib/i18n";

const TranslationsProvider = ({
  children,
  locale,
  translation,
  languages,
}: {
  children: ReactNode;
  locale: string;
  translation?: Record<string, string>;
  languages?: Language[];
}) => {
  const { updateSelectedLanguage } = useSettingsStore();

  const supportedLngs = languages?.length
    ? languages?.map((language) => language?.locale)
    : [DEFAULT_LANGUAGE_CODE as string];
  const defaultLanguage = languages?.find((language) => Boolean(language?.default));
  const lang = locale;
  const language = languages?.find((item) => item?.locale === lang);

  useEffect(() => {
    setCookie("defaultLang", defaultLanguage?.locale || DEFAULT_LANGUAGE_CODE);
    setCookie("locales", supportedLngs);
    setCookie("lang", lang);
    if (language) {
      const html = document.documentElement;
      html.setAttribute("lang", lang);
      html.setAttribute("dir", language?.backward ? "rtl" : "ltr");
      updateSelectedLanguage(language);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  i18n.init({
    lng: lang,
    fallbackLng: DEFAULT_LANGUAGE_CODE,
    supportedLngs,
    defaultNS: "translation",
    fallbackNS: "translation",
    ns: "translation",
    resources: { [lang]: { translation: translation || {} } },
    interpolation: {
      escapeValue: false,
    },
  });

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default TranslationsProvider;
