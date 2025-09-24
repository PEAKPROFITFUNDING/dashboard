import { useState, useEffect } from "react";
import type { FC } from "react";
import { useTickets } from "../../../../context/user/UserTicketsContext";
import Input from "../../../../components/form/input/InputField";
import Select from "../../../../components/form/Select";

const TicketsFilters: FC = () => {
  const { filters, updateFilters } = useTickets();
  const [localFilters, setLocalFilters] = useState({
    search: filters.search || "",
    category: filters.category || "",
    status: filters.status || "",
  });

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateFilters({ ...localFilters, page: 1 });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localFilters.search]); // Only debounce search

  // Immediate update for category and status
  useEffect(() => {
    if (
      localFilters.category !== filters.category ||
      localFilters.status !== filters.status
    ) {
      updateFilters({ ...localFilters, page: 1 });
    }
  }, [localFilters.category, localFilters.status]); // Immediate update for dropdowns

  const categoryOptions = [
    { value: "", label: "All Categories" },
    { value: "technical", label: "Technical" },
    { value: "billing", label: "Billing" },
    { value: "general", label: "General" },
    { value: "other", label: "Other" },
  ];

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "open", label: "Open" },
    { value: "in progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
  ];

  const handleFilterChange = (key: string, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setLocalFilters({ search: "", category: "", status: "" });
    updateFilters({ search: "", category: "", status: "", page: 1 });
  };

  const hasActiveFilters =
    localFilters.search || localFilters.category || localFilters.status;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="md:col-span-2">
          <Input
            type="text"
            placeholder="Search tickets by subject or description..."
            value={localFilters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full"
          />
        </div>

        {/* Category Filter */}
        <div>
          <Select
            options={categoryOptions}
            placeholder="All categories"
            defaultValue={localFilters.category}
            onChange={(value) => handleFilterChange("category", value)}
          />
        </div>

        {/* Status Filter */}
        <div>
          <Select
            options={statusOptions}
            placeholder="All status"
            defaultValue={localFilters.status}
            onChange={(value) => handleFilterChange("status", value)}
          />
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default TicketsFilters;
