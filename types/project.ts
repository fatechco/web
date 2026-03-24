// types/project.ts
import type { User } from "./user";
import type { Amenity } from "./amenity";

export interface Project {
  id: number;
  uuid: string;
  slug: string;
  name: string;
  description?: string;
  excerpt?: string;
  
  // Developer info
  developer_name?: string;
  developer_description?: string;
  developer_id?: number;
  
  // Agency
  agency_id?: number;
  agency?: User;
  
  // Location
  country_id?: number;
  province_id?: number;
  district_id?: number;
  ward_id?: number;
  address?: string;
  street?: string;
  street_number?: string;
  building_name?: string;
  full_address?: string;
  latitude?: number;
  longitude?: number;
  
  // Project details
  total_area?: number;
  built_area?: number;
  total_units?: number;
  available_units?: number;
  total_floors?: number;
  basement_floors?: number;
  
  // Pricing
  min_price?: number;
  max_price?: number;
  price_per_m2?: number;
  
  // Dates
  start_date?: string;
  completion_date?: string;
  handover_date?: string;
  
  // Status
  status: 'planning' | 'ongoing' | 'completed' | 'sold_out' | 'paused' | 'cancelled';
  
  // Flags
  is_featured: boolean;
  is_hot: boolean;
  is_active: boolean;
  
  // Statistics
  views: number;
  unique_views: number;
  favorites_count: number;
  inquiries_count: number;
  
  // SEO
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
  
  // Relations
  translations?: ProjectTranslation[];
  images?: ProjectImage[];
  units?: ProjectUnit[];
  amenities?: Amenity[];
  reviews?: ProjectReview[];
  
  // Accessors
  price_range?: string;
  status_label?: string;
  progress_percentage?: number;
}

export interface ProjectTranslation {
  id: number;
  project_id: number;
  locale: string;
  name: string;
  description?: string;
  excerpt?: string;
  address?: string;
  developer_name?: string;
  developer_description?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

export interface ProjectImage {
  id: number;
  project_id: number;
  file_id?: number;
  path: string;
  thumbnail_path?: string;
  caption?: string;
  is_primary: boolean;
  order: number;
  type: 'image' | 'video' | 'virtual_tour';
  url?: string;
  thumbnail_url?: string;
}

export interface ProjectUnit {
  id: number;
  project_id: number;
  unit_number: string;
  unit_type: 'apartment' | 'villa' | 'townhouse' | 'office' | 'retail';
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  price?: number;
  status: 'available' | 'reserved' | 'sold';
  features?: Record<string, any>;
  
  // Accessors
  price_formatted?: string;
  area_formatted?: string;
}

export interface ProjectFloorPlan {
  id: number;
  project_id: number;
  floor_number: string;
  units_on_floor: number;
  layout?: Record<string, any>;
  image_path?: string;
  image_url?: string;
}

export interface ProjectPhase {
  id: number;
  project_id: number;
  name: string;
  description?: string;
  order: number;
  start_date?: string;
  completion_date?: string;
  status: 'planning' | 'ongoing' | 'completed';
}

export interface ProjectReview {
  id: number;
  project_id: number;
  user_id: number;
  rating: number;
  comment?: string;
  is_approved: boolean;
  created_at: string;
  user?: User;
}

export interface ProjectFilters {
  page?: number;
  per_page?: number;
  keyword?: string;
  city?: string;
  district?: string;
  status?: string;
  is_featured?: boolean;
  is_hot?: boolean;
  price_min?: number;
  price_max?: number;
  area_min?: number;
  area_max?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface ProjectStatistics {
  total_projects: number;
  featured_projects: number;
  ongoing_projects: number;
  completed_projects: number;
  total_units: number;
  sold_units: number;
  available_units: number;
  total_views: number;
  avg_price: number;
  min_price: number;
  max_price: number;
}