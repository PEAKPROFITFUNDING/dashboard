import { Shield } from "lucide-react";
import Button from "../../../../components/ui/button/Button";

const KYCCard = () => {
  const handleCompleteKYC = () => {
    console.log("Redirecting to KYC verification...");
  };

  return (
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
        To unlock all features, including withdrawals, please complete your KYC
        verification.
      </p>

      <Button
        onClick={handleCompleteKYC}
        className="w-full font-semibold bg-gray-900 hover:text-white hover:bg-gray-800 border-white dark:bg-white dark:text-gray-900 dark:border-gray-700 dark:hover:bg-gray-300"
      >
        <Shield className="w-4 h-4 mr-2" />
        Complete KYC
      </Button>
    </div>
  );
};

export default KYCCard;
