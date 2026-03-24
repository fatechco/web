import type { Amenity } from "./amenity";
import type { Project } from "./project";
import type { PropertyCategory } from "./property-category";
import type { User } from "./user";

// types/property.ts
export interface Property {
  id: number;
  uuid: string;
  slug: string;
  title?: string;
  description?: string;
  price: number;
  price_per_m2?: number;
  is_negotiable?: boolean;
  area: number;
  land_area?: number;
  built_area?: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  garages?: number;
  year_built?: number;
  furnishing?: string;
  legal_status?: string;
  ownership_type?: string;
  address?: string;
  full_address?: string;
  street?: string;
  street_number?: string;
  building_name?: string;
  latitude?: number;
  longitude?: number;
  project_name?: string;
  status: 'pending' | 'available' | 'sold' | 'rented' | 'expired' | 'hidden' | 'rejected';
  type: 'sale' | 'rent';
  is_featured: boolean;
  is_vip: boolean;
  vip_expires_at?: string;
  is_urgent: boolean;
  is_top: boolean;
  top_expires_at?: string;
  views: number;
  unique_views: number;
  contact_views: number;
  favorites_count: number;
  published_at?: string;
  expired_at?: string;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  category?: PropertyCategory;
  project?: Project;
  user?: User;
  images?: PropertyImage[];
  primary_image?: PropertyImage;
  amenities?: Amenity[];
  reviews?: PropertyReview[];
  
  // Translations
  translations?: PropertyTranslation[];
}

export interface PropertyFull extends Property {
  translations: PropertyTranslation[];
}

export interface PropertyTranslation {
  id: number;
  property_id: number;
  locale: string;
  title: string;
  description: string;
}

export interface PropertyImage {
  id: number;
  uuid: string;
  path: string;
  thumbnail_path?: string;
  medium_path?: string;
  large_path?: string;
  caption?: string;
  is_primary: boolean;
  order: number;
  type: string;
  url?: string;
  thumbnail_url?: string;
}

export interface PropertyFilters {
  page?: number;
  per_page?: number;
  keyword?: string;
  category_id?: number;
  project_id?: number;
  user_id?: number;
  city?: string;
  district?: string;
  price_min?: number;
  price_max?: number;
  area_min?: number;
  area_max?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnishing?: string;
  transaction_type?: string;
  status?: string;
  is_featured?: boolean;
  is_vip?: boolean;
  amenities?: number[];
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PropertyReview {
  id: number;
  property_id: number;
  user_id: number;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
  user?: User;
}