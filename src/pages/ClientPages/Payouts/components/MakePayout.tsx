import { useState } from "react";
import { TrendingUp, Shield, Calendar, DollarSign } from "lucide-react";
import Input from "../../../../components/form/input/InputField";
import Select from "../../../../components/form/Select";
import Button from "../../../../components/ui/button/Button";

export default function MakePayout() {
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("");

  const availableBalance = 10250.0;
  const pendingProfits = 1500.0;
  const nextPayoutDate = "Sep 25, 2025";

  const payoutMethods = [
    { value: "PAYPAL", label: "PayPal" },
    { value: "BANK_ACCOUNT", label: "Bank Account" },
    { value: "WIRE_TRANSFER", label: "Wire Transfer" },
    { value: "CRYPTOCURRENCY", label: "Cryptocurrency" },
  ];

  const handleRequestPayout = () => {
    if (!payoutAmount || !payoutMethod) {
      alert("Please enter amount and select a payout method");
      return;
    }
    console.log("Requesting payout:", {
      amount: payoutAmount,
      method: payoutMethod,
    });
  };

  const handleCompleteKYC = () => {
    console.log("Redirecting to KYC verification...");
  };

  return (
    <div className="mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Payout Card */}
        <div className="lg:col-span-2 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                Available for Payout
              </h3>
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                $
                {availableBalance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                Next payout date:
              </p>
              <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">{nextPayoutDate}</span>
              </div>
            </div>
          </div>

          {/* Payout Form */}
          <div className="space-y-6">
            {/* Payout Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Payout Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-lg z-10">
                  $
                </span>
                <Input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder="0.00"
                  step={0.01}
                />
              </div>
            </div>

            {/* Payout Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Payout Method
              </label>
              <Select
                options={payoutMethods}
                placeholder="Select a payout method"
                onChange={setPayoutMethod}
              />
            </div>

            {/* Request Button */}
            <Button
              onClick={handleRequestPayout}
              className="w-full h-14"
              size="md"
              variant="primary"
              disabled={!payoutAmount || !payoutMethod}
              startIcon={<DollarSign className="w-5 h-5" />}
            >
              Request Payout
            </Button>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Pending Profits Card */}
          <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl shadow-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="text-gray-900 dark:text-white font-medium">
                  Pending Profits
                </h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Pending from last trading cycle
                </p>
              </div>
            </div>

            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
              $
              {pendingProfits.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>

          {/* KYC Verification Card */}
          <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl shadow-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h4 className="text-gray-900 dark:text-white font-medium">
                  Verify KYC
                </h4>
              </div>
            </div>

            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
              To unlock all features, including withdrawals, please complete
              your KYC verification.
            </p>

            <Button
              onClick={handleCompleteKYC}
              className="w-full font-semibold bg-gray-900 hover:text-white hover:bg-gray-800 border-white dark:bg-white dark:text-gray-900 dark:border-gray-700 dark:hover:bg-gray-300"
            >
              <Shield className="w-4 h-4 mr-2" />
              Complete KYC
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
