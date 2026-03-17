import fetcher from "@/lib/fetcher";
import { Currency, DefaultResponse, Language, Setting } from "@/types/global";

export const globalService = {
  languages: () =>
    fetcher<DefaultResponse<Language[]>>("v1/rest/languages/active", {
      next: { revalidate: Number(process.env.NEXT_PUBLIC_CACHE_TIME) },
    }),
  currencies: () =>
    fetcher<DefaultResponse<Currency[]>>("v1/rest/currencies/active", {
      next: { revalidate: Number(process.env.NEXT_PUBLIC_CACHE_TIME) },
    }),
  settings: () =>
    fetcher<DefaultResponse<Setting[]>>("v1/rest/settings", {
      next: { revalidate: Number(process.env.NEXT_PUBLIC_CACHE_TIME) },
    }),
};
