import Button from "../../../../../components/ui/button/Button";

// Available Balance Card Component
export function AvailableBalanceCard({
  balance,
  onRequestPayout,
}: {
  balance: number;
  onRequestPayout: () => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] p-8 transition-all duration-200 hover:shadow-lg">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Available Balance
        </h2>
        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          ${balance.toLocaleString()}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
          Earnings available for withdrawal
        </p>
        <Button
          variant="primary"
          size="md"
          onClick={onRequestPayout}
          className="px-8"
        >
          Request Payout
        </Button>
      </div>
    </div>
  );
}
