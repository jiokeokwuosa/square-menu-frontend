import { useState } from "react";
import { formatVariations, getPrimaryPrice, truncateText } from "@/lib/menu";
import type { CatalogItemView } from "@/types/api";

interface MenuItemCardProps {
  item: CatalogItemView;
  expanded: boolean;
  onToggleExpanded: () => void;
}

export function MenuItemCard({ item, expanded, onToggleExpanded }: MenuItemCardProps) {
  const [imageSource, setImageSource] = useState<string | null>(
    item.image_url ?? "/images/placeholder.png",
  );
  const description = item.description ?? "";
  const longDescription = description.length > 120;
  const visibleDescription = expanded ? description : truncateText(description, 120);

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
      <div className="h-40 w-full bg-zinc-100">
        {imageSource ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSource}
            alt={item.name}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => {
              if (imageSource === "/images/placeholder.png") {
                setImageSource("/placeholder.png");
                return;
              }
              setImageSource(null);
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            No image available
          </div>
        )}
      </div>

      <div className="space-y-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-zinc-900">{item.name}</h3>
          <span className="text-sm font-semibold text-zinc-700">
            {getPrimaryPrice(item.variations)}
          </span>
        </div>

        {description && (
          <p className="text-sm leading-6 text-zinc-600">
            {visibleDescription}
            {longDescription && (
              <>
                {" "}
                <button
                  type="button"
                  onClick={onToggleExpanded}
                  className="font-medium text-zinc-900 underline underline-offset-2"
                >
                  {expanded ? "Read less" : "Read more"}
                </button>
              </>
            )}
          </p>
        )}

        {item.variations.length > 1 && (
          <p className="text-xs leading-5 text-zinc-500">{formatVariations(item.variations)}</p>
        )}
      </div>
    </div>
  );
}
