import type { CatalogItemVariationView } from "@/types/api";

export function formatPrice(
  amountMinor: number | null,
  currency: string | null,
): string {
  if (amountMinor === null || !currency) {
    return "Price unavailable";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amountMinor / 100);
}

export function getPrimaryPrice(variations: CatalogItemVariationView[]): string {
  const first = variations[0];
  if (!first) {
    return "Price unavailable";
  }
  return formatPrice(first.price, first.currency);
}

export function formatVariations(variations: CatalogItemVariationView[]): string {
  if (variations.length <= 1) {
    return "";
  }

  return variations
    .map((variation) => `${variation.name} ${formatPrice(variation.price, variation.currency)}`)
    .join(" · ");
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength).trim()}...`;
}
