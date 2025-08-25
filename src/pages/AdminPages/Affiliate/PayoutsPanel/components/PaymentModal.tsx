import { useState } from "react";
import Button from "../../../../../components/ui/button/Button";
import { Modal } from "../../../../../components/ui/modal";
import { PaymentMethod, PayoutRequest } from "../AdminAffiliatePayoutsPanel";

// Payment Details Modal Component
export function PaymentModal({
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
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      className="max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Process Payment
        </h2>

        <div className="space-y-6">
          {/* Affiliate Info */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-gray-900 dark:text-white">
            <h3 className="font-semibold  mb-2">Affiliate Details</h3>
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
          <div className="border border-gray-200 dark:border-white/[0.05] text-gray-900 dark:text-white rounded-lg p-4">
            <h3 className="font-semibold  mb-3">Amount Breakdown</h3>
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
