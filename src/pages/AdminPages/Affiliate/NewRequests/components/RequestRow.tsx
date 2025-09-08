import { TableRow, TableCell } from "../../../../../components/ui/table";
import { Eye } from "lucide-react";
import { AffiliateRequest } from "./types";
import Button from "../../../../../components/ui/button/Button";

interface RequestRowProps {
  request: AffiliateRequest;
  onViewDetails: (request: AffiliateRequest) => void;
  onStatusChange: (id: number, status: "approved" | "rejected") => void;
  showActionButtons?: boolean;
}

export default function RequestRow({
  request,
  onViewDetails,
  onStatusChange,
  showActionButtons = true,
}: RequestRowProps) {
  const getStatusBadge = (status: string) => {
    const baseClasses =
      "inline-flex px-2 py-1 text-xs font-semibold rounded-full";

    switch (status) {
      case "approved":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
    }
  };

  return (
    <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
      {/* Full Name */}
      <TableCell className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">
        {request.fullName}
      </TableCell>

      {/* Email */}
      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
        {request.email}
      </TableCell>

      {/* Applied Date */}
      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
        {request.appliedDate}
      </TableCell>

      {/* Status */}
      <TableCell className="px-5 py-4">
        <span className={getStatusBadge(request.status)}>{request.status}</span>
      </TableCell>

      {/* Actions */}
      <TableCell className="px-5 py-4">
        <div className="flex items-center gap-2">
          {/* View Details Button */}
          <Button
            size="sm"
            variant="primary"
            onClick={() => onViewDetails(request)}
            className="text-xs"
          >
            <Eye className="w-3 h-3" />
            View
          </Button>

          {/* Conditional Action Buttons */}
          {showActionButtons && request.status === "pending" && (
            <>
              {/* Approve Button */}
              <button
                onClick={() => onStatusChange(request.id, "approved")}
                className="px-4 py-3 text-xs text-success-600 bg-white border border-success-300 rounded-lg hover:bg-success-50 transition-colors dark:bg-gray-800 dark:border-success-600 dark:text-success-400 dark:hover:bg-success-500/10"
              >
                Approve
              </button>

              {/* Reject Button */}
              <button
                onClick={() => onStatusChange(request.id, "rejected")}
                className="px-4 py-3 text-xs text-error-600 bg-white border border-error-300 rounded-lg hover:bg-error-50 transition-colors dark:bg-gray-800 dark:border-error-600 dark:text-error-400 dark:hover:bg-error-500/10"
              >
                Reject
              </button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
