import { TableCell, TableRow } from "../../../../../components/ui/table";
import Button from "../../../../../components/ui/button/Button";
import Badge from "../../../../../components/ui/badge/Badge";
import { AffiliateRequest } from "./types";

interface RequestRowProps {
  request: AffiliateRequest;
  onViewDetails: (request: AffiliateRequest) => void;
  onStatusChange: (id: number, status: "approved" | "rejected") => void;
}

export default function RequestRow({
  request,
  onViewDetails,
  onStatusChange,
}: RequestRowProps) {
  return (
    <TableRow className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
      <TableCell className="px-5 py-4 sm:px-6 text-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 overflow-hidden rounded-full bg-brand-500 flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {request.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div>
            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
              {request.fullName}
            </span>
            {request.flag && (
              <Badge
                color={
                  request.flag === "suspicious"
                    ? "error"
                    : request.flag === "top_referrer"
                    ? "success"
                    : "dark"
                }
                size="sm"
              >
                {request.flag === "suspicious"
                  ? "Suspicious"
                  : request.flag === "top_referrer"
                  ? "Top Referrer"
                  : request.flag === "blacklisted"
                  ? "Blacklisted"
                  : request.flag}
              </Badge>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {request.email}
      </TableCell>
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {new Date(request.appliedDate).toLocaleDateString()}
      </TableCell>
      <TableCell className="px-4 py-3 text-start">
        <Badge
          size="sm"
          color={
            request.status === "approved"
              ? "success"
              : request.status === "rejected"
              ? "error"
              : "warning"
          }
        >
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </Badge>
      </TableCell>
      <TableCell className="px-4 py-3 text-start">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => onViewDetails(request)}
            className="text-xs"
          >
            View Details
          </Button>
          {request.status === "pending" && (
            <>
              <button
                onClick={() => onStatusChange(request.id, "approved")}
                className="px-4 py-3 text-xs text-success-600 bg-white border border-success-300 rounded-lg hover:bg-success-50 transition-colors dark:bg-gray-800 dark:border-success-600 dark:text-success-400 dark:hover:bg-success-500/10"
              >
                Approve
              </button>
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
