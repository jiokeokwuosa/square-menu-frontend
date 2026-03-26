export interface LocationItem {
  id: string;
  name: string;
  address: string;
  timezone: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface LocationsResponse {
  data: LocationItem[];
}

export interface CatalogItemVariationView {
  name: string;
  price: number | null;
  currency: string | null;
}

export interface CatalogItemView {
  id: string;
  name: string;
  description: string | null;
  category: string;
  image_url: string | null;
  variations: CatalogItemVariationView[];
}

export interface CatalogGroup {
  category_id: string;
  category_name: string;
  items: CatalogItemView[];
}

export interface CatalogResponse {
  location_id: string;
  groups: CatalogGroup[];
}

export interface CatalogCategory {
  id: string;
  name: string;
  item_count: number;
}

export interface CatalogCategoriesResponse {
  location_id: string;
  categories: CatalogCategory[];
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  code: string;
  details?: unknown;
}
