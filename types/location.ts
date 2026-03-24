export interface Country {
  id: number;
  code: string;
  phone_code?: string;
  name: string;
  native_name?: string;
  active: boolean;
  default: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Province {
  id: number;
  country_id: number;
  code?: string;
  name: string;
  type?: string;
  active: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
  country?: Country;
}

export interface District {
  id: number;
  province_id: number;
  country_id: number;
  code?: string;
  name: string;
  type?: string;
  active: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
  province?: Province;
  country?: Country;
}

export interface Ward {
  id: number;
  district_id: number;
  province_id: number;
  country_id: number;
  code?: string;
  name: string;
  type?: string;
  active: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
  district?: District;
  province?: Province;
  country?: Country;
}