import { Dispatch, SetStateAction } from "react";

export type FilterOption = {
  key: string;
  label: string;
  color?: "success" | "warning" | "error" | "info";
};

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: Dispatch<SetStateAction<string>>;
  filterOptions: FilterOption[];
  counts: Record<string, number>;
  badgeConfig?: {
    key: string;
    color: "success" | "warning" | "error" | "info";
    label: string;
  }[];
}

export default function FilterBar({
  activeFilter,
  onFilterChange,
  filterOptions,
  counts,
}: FilterBarProps) {
  return (
    <div className=" flex justify-between items-center">
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeFilter === filter.key
                ? "bg-brand-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {filter.label} ({counts[filter.key] || 0})
          </button>
        ))}
      </div>
    </div>
  );
}
