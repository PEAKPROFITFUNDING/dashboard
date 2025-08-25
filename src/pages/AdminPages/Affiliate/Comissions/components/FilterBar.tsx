import { Commission, FilterType } from "../AdminComissions";

// Filter Bar Component
export function FilterBar({
  activeFilter,
  onFilterChange,
  searchTerm,
  onSearchChange,
  commissions,
  affiliateFilter,
  onAffiliateFilterChange,
  typeFilter,
  onTypeFilterChange,
}: {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  searchTerm: string;
  onSearchChange: (search: string) => void;
  commissions: Commission[];
  affiliateFilter: string;
  onAffiliateFilterChange: (affiliate: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
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
    { key: "rejected", label: "Rejected" },
  ];

  const uniqueAffiliates = Array.from(
    new Set(commissions.map((c) => c.affiliateName))
  ).sort();
  const commissionTypes = [
    { key: "", label: "All Types" },
    { key: "purchase", label: "Purchase" },
    { key: "referral", label: "Referral" },
    { key: "bonus", label: "Bonus" },
    { key: "recurring", label: "Recurring" },
    { key: "tier2", label: "Tier 2" },
  ];

  return (
    <div className="space-y-4">
      {/* Status Filters */}
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

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by affiliate or customer name..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 dark:border-white/[0.05] rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={affiliateFilter}
            onChange={(e) => onAffiliateFilterChange(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-white/[0.05] rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Affiliates</option>
            {uniqueAffiliates.map((affiliate) => (
              <option key={affiliate} value={affiliate}>
                {affiliate}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-white/[0.05] rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {commissionTypes.map((type) => (
              <option key={type.key} value={type.key}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
