import { WorkingDay } from "@/types/shop";

export interface DefaultResponse<T> {
  data: T;
  message: string;
  status: boolean;
  timestamp: string;
}

export interface Paginate<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    next: string | null;
    prev: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    links: {
      active: boolean;
      label: string;
      url: string;
    }[];
    per_page: string;
    to: number;
    total: number;
  };
}

export interface Coordinate {
  lat: number;
  lng: number;
}

export enum ImageTypes {
  BANNER = "banners",
  BRAND = "brands",
  CATEGORY = "categories",
  SHOP = "shops",
  SHOP_LOGO = "shops/logo",
  SHOP_BG = "shops/background",
  REVIEW = "reviews",
  USER = "users",
}

export interface Currency {
  id: number;
  symbol: string;
  rate: number;
  title: string;
  default?: boolean;
  active: boolean;
  updated_at: string;
  position: string;
}

export interface Setting {
  created_at: string;
  id: number;
  key: string;
  value: string;
  updated_at: string;
}

export interface Language {
  active: number;
  backward: number;
  default: number;
  id: number;
  img: string;
  locale: string;
  title: string;
}

export interface Location {
  latitude: string;
  longitude: string;
}


export interface Payment {
  tag: string;
  id: number;
  input?: number;
  active: boolean;
}

export interface ErrorResponse {
  message: string;
  status: boolean;
  statusCode: string;
  timestamp: string;
  params?: Record<string, string[]>;
}

export type ParamsType = Record<
  string,
  | string
  | number
  | undefined
  | null
  | string[]
  | (number | undefined)[]
  | boolean
  | Record<string, string | number | undefined>[]
>;

export interface DeliveryPrice {
  country_id: number;
  city_id: number;
  price: number;
  id: number;
  region_id: number;
}

export interface TransactionCreateBody {
  id: number;
  payment: {
    payment_sys_id?: number;
  };
}

export type LikeTypes = "property" | "shop" | "master";

export interface LikeOptions {
  type: LikeTypes;
  type_id?: number;
  region_id?: number;
  country_id?: number;
  city_id?: number;
}

export interface LatLng {
  lat: number;
  lng: number;
}


export interface SearchPrediction {
  id: string;
  name: {
    string: string;
    offset: number;
    length: number;
  };
  address: {
    string: string;
  };
}


export interface Referral {
  id: number;
  price_to: number;
  price_from: number;
  img: string;
}

interface PageTranslation {
  description: string;
}

export interface Page {
  id: number;
  img?: string;
  type: string;
  
  buttons?: {
    app_store_button_link: string;
    google_play_button_link: string;
  };
}

export interface Transaction {
  id: number;
  note: string;
  payable_id: number;
  payable_type: string;
  payment_system: Payment;
  perform_time: string;
  price: number;
  status: string;
  status_description: string;
}
