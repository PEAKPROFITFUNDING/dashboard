import Badge from "../../../../../components/ui/badge/Badge";
import { Affiliate, FilterType } from "./types";

interface FilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  affiliates: Affiliate[];
}

export default function FilterBar({
  activeFilter,
  onFilterChange,
  affiliates,
}: FilterBarProps) {
  const getFilterCount = (filter: FilterType) => {
    if (filter === "all") return affiliates.length;
    return affiliates.filter((affiliate) => affiliate.status === filter).length;
  };

  const filterOptions = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
    { key: "pending", label: "Pending" },
  ];

  return (
    <div className="mb-6 flex justify-between">
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key as FilterType)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeFilter === filter.key
                ? "bg-brand-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {filter.label} ({getFilterCount(filter.key as FilterType)})
          </button>
        ))}
      </div>
      <div className="flex items-center space-x-3">
        <Badge color="success" size="sm">
          {affiliates.filter((a) => a.status === "active").length} Active
        </Badge>
        <Badge color="warning" size="sm">
          {affiliates.filter((a) => a.status === "pending").length} Pending
        </Badge>
      </div>
    </div>
  );
}
