import { useState } from "react";
import { PayoutRequest } from "../AdminAffiliatePayoutsPanel";
import { Modal } from "../../../../../components/ui/modal";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: PayoutRequest | null;
  onApprove: (id: string) => void;
  onMarkPaid: (id: string, transactionId: string) => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  request,
  onApprove,
  onMarkPaid,
}: PaymentModalProps) {
  const [transactionId, setTransactionId] = useState("");
  const [showMarkPaid, setShowMarkPaid] = useState(false);

  if (!isOpen || !request) return null;

  const handleApprove = () => {
    onApprove(request.id);
    onClose();
  };

  const handleMarkPaid = () => {
    if (transactionId.trim()) {
      onMarkPaid(request.id, transactionId.trim());
      setTransactionId("");
      setShowMarkPaid(false);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-lg w-full p-6"
      showCloseButton={false}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Payout Request Details
      </h3>

      <div className="space-y-4 mb-6">
        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Affiliate
          </label>
          <p className="text-gray-900 dark:text-white">
            {request.affiliate.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {request.affiliate.email}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Amount
          </label>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            ${request.amount.toLocaleString()}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Payment Method
          </label>
          <p className="text-gray-900 dark:text-white capitalize">
            {request.paymentMethod.type.replace("_", " ")}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {request.paymentMethod.accountNumber}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400 pr-2">
            Status
          </label>
          <span
            className={`inline-block px-2 py-1 text-xs rounded-full ${
              request.status === "PENDING"
                ? "bg-yellow-100 text-yellow-800"
                : request.status === "APPROVED"
                ? "bg-green-100 text-green-800"
                : request.status === "PAID"
                ? "bg-blue-100 text-blue-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {request.status}
          </span>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Requested Date
          </label>
          <p className="text-gray-900 dark:text-white">
            {new Date(request.requestedDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {showMarkPaid && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Transaction ID
          </label>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Enter transaction ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Close
        </button>

        {request.status === "PENDING" && (
          <button
            onClick={handleApprove}
            className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600"
          >
            Approve
          </button>
        )}

        {request.status === "APPROVED" && !showMarkPaid && (
          <button
            onClick={() => setShowMarkPaid(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Mark as Paid
          </button>
        )}

        {showMarkPaid && (
          <button
            onClick={handleMarkPaid}
            disabled={!transactionId.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            Confirm Payment
          </button>
        )}
      </div>
    </Modal>
  );
}
