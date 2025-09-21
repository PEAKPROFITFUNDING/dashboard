import { XCircle } from "lucide-react";
import Button from "../../../../../components/ui/button/Button";

type KYCRejectedProps = {
  rejectionReason: string;
  onResubmit: () => void;
};

export const KYCRejected: React.FC<KYCRejectedProps> = ({
  rejectionReason,
  onResubmit,
}) => (
  <div className="flex flex-col flex-1">
    <div className="flex flex-col justify-center flex-1 w-full mx-auto">
      <div className="rounded-xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] p-8 transition-all duration-200">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>

          <h1 className="mb-4 font-semibold text-gray-800 text-2xl dark:text-white/90 sm:text-3xl">
            KYC Verification Rejected
          </h1>

          <div className="p-6 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
            <p className="text-lg text-red-800 dark:text-red-300 font-medium mb-2">
              Unfortunately, your KYC submission was rejected.
            </p>
            <p className="text-sm text-red-700 dark:text-red-400">
              <strong>Reason:</strong> {rejectionReason}
            </p>
          </div>

          <div className="mt-6">
            <Button onClick={onResubmit} size="sm">
              Resubmit KYC Application
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
