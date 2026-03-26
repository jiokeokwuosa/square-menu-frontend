"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ApiClientError,
  getCatalogByLocation,
  getCategoriesByLocation,
  getLocations,
} from "@/lib/api";
import type {
  CatalogCategory,
  CatalogGroup,
  CatalogItemView,
  LocationItem,
} from "@/types/api";

const LOCATION_STORAGE_KEY = "square_menu_selected_location";

export function useMenuPageState() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [groups, setGroups] = useState<CatalogGroup[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState<string>("");
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const filteredGroups = useMemo(() => {
    const term = search.trim().toLowerCase();
    const bySearch = groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => matchesSearch(item, term)),
      }))
      .filter((group) => group.items.length > 0);

    if (activeCategory === "all") {
      return bySearch;
    }
    return bySearch.filter((group) => group.category_id === activeCategory);
  }, [activeCategory, groups, search]);

  const hasItems = filteredGroups.some((group) => group.items.length > 0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    void loadLocations();
  }, []);

  useEffect(() => {
    if (!selectedLocationId) {
      return;
    }
    void loadMenuData(selectedLocationId);
    setPersistedLocation(selectedLocationId);
  }, [selectedLocationId]);

  async function loadLocations(): Promise<void> {
    setLoadingLocations(true);
    setError(null);

    try {
      const response = await getLocations();
      setLocations(response.data);

      const persisted = getPersistedLocation();
      const persistedStillValid = response.data.some((loc) => loc.id === persisted);
      const fallback = response.data[0]?.id ?? "";
      setSelectedLocationId(persistedStillValid ? persisted ?? fallback : fallback);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingLocations(false);
    }
  }

  async function loadMenuData(locationId: string): Promise<void> {
    setLoadingMenu(true);
    setError(null);
    setActiveCategory("all");

    try {
      const [catalogRes, categoriesRes] = await Promise.all([
        getCatalogByLocation(locationId),
        getCategoriesByLocation(locationId),
      ]);
      setGroups(catalogRes.groups);
      setCategories(categoriesRes.categories);
    } catch (err) {
      setError(getErrorMessage(err));
      setGroups([]);
      setCategories([]);
    } finally {
      setLoadingMenu(false);
    }
  }

  function onCategorySelect(categoryId: string): void {
    setActiveCategory(categoryId);
    if (categoryId === "all") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(`category-${categoryId}`);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function toggleExpanded(itemId: string): void {
    setExpandedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  }

  function retry(): void {
    if (selectedLocationId) {
      void loadMenuData(selectedLocationId);
    } else {
      void loadLocations();
    }
  }

  return {
    locations,
    selectedLocationId,
    setSelectedLocationId,
    categories,
    activeCategory,
    onCategorySelect,
    filteredGroups,
    expandedItems,
    toggleExpanded,
    search,
    setSearch,
    loadingLocations,
    loadingMenu,
    error,
    retry,
    hasItems,
    isMounted,
  };
}

function getPersistedLocation(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  const storage = window.localStorage;
  if (!storage || typeof storage.getItem !== "function") {
    return null;
  }

  try {
    return storage.getItem(LOCATION_STORAGE_KEY);
  } catch {
    return null;
  }
}

function setPersistedLocation(locationId: string): void {
  if (typeof window === "undefined") {
    return;
  }
  const storage = window.localStorage;
  if (!storage || typeof storage.setItem !== "function") {
    return;
  }

  try {
    storage.setItem(LOCATION_STORAGE_KEY, locationId);
  } catch {
    // Ignore storage write errors (private mode / quotas) and continue UX flow.
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return `${error.message}${error.statusCode ? ` (HTTP ${error.statusCode})` : ""}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred.";
}

function matchesSearch(item: CatalogItemView, searchTerm: string): boolean {
  if (!searchTerm) {
    return true;
  }

  const haystack = `${item.name} ${item.description ?? ""}`.toLowerCase();
  return haystack.includes(searchTerm);
}
