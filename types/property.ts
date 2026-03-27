// types/property.ts
import type { Amenity } from "./amenity";
import type { Project } from "./project";
import type { PropertyCategory } from "./property-category";
import type { User } from "./user";


// Property Translation
export interface PropertyTranslation {
  id: number;
  property_id: number;
  locale: string;
  title: string;
  description: string;
  content?: string;
}

// Property Image (từ File model)
export interface PropertyImage {
  id: number;
  uuid: string;
  url: string;
  thumbnail_url?: string;
  caption?: string;
  is_primary: boolean;
  order: number;
  file_category: string;
  mime_type: string;
  size: string;
  size_bytes: number;
  width?: number;
  height?: number;
}

// Property Review
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

// Property Filters
export interface PropertyFilters {
  page?: number;
  per_page?: number;
  keyword?: string;
  category_id?: number;
  project_id?: number;
  user_id?: number;
  country_id?: number;
  province_id?: number;
  district_id?: number;
  ward_id?: number;
  price_min?: number;
  price_max?: number;
  area_min?: number;
  area_max?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnishing?: string;
  type?: 'sale' | 'rent';
  status?: 'pending' | 'available' | 'sold' | 'rented' | 'expired' | 'hidden' | 'rejected';
  is_featured?: boolean;
  is_vip?: boolean;
  amenities?: number[];
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Main Property Interface
export interface Property {
  id: number;
  uuid: string;
  slug: string;
  title: string;
  description: string;
  content?: string;
  
  // Pricing
  price: number;
  price_formatted: string;
  price_per_m2?: number;
  is_negotiable: boolean;
  
  // Area & Dimensions
  area: number;
  area_formatted: string;
  land_area?: number;
  land_area_formatted?: string;
  built_area?: number;
  built_area_formatted?: string;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  garages?: number;
  year_built?: number;
  furnishing?: string;
  furnishing_label?: string;
  legal_status?: string;
  ownership_type?: string;
  
  // Location
  address?: string;
  full_address: string;
  city?: string;
  district?: {
    id: number;
    name: string;
  };
  ward?: {
    id: number;
    name: string;
  };
  street?: string;
  street_number?: string;
  building_name?: string;
  project_name?: string;
  latitude?: number;
  longitude?: number;
  map_url?: string;
  
  // Status
  status: 'pending' | 'available' | 'sold' | 'rented' | 'expired' | 'hidden' | 'rejected';
  status_label: string;
  type: 'sale' | 'rent';
  type_label: string;
  
  // Premium Features
  is_featured: boolean;
  is_vip: boolean;
  is_vip_active?: boolean;
  vip_expires_at?: string;
  is_urgent: boolean;
  is_top: boolean;
  is_top_active?: boolean;
  top_expires_at?: string;
  
  // Statistics
  views: number;
  unique_views?: number;
  contact_views?: number;
  favorites_count: number;
  
  // Media
  images?: PropertyImage[];
  primary_image?: string;
  primary_image_thumbnail?: string;
  all_images?: PropertyImage[];
  video_url?: string;
  virtual_tour_url?: string;
  
  // Relations
  user?: User;
  category?: PropertyCategory;
  project?: Project;
  amenities?: Amenity[];
  reviews?: PropertyReview[];
  translations?: PropertyTranslation[];
  
  // SEO
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  
  // Timestamps
  published_at?: string;
  expired_at?: string;
  created_at: string;
  updated_at: string;
  
  // Permissions
  can_edit?: boolean;
  can_delete?: boolean;
}

// Property Detail (extends Property with more relations)
export interface PropertyDetail extends Property {
  assigned_agents?: {
    id: number;
    name: string;
    avatar: string | null;
    type: string;
    commission_rate?: number;
  }[];
  primary_agent?: {
    id: number;
    name: string;
    avatar: string | null;
    commission_rate?: number;
  } | null;
}

// Property Edit Data (for form)
export interface PropertyEditData {
  id: number;
  uuid: string;
  title: string;
  description: string;
  category_id: number | null;
  type: 'sale' | 'rent';
  status: string;
  price: number;
  is_negotiable: boolean;
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
  country_id?: number;
  province_id?: number;
  district_id?: number;
  ward_id?: number;
  street?: string;
  street_number?: string;
  building_name?: string;
  full_address?: string;
  latitude?: number;
  longitude?: number;
  existing_images: PropertyImage[];
  video_url?: string;
  virtual_tour_url?: string;
  amenities: number[];
  is_featured: boolean;
  is_vip: boolean;
  is_urgent: boolean;
  is_top: boolean;
  translations: Record<string, {
    title: string;
    description: string;
    content?: string;
  }>;
}

// Property List Item (for cards)
export interface PropertyListItem {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  price_formatted: string;
  area: number;
  area_formatted: string;
  bedrooms?: number;
  bathrooms?: number;
  address: string;
  city?: string;
  district?: {
    id: number;
    name: string;
  };
  status: string;
  status_label: string;
  type: 'sale' | 'rent';
  type_label: string;
  is_featured: boolean;
  is_vip: boolean;
  views: number;
  primary_image: string | null;
  primary_image_thumbnail: string | null;
  created_at: string;
  user?: {
    id: number;
    name: string;
    avatar: string | null;
  };
}

// Paginated Response
export interface PropertyPaginatedResponse {
  data: PropertyListItem[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}