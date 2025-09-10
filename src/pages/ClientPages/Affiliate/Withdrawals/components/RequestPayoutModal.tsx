import { useRef, useState } from "react";
import Button from "../../../../../components/ui/button/Button";
import { Modal } from "../../../../../components/ui/modal";
import axiosInstance from "../../../../../api/axiosInstance";
import { PaymentConfirmationModal } from "./PaymentConfirmationModal";

// Confirmation Modal Component

// Request Payout Modal Component
export function RequestPayoutModal({
  isOpen,
  onClose,
  availableBalance,
}: {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
}) {
  const [paymentType, setPaymentType] = useState("");
  const [walletType, setWalletType] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [errors, setErrors] = useState<{
    paymentType?: string;
    walletType?: string;
    accountNumber?: string;
    amount?: string;
  }>({});

  const paymentTypes = [
    { value: "PAYPAL", label: "PayPal" },
    { value: "BANK_ACCOUNT", label: "Bank Account" },
    { value: "WIRE_TRANSFER", label: "Wire Transfer" },
    { value: "CRYPTOCURRENCY", label: "Cryptocurrency" },
  ];

  const walletTypes = [
    { value: "BTC", label: "Bitcoin (BTC)" },
    { value: "ETH", label: "Ethereum (ETH)" },
    { value: "USDT", label: "Tether (USDT)" },
    { value: "USDC", label: "USD Coin (USDC)" },
    { value: "LTC", label: "Litecoin (LTC)" },
    { value: "XRP", label: "Ripple (XRP)" },
    { value: "ADA", label: "Cardano (ADA)" },
    { value: "DOT", label: "Polkadot (DOT)" },
    { value: "SOL", label: "Solana (SOL)" },
    { value: "OTHER", label: "Other" },
  ];
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Helper function to clear specific errors
  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Helper function to clear submit status when any field changes
  const clearSubmitStatus = () => {
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: "" });
    }
  };

  const validateForm = () => {
    const newErrors: {
      paymentType?: string;
      walletType?: string;
      accountNumber?: string;
      amount?: string;
    } = {};

    // Validate payment type
    if (!paymentType) {
      newErrors.paymentType = "Please select a payment method";
    }

    // Validate wallet type for cryptocurrency
    if (paymentType === "CRYPTOCURRENCY" && !walletType) {
      newErrors.walletType = "Please select a wallet type";
    }

    // Validate account number
    if (!accountNumber.trim()) {
      newErrors.accountNumber = "Please enter account details";
    } else if (accountNumber.trim().length < 4) {
      newErrors.accountNumber = "Account details must be at least 4 characters";
    }

    // Validate amount
    if (!amount) {
      newErrors.amount = "Please enter an amount";
    } else {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        newErrors.amount = "Please enter a valid amount";
      } else if (amountNum > availableBalance) {
        newErrors.amount = "Amount cannot exceed available balance";
      } else if (amountNum < 0) {
        newErrors.amount = "Minimum withdrawal amount is $50";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any previous status messages
    setSubmitStatus({ type: null, message: "" });

    if (!validateForm()) {
      return;
    }

    // Show confirmation modal
    setShowConfirmation(true);
  };

  const handleConfirmedSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Format payment method type for cryptocurrency
      let formattedPaymentType = paymentType;
      if (paymentType === "CRYPTOCURRENCY") {
        formattedPaymentType = `${walletType} - Cryptocurrency`;
      }

      const payload = {
        amount: parseFloat(amount),
        paymentMethod: {
          type: formattedPaymentType,
          accountNumber: accountNumber.trim(),
        },
        notes: notes.trim() || undefined,
      };

      const response = await axiosInstance.post("/withdraw/request", payload);

      // Success - reset form values and show success message
      setShowConfirmation(false);

      // Reset all form values on success
      setPaymentType("");
      setWalletType("");
      setAccountNumber("");
      setAmount("");
      setNotes("");
      setErrors({});

      setSubmitStatus({
        type: "success",
        message:
          "Withdrawal request submitted successfully! You will receive a confirmation email shortly.",
      });

      // Scroll to top to show success message
      modalContentRef.current?.scrollTo({ top: 0, behavior: "smooth" });

      console.log("Withdrawal request submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting withdrawal request:", error);

      // Handle specific error messages from the API
      const errorMessage =
        error.response?.data?.message ||
        "Failed to submit withdrawal request. Please try again.";

      setShowConfirmation(false);
      setSubmitStatus({
        type: "error",
        message: errorMessage,
      });

      // Scroll to top to show error message
      modalContentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return; // Prevent closing while submitting

    onClose();
    setPaymentType("");
    setWalletType("");
    setAccountNumber("");
    setAmount("");
    setNotes("");
    setErrors({});
    setSubmitStatus({ type: null, message: "" });
    setShowConfirmation(false);
  };

  const handleStartNewRequest = () => {
    setPaymentType("");
    setWalletType("");
    setAccountNumber("");
    setAmount("");
    setNotes("");
    setErrors({});
    setSubmitStatus({ type: null, message: "" });
    setShowConfirmation(false);
  };

  const handlePaymentTypeChange = (value: string) => {
    setPaymentType(value);
    // Clear errors for payment type and related fields
    clearError("paymentType");
    clearError("walletType");
    clearError("accountNumber");
    clearSubmitStatus();

    // Reset wallet type when changing payment method
    if (value !== "CRYPTOCURRENCY") {
      setWalletType("");
    }
    // Clear account number when changing payment type
    setAccountNumber("");
  };

  const handleWalletTypeChange = (value: string) => {
    setWalletType(value);
    clearError("walletType");
    clearError("accountNumber");
    clearSubmitStatus();
    // Clear account number when changing wallet type
    setAccountNumber("");
  };

  const handleAccountNumberChange = (value: string) => {
    setAccountNumber(value);
    clearError("accountNumber");
    clearSubmitStatus();
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    clearError("amount");
    clearSubmitStatus();
  };

  const getAccountPlaceholder = () => {
    if (paymentType === "CRYPTOCURRENCY") {
      return `Enter ${walletType ? walletType : "wallet"} address`;
    }
    switch (paymentType) {
      case "PAYPAL":
        return "Enter PayPal email address";
      case "BANK_ACCOUNT":
        return "Enter bank account number";
      case "WIRE_TRANSFER":
        return "Enter bank account/SWIFT details";
      default:
        return "Enter account details";
    }
  };

  const getAccountLabel = () => {
    if (paymentType === "CRYPTOCURRENCY") {
      return `${walletType ? walletType : "Wallet"} Address`;
    }
    switch (paymentType) {
      case "PAYPAL":
        return "PayPal Email";
      case "BANK_ACCOUNT":
        return "Bank Account Number";
      case "WIRE_TRANSFER":
        return "Bank Details";
      default:
        return "Account Details";
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        className="max-w-md mx-4 max-h-11/12 overflow-auto"
        ref={modalContentRef}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Request Payout
          </h2>

          {/* Success/Error Message */}
          {submitStatus.type && (
            <div
              className={`mb-6 rounded-lg p-4 border ${
                submitStatus.type === "success"
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              }`}
            >
              <p
                className={`text-sm ${
                  submitStatus.type === "success"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {submitStatus.message}
              </p>
              {submitStatus.type === "success" && (
                <div className="mt-4 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 text-sm"
                  >
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleStartNewRequest}
                    className="flex-1 text-sm"
                  >
                    New Request
                  </Button>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Available Balance Display */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Available Balance
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${availableBalance.toLocaleString()}
              </p>
            </div>

            {/* Payment Method Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Method *
              </label>
              <select
                value={paymentType}
                onChange={(e) => handlePaymentTypeChange(e.target.value)}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.paymentType
                    ? "border-red-300 dark:border-red-600"
                    : "border-gray-200 dark:border-white/[0.05]"
                }`}
              >
                <option value="">Select payment method</option>
                {paymentTypes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.paymentType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.paymentType}
                </p>
              )}
            </div>

            {/* Wallet Type Selection for Cryptocurrency */}
            {paymentType === "CRYPTOCURRENCY" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Wallet Type *
                </label>
                <select
                  value={walletType}
                  onChange={(e) => handleWalletTypeChange(e.target.value)}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.walletType
                      ? "border-red-300 dark:border-red-600"
                      : "border-gray-200 dark:border-white/[0.05]"
                  }`}
                >
                  <option value="">Select wallet type</option>
                  {walletTypes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.walletType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.walletType}
                  </p>
                )}
              </div>
            )}

            {/* Account Details */}
            {paymentType &&
              (paymentType !== "CRYPTOCURRENCY" || walletType) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {getAccountLabel()} *
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => handleAccountNumberChange(e.target.value)}
                    placeholder={getAccountPlaceholder()}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.accountNumber
                        ? "border-red-300 dark:border-red-600"
                        : "border-gray-200 dark:border-white/[0.05]"
                    }`}
                  />
                  {errors.accountNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.accountNumber}
                    </p>
                  )}
                </div>
              )}

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  disabled={isSubmitting}
                  className={`w-full pl-8 pr-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.amount
                      ? "border-red-300 dark:border-red-600"
                      : "border-gray-200 dark:border-white/[0.05]"
                  }`}
                />
              </div>
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Minimum withdrawal: $50 • Maximum: $
                {availableBalance.toLocaleString()}
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes for this withdrawal..."
                rows={3}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed border-gray-200 dark:border-white/[0.05] resize-none"
              />
            </div>

            {/* Buttons - only show if no success message */}
            {submitStatus.type !== "success" && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Review Request
                </Button>
              </div>
            )}
          </form>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <PaymentConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmedSubmit}
        isSubmitting={isSubmitting}
        paymentDetails={{
          amount,
          paymentType,
          walletType,
          accountNumber,
          notes,
        }}
      />
    </>
  );
}
