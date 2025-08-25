import { useState } from "react";
import { Modal } from "../../../../../components/ui/modal";
import Badge from "../../../../../components/ui/badge/Badge";
import { Link } from "react-router";
import Button from "../../../../../components/ui/button/Button";
import { Commission, CommissionType } from "../AdminComissions";

// Commission Details Modal Component
export function CommissionModal({
  isOpen,
  onClose,
  commission,
}: {
  isOpen: boolean;
  onClose: () => void;
  commission: Commission | null;
}) {
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");

  if (!commission) return null;

  const getTypeLabel = (type: CommissionType) => {
    switch (type) {
      case "purchase":
        return "Purchase Commission";
      case "referral":
        return "Referral Commission";
      case "bonus":
        return "Performance Bonus";
      case "recurring":
        return "Recurring Commission";
      case "tier2":
        return "Tier 2 Commission";
    }
  };

  const getTypeDescription = (type: CommissionType) => {
    switch (type) {
      case "purchase":
        return "Commission earned from direct customer purchase";
      case "referral":
        return "Commission earned from referring new affiliate";
      case "bonus":
        return "Special bonus commission";
      case "recurring":
        return "Recurring subscription commission";
      case "tier2":
        return "Commission from sub-affiliate's sale";
    }
  };

  const handleStatusChange = (newStatus: string) => {
    console.log("Status changed:", {
      commissionId: commission.id,
      newStatus,
      notes,
    });
    onClose();
    setStatus("");
    setNotes("");
  };

  const handleCancel = () => {
    onClose();
    setStatus("");
    setNotes("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      className="max-w-2xl mx-4 max-h-[90vh] overflow-y-scroll"
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Commission Details
        </h2>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge
              size="md"
              color={
                commission.status === "pending"
                  ? "warning"
                  : commission.status === "approved"
                  ? "success"
                  : commission.status === "paid"
                  ? "primary"
                  : "error"
              }
            >
              {commission.status.charAt(0).toUpperCase() +
                commission.status.slice(1)}
            </Badge>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ${commission.amount.toLocaleString()}
            </span>
          </div>

          {/* Commission Type */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-gray-900 dark:text-white">
            <h3 className="font-semibold  mb-2">
              {getTypeLabel(commission.commissionType)}
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              {getTypeDescription(commission.commissionType)}
            </p>
            {commission.rate > 0 && (
              <div className="text-sm">
                <span className="font-medium">Rate:</span> {commission.rate}% of
                ${commission.orderValue.toLocaleString()} = $
                {commission.amount.toLocaleString()}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-900 dark:text-white">
            {/* Affiliate Info */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Affiliate Details</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Name:</span>
                  <Link
                    to={`/admin/affiliates/${commission.affiliateId}`}
                    className="ml-1 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {commission.affiliateName}
                  </Link>
                </p>
                <p>
                  <span className="font-medium">ID:</span>{" "}
                  {commission.affiliateId}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {commission.affiliateEmail}
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Customer Details
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {commission.customerName}
                </p>
                <p>
                  <span className="font-medium">ID:</span>{" "}
                  {commission.customerId}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {commission.customerEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Order & Transaction Info */}
          <div className="border border-gray-200 text-gray-900 dark:text-white dark:border-white/[0.05] rounded-lg p-4">
            <h3 className="font-semibold  mb-3">Transaction Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p>
                  <span className="font-medium">Date Earned:</span>{" "}
                  {new Date(commission.dateEarned).toLocaleString()}
                </p>
                {commission.orderId && (
                  <p>
                    <span className="font-medium">Order ID:</span>{" "}
                    {commission.orderId}
                  </p>
                )}
                {commission.transactionId && (
                  <p>
                    <span className="font-medium">Transaction ID:</span>{" "}
                    {commission.transactionId}
                  </p>
                )}
              </div>
              <div>
                {commission.orderValue > 0 && (
                  <p>
                    <span className="font-medium">Order Value:</span> $
                    {commission.orderValue.toLocaleString()}
                  </p>
                )}
                {commission.rate > 0 && (
                  <p>
                    <span className="font-medium">Commission Rate:</span>{" "}
                    {commission.rate}%
                  </p>
                )}
              </div>
            </div>
            {commission.notes && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/[0.05]">
                <p className="text-sm">
                  <span className="font-medium">Notes:</span> {commission.notes}
                </p>
              </div>
            )}
          </div>

          {/* Status Management */}
          {commission.status !== "paid" && (
            <div className="border border-gray-200 dark:border-white/[0.05] rounded-lg p-4 text-gray-900 dark:text-white">
              <h3 className="font-semibold  mb-3">Update Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-white/[0.05] rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select new status...</option>
                    {commission.status === "pending" && (
                      <option value="approved">Approve</option>
                    )}
                    {commission.status === "pending" && (
                      <option value="rejected">Reject</option>
                    )}
                    {commission.status === "approved" && (
                      <option value="paid">Mark as Paid</option>
                    )}
                    {commission.status === "approved" && (
                      <option value="rejected">Reject</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this status change..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-white/[0.05] rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              {commission.status === "paid" ? "Close" : "Cancel"}
            </Button>
            {commission.status !== "paid" && status && (
              <Button
                variant="primary"
                onClick={() => handleStatusChange(status)}
                className="flex-1"
              >
                Update Status
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
