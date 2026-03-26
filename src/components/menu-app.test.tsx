import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Home from "@/app/page";
import * as api from "@/lib/api";

vi.mock("@/lib/api", async () => {
  const original = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return {
    ...original,
    getLocations: vi.fn(),
    getCatalogByLocation: vi.fn(),
    getCategoriesByLocation: vi.fn(),
  };
});

describe("MenuApp integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    if (typeof window.localStorage.clear === "function") {
      window.localStorage.clear();
    }
  });

  it("loads locations and menu data", async () => {
    vi.mocked(api.getLocations).mockResolvedValue({
      data: [{ id: "loc_1", name: "Main", address: "", timezone: "UTC", status: "ACTIVE" }],
    });
    vi.mocked(api.getCatalogByLocation).mockResolvedValue({
      location_id: "loc_1",
      groups: [
        {
          category_id: "cat_1",
          category_name: "Drinks",
          items: [
            {
              id: "item_1",
              name: "Coffee",
              description: "Fresh coffee",
              category: "Drinks",
              image_url: null,
              variations: [{ name: "Regular", price: 300, currency: "USD" }],
            },
          ],
        },
      ],
    });
    vi.mocked(api.getCategoriesByLocation).mockResolvedValue({
      location_id: "loc_1",
      categories: [{ id: "cat_1", name: "Drinks", item_count: 1 }],
    });

    render(<Home />);

    await waitFor(() => expect(api.getLocations).toHaveBeenCalled());
    await waitFor(() => expect(api.getCatalogByLocation).toHaveBeenCalledWith("loc_1"));
    expect(screen.getByText("Coffee")).toBeInTheDocument();
  });

  it("filters by search input", async () => {
    vi.mocked(api.getLocations).mockResolvedValue({
      data: [{ id: "loc_1", name: "Main", address: "", timezone: "UTC", status: "ACTIVE" }],
    });
    vi.mocked(api.getCatalogByLocation).mockResolvedValue({
      location_id: "loc_1",
      groups: [
        {
          category_id: "cat_1",
          category_name: "Drinks",
          items: [
            {
              id: "item_1",
              name: "Coffee",
              description: "Fresh coffee",
              category: "Drinks",
              image_url: null,
              variations: [{ name: "Regular", price: 300, currency: "USD" }],
            },
            {
              id: "item_2",
              name: "Tea",
              description: "Green tea",
              category: "Drinks",
              image_url: null,
              variations: [{ name: "Regular", price: 280, currency: "USD" }],
            },
          ],
        },
      ],
    });
    vi.mocked(api.getCategoriesByLocation).mockResolvedValue({
      location_id: "loc_1",
      categories: [{ id: "cat_1", name: "Drinks", item_count: 2 }],
    });

    render(<Home />);

    const search = await screen.findByLabelText("Search (bonus)");
    fireEvent.change(search, { target: { value: "tea" } });

    await waitFor(() => {
      expect(screen.queryByText("Coffee")).not.toBeInTheDocument();
      expect(screen.getByText("Tea")).toBeInTheDocument();
    });
  });
});
