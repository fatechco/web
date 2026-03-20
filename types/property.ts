// types/property.ts
export type PropertyType = 'sale' | 'rent';
export type PropertyStatus = 'selling' | 'sold' | 'rented';
export type ModerationStatus = 'pending' | 'approved' | 'rejected';
export type PeriodUnit = 'month' | 'year' | 'day';

export interface Property {
    id: number;
    name: string; // length 300
    slug: string; // length 300, unique
    type: PropertyType; // default 'sale'
    description?: string | null; // length 400
    content?: string | null; // longText
    location?: string | null;
    images?: string | null; // JSON string hoặc comma-separated
    project_id: number; // default 0
    number_bedroom?: number | null;
    number_bathroom?: number | null;
    number_floor?: number | null;
    square?: number | null; // square meter
    price?: number | null; // decimal 15,0
    currency_id?: number | null;
    is_featured: boolean; // default 0
    city_id?: number | null;
    period: PeriodUnit; // default 'month'
    status: PropertyStatus; // default 'selling'
    category_id?: number | null;
    moderation_status: ModerationStatus; // default 'pending'
    expire_date?: string | null; // date
    auto_renew: boolean; // default false
    never_expired: boolean; // default false
    created_at: string;
    updated_at: string;
}

export interface PropertyFilters {
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export interface PropertyResponse {
  data: Property[];
  total: number;
  page: number;
  totalPages: number;
}
