// services/amenity.ts
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { DefaultResponse, Paginate, ParamsType } from "@/types/global";
import { Amenity } from "@/types/amenity";

export const amenityService = {
  /**
   * Get all amenities with pagination and filters
   * @param params - Query parameters (page, per_page, search, is_active, etc.)
   */
  getAll: (params?: ParamsType) =>
    fetcher<Paginate<Amenity>>(buildUrlQueryParams("v1/rest/amenities", params)),

  /**
   * Get amenity by ID
   * @param id - Amenity ID
   * @param params - Query parameters (lang, etc.)
   */
  getById: (id: number, params?: ParamsType) =>
    fetcher<DefaultResponse<Amenity>>(buildUrlQueryParams(`v1/rest/amenities/${id}`, params)),

  /**
   * Get amenity by slug
   * @param slug - Amenity slug
   * @param params - Query parameters (lang, etc.)
   */
  getBySlug: (slug: string, params?: ParamsType) =>
    fetcher<DefaultResponse<Amenity>>(buildUrlQueryParams(`v1/rest/amenities/${slug}`, params)),

  /**
   * Search amenities by keyword
   * @param keyword - Search keyword
   * @param params - Query parameters (page, per_page, etc.)
   */
  search: (keyword: string, params?: ParamsType) =>
    fetcher<Paginate<Amenity>>(buildUrlQueryParams("v1/rest/amenities/search", { 
      keyword, 
      ...params 
    })),

  /**
   * Get popular amenities (most used)
   * @param limit - Number of amenities to return
   * @param params - Query parameters (lang, etc.)
   */
  getPopular: (limit: number = 12, params?: ParamsType) =>
    fetcher<Amenity[]>(buildUrlQueryParams("v1/rest/amenities/popular", { 
      limit, 
      ...params 
    })),

  /**
   * Get amenities by property ID
   * @param propertyId - Property ID
   * @param params - Query parameters (lang, etc.)
   */
  getByPropertyId: (propertyId: number, params?: ParamsType) =>
    fetcher<Amenity[]>(buildUrlQueryParams(`v1/rest/properties/${propertyId}/amenities`, params)),

  /**
   * Get amenities by project ID
   * @param projectId - Project ID
   * @param params - Query parameters (lang, etc.)
   */
  getByProjectId: (projectId: number, params?: ParamsType) =>
    fetcher<Amenity[]>(buildUrlQueryParams(`v1/rest/projects/${projectId}/amenities`, params)),
};