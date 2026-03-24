// services/location.ts
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { ParamsType, Paginate } from "@/types/global";
import type { Country, Province, District, Ward } from "@/types/location";

export const locationService = {
  /**
   * Get all countries with pagination
   */
  getCountries: (params?: ParamsType) =>
    fetcher<Paginate<Country>>(buildUrlQueryParams("v1/rest/countries", params)),

  /**
   * Get all countries without pagination (for dropdowns)
   */
  getAllCountries: (params?: ParamsType) =>
    fetcher<Country[]>(buildUrlQueryParams("v1/rest/countries/all", params)),

  /**
   * Get country by ID
   */
  getCountryById: (id: number, params?: ParamsType) =>
    fetcher<Country>(buildUrlQueryParams(`v1/rest/countries/${id}`, params)),

  /**
   * Get country by code
   */
  getCountryByCode: (code: string, params?: ParamsType) =>
    fetcher<Country>(buildUrlQueryParams(`v1/rest/countries/code/${code}`, params)),

  /**
   * Get provinces by country ID with pagination
   */
  getProvinces: (countryId: number, params?: ParamsType) =>
    fetcher<Paginate<Province>>(buildUrlQueryParams(`v1/rest/countries/${countryId}/provinces`, params)),

  /**
   * Get all provinces by country ID without pagination
   */
  getAllProvinces: (countryId: number, params?: ParamsType) =>
    fetcher<Province[]>(buildUrlQueryParams(`v1/rest/countries/${countryId}/provinces/all`, params)),

  /**
   * Get province by ID
   */
  getProvinceById: (id: number, params?: ParamsType) =>
    fetcher<Province>(buildUrlQueryParams(`v1/rest/provinces/${id}`, params)),

  /**
   * Get districts by province ID with pagination
   */
  getDistricts: (provinceId: number, params?: ParamsType) =>
    fetcher<Paginate<District>>(buildUrlQueryParams(`v1/rest/provinces/${provinceId}/districts`, params)),

  /**
   * Get all districts by province ID without pagination
   */
  getAllDistricts: (provinceId: number, params?: ParamsType) =>
    fetcher<District[]>(buildUrlQueryParams(`v1/rest/provinces/${provinceId}/districts/all`, params)),

  /**
   * Get district by ID
   */
  getDistrictById: (id: number, params?: ParamsType) =>
    fetcher<District>(buildUrlQueryParams(`v1/rest/districts/${id}`, params)),

  /**
   * Get wards by district ID with pagination
   */
  getWards: (districtId: number, params?: ParamsType) =>
    fetcher<Paginate<Ward>>(buildUrlQueryParams(`v1/rest/districts/${districtId}/wards`, params)),

  /**
   * Get all wards by district ID without pagination
   */
  getAllWards: (districtId: number, params?: ParamsType) =>
    fetcher<Ward[]>(buildUrlQueryParams(`v1/rest/districts/${districtId}/wards/all`, params)),

  /**
   * Get ward by ID
   */
  getWardById: (id: number, params?: ParamsType) =>
    fetcher<Ward>(buildUrlQueryParams(`v1/rest/wards/${id}`, params)),

  /**
   * Search locations (all levels)
   */
  search: (keyword: string, params?: ParamsType) =>
    fetcher<any[]>(buildUrlQueryParams("v1/rest/locations/search", { keyword, ...params })),
};