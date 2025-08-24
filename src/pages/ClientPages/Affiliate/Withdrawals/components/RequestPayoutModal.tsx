import { useState } from "react";
import Button from "../../../../../components/ui/button/Button";
import { Modal } from "../../../../../components/ui/modal";

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
  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<{ method?: string; amount?: string }>(
    {}
  );

  const withdrawalMethods = [
    { value: "paypal", label: "PayPal" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "wire_transfer", label: "Wire Transfer" },
    { value: "crypto", label: "Cryptocurrency" },
  ];

  const validateForm = () => {
    const newErrors: { method?: string; amount?: string } = {};

    if (!method) {
      newErrors.method = "Please select a withdrawal method";
    }

    if (!amount) {
      newErrors.amount = "Please enter an amount";
    } else {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        newErrors.amount = "Please enter a valid amount";
      } else if (amountNum > availableBalance) {
        newErrors.amount = "Amount cannot exceed available balance";
      } else if (amountNum < 50) {
        newErrors.amount = "Minimum withdrawal amount is $50";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle form submission here
      console.log("Withdrawal request:", { method, amount });
      onClose();
      setMethod("");
      setAmount("");
      setErrors({});
    }
  };

  const handleClose = () => {
    onClose();
    setMethod("");
    setAmount("");
    setErrors({});
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md mx-4">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Request Payout
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Available Balance Display */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Available Balance
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${availableBalance.toLocaleString()}
            </p>
          </div>

          {/* Withdrawal Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Withdrawal Method *
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.method
                  ? "border-red-300 dark:border-red-600"
                  : "border-gray-200 dark:border-white/[0.05]"
              }`}
            >
              <option value="">Select withdrawal method</option>
              {withdrawalMethods.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.method && (
              <p className="text-red-500 text-sm mt-1">{errors.method}</p>
            )}
          </div>

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
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="50"
                max={availableBalance}
                step="0.01"
                className={`w-full pl-8 pr-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
              Minimum withdrawal: $50
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" className="flex-1">
              Submit Request
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
