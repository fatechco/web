// services/property.ts
import fetcher from "@/lib/fetcher";
import { Property, PropertyFilters, PropertyResponse } from "@/types/property";

export const propertyService = {
  // get list property of current user with filters
  async getMyProperties(filters: PropertyFilters = {}): Promise<PropertyResponse> {
    const queryParams = new URLSearchParams();
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());

    const queryString = queryParams.toString();
    const url = queryString ? `/user/properties?${queryString}` : '/user/properties';
    
    return fetcher(url);
  },

  // delete property - use fetcher.delete
  async deleteProperty(id: number): Promise<void> {
    return fetcher.delete(`/properties/${id}`);
  },

  // update property - use fetcher.put
  async updateProperty(id: number, data: Partial<Property>): Promise<Property> {
    return fetcher.put(`/properties/${id}`, { body: data });
  },

  // add new property - use fetcher.post
  async addProperty(data: Omit<Property, 'id'>): Promise<Property> {
    return fetcher.post('/properties', { body: data });
  }
};