export interface PropertyCategory {
  id: number;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  image?: string;
  parent_id?: number;
  order: number;
  is_active: boolean;
  children?: PropertyCategory[];
}