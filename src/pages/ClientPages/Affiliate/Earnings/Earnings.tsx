import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import Badge from "../../../../components/ui/badge/Badge";
import BarChartOne from "../../../../components/charts/bar/BarChartOne";

// Types for sorting and filtering
type SortField = "user" | "type" | "amount" | "status" | "date";
type FilterType = "all" | "pending" | "approved" | "paid";

interface Commission {
  id: number;
  user: string;
  type: string;
  amount: number;
  status: string;
  date: string;
}
const summaryData = {
  lifetime: 2500,
  thisMonth: 500,
  thisWeek: 120,
  pending: 200,
  approved: 1000,
  paid: 1300,
};

const commissionsData: Commission[] = [
  {
    id: 1,
    user: "John Doe",
    type: "purchase",
    amount: 150,
    status: "approved",
    date: "2025-08-01T12:30:00Z",
  },
  {
    id: 2,
    user: "Sarah Wilson",
    type: "signup",
    amount: 25,
    status: "pending",
    date: "2025-08-02T09:15:00Z",
  },
  {
    id: 3,
    user: "Mike Johnson",
    type: "purchase",
    amount: 300,
    status: "paid",
    date: "2025-08-03T16:45:00Z",
  },
  {
    id: 4,
    user: "Emily Chen",
    type: "purchase",
    amount: 75,
    status: "approved",
    date: "2025-08-04T11:20:00Z",
  },
  {
    id: 5,
    user: "David Brown",
    type: "purchase",
    amount: 200,
    status: "pending",
    date: "2025-08-05T14:30:00Z",
  },
  {
    id: 6,
    user: "Lisa Garcia",
    type: "upgrade",
    amount: 125,
    status: "paid",
    date: "2025-08-06T10:10:00Z",
  },
];

// Stats Card Component
function StatsCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] p-6 transition-all duration-200 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            ${typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Filter Bar Component
function FilterBar({
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
// Commission Table Component
function CommissionTable() {
  const [statusFilter, setStatusFilter] = useState<FilterType>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const itemsPerPage = 5;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
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

  const sortedAndFilteredData = [...commissionsData]
    .filter(
      (commission) =>
        statusFilter === "all" || commission.status === statusFilter
    )
    .sort((a, b) => {
      let aValue: any = a[sortField as keyof Commission];
      let bValue: any = b[sortField as keyof Commission];

      if (sortField === "date") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortField === "amount") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const paginatedData = sortedAndFilteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedAndFilteredData.length / itemsPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "paid":
        return "success";
      default:
        return "error";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "purchase":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "signup":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "subscription":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "upgrade":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] overflow-hidden">
      {/* Header with title */}
      <div className="p-6 border-b border-gray-100 dark:border-white/[0.05]">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Commission History
        </h3>
      </div>

      {/* Filter Bar */}
      <div className="p-6 border-b border-gray-100 dark:border-white/[0.05]">
        <FilterBar
          activeFilter={statusFilter}
          onFilterChange={(filter) => {
            setStatusFilter(filter);
            setCurrentPage(1);
          }}
          commissions={commissionsData}
        />
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-6 py-4 font-medium text-gray-500 text-start text-xs dark:text-gray-400"
              >
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort("user")}
                >
                  User {getSortIcon("user")}
                </div>
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 font-medium text-gray-500 text-start text-xs dark:text-gray-400"
              >
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort("type")}
                >
                  Type {getSortIcon("type")}
                </div>
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 font-medium text-gray-500 text-start text-xs dark:text-gray-400"
              >
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort("amount")}
                >
                  Amount {getSortIcon("amount")}
                </div>
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 font-medium text-gray-500 text-start text-xs dark:text-gray-400"
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
                className="px-6 py-4 font-medium text-gray-500 text-start text-xs dark:text-gray-400"
              >
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort("date")}
                >
                  Date & Time {getSortIcon("date")}
                </div>
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {paginatedData.map((commission) => {
              const { date, time } = formatDate(commission.date);
              return (
                <TableRow
                  key={commission.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <TableCell className="px-6 py-4 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium text-sm">
                        {commission.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {commission.user}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-start">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getTypeColor(
                        commission.type
                      )}`}
                    >
                      {commission.type}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-start">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${commission.amount}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-start">
                    <Badge size="sm" color={getStatusColor(commission.status)}>
                      {commission.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-start">
                    <div className="text-sm">
                      <div className="text-gray-900 dark:text-white font-medium">
                        {date}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {time}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 dark:border-white/[0.05]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(
                currentPage * itemsPerPage,
                sortedAndFilteredData.length
              )}{" "}
              of {sortedAndFilteredData.length} results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm border border-gray-200 dark:border-white/[0.05] rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-white/[0.05]"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm border border-gray-200 dark:border-white/[0.05] rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-white/[0.05]"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Earnings() {
  return (
    <>
      <PageMeta
        title="Client PeakProfit"
        description="Peak Profit Affiliate Earnings Page"
      />
      <PageBreadcrumb pageTitle={`Affiliate Earnings Overview`} />

      <div className="space-y-8">
        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <div className="xl:col-span-2">
            <StatsCard
              title="Lifetime Earnings"
              value={summaryData.lifetime}
              subtitle="Total earned since joining"
            />
          </div>
          <StatsCard
            title="This Month"
            value={summaryData.thisMonth}
            subtitle="Current month earnings"
          />
          <StatsCard
            title="This Week"
            value={summaryData.thisWeek}
            subtitle="Current week earnings"
          />
          <StatsCard
            title="Pending"
            value={summaryData.pending}
            subtitle="Awaiting approval"
          />
          <StatsCard
            title="Paid"
            value={summaryData.paid}
            subtitle="Successfully paid out"
          />
        </div>

        {/* Chart Section */}
        <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Earnings Overview
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Monthly commission earnings for the current year
            </p>
          </div>
          <BarChartOne />
        </div>

        {/* Commission Table Section */}
        <CommissionTable />
      </div>
    </>
  );
}
