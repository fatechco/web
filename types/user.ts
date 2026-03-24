import type { Property } from "./product";
import type { Project } from "./project";

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  avatar?: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  role?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  properties?: Property[];
  projects?: Project[];
  favorites?: Favorite[];
  reviews?: Review[];
}

export interface Favorite {
  id: number;
  user_id: number;
  favorable_type: string;
  favorable_id: number;
  created_at: string;
  
  // Polymorphic relations
  property?: Property;
  project?: Project;
  user?: User;
}

export interface Review {
  id: number;
  user_id: number;
  reviewable_type: string;
  reviewable_id: number;
  rating: number;
  comment?: string;
  is_approved: boolean;
  created_at: string;
  
  // Relations
  user?: User;
  property?: Property;
  project?: Project;
}