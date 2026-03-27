import type { Property } from "./property";
import type { Project } from "./project";

export interface Amenity {
  id: number;
  slug: string;
  name: string;
  icon?: string;
  order: number;
  is_active: boolean;
  
  // Pivot data (when used with property or project)
  pivot?: {
    property_id?: number;
    project_id?: number;
    amenity_id: number;
    value?: string;
  };
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
  
  // Relations
  translations?: AmenityTranslation[];
  properties?: Property[];
  projects?: Project[];
}

export interface AmenityTranslation {
  id: number;
  amenity_id: number;
  locale: string;
  name: string;
  description?: string;
}

export interface AmenityGroup {
  name: string;
  amenities: Amenity[];
}

export interface AmenityFilters {
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: boolean;
  group?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface AmenityStatistics {
  total_amenities: number;
  active_amenities: number;
  total_properties_with_amenities: number;
  total_projects_with_amenities: number;
  most_used: {
    amenity_id: number;
    name: string;
    count: number;
  }[];
}

export interface PropertyAmenity {
  property_id: number;
  amenity_id: number;
  value?: string;
  amenity?: Amenity;
}

export interface ProjectAmenity {
  project_id: number;
  amenity_id: number;
  value?: string;
  amenity?: Amenity;
}