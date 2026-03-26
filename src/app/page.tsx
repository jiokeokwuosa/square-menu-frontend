"use client";

import { LocationSelector } from "@/components/menu/location-selector";
import { CategoryNav } from "@/components/menu/category-nav";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { EmptyState, ErrorState, LoadingState } from "@/components/menu/states";
import { useMenuPageState } from "@/hooks/use-menu-page-state";

export default function Home() {
  const {
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
  } = useMenuPageState();

  return (
    <main className="mx-auto w-full max-w-6xl p-4 pb-10 md:p-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Restaurant Menu</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Browse Square catalog items by location and category.
        </p>
      </header>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <LocationSelector
            locations={locations}
            selectedLocationId={selectedLocationId}
            disabled={!isMounted || loadingLocations || locations.length === 0}
            onChange={setSelectedLocationId}
          />

          <div className="w-full">
            <label htmlFor="search" className="mb-1 block text-sm font-medium text-zinc-700">
              Search (bonus)
            </label>
            <input
              id="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by item name or description"
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-500"
            />
          </div>
        </div>
      </section>

      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={onCategorySelect}
      />

      {error && (
        <ErrorState message={error} onRetry={retry} />
      )}

      {(loadingLocations || loadingMenu) && <LoadingState />}

      {!loadingLocations && !loadingMenu && !error && !hasItems && (
        <EmptyState message="No items found for this location." />
      )}

      {!loadingLocations && !loadingMenu && !error && hasItems && (
        <section className="mt-4 space-y-6 transition-all duration-300">
          {filteredGroups.map((group) => (
            <article
              key={group.category_id}
              id={`category-${group.category_id}`}
              className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <h2 className="mb-4 text-lg font-semibold text-zinc-900">{group.category_name}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {group.items.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    expanded={Boolean(expandedItems[item.id])}
                    onToggleExpanded={() => toggleExpanded(item.id)}
                  />
                ))}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
