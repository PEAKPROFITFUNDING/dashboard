import { useState, useMemo, useEffect } from "react";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import PageMeta from "../../../../components/common/PageMeta";
import { Link } from "react-router";
import axiosInstance from "../../../../api/axiosInstance";
import {
  Affiliate,
  AffiliatesTable,
  FilterType,
  SortField,
  SummaryStats,
} from "./components";
import FilterBar from "../../../../components/FilterBar";

// API Response types
interface ApiAffiliate {
  _id: string;
  userId: string;
  user: {
    name: string;
    email: string;
    profilePicture: string;
  };
  tier: string;
  referralCode: string;
  referralLink: string;
  referrals: [];
  referralsCount: number;
  commissionPercentage: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  result: {
    data: ApiAffiliate[];
    pagination: {
      currentPage: number;
      perPage: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
  message: string;
}

export default function ManageAffiliates() {
  const [apiAffiliates, setApiAffiliates] = useState<ApiAffiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortField, setSortField] = useState<SortField>("commissionsEarned");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fetch affiliates data
  useEffect(() => {
    const fetchAffiliates = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<ApiResponse>(
          "/admin/affiliates?pageNo=1"
        );
        setApiAffiliates(response.data.result.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching affiliates:", err);
        setError(err.message || "Failed to fetch affiliates");
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliates();
  }, []);

  // Transform API data to match the existing Affiliate interface
  const simpleAffiliates: Affiliate[] = useMemo(() => {
    return apiAffiliates.map((a) => ({
      id: a._id,
      fullName: a.user.name,
      email: a.user.email,
      status: a.tier.toLowerCase() as "active" | "inactive" | "pending", // Map tier to status
      clicks: 0, // Not provided in API response
      signups: a.referralsCount,
      fundedAccounts: 0, // Not provided in API response
      commissionsEarned: a.commissionPercentage, // Use commission percentage instead
      referralCode: a.referralCode,
    }));
  }, [apiAffiliates]);

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

  if (loading) {
    return (
      <>
        <PageMeta
          title="Admin PeakProfit"
          description="Peak Profit Admin Manage Affiliates Page"
        />
        <PageBreadcrumb pageTitle="Manage Affiliates" />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-400">
            Loading affiliates...
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageMeta
          title="Admin PeakProfit"
          description="Peak Profit Admin Manage Affiliates Page"
        />
        <PageBreadcrumb pageTitle="Manage Affiliates" />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600 dark:text-red-400">
            Error: {error}
          </div>
        </div>
      </>
    );
  }

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
        <SummaryStats affiliates={filteredAndSortedAffiliates} />

        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          filterOptions={[
            { key: "all", label: "All" },
            { key: "active", label: "Active", color: "success" },
            { key: "inactive", label: "Inactive", color: "error" },
            { key: "pending", label: "Pending", color: "warning" },
            { key: "bronze", label: "Bronze", color: "info" },
            { key: "silver", label: "Silver", color: "info" },
            { key: "gold", label: "Gold", color: "success" },
          ]}
          counts={{
            all: simpleAffiliates.length,
            active: simpleAffiliates.filter((a) => a.status === "active")
              .length,
            inactive: simpleAffiliates.filter((a) => a.status === "inactive")
              .length,
            pending: simpleAffiliates.filter((a) => a.status === "pending")
              .length,
            bronze: simpleAffiliates.filter((a) => a.status === "bronze")
              .length,
            silver: simpleAffiliates.filter((a) => a.status === "silver")
              .length,
            gold: simpleAffiliates.filter((a) => a.status === "gold").length,
          }}
        />

        <AffiliatesTable
          affiliates={filteredAndSortedAffiliates}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </div>
    </>
  );
}
