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
import { Link } from "react-router";
import { useAffiliates } from "../../../../context/AffiliateContext";

export default function ManageAffiliates() {
  const { affiliates, setAffiliates } = useAffiliates();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortField, setSortField] = useState<SortField>("commissionsEarned");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const simpleAffiliates: Affiliate[] = useMemo(() => {
    return affiliates.map((a) => ({
      id: a.id,
      fullName: a.fullName,
      email: a.email,
      status: a.status,
      clicks: a.performance.totalClicks,
      signups: a.performance.totalSignups,
      fundedAccounts: a.performance.totalFundedAccounts,
      commissionsEarned: a.performance.totalCommissionEarned,
    }));
  }, [affiliates]);

  // Filter and sort logic
  const filteredAndSortedAffiliates = useMemo(() => {
    let filtered = simpleAffiliates;

    if (activeFilter !== "all") {
      filtered = filtered.filter(
        (affiliate) => affiliate.status === activeFilter
      );
    }

    return filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? (aValue as string).localeCompare(bValue as string)
          : (bValue as string).localeCompare(aValue as string);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }, [simpleAffiliates, activeFilter, sortField, sortDirection]);

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

      <Link
        to={"/affiliate/manage-affiliates/new-affiliate"}
        className="fixed bottom-6 right-6 flex items-center justify-center w-16 h-16 bg-brand-700 text-white text-3xl rounded-full shadow-3xl cursor-pointer hover:bg-brand-800 transition"
      >
        +
      </Link>

      <PageBreadcrumb pageTitle="Manage Affiliates" />
      <div>
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          affiliates={simpleAffiliates}
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
