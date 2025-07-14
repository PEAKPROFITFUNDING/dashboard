import { useState, useMemo } from "react";
import { Link } from "react-router";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import PageMeta from "../../../../components/common/PageMeta";
import Badge from "../../../../components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import Button from "../../../../components/ui/button/Button";

// Types
interface Affiliate {
  id: number;
  fullName: string;
  email: string;
  status: "active" | "inactive" | "pending";
  clicks: number;
  signups: number;
  fundedAccounts: number;
  commissionsEarned: number;
}

// Dummy data
const dummyAffiliates: Affiliate[] = [
  {
    id: 1,
    fullName: "John Smith",
    email: "john.smith@email.com",
    status: "active",
    clicks: 1250,
    signups: 45,
    fundedAccounts: 23,
    commissionsEarned: 1250.5,
  },
  {
    id: 2,
    fullName: "Sarah Johnson",
    email: "sarah.j@email.com",
    status: "active",
    clicks: 890,
    signups: 32,
    fundedAccounts: 18,
    commissionsEarned: 890.25,
  },
  {
    id: 3,
    fullName: "Mike Chen",
    email: "mike.chen@email.com",
    status: "inactive",
    clicks: 450,
    signups: 15,
    fundedAccounts: 8,
    commissionsEarned: 450.75,
  },
  {
    id: 4,
    fullName: "Emily Davis",
    email: "emily.davis@email.com",
    status: "pending",
    clicks: 0,
    signups: 0,
    fundedAccounts: 0,
    commissionsEarned: 0,
  },
  {
    id: 5,
    fullName: "David Wilson",
    email: "david.wilson@email.com",
    status: "active",
    clicks: 2100,
    signups: 78,
    fundedAccounts: 45,
    commissionsEarned: 2100.0,
  },
  {
    id: 6,
    fullName: "Lisa Brown",
    email: "lisa.brown@email.com",
    status: "active",
    clicks: 675,
    signups: 28,
    fundedAccounts: 15,
    commissionsEarned: 675.3,
  },
  {
    id: 7,
    fullName: "Alex Thompson",
    email: "alex.thompson@email.com",
    status: "inactive",
    clicks: 320,
    signups: 12,
    fundedAccounts: 6,
    commissionsEarned: 320.45,
  },
  {
    id: 8,
    fullName: "Maria Garcia",
    email: "maria.garcia@email.com",
    status: "active",
    clicks: 1580,
    signups: 52,
    fundedAccounts: 31,
    commissionsEarned: 1580.8,
  },
  {
    id: 9,
    fullName: "James Lee",
    email: "james.lee@email.com",
    status: "pending",
    clicks: 0,
    signups: 0,
    fundedAccounts: 0,
    commissionsEarned: 0,
  },
  {
    id: 10,
    fullName: "Anna White",
    email: "anna.white@email.com",
    status: "active",
    clicks: 920,
    signups: 35,
    fundedAccounts: 20,
    commissionsEarned: 920.15,
  },
];

type FilterType = "all" | "active" | "inactive" | "pending";
type SortField = "commissionsEarned" | "signups" | "fullName" | "status";

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

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-4 h-4" />
    ) : (
      <ArrowDown className="w-4 h-4" />
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      case "pending":
        return "warning";
      default:
        return "primary";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getFilterCount = (filter: FilterType) => {
    if (filter === "all") return affiliates.length;
    return affiliates.filter((affiliate) => affiliate.status === filter).length;
  };

  return (
    <>
      <PageMeta
        title="Admin PeakProfit"
        description="Peak Profit Admin Manage Affiliates Page"
      />
      <PageBreadcrumb pageTitle="Manage Affiliates" />

      <div>
        {/* Filters */}
        <div className="mb-6 flex justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All" },
              { key: "active", label: "Active" },
              { key: "inactive", label: "Inactive" },
              { key: "pending", label: "Pending" },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key as FilterType)}
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

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    <div
                      className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                      onClick={() => handleSort("fullName")}
                    >
                      Full Name {getSortIcon("fullName")}
                    </div>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Email
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    <div
                      className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                      onClick={() => handleSort("status")}
                    >
                      Status {getSortIcon("status")}
                    </div>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Clicks
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    <div
                      className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                      onClick={() => handleSort("signups")}
                    >
                      Signups {getSortIcon("signups")}
                    </div>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Funded Accounts
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    <div
                      className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                      onClick={() => handleSort("commissionsEarned")}
                    >
                      Commissions {getSortIcon("commissionsEarned")}
                    </div>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {filteredAndSortedAffiliates.map((affiliate) => (
                  <TableRow
                    key={affiliate.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                  >
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full bg-brand-500 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {affiliate.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {affiliate.fullName}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {affiliate.email}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <Badge size="sm" color={getStatusColor(affiliate.status)}>
                        {affiliate.status.charAt(0).toUpperCase() +
                          affiliate.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {affiliate.clicks.toLocaleString()}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {affiliate.signups.toLocaleString()}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {affiliate.fundedAccounts.toLocaleString()}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {formatCurrency(affiliate.commissionsEarned)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <Link to={`/affiliate/manage-affiliates/${affiliate.id}`}>
                        <Button size="sm" variant="primary" className="text-xs">
                          Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Affiliates
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {filteredAndSortedAffiliates.length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Clicks
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {filteredAndSortedAffiliates
                .reduce((sum, a) => sum + a.clicks, 0)
                .toLocaleString()}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Signups
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {filteredAndSortedAffiliates
                .reduce((sum, a) => sum + a.signups, 0)
                .toLocaleString()}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Commissions
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(
                filteredAndSortedAffiliates.reduce(
                  (sum, a) => sum + a.commissionsEarned,
                  0
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
