import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import { useState } from "react";
import Badge from "../../../../components/ui/badge/Badge";
import Button from "../../../../components/ui/button/Button";
import { Link } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  CheckCircle,
  XCircle,
  DollarSign,
  Calendar,
} from "lucide-react";
import { Modal } from "../../../../components/ui/modal";

// Types
type SortField =
  | "affiliate"
  | "amount"
  | "date"
  | "status"
  | "method"
  | "transactionId"
  | "paidDate";
type FilterType = "all" | "pending" | "approved" | "paid" | "rejected";
type PaymentMethod = "paypal" | "bank_transfer" | "wire_transfer" | "crypto";

interface PayoutRequest {
  id: number;
  affiliateId: string;
  affiliateName: string;
  affiliateEmail: string;
  amount: number;
  requestedDate: string;
  status: "pending" | "approved" | "paid" | "rejected";
  method: PaymentMethod;
  accountDetails: {
    paypalEmail?: string;
    bankAccount?: string;
    iban?: string;
    walletAddress?: string;
    accountHolder?: string;
  };
  transactionId?: string;
  paidDate?: string;
  fees: number;
}

// Dummy data
const overviewStats = {
  pendingRequests: { count: 8, amount: 4250 },
  approvedUnpaid: { count: 5, amount: 2800 },
  paidThisMonth: 15600,
  lifetimePaid: 125000,
};

const payoutRequests: PayoutRequest[] = [
  {
    id: 1,
    affiliateId: "AFF-001",
    affiliateName: "John Doe",
    affiliateEmail: "john@example.com",
    amount: 800,
    requestedDate: "2025-08-20T10:30:00Z",
    status: "pending",
    method: "paypal",
    accountDetails: { paypalEmail: "john@example.com" },
    fees: 24,
  },
  {
    id: 2,
    affiliateId: "AFF-002",
    affiliateName: "Sarah Wilson",
    affiliateEmail: "sarah@example.com",
    amount: 1200,
    requestedDate: "2025-08-19T14:15:00Z",
    status: "approved",
    method: "bank_transfer",
    accountDetails: {
      bankAccount: "****1234",
      iban: "GB29 NWBK 6016 1331 9268 19",
      accountHolder: "Sarah Wilson",
    },
    fees: 15,
  },
  {
    id: 3,
    affiliateId: "AFF-003",
    affiliateName: "Mike Johnson",
    affiliateEmail: "mike@example.com",
    amount: 650,
    requestedDate: "2025-08-18T16:45:00Z",
    status: "paid",
    method: "paypal",
    accountDetails: { paypalEmail: "mike@example.com" },
    transactionId: "TXN-789123456",
    paidDate: "2025-08-21T09:30:00Z",
    fees: 19.5,
  },
  {
    id: 4,
    affiliateId: "AFF-004",
    affiliateName: "Emily Chen",
    affiliateEmail: "emily@example.com",
    amount: 950,
    requestedDate: "2025-08-17T11:20:00Z",
    status: "approved",
    method: "crypto",
    accountDetails: { walletAddress: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" },
    fees: 10,
  },
  {
    id: 5,
    affiliateId: "AFF-005",
    affiliateName: "David Brown",
    affiliateEmail: "david@example.com",
    amount: 300,
    requestedDate: "2025-08-16T13:45:00Z",
    status: "rejected",
    method: "paypal",
    accountDetails: { paypalEmail: "david@example.com" },
    fees: 9,
  },
];

// Overview Stats Cards Component
function StatsCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] p-6 transition-all duration-200 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {typeof value === "number" ? `$${value.toLocaleString()}` : value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className="text-blue-500 opacity-80">{icon}</div>
      </div>
    </div>
  );
}

// Payment Details Modal Component
function PaymentModal({
  isOpen,
  onClose,
  request,
}: {
  isOpen: boolean;
  onClose: () => void;
  request: PayoutRequest | null;
}) {
  const [transactionId, setTransactionId] = useState("");

  if (!request) return null;

  const finalAmount = request.amount - request.fees;

  const getMethodLabel = (method: PaymentMethod) => {
    switch (method) {
      case "paypal":
        return "PayPal";
      case "bank_transfer":
        return "Bank Transfer";
      case "wire_transfer":
        return "Wire Transfer";
      case "crypto":
        return "Cryptocurrency";
    }
  };

  const getAccountDetails = () => {
    switch (request.method) {
      case "paypal":
        return request.accountDetails.paypalEmail;
      case "bank_transfer":
      case "wire_transfer":
        return `${request.accountDetails.accountHolder}\n${request.accountDetails.bankAccount}\n${request.accountDetails.iban}`;
      case "crypto":
        return request.accountDetails.walletAddress;
    }
  };

  const handleConfirmPayment = () => {
    // Handle payment confirmation here
    console.log("Payment confirmed:", { requestId: request.id, transactionId });
    onClose();
    setTransactionId("");
  };

  const handleCancel = () => {
    onClose();
    setTransactionId("");
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} className="max-w-lg mx-4">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Process Payment
        </h2>

        <div className="space-y-6">
          {/* Affiliate Info */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Affiliate Details
            </h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {request.affiliateName}
              </p>
              <p>
                <span className="font-medium">ID:</span> {request.affiliateId}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {request.affiliateEmail}
              </p>
            </div>
          </div>

          {/* Payment Method & Details */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Payment Method
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {getMethodLabel(request.method)}
            </p>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-line">
              {getAccountDetails()}
            </div>
          </div>

          {/* Amount Breakdown */}
          <div className="border border-gray-200 dark:border-white/[0.05] rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Amount Breakdown
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Requested Amount:</span>
                <span className="font-medium">
                  ${request.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Processing Fees:</span>
                <span>-${request.fees.toLocaleString()}</span>
              </div>
              <hr className="border-gray-200 dark:border-white/[0.05]" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Final Payable Amount:</span>
                <span className="text-green-600">
                  ${finalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction ID Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Transaction ID (Optional)
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter transaction ID for records"
              className="w-full px-4 py-2 border border-gray-200 dark:border-white/[0.05] rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmPayment}
              className="flex-1"
            >
              Confirm & Mark Paid
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// Filter Bar Component
function FilterBar({
  activeFilter,
  onFilterChange,
  requests,
}: {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  requests: PayoutRequest[];
}) {
  const getFilterCount = (filter: FilterType) => {
    if (filter === "all") return requests.length;
    return requests.filter((request) => request.status === filter).length;
  };

  const filterOptions = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "paid", label: "Paid" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div className="mb-6 flex justify-between flex-wrap gap-4">
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
        <Badge color="warning" size="sm">
          {requests.filter((r) => r.status === "pending").length} Pending
        </Badge>
        <Badge color="success" size="sm">
          {requests.filter((r) => r.status === "approved").length} Approved
        </Badge>
      </div>
    </div>
  );
}

// Main Payouts Table Component
function PayoutsTable({
  title,
  requests,
  showActions = true,
}: {
  title: string;
  requests: PayoutRequest[];
  showActions?: boolean;
}) {
  const [statusFilter, setStatusFilter] = useState<FilterType>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedRequest, setSelectedRequest] = useState<PayoutRequest | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

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

  const sortedAndFilteredData = [...requests]
    .filter(
      (request) => statusFilter === "all" || request.status === statusFilter
    )
    .sort((a, b) => {
      let aValue: any = a[sortField as keyof PayoutRequest];
      let bValue: any = b[sortField as keyof PayoutRequest];

      if (sortField === "date" || sortField === "paidDate") {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      } else if (sortField === "amount") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else {
        aValue = String(aValue || "").toLowerCase();
        bValue = String(bValue || "").toLowerCase();
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
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "paid":
        return "primary";
      case "rejected":
        return "error";
      default:
        return "error";
    }
  };

  const handlePayClick = (request: PayoutRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleRejectClick = (request: PayoutRequest) => {
    // Handle rejection logic here
    console.log("Rejecting request:", request.id);
  };

  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-white/[0.05]">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
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
          requests={requests}
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
                  onClick={() => handleSort("affiliate")}
                >
                  Affiliate {getSortIcon("affiliate")}
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
                  onClick={() => handleSort("date")}
                >
                  {showActions ? "Requested Date" : "Paid Date"}{" "}
                  {getSortIcon("date")}
                </div>
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 font-medium text-gray-500 text-start text-xs dark:text-gray-400"
              >
                Method
              </TableCell>
              {!showActions && (
                <TableCell
                  isHeader
                  className="px-6 py-4 font-medium text-gray-500 text-start text-xs dark:text-gray-400"
                >
                  Transaction ID
                </TableCell>
              )}
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
              {showActions && (
                <TableCell
                  isHeader
                  className="px-6 py-4 font-medium text-gray-500 text-start text-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {paginatedData.map((request) => (
              <TableRow
                key={request.id}
                className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
              >
                <TableCell className="px-6 py-4 text-start">
                  <div>
                    <Link
                      to={`/admin/affiliates/${request.affiliateId}`}
                      className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {request.affiliateName}
                    </Link>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {request.affiliateId}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-start">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${request.amount.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 text-start">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {showActions
                      ? formatDate(request.requestedDate)
                      : formatDate(request.paidDate || "")}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 text-start">
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {request.method.replace("_", " ")}
                  </span>
                </TableCell>
                {!showActions && (
                  <TableCell className="px-6 py-4 text-start">
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                      {request.transactionId || "-"}
                    </span>
                  </TableCell>
                )}
                <TableCell className="px-6 py-4 text-start">
                  <Badge size="sm" color={getStatusColor(request.status)}>
                    {request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)}
                  </Badge>
                </TableCell>
                {showActions && (
                  <TableCell className="px-6 py-4 text-start">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePayClick(request)}
                        className="text-xs"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      {request.status === "approved" && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handlePayClick(request)}
                          className="text-xs"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Pay
                        </Button>
                      )}
                      {request.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectClick(request)}
                          className="text-xs "
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
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
              <Button
                variant="primary"
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
                variant="primary"
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

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={selectedRequest}
      />
    </div>
  );
}

export default function PayoutsPanel() {
  const pendingRequests = payoutRequests.filter((r) => r.status === "pending");
  const approvedRequests = payoutRequests.filter(
    (r) => r.status === "approved"
  );
  const paidRequests = payoutRequests.filter((r) => r.status === "paid");

  return (
    <>
      <PageMeta
        title="Admin - Payout Management"
        description="Admin dashboard for managing affiliate payouts"
      />
      <PageBreadcrumb pageTitle={`Payout Management`} />

      <div className="space-y-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Pending Requests"
            value={`${
              overviewStats.pendingRequests.count
            } ($${overviewStats.pendingRequests.amount.toLocaleString()})`}
            subtitle={`${overviewStats.pendingRequests.count} requests awaiting review`}
            icon={<Calendar className="w-8 h-8" />}
          />
          <StatsCard
            title="Approved (Unpaid)"
            value={`${
              overviewStats.approvedUnpaid.count
            } ($${overviewStats.approvedUnpaid.amount.toLocaleString()})`}
            subtitle={`${overviewStats.approvedUnpaid.count} requests ready for payment`}
            icon={<CheckCircle className="w-8 h-8" />}
          />
          <StatsCard
            title="Paid This Month"
            value={overviewStats.paidThisMonth}
            subtitle="Total paid out this month"
            icon={<DollarSign className="w-8 h-8" />}
          />
          <StatsCard
            title="Lifetime Paid"
            value={overviewStats.lifetimePaid}
            subtitle="Total paid to all affiliates"
            icon={<DollarSign className="w-8 h-8" />}
          />
        </div>

        {/* Pending Requests Table */}
        <PayoutsTable
          title="Pending & Approved Requests"
          requests={payoutRequests.filter(
            (r) => r.status === "pending" || r.status === "approved"
          )}
          showActions={true}
        />

        {/* Paid History Table */}
        <PayoutsTable
          title="Payment History"
          requests={paidRequests}
          showActions={false}
        />
      </div>
    </>
  );
}
