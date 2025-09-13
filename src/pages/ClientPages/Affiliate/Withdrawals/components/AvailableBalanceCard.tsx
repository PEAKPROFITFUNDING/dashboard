import { useEffect, useState } from "react";
import Button from "../../../../../components/ui/button/Button";
import { AffiliateType } from "../../../../../types/Affiliates";

export function AvailableBalanceCard({
  affiliate,
  onRequestPayout,
}: {
  affiliate: AffiliateType;
  onRequestPayout: () => void;
}) {
  const [canWithdraw, setCanWithdraw] = useState(false);
  const [timer, setTimer] = useState("");
  const [nextWithdrawDate, setNextWithdrawDate] = useState<Date | null>(null);

  // const lastWithdrawDate = new Date(
  //   Date.now() - (7 * 24 * 60 * 60 * 1000 - 5 * 1000)
  // );

  const lastWithdrawDate = affiliate?.lastWithdrawDate;

  useEffect(() => {
    const updateTimer = () => {
      const lastDate = lastWithdrawDate ? new Date(lastWithdrawDate) : null;

      if (!lastDate) {
        setCanWithdraw(true);
        setTimer("");
        setNextWithdrawDate(null);
        return;
      }

      const nextDate = new Date(lastDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      setNextWithdrawDate(nextDate);

      const now = new Date();
      if (now >= nextDate) {
        setCanWithdraw(true);
        setTimer("");
      } else {
        setCanWithdraw(false);
        const diff = nextDate.getTime() - now.getTime();

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimer(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000); // update every second
    return () => clearInterval(interval);
  }, [affiliate?.lastWithdrawDate]);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] p-8 transition-all duration-200 hover:shadow-lg">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Available Balance
        </h2>
        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          ${affiliate?.balance.toLocaleString() || 0}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Earnings available for withdrawal
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Withdrawals can be made once every 7 days
        </p>

        {canWithdraw ? (
          <Button
            variant="primary"
            size="md"
            onClick={onRequestPayout}
            className="px-8"
          >
            Request Payout
          </Button>
        ) : (
          <div className="text-sm text-gray-700 dark:text-gray-300">
            You can withdraw in <span className="font-semibold">{timer}</span>
            {nextWithdrawDate && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                ({nextWithdrawDate.toLocaleString()})
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
