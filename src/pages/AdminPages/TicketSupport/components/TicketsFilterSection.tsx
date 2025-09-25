import React, { useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { ChevronDown, Filter } from "lucide-react";
import FilterBar, { FilterOption } from "../../../../components/FilterBar";
import { SearchBar } from "../../../../components/SearchBar";
import { Dropdown } from "../../../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../../../components/ui/dropdown/DropdownItem";

interface TicketsFilterSectionProps {
  // Search props
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  onSearchClear: () => void;
  searchPlaceholder?: string;

  // Status filter props
  activeStatus: string;
  onStatusChange: Dispatch<SetStateAction<string>>;
  statusOptions: FilterOption[];
  statusCounts: Record<string, number>;

  // Category filter props
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  categoryOptions: Array<{ key: string; label: string }>;

  // Priority filter props
  activePriority: string;
  onPriorityChange: (priority: string) => void;
  priorityOptions: Array<{ key: string; label: string }>;
}

const TicketsFilterSection: React.FC<TicketsFilterSectionProps> = ({
  // Search props
  searchQuery,
  onSearchChange,
  onSearch,
  onSearchClear,
  searchPlaceholder = "Search tickets by subject, description, or user...",

  // Status filter props
  activeStatus,
  onStatusChange,
  statusOptions,
  statusCounts,

  // Category filter props
  activeCategory,
  onCategoryChange,
  categoryOptions,

  // Priority filter props
  activePriority,
  onPriorityChange,
  priorityOptions,
}) => {
  // Dropdown states
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);

  // Helper functions
  const getCurrentCategoryLabel = () => {
    const category = categoryOptions.find((opt) => opt.key === activeCategory);
    return category ? category.label : "All Categories";
  };

  const getCurrentPriorityLabel = () => {
    const priority = priorityOptions.find((opt) => opt.key === activePriority);
    return priority ? priority.label : "All Priorities";
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    onCategoryChange(category);
    setCategoryDropdownOpen(false);
  };

  // Handle priority change
  const handlePriorityChange = (priority: string) => {
    onPriorityChange(priority);
    setPriorityDropdownOpen(false);
  };

  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] p-6">
      <div className="space-y-4">
        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onSearch={onSearch}
          onClear={onSearchClear}
          placeholder={searchPlaceholder}
        />

        <div className="flex justify-between">
          {/* Status Filter Bar */}
          <FilterBar
            activeFilter={activeStatus}
            onFilterChange={onStatusChange}
            filterOptions={statusOptions}
            counts={statusCounts}
          />
          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="dropdown-toggle inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 dark:border-white/[0.05] rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
              >
                <Filter className="w-4 h-4" />
                {getCurrentCategoryLabel()}
                <ChevronDown className="w-4 h-4" />
              </button>
              <Dropdown
                isOpen={categoryDropdownOpen}
                onClose={() => setCategoryDropdownOpen(false)}
                className="w-48"
              >
                <div className="py-1">
                  {categoryOptions.map((option) => (
                    <DropdownItem
                      key={option.key}
                      onClick={() => handleCategoryChange(option.key)}
                      className={
                        activeCategory === option.key
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                          : ""
                      }
                    >
                      {option.label}
                    </DropdownItem>
                  ))}
                </div>
              </Dropdown>
            </div>

            {/* Priority Dropdown */}
            <div className="relative">
              <button
                onClick={() => setPriorityDropdownOpen(!priorityDropdownOpen)}
                className="dropdown-toggle inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 dark:border-white/[0.05] rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
              >
                <Filter className="w-4 h-4" />
                {getCurrentPriorityLabel()}
                <ChevronDown className="w-4 h-4" />
              </button>
              <Dropdown
                isOpen={priorityDropdownOpen}
                onClose={() => setPriorityDropdownOpen(false)}
                className="w-48"
              >
                <div className="py-1">
                  {priorityOptions.map((option) => (
                    <DropdownItem
                      key={option.key}
                      onClick={() => handlePriorityChange(option.key)}
                      className={
                        activePriority === option.key
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                          : ""
                      }
                    >
                      {option.label}
                    </DropdownItem>
                  ))}
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketsFilterSection;
