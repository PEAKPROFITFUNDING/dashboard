import React, { useState } from "react";
import { Modal } from "../ui/modal";
import InputField from "../form/input/InputField";
import Button from "../ui/button/Button";
import Select from "../form/Select";
import { Challenge, PayoutRequest } from "../../services/payoutService";

interface PayoutRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: Challenge | null;
  onSubmit: (data: PayoutRequest) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const payoutMethods = [
  { value: "PayPal", label: "PayPal" },
  { value: "Bank", label: "Bank Transfer" },
  { value: "Crypto", label: "Crypto (USDT/BTC)" },
];

const PayoutRequestModal: React.FC<PayoutRequestModalProps> = ({
  isOpen,
  onClose,
  challenge,
  onSubmit,
  loading,
  error,
}) => {
  const [method, setMethod] = useState<"PayPal" | "Bank" | "Crypto">("PayPal");
  const [accountHolder, setAccountHolder] = useState("");
  const [details, setDetails] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!accountHolder || !details) {
      setFormError("Please fill in all fields.");
      return;
    }
    if (!challenge) return;
    try {
      await onSubmit({
        challengeId: challenge.id,
        method,
        accountHolder,
        details,
      });
      setAccountHolder("");
      setDetails("");
      setMethod("PayPal");
    } catch {
      setFormError("Failed to submit payout request.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl w-full mx-4 max-h-[90vh]"
    >
      <div className="flex flex-col h-full max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Request Payout
          </h3>
        </div>

        {/* Scrollable Content */}
        {challenge && (
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            {/* Challenge Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Challenge
                </label>
                <p className="text-gray-900 dark:text-white">
                  {challenge.name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Profit
                </label>
                <p className="text-gray-900 dark:text-white">
                  ${challenge.profit.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Payout Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payout Method
              </label>
              <Select
                options={payoutMethods}
                defaultValue={method}
                onChange={(value) =>
                  setMethod(value as "PayPal" | "Bank" | "Crypto")
                }
                placeholder="Select payout method"
                className="w-full"
              />
            </div>

            {/* Account Holder Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Account Holder Name
              </label>
              <InputField
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                placeholder="John Doe"
              />
            </div>

            {/* Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {method === "PayPal"
                  ? "PayPal Email"
                  : method === "Bank"
                  ? "Bank Details"
                  : "Crypto Wallet Address"}
              </label>
              <InputField
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={
                  method === "PayPal"
                    ? "you@example.com"
                    : method === "Bank"
                    ? "Bank name, IBAN, SWIFT"
                    : "e.g., 0x1234... or BTC address"
                }
              />
            </div>

            {/* Error message */}
            {(formError || error) && (
              <div className="text-red-500">{formError || error}</div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                size="sm"
                variant="outline"
                onClick={onClose}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                variant="primary"
                disabled={loading}
                className="text-xs"
              >
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default PayoutRequestModal;
