import type { DefaultResponse, Paginate, ParamsType } from "@/types/global";
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { Country, Province } from "@/types/location";

export const countryService = {
  getAll: (params?: ParamsType) =>
    fetcher<DefaultResponse<Country[]>>(buildUrlQueryParams("v1/rest/countries/all", params)),
  get: (id: number, params?: ParamsType) =>
    fetcher<DefaultResponse<Country>>(buildUrlQueryParams(`v1/rest/countries/${id}`, params)),
};

export const provinceService = {
  get: (id: number, params?: ParamsType) =>
    fetcher<DefaultResponse<Province>>(`v1/rest/provinces/${id}`, params),
};
