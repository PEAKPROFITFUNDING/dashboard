import Badge from "../../../../../components/ui/badge/Badge";
import { FilterType, PayoutRequest } from "../AdminAffiliatePayoutsPanel";

// Filter Bar Component
export function FilterBar({
  activeFilter,
  onFilterChange,
  requests,
}: {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  requests: PayoutRequest[];
}) {
  const getFilterCount = (filter: FilterType) => {
    if (filter === "all") return requests.length;
    return requests.filter((request) => request.status === filter).length;
  };

  const filterOptions = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "paid", label: "Paid" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div className="mb-6 flex justify-between flex-wrap gap-4">
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
        <Badge color="warning" size="sm">
          {requests.filter((r) => r.status === "pending").length} Pending
        </Badge>
        <Badge color="success" size="sm">
          {requests.filter((r) => r.status === "approved").length} Approved
        </Badge>
      </div>
    </div>
  );
}
