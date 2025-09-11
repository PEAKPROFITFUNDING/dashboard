import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Commission } from "../../types/Affiliates";
import FilterBar from "../FilterBar";
import { SearchBar } from "../SearchBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Pagination } from "../Pagination";
export type SortField =
  | "user"
  | "type"
  | "amount"
  | "date"
  | "affiliateTier"
  | "commissionPercentage";
export type FilterType = "all" | "SIGNUP" | "PURCHASE" | "UPGRADE";

interface CommissionsTableProps {
  commissions: Commission[];
  pagination: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onFilterChange: (filter: FilterType) => void;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  onClearSearch: () => void;
  activeFilter: string;
  searchQuery: string;
  counts: Record<string, number>;
  showAffiliates?: boolean;
}

const filterOptions = [
  { key: "all", label: "All" },
  { key: "SIGNUP", label: "Signups" },
  { key: "PURCHASE", label: "Purchases" },
];

export function CommissionsTable({
  commissions,
  pagination,
  onPageChange,
  onFilterChange,
  onSearchChange,
  onSearch,
  onClearSearch,
  activeFilter,
  searchQuery,
  counts,
  showAffiliates = false,
}: CommissionsTableProps) {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  console.log(commissions);

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

  const sortedData = [...commissions].sort((a, b) => {
    let aValue;
    let bValue;

    // Use earnedAt as the date field since that's what's in the API
    const aDate = a.earnedAt || a.earnedAt;
    const bDate = b.earnedAt || b.earnedAt;

    switch (sortField) {
      case "amount":
        aValue = a.amount;
        bValue = b.amount;
        break;
      case "date":
        aValue = new Date(aDate).getTime();
        bValue = new Date(bDate).getTime();
        break;
      case "affiliateTier":
        aValue = a.affiliateTier;
        bValue = b.affiliateTier;
        break;
      case "commissionPercentage":
        aValue = a.commissionPercentage;
        bValue = b.commissionPercentage;
        break;
      case "type":
        aValue = a.type;
        bValue = b.type;
        break;
      case "user":
        // Since user field might not exist, use referralCode as fallback
        aValue = a.referredUser.name || a.referralCode || "";
        bValue = b.referredUser.name || b.referralCode || "";
        break;
      default:
        return 0;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      if (aValue === bValue) return 0;
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const getTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case "PURCHASE":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "SIGNUP":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "UPGRADE":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier?.toUpperCase()) {
      case "BRONZE":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
      case "SILVER":
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400";
      case "GOLD":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "PLATINUM":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
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

      {/* Filter and Search Bar */}
      <div className="p-6 flex flex-col md:flex-row gap-4 justify-between items-center border-b border-gray-100 dark:border-white/[0.05]">
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
          filterOptions={filterOptions}
          counts={counts}
        />
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onSearch={onSearch}
          onClear={onClearSearch}
          placeholder="Search users..."
        />
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {showAffiliates && (
                <TableCell
                  isHeader
                  className="px-6 py-4 font-medium text-gray-500 text-start text-xs dark:text-gray-400"
                >
                  <div
                    className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => handleSort("user")}
                  >
                    Affiliate {getSortIcon("user")}
                  </div>
                </TableCell>
              )}
              <TableCell
                isHeader
                className="px-6 py-4 font-medium text-gray-500 text-start text-xs dark:text-gray-400"
              >
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort("user")}
                >
                  {showAffiliates ? (
                    <>Referral {getSortIcon("user")}</>
                  ) : (
                    <>User {getSortIcon("user")}</>
                  )}
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
                  onClick={() => handleSort("affiliateTier")}
                >
                  Tier {getSortIcon("affiliateTier")}
                </div>
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 font-medium text-gray-500 text-start text-xs dark:text-gray-400"
              >
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort("commissionPercentage")}
                >
                  Rate {getSortIcon("commissionPercentage")}
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
            {sortedData.map((commission) => {
              const dateToUse = commission.earnedAt;
              const { date, time } = formatDate(dateToUse);
              const isPurchase = commission.type.toUpperCase() === "PURCHASE";
              const displayUser = commission.referredUser.name;

              return (
                <TableRow
                  key={commission.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  {showAffiliates && (
                    <TableCell className="px-6 py-4 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium text-sm">
                          {commission.affiliate.name
                            ?.split(" ")
                            ?.map((n) => n[0])
                            ?.join("")
                            ?.slice(0, 2)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {commission.affiliate.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {commission.affiliate.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                  )}
                  <TableCell className="px-6 py-4 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium text-sm">
                        {displayUser
                          ?.split(" ")
                          ?.map((n) => n[0])
                          ?.join("")
                          ?.slice(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {displayUser}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {commission.referredUser.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-start">
                    <div className="flex flex-col gap-2">
                      <span
                        className={`inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getTypeColor(
                          commission.type
                        )}`}
                      >
                        {commission.type.toLowerCase()}
                      </span>
                      {isPurchase && commission.challenge && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {commission.challenge.name}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-start">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {commission.formattedAmount ||
                        `$${commission.amount.toFixed(2)}`}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-start">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTierColor(
                        commission.affiliateTier
                      )}`}
                    >
                      {commission.affiliateTier}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-start">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">
                      {commission.commissionPercentage}%
                    </span>
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
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        itemsPerPage={pagination.perPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}
