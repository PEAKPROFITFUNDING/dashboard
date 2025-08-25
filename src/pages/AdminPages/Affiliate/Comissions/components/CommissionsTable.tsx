import Button from "../../../../../components/ui/button/Button";
import { CommissionModal } from "./CommissionModal";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../../components/ui/table";
import {
  Commission,
  CommissionType,
  FilterType,
  SortField,
} from "../AdminComissions";
import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CheckCircle,
  Eye,
  XCircle,
} from "lucide-react";
import { FilterBar } from "./FilterBar";
import { Link } from "react-router";
import Badge from "../../../../../components/ui/badge/Badge";

// Main Commissions Table Component
export function CommissionsTable({
  commissions,
}: {
  commissions: Commission[];
}) {
  const [statusFilter, setStatusFilter] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [affiliateFilter, setAffiliateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedCommission, setSelectedCommission] =
    useState<Commission | null>(null);
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

  const sortedAndFilteredData = [...commissions]
    .filter((commission) => {
      if (statusFilter !== "all" && commission.status !== statusFilter)
        return false;
      if (affiliateFilter && commission.affiliateName !== affiliateFilter)
        return false;
      if (typeFilter && commission.commissionType !== typeFilter) return false;
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          commission.affiliateName.toLowerCase().includes(search) ||
          commission.customerName.toLowerCase().includes(search) ||
          commission.affiliateId.toLowerCase().includes(search) ||
          commission.customerId.toLowerCase().includes(search)
        );
      }
      return true;
    })
    .sort((a, b) => {
      let aValue: any = a[sortField as keyof Commission];
      let bValue: any = b[sortField as keyof Commission];

      if (sortField === "date") {
        aValue = new Date(a.dateEarned).getTime();
        bValue = new Date(b.dateEarned).getTime();
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

  const getTypeColor = (type: CommissionType) => {
    switch (type) {
      case "purchase":
        return "primary";
      case "referral":
        return "success";
      case "bonus":
        return "warning";
      case "recurring":
        return "info";
      case "tier2":
        return "primary";
      default:
        return "primary";
    }
  };

  const handleRowClick = (commission: Commission) => {
    setSelectedCommission(commission);
    setIsModalOpen(true);
  };

  const handleApprove = (e: React.MouseEvent, commission: Commission) => {
    e.stopPropagation();
    console.log("Approving commission:", commission.id);
  };

  const handleReject = (e: React.MouseEvent, commission: Commission) => {
    e.stopPropagation();
    console.log("Rejecting commission:", commission.id);
  };

  const handleMarkPaid = (e: React.MouseEvent, commission: Commission) => {
    e.stopPropagation();
    console.log("Marking as paid:", commission.id);
  };

  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-white/[0.05]">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Commission Management
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
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          commissions={commissions}
          affiliateFilter={affiliateFilter}
          onAffiliateFilterChange={setAffiliateFilter}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
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
                  onClick={() => handleSort("customer")}
                >
                  Customer {getSortIcon("customer")}
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
                  Date Earned {getSortIcon("date")}
                </div>
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 font-medium text-gray-500 text-start text-xs dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {paginatedData.map((commission) => (
              <TableRow
                key={commission.id}
                className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                onClick={() => handleRowClick(commission)}
              >
                <TableCell className="px-6 py-4 text-start">
                  <div>
                    <Link
                      to={`/admin/affiliates/${commission.affiliateId}`}
                      className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {commission.affiliateName}
                    </Link>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {commission.affiliateId}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-start">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {commission.customerName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {commission.customerId}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-start">
                  <Badge
                    size="sm"
                    color={getTypeColor(commission.commissionType)}
                  >
                    {commission.commissionType.charAt(0).toUpperCase() +
                      commission.commissionType.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-start">
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${commission.amount.toLocaleString()}
                    </span>
                    {commission.rate > 0 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {commission.rate}% of $
                        {commission.orderValue.toLocaleString()}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-start">
                  <Badge size="sm" color={getStatusColor(commission.status)}>
                    {commission.status.charAt(0).toUpperCase() +
                      commission.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-start">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(commission.dateEarned)}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 text-start">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(commission);
                      }}
                      className="text-xs"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    {commission.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={(e) => handleApprove(e, commission)}
                          className="text-xs"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleReject(e, commission)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    {commission.status === "approved" && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={(e) => handleMarkPaid(e, commission)}
                        className="text-xs"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Mark Paid
                      </Button>
                    )}
                  </div>
                </TableCell>
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

      {/* Commission Details Modal */}
      <CommissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        commission={selectedCommission}
      />
    </div>
  );
}
