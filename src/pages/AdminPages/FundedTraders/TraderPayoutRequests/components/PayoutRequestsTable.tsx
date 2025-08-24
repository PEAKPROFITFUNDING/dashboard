import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../../components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import Badge from "../../../../../components/ui/badge/Badge";
import Button from "../../../../../components/ui/button/Button";
import Pagination from "../../../Affiliate/NewRequests/components/Pagination"; // make sure you have a Pagination component
import { AdminPayoutRequest } from "../../../../../services/payoutService";

interface Props {
  requests: AdminPayoutRequest[];
  onViewDetails: (req: AdminPayoutRequest) => void;
}

export default function PayoutRequestsTable({
  requests,
  onViewDetails,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortField, setSortField] =
    useState<keyof AdminPayoutRequest>("requestedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Sorting
  const sortedRequests = useMemo(() => {
    return [...requests].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [requests, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = sortedRequests.slice(startIndex, endIndex);

  const handleSort = (field: keyof AdminPayoutRequest) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: keyof AdminPayoutRequest) => {
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
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:text-white dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-theme-xs text-start font-medium text-gray-500 dark:text-white"
                >
                  <div
                    className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => handleSort("username")}
                  >
                    User {getSortIcon("username")}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-theme-xs text-start font-medium text-gray-500 dark:text-white"
                >
                  <div
                    className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-white"
                    onClick={() => handleSort("method")}
                  >
                    Method {getSortIcon("method")}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-theme-xs text-start font-medium text-gray-500 dark:text-white"
                >
                  <div
                    className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-white"
                    onClick={() => handleSort("amount")}
                  >
                    Amount {getSortIcon("amount")}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-theme-xs text-start font-medium text-gray-500 dark:text-white"
                >
                  <div
                    className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-white"
                    onClick={() => handleSort("requestedAt")}
                  >
                    Requested At {getSortIcon("requestedAt")}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-theme-xs text-start font-medium text-gray-500 dark:text-white"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-theme-xs text-start font-medium text-gray-500 dark:text-white"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] dark:text-white">
              {currentRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="flex items-center gap-2 justify-start py-4 pl-2">
                    <img
                      src={req.avatarUrl}
                      alt={req.username}
                      className="w-8 h-8 rounded-full"
                    />
                    {req.username}
                  </TableCell>
                  <TableCell>{req.method}</TableCell>
                  <TableCell>${req.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(req.requestedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      color={
                        req.status === "approved"
                          ? "success"
                          : req.status === "declined"
                          ? "error"
                          : "warning"
                      }
                    >
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => onViewDetails(req)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {totalPages && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={sortedRequests.length}
        />
      )}
    </div>
  );
}
