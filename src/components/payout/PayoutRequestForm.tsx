import React, { useState } from "react";
import {
  PayoutRequest,
  submitPayoutRequest,
} from "../../services/payoutService";
import Button from "../ui/button/Button";

interface Props {
  accountId: string;
  onSuccess: () => void;
}

const payoutMethods = [
  { value: "PayPal", label: "PayPal" },
  { value: "Bank", label: "Bank Transfer" },
];

const PayoutRequestForm: React.FC<Props> = ({ accountId, onSuccess }) => {
  const [method, setMethod] = useState<"PayPal" | "Bank">("PayPal");
  const [accountHolder, setAccountHolder] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await submitPayoutRequest({
        challengeId: accountId,
        method,
        accountHolder,
        details,
      });
      onSuccess();
    } catch (err) {
      setError("Failed to submit payout request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Payout Method</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as "PayPal" | "Bank")}
          className="input"
        >
          {payoutMethods.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Account Holder Name</label>
        <input
          type="text"
          value={accountHolder}
          onChange={(e) => setAccountHolder(e.target.value)}
          className="input"
          required
        />
      </div>
      <div>
        <label>Details (PayPal email or bank info)</label>
        <input
          type="text"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="input"
          required
        />
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Submitting..." : "Submit Payout Request"}
      </button>
    </form>
  );
};

export default PayoutRequestForm;
