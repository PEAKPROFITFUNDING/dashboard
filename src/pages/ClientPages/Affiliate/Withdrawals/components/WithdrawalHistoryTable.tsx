import { useState } from "react";
import { FilterType, SortField, Withdrawal } from "../Wathdrawals";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../../components/ui/table";
import Badge from "../../../../../components/ui/badge/Badge";
import FilterBar from "../../../../../components/FilterBar";

interface WithdrawalHistoryTableProps {
  withdrawals: Withdrawal[];
}

// Withdrawal History Table Component
export function WithdrawalHistoryTable({
  withdrawals,
}: WithdrawalHistoryTableProps) {
  const [statusFilter, setStatusFilter] = useState<FilterType>("all");
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

  // Map API status to filter status
  const mapApiStatusToFilter = (apiStatus: string): FilterType => {
    switch (apiStatus) {
      case "REQUESTED":
        return "PENDING";
      case "APPROVED":
        return "APPROVED";
      case "DENIED":
        return "DENIED";
      case "PAID":
        return "PAID";
      default:
        return "PENDING";
    }
  };

  // Filter and sort data
  const sortedAndFilteredData = [...withdrawals]
    .filter((withdrawal) => {
      if (statusFilter === "all") return true;
      return mapApiStatusToFilter(withdrawal.status) === statusFilter;
    })
    .sort((a, b) => {
      let aValue;
      let bValue;

      switch (sortField) {
        case "date":
          aValue = new Date(a.requestedDate).getTime();
          bValue = new Date(b.requestedDate).getTime();
          break;
        case "method":
          aValue = a.paymentMethod.type.toLowerCase();
          bValue = b.paymentMethod.type.toLowerCase();
          break;
        case "amount":
          aValue = a.amount;
          bValue = b.amount;
          break;
        case "status":
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const getStatusColor = (status: string) => {
    const mappedStatus = mapApiStatusToFilter(status);
    switch (mappedStatus) {
      case "APPROVED":
        return "success";
      case "PENDING":
        return "warning";
      case "PAID":
        return "info";
      case "DENIED":
        return "error";
      default:
        return "error";
    }
  };

  const getStatusLabel = (status: string) => {
    const mappedStatus = mapApiStatusToFilter(status);
    switch (mappedStatus) {
      case "PENDING":
        return "Pending";
      case "APPROVED":
        return "Approved";
      case "DENIED":
        return "Denied";
      case "PAID":
        return "Paid";
      default:
        return status;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "paypal":
        return "💳";
      case "bank_account":
      case "bank_transfer":
      case "wire_transfer":
        return "🏦";
      case "cryptocurrency":
      case "crypto":
        return "₿";
      default:
        return "💰";
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method.toLowerCase()) {
      case "bank_account":
        return "Bank Account";
      case "paypal":
        return "PayPal";
      case "wire_transfer":
        return "Wire Transfer";
      default:
        return method.charAt(0).toUpperCase() + method.slice(1);
    }
  };

  // Calculate counts for filter options
  const filterCounts = {
    all: withdrawals.length,
    PENDING: withdrawals.filter(
      (w) => mapApiStatusToFilter(w.status) === "PENDING"
    ).length,
    APPROVED: withdrawals.filter(
      (w) => mapApiStatusToFilter(w.status) === "APPROVED"
    ).length,
    DENIED: withdrawals.filter(
      (w) => mapApiStatusToFilter(w.status) === "DENIED"
    ).length,
    PAID: withdrawals.filter((w) => mapApiStatusToFilter(w.status) === "PAID")
      .length,
  };

  const filterOptions = [
    { key: "all", label: "All" },
    { key: "PENDING", label: "Pending", color: "warning" as const },
    { key: "APPROVED", label: "Approved", color: "success" as const },
    { key: "PAID", label: "Paid", color: "info" as const },
    { key: "DENIED", label: "Denied", color: "error" as const },
  ];

  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] overflow-hidden">
      {/* Header with title */}
      <div className="p-6 border-b border-gray-100 dark:border-white/[0.05]">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Withdrawal History
        </h3>
      </div>

      {/* Filter Bar */}
      <div className="p-6 border-b  border-gray-100 dark:border-white/[0.05]">
        <FilterBar
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
          filterOptions={filterOptions}
          counts={filterCounts}
        />
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        {sortedAndFilteredData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {statusFilter === "all"
                ? "No withdrawal requests found."
                : `No ${statusFilter.toLowerCase()} withdrawals found.`}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
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
                <TableCell
                  isHeader
                  className="px-6 py-4 font-medium text-gray-500 text-start text-xs dark:text-gray-400"
                >
                  <div
                    className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => handleSort("method")}
                  >
                    Method {getSortIcon("method")}
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
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {sortedAndFilteredData.map((withdrawal) => {
                const { date, time } = formatDate(withdrawal.requestedDate);
                return (
                  <TableRow
                    key={withdrawal._id}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                  >
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
                    <TableCell className="px-6 py-4 text-start">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {getMethodIcon(withdrawal.paymentMethod.type)}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-gray-900 dark:text-white font-medium">
                            {getMethodLabel(withdrawal.paymentMethod.type)}
                          </span>
                          {withdrawal.paymentMethod.accountNumber && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              ****
                              {withdrawal.paymentMethod.accountNumber.slice(-4)}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-start">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${withdrawal.amount.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-start">
                      <Badge
                        size="sm"
                        color={getStatusColor(withdrawal.status)}
                      >
                        {getStatusLabel(withdrawal.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
