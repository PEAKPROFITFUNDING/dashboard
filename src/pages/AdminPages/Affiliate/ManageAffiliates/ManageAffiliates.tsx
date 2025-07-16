import { useState, useMemo } from "react";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import PageMeta from "../../../../components/common/PageMeta";
import {
  FilterBar,
  AffiliatesTable,
  SummaryStats,
  dummyAffiliates,
  type Affiliate,
  type FilterType,
  type SortField,
} from "./components";

export default function ManageAffiliates() {
  const [affiliates] = useState<Affiliate[]>(dummyAffiliates);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortField, setSortField] = useState<SortField>("commissionsEarned");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Filter and sort logic
  const filteredAndSortedAffiliates = useMemo(() => {
    let filtered = affiliates;

    // Apply filter
    if (activeFilter !== "all") {
      filtered = affiliates.filter(
        (affiliate) => affiliate.status === activeFilter
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === "asc" ? comparison : -comparison;
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [affiliates, activeFilter, sortField, sortDirection]);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <>
      <PageMeta
        title="Admin PeakProfit"
        description="Peak Profit Admin Manage Affiliates Page"
      />
      <PageBreadcrumb pageTitle="Manage Affiliates" />

      <div>
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          affiliates={affiliates}
        />

        <AffiliatesTable
          affiliates={filteredAndSortedAffiliates}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        <SummaryStats affiliates={filteredAndSortedAffiliates} />
      </div>
    </>
  );
}
