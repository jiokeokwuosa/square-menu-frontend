import { expect, test } from "@playwright/test";

test("renders menu and supports searching", async ({ page }) => {
  const corsHeaders = {
    "access-control-allow-origin": "http://localhost:3002",
    "content-type": "application/json",
  };

  await page.route("http://localhost:4010/api/locations", async (route) => {
    await route.fulfill({
      headers: corsHeaders,
      body: JSON.stringify({
        data: [{ id: "loc_1", name: "Main", address: "", timezone: "UTC", status: "ACTIVE" }],
      }),
    });
  });

  await page.route("http://localhost:4010/api/catalog/categories?location_id=loc_1", async (route) => {
    await route.fulfill({
      headers: corsHeaders,
      body: JSON.stringify({
        location_id: "loc_1",
        categories: [{ id: "cat_1", name: "Drinks", item_count: 2 }],
      }),
    });
  });

  await page.route("http://localhost:4010/api/catalog?location_id=loc_1", async (route) => {
    await route.fulfill({
      headers: corsHeaders,
      body: JSON.stringify({
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
      }),
    });
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Restaurant Menu" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Coffee" })).toBeVisible();
  await page.getByLabel("Search (bonus)").fill("tea");
  await expect(page.getByRole("heading", { name: "Tea" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Coffee" })).toHaveCount(0);
});
