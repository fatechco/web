import fetcher from "@/lib/fetcher";
import { DefaultResponse } from "@/types/global";

export const translationService = {
  getAll: (lang: string) =>
    fetcher<DefaultResponse<Record<string, string>>>(`v1/rest/translations/paginate?lang=${lang}`, {
      headers: { "Access-Control-Allow-Origin": "*" },
      next: { revalidate: Number(process.env.NEXT_PUBLIC_CACHE_TIME) },
    }),
};
