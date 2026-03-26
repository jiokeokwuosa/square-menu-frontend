import type { CatalogCategory } from "@/types/api";
import { CategoryButton } from "@/components/menu/category-button";

interface CategoryNavProps {
  categories: CatalogCategory[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryNav({
  categories,
  activeCategory,
  onSelectCategory,
}: CategoryNavProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-10 mt-4 overflow-x-auto rounded-2xl border border-zinc-200 bg-white/95 p-2 shadow-sm backdrop-blur">
      <div className="flex min-w-max gap-2">
        <CategoryButton
          active={activeCategory === "all"}
          label="All"
          onClick={() => onSelectCategory("all")}
        />
        {categories.map((category) => (
          <CategoryButton
            key={category.id}
            active={activeCategory === category.id}
            label={`${category.name} (${category.item_count})`}
            onClick={() => onSelectCategory(category.id)}
          />
        ))}
      </div>
    </nav>
  );
}
