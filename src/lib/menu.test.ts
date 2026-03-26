import { describe, expect, it } from "vitest";
import { formatPrice, formatVariations, getPrimaryPrice, truncateText } from "@/lib/menu";

describe("menu utils", () => {
  it("formats minor currency units", () => {
    expect(formatPrice(1250, "USD")).toBe("$12.50");
  });

  it("handles missing price", () => {
    expect(formatPrice(null, "USD")).toBe("Price unavailable");
  });

  it("gets primary price from first variation", () => {
    expect(
      getPrimaryPrice([
        { name: "Small", price: 400, currency: "USD" },
        { name: "Large", price: 650, currency: "USD" },
      ]),
    ).toBe("$4.00");
  });

  it("formats multiple variations", () => {
    expect(
      formatVariations([
        { name: "Small", price: 400, currency: "USD" },
        { name: "Large", price: 650, currency: "USD" },
      ]),
    ).toBe("Small $4.00 · Large $6.50");
  });

  it("truncates long text", () => {
    expect(truncateText("abcdefghijklmnopqrstuvwxyz", 10)).toBe("abcdefghij...");
  });
});
