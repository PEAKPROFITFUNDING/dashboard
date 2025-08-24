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
import Button from "../../../../components/ui/button/Button";
import { Modal } from "../../../../components/ui/modal";
import Badge from "../../../../components/ui/badge/Badge";

// Types for sorting and filtering
type SortField = "date" | "method" | "amount" | "status";
type FilterType = "all" | "pending" | "approved" | "paid" | "rejected";

interface Withdrawal {
  id: number;
  date: string;
  method: string;
  amount: number;
  status: string;
}

// Dummy data
const availableBalance = 1200;

const withdrawalData: Withdrawal[] = [
  {
    id: 1,
    date: "2025-08-20T14:30:00Z",
    method: "PayPal",
    amount: 500,
    status: "paid",
  },
  {
    id: 2,
    date: "2025-08-15T10:15:00Z",
    method: "Bank Transfer",
    amount: 800,
    status: "approved",
  },
  {
    id: 3,
    date: "2025-08-10T16:45:00Z",
    method: "PayPal",
    amount: 300,
    status: "pending",
  },
  {
    id: 4,
    date: "2025-08-05T11:20:00Z",
    method: "Bank Transfer",
    amount: 150,
    status: "rejected",
  },
  {
    id: 5,
    date: "2025-07-28T09:30:00Z",
    method: "PayPal",
    amount: 600,
    status: "paid",
  },
  {
    id: 6,
    date: "2025-07-20T13:45:00Z",
    method: "Bank Transfer",
    amount: 400,
    status: "paid",
  },
];

// Available Balance Card Component
function AvailableBalanceCard({
  balance,
  onRequestPayout,
}: {
  balance: number;
  onRequestPayout: () => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] p-8 transition-all duration-200 hover:shadow-lg">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Available Balance
        </h2>
        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          ${balance.toLocaleString()}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
          Earnings available for withdrawal
        </p>
        <Button
          variant="primary"
          size="md"
          onClick={onRequestPayout}
          className="px-8"
        >
          Request Payout
        </Button>
      </div>
    </div>
  );
}

// Request Payout Modal Component
function RequestPayoutModal({
  isOpen,
  onClose,
  availableBalance,
}: {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
}) {
  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<{ method?: string; amount?: string }>(
    {}
  );

  const withdrawalMethods = [
    { value: "paypal", label: "PayPal" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "wire_transfer", label: "Wire Transfer" },
    { value: "crypto", label: "Cryptocurrency" },
  ];

  const validateForm = () => {
    const newErrors: { method?: string; amount?: string } = {};

    if (!method) {
      newErrors.method = "Please select a withdrawal method";
    }

    if (!amount) {
      newErrors.amount = "Please enter an amount";
    } else {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        newErrors.amount = "Please enter a valid amount";
      } else if (amountNum > availableBalance) {
        newErrors.amount = "Amount cannot exceed available balance";
      } else if (amountNum < 50) {
        newErrors.amount = "Minimum withdrawal amount is $50";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle form submission here
      console.log("Withdrawal request:", { method, amount });
      onClose();
      setMethod("");
      setAmount("");
      setErrors({});
    }
  };

  const handleClose = () => {
    onClose();
    setMethod("");
    setAmount("");
    setErrors({});
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md mx-4">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Request Payout
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Available Balance Display */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Available Balance
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${availableBalance.toLocaleString()}
            </p>
          </div>

          {/* Withdrawal Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Withdrawal Method *
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.method
                  ? "border-red-300 dark:border-red-600"
                  : "border-gray-200 dark:border-white/[0.05]"
              }`}
            >
              <option value="">Select withdrawal method</option>
              {withdrawalMethods.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.method && (
              <p className="text-red-500 text-sm mt-1">{errors.method}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                $
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="50"
                max={availableBalance}
                step="0.01"
                className={`w-full pl-8 pr-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.amount
                    ? "border-red-300 dark:border-red-600"
                    : "border-gray-200 dark:border-white/[0.05]"
                }`}
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Minimum withdrawal: $50
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" className="flex-1">
              Submit Request
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

// Filter Bar Component
function FilterBar({
  activeFilter,
  onFilterChange,
  withdrawals,
}: {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  withdrawals: Withdrawal[];
}) {
  const getFilterCount = (filter: FilterType) => {
    if (filter === "all") return withdrawals.length;
    return withdrawals.filter((withdrawal) => withdrawal.status === filter)
      .length;
  };

  const filterOptions = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "paid", label: "Paid" },
    { key: "rejected", label: "Rejected" },
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
    </div>
  );
}

// Withdrawal History Table Component
function WithdrawalHistoryTable() {
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

  const sortedAndFilteredData = [...withdrawalData]
    .filter(
      (withdrawal) =>
        statusFilter === "all" || withdrawal.status === statusFilter
    )
    .sort((a, b) => {
      let aValue: any = a[sortField as keyof Withdrawal];
      let bValue: any = b[sortField as keyof Withdrawal];

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
        return "primary";
      case "rejected":
        return "error";
      default:
        return "error";
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "paypal":
        return "💳";
      case "bank transfer":
      case "wire transfer":
        return "🏦";
      case "cryptocurrency":
      case "crypto":
        return "₿";
      default:
        return "💰";
    }
  };

  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] overflow-hidden">
      {/* Header with title */}
      <div className="p-6 border-b border-gray-100 dark:border-white/[0.05]">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Withdrawal History
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
          withdrawals={withdrawalData}
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
            {paginatedData.map((withdrawal) => {
              const { date, time } = formatDate(withdrawal.date);
              return (
                <TableRow
                  key={withdrawal.id}
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
                        {getMethodIcon(withdrawal.method)}
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {withdrawal.method}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-start">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${withdrawal.amount.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-start">
                    <Badge size="sm" color={getStatusColor(withdrawal.status)}>
                      {withdrawal.status.charAt(0).toUpperCase() +
                        withdrawal.status.slice(1)}
                    </Badge>
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
          <div className="flex items-center md:justify-between flex-col md:flex-row gap-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(
                currentPage * itemsPerPage,
                sortedAndFilteredData.length
              )}{" "}
              of {sortedAndFilteredData.length} results
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Withdrawals() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <PageMeta
        title="Client PeakProfit - Withdrawals"
        description="Peak Profit Affiliate Withdrawals Page"
      />
      <PageBreadcrumb pageTitle={`Withdrawal Management`} />

      <div className="space-y-8">
        {/* Available Balance Section */}
        <div className="max-w-md mx-auto">
          <AvailableBalanceCard
            balance={availableBalance}
            onRequestPayout={() => setIsModalOpen(true)}
          />
        </div>

        {/* Withdrawal History Section */}
        <WithdrawalHistoryTable />

        {/* Request Payout Modal */}
        <RequestPayoutModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          availableBalance={availableBalance}
        />
      </div>
    </>
  );
}
