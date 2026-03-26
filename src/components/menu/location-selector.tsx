import type { LocationItem } from "@/types/api";

interface LocationSelectorProps {
  locations: LocationItem[];
  selectedLocationId: string;
  disabled: boolean;
  onChange: (locationId: string) => void;
}

export function LocationSelector({
  locations,
  selectedLocationId,
  disabled,
  onChange,
}: LocationSelectorProps) {
  return (
    <div className="w-full md:max-w-xs">
      <label htmlFor="location" className="mb-1 block text-sm font-medium text-zinc-700">
        Location
      </label>
      <select
        id="location"
        value={selectedLocationId}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        suppressHydrationWarning
        className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-zinc-500"
      >
        {locations.map((location) => (
          <option key={location.id} value={location.id}>
            {location.name}
          </option>
        ))}
      </select>
    </div>
  );
}
