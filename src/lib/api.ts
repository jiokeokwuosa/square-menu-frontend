import { getApiBaseUrl } from "@/lib/env";
import type {
  ApiErrorResponse,
  CatalogCategoriesResponse,
  CatalogResponse,
  LocationsResponse,
} from "@/types/api";

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    let apiError: ApiErrorResponse | null = null;
    try {
      apiError = (await response.json()) as ApiErrorResponse;
    } catch {
      apiError = null;
    }
    throw new ApiClientError(
      apiError?.message ?? "Request failed",
      response.status,
      apiError?.code,
    );
  }

  return (await response.json()) as T;
}

export function getLocations(): Promise<LocationsResponse> {
  return fetchJson<LocationsResponse>("/locations");
}

export function getCatalogByLocation(locationId: string): Promise<CatalogResponse> {
  return fetchJson<CatalogResponse>(
    `/catalog?location_id=${encodeURIComponent(locationId)}`,
  );
}

export function getCategoriesByLocation(
  locationId: string,
): Promise<CatalogCategoriesResponse> {
  return fetchJson<CatalogCategoriesResponse>(
    `/catalog/categories?location_id=${encodeURIComponent(locationId)}`,
  );
}
