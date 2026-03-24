// services/property-category.ts
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { DefaultResponse, Paginate, ParamsType } from "@/types/global";
import type { PropertyCategory } from "@/types/property-category";

export const propertyCategoryService = {
  /**
   * Get all categories with pagination
   */
  getAll: (params?: ParamsType) =>
    fetcher<Paginate<PropertyCategory>>(buildUrlQueryParams("v1/rest/categories", params)),

  /**
   * Get category tree (hierarchical)
   */
  getTree: (params?: ParamsType) =>
    fetcher<PropertyCategory[]>(buildUrlQueryParams("v1/rest/categories/tree", params)),

  /**
   * Get category by ID
   */
  getById: (id: number, params?: ParamsType) =>
    fetcher<DefaultResponse<PropertyCategory>>(buildUrlQueryParams(`v1/rest/categories/${id}`, params)),

  /**
   * Get category by slug
   */
  getBySlug: (slug: string, params?: ParamsType) =>
    fetcher<DefaultResponse<PropertyCategory>>(buildUrlQueryParams(`v1/rest/categories/${slug}`, params)),

  /**
   * Get root categories (no parent)
   */
  getRoot: (params?: ParamsType) =>
    fetcher<PropertyCategory[]>(buildUrlQueryParams("v1/rest/categories/root", params)),

  /**
   * Get properties by category
   */
  getProperties: (categoryId: number, params?: ParamsType) =>
    fetcher<Paginate<any>>(buildUrlQueryParams(`v1/rest/categories/${categoryId}/properties`, params)),

  /**
   * Get category statistics
   */
  getStatistics: (params?: ParamsType) =>
    fetcher<any>(buildUrlQueryParams("v1/rest/categories/statistics", params)),
};