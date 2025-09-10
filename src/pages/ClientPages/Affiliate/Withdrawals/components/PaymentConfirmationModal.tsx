import Button from "../../../../../components/ui/button/Button";
import { Modal } from "../../../../../components/ui/modal";

export function PaymentConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  paymentDetails,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  paymentDetails: {
    amount: string;
    paymentType: string;
    walletType?: string;
    accountNumber: string;
    notes?: string;
  };
}) {
  const getPaymentMethodDisplay = () => {
    if (paymentDetails.paymentType === "CRYPTOCURRENCY") {
      return `${paymentDetails.walletType} - Cryptocurrency`;
    }
    const paymentTypes = {
      PAYPAL: "PayPal",
      BANK_ACCOUNT: "Bank Account",
      WIRE_TRANSFER: "Wire Transfer",
    };
    return (
      paymentTypes[paymentDetails.paymentType] || paymentDetails.paymentType
    );
  };

  const getAccountDisplay = () => {
    if (paymentDetails.paymentType === "CRYPTOCURRENCY") {
      // Show first 8 and last 8 characters for crypto addresses
      const account = paymentDetails.accountNumber;
      if (account.length > 16) {
        return `${account.slice(0, 8)}...${account.slice(-8)}`;
      }
      return account;
    }

    // For other payment methods, show first few characters
    const account = paymentDetails.accountNumber;
    if (account.length > 12) {
      return `${account.slice(0, 8)}***${account.slice(-4)}`;
    }
    return account;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md mx-4">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Confirm Withdrawal Request
        </h2>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Amount:
              </span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                ${parseFloat(paymentDetails.amount).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Payment Method:
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {getPaymentMethodDisplay()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Account:
              </span>
              <span className="text-sm font-mono text-gray-900 dark:text-white">
                {getAccountDisplay()}
              </span>
            </div>

            {paymentDetails.notes && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Notes:
                </span>
                <p className="text-sm text-gray-900 dark:text-white mt-1">
                  {paymentDetails.notes}
                </p>
              </div>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              Please review the details above carefully. Once submitted, this
              withdrawal request will be processed according to our standard
              procedures.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Confirm Request"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
