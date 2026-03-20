// services/property.ts
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { DefaultResponse, Paginate, ParamsType } from "@/types/global";
import { Property } from "@/types/property";
import { BASE_URL } from "@/config/global";
import { getCookie } from "cookies-next";

export const propertyService = {
  // Get all properties with pagination and filters
  getAll: (params?: ParamsType) =>
    fetcher<Paginate<Property>>(buildUrlQueryParams("v1/rest/properties/paginate", params)),

  // Get property by ID with full details
  get: (id?: string, params?: ParamsType) =>
    fetcher<DefaultResponse<Property>>(buildUrlQueryParams(`v1/rest/properties/${id}`, params)),

  // Get property by UUID (public)
  getByUuid: (uuid: string, params?: ParamsType) =>
    fetcher<DefaultResponse<Property>>(buildUrlQueryParams(`v1/rest/properties/${uuid}`, params)),

  // Search properties with advanced filters
  search: (params?: ParamsType) =>
    fetcher<Paginate<Property>>(buildUrlQueryParams("v1/rest/properties/search", params)),

  // Get featured properties
  getFeatured: (params?: ParamsType) =>
    fetcher<Paginate<Property>>(buildUrlQueryParams("v1/rest/properties/featured", params)),

  // Get VIP properties
  getVip: (params?: ParamsType) =>
    fetcher<Paginate<Property>>(buildUrlQueryParams("v1/rest/properties/vip", params)),

  // Get similar properties
  getSimilar: (id: number, params?: ParamsType) =>
    fetcher<Paginate<Property>>(buildUrlQueryParams(`v1/rest/properties/${id}/similar`, params)),

  // Get properties for map
  getForMap: (params?: ParamsType) =>
    fetcher<any[]>(buildUrlQueryParams("v1/rest/properties/map", params)),

  // Get current user's properties (authenticated)
  getMyProperties: (params?: ParamsType) =>
    fetcher<Paginate<Property>>(buildUrlQueryParams("v1/user/properties", params)),

  // Get property statistics for current user
  getMyStats: (params?: ParamsType) =>
    fetcher<any>(buildUrlQueryParams("v1/user/properties/stats", params)),

  // Create new property
  create: (data: FormData) =>
    fetcher.post<DefaultResponse<Property>>("v1/user/properties", { body: data }),

  // Update property
  update: (id: number, data: FormData) =>
    fetcher.put<DefaultResponse<Property>>(`v1/user/properties/${id}`, { body: data }),

  // Delete properties
  delete: (ids: number[]) =>
    fetcher.delete<DefaultResponse<null>>("v1/user/properties", { body: { ids } }),

  // Toggle featured status
  toggleFeatured: (id: number) =>
    fetcher.post<DefaultResponse<Property>>(`v1/user/properties/${id}/toggle-featured`),

  // Toggle VIP status
  toggleVip: (id: number, days?: number) =>
    fetcher.post<DefaultResponse<Property>>(`v1/user/properties/${id}/toggle-vip`, { 
      body: { days } 
    }),

  // Bulk update properties
  bulkUpdate: (ids: number[], data: any) =>
    fetcher.post<DefaultResponse<number>>("v1/user/properties/bulk-update", { 
      body: { ids, data } 
    }),

  // Download property document
  downloadDocument: (id: number, documentId: number) =>
    fetch(`${BASE_URL}v1/user/properties/${id}/documents/${documentId}`, {
      headers: {
        Authorization: getCookie("token") as string,
      },
    }),

  // Upload property document
  uploadDocument: (id: number, file: File) => {
    const formData = new FormData();
    formData.append('document', file);
    return fetcher.post(`v1/user/properties/${id}/documents`, { body: formData });
  },
};