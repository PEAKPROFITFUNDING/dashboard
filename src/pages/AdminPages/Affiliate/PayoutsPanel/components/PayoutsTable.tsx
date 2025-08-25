import { useState } from "react";
import {
  FilterType,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../../components/ui/table";
import Badge from "../../../../../components/ui/badge/Badge";
import Button from "../../../../../components/ui/button/Button";
import { PaymentModal } from "./PaymentModal";
import { Link } from "react-router";
import { FilterBar } from "./FilterBar";

// Main Payouts Table Component
export function PayoutsTable({
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
