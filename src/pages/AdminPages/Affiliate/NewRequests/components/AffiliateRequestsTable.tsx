import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../../components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import RequestRow from "./RequestRow";
import { AffiliateRequest } from "./types";

interface AffiliateRequestsTableProps {
  requests: AffiliateRequest[];
  onViewDetails: (request: AffiliateRequest) => void;
  onStatusChange: (id: number, status: "approved" | "rejected") => void;
}

export default function AffiliateRequestsTable({
  requests,
  onViewDetails,
  onStatusChange,
}: AffiliateRequestsTableProps) {
  const [sortField, setSortField] =
    useState<keyof AffiliateRequest>("appliedDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Sorting function - now only for client-side sorting of current page data
  const sortedRequests = useMemo(() => {
    return [...requests].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === "asc" ? comparison : -comparison;
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [requests, sortField, sortDirection]);

  // Handle sorting
  const handleSort = (field: keyof AffiliateRequest) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: keyof AffiliateRequest) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-4 h-4" />
    ) : (
      <ArrowDown className="w-4 h-4" />
    );
  };

  return (
    <div className="space-y-6">
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
                  <div
                    className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => handleSort("email")}
                  >
                    Email {getSortIcon("email")}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div
                    className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => handleSort("appliedDate")}
                  >
                    Applied Date {getSortIcon("appliedDate")}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
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
              {sortedRequests.map((request) => (
                <RequestRow
                  key={request.id}
                  request={request}
                  onViewDetails={onViewDetails}
                  onStatusChange={onStatusChange}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
