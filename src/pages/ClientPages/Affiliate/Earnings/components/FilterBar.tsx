import Badge from "../../../../../components/ui/badge/Badge";
import { Commission, FilterType } from "../Earnings";

// Filter Bar Component
export function FilterBar({
  activeFilter,
  onFilterChange,
  commissions,
}: {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  commissions: Commission[];
}) {
  const getFilterCount = (filter: FilterType) => {
    if (filter === "all") return commissions.length;
    return commissions.filter((commission) => commission.status === filter)
      .length;
  };

  const filterOptions = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "paid", label: "Paid" },
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
          {commissions.filter((c) => c.status === "approved").length} Approved
        </Badge>
        <Badge color="warning" size="sm">
          {commissions.filter((c) => c.status === "pending").length} Pending
        </Badge>
        <Badge color="success" size="sm">
          {commissions.filter((c) => c.status === "paid").length} Paid
        </Badge>
      </div>
    </div>
  );
}
