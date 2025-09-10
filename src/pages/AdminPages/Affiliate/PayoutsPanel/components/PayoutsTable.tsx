import { useState } from "react";
import {
  FilterOption,
  PayoutRequest,
  SortField,
} from "../AdminAffiliatePayoutsPanel";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CheckCircle,
  Eye,
  XCircle,
} from "lucide-react";
import FilterBar from "../../../../../components/FilterBar";
import { PaymentModal } from "./PaymentModal";
import { ConfirmationModal } from "../../../../../components/ConfirmationModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../../components/ui/table";

interface PayoutsTableProps {
  title: string;
  requests: PayoutRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onMarkPaid: (id: string, transactionId: string) => void;
}

const filterOptions: FilterOption[] = [
  { key: "all", label: "All" },
  { key: "PENDING", label: "Pending", color: "warning" },
  { key: "APPROVED", label: "Approved", color: "success" },
  { key: "PAID", label: "Paid", color: "info" },
  { key: "DENIED", label: "Denied", color: "error" },
];

export function PayoutsTable({
  title,
  requests,
  onApprove,
  onReject,
  onMarkPaid,
}: PayoutsTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("requestedDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedRequest, setSelectedRequest] = useState<PayoutRequest | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "reject";
    request: PayoutRequest | null;
  }>({ isOpen: false, type: "reject", request: null });

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

  // Calculate counts for filter
  const counts = {
    all: requests.length,
    PENDING: requests.filter((r) => r.status === "PENDING").length,
    APPROVED: requests.filter((r) => r.status === "APPROVED").length,
    PAID: requests.filter((r) => r.status === "PAID").length,
    DENIED: requests.filter((r) => r.status === "DENIED").length,
  };

  const sortedAndFilteredData = [...requests]
    .filter(
      (request) => statusFilter === "all" || request.status === statusFilter
    )
    .sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      if (sortField === "requestedDate") {
        aValue = new Date(a.requestedDate).getTime();
        bValue = new Date(b.requestedDate).getTime();
      } else if (sortField === "amount") {
        aValue = a.amount;
        bValue = b.amount;
      } else if (sortField === "affiliate") {
        aValue = a.affiliate.name.toLowerCase();
        bValue = b.affiliate.name.toLowerCase();
      } else if (sortField === "status") {
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "APPROVED":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "PAID":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "DENIED":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const handleViewClick = (request: PayoutRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleRejectClick = (request: PayoutRequest) => {
    setConfirmModal({
      isOpen: true,
      type: "reject",
      request,
    });
  };

  const handleConfirmReject = () => {
    if (confirmModal.request) {
      onReject(confirmModal.request.id);
    }
    setConfirmModal({ isOpen: false, type: "reject", request: null });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] overflow-hidden">
      {/* Header */}
      <div className="p-4 px-6 border-b border-gray-100 dark:border-white/[0.05]">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>

      {/* Filter Bar */}
      <div className="p-4 px-6 border-b border-gray-100 dark:border-white/[0.05]">
        <FilterBar
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
          filterOptions={filterOptions}
          counts={counts}
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-none border-none bg-transparent dark:bg-transparent">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-6 py-3 font-medium text-gray-500 text-start text-xs uppercase tracking-wider dark:text-gray-400"
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
                  className="px-6 py-3 font-medium text-gray-500 text-start text-xs uppercase tracking-wider dark:text-gray-400"
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
                  className="px-6 py-3 font-medium text-gray-500 text-start text-xs uppercase tracking-wider dark:text-gray-400"
                >
                  <div
                    className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => handleSort("requestedDate")}
                  >
                    Date {getSortIcon("requestedDate")}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-3 font-medium text-gray-500 text-start text-xs uppercase tracking-wider dark:text-gray-400"
                >
                  Method
                </TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-3 font-medium text-gray-500 text-start text-xs uppercase tracking-wider dark:text-gray-400"
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
                  className="px-6 py-3 font-medium text-gray-500 text-start text-xs uppercase tracking-wider dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedData.map((request) => (
                <TableRow
                  key={request.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="px-6 py-4 text-start">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {request.affiliate.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {request.affiliate.email}
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
                      {new Date(request.requestedDate).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-start">
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {request.paymentMethod.type.replace("_", " ")}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-start">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-start">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewClick(request)}
                        className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {request.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleViewClick(request)}
                            className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectClick(request)}
                            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
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
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={selectedRequest}
        onApprove={onApprove}
        onMarkPaid={onMarkPaid}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({ isOpen: false, type: "reject", request: null })
        }
        onConfirm={handleConfirmReject}
        title="Reject Payout Request"
        message={`Are you sure you want to reject the payout request for ${confirmModal.request?.affiliate.name}? This action cannot be undone.`}
        confirmText="Reject"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
}
