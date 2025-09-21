import {
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import Button from "../../../../components/ui/button/Button";
import { useUser } from "../../../../context/UserContext";

const KYCCard = () => {
  const { kyc } = useUser();

  const handleCompleteKYC = () => {
    console.log("Redirecting to KYC verification...");
  };

  const handleResubmitKYC = () => {
    console.log("Redirecting to KYC resubmission...");
  };

  // No KYC submitted yet
  if (!kyc) {
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
          To unlock all features, including withdrawals, please complete your
          KYC verification.
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
  }

  // KYC is pending
  if (kyc.status === "pending") {
    return (
      <div className="bg-white dark:bg-white/[0.03] border border-blue-200 dark:border-blue-800/50 rounded-xl shadow-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="text-gray-900 dark:text-white font-medium">
              KYC Under Review
            </h4>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mt-1">
              Pending
            </span>
          </div>
        </div>

        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed">
          Your KYC verification is currently being reviewed by our team. This
          process typically takes 1-3 business days.
        </p>

        <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
          <Clock className="w-4 h-4" />
          <span>Review in progress...</span>
        </div>
      </div>
    );
  }

  // KYC is approved
  if (kyc.status === "approved") {
    return (
      <div className="bg-white dark:bg-white/[0.03] border border-green-200 dark:border-green-800/50 rounded-xl shadow-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h4 className="text-gray-900 dark:text-white font-medium">
              KYC Verified
            </h4>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mt-1">
              Approved
            </span>
          </div>
        </div>

        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed">
          Congratulations! Your identity has been successfully verified. You now
          have access to all platform features including withdrawals.
        </p>

        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <CheckCircle className="w-4 h-4" />
          <span>Identity verified</span>
        </div>
      </div>
    );
  }

  // KYC is rejected
  if (kyc.status === "rejected") {
    return (
      <div className="bg-white dark:bg-white/[0.03] border border-red-200 dark:border-red-800/50 rounded-xl shadow-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h4 className="text-gray-900 dark:text-white font-medium">
              KYC Rejected
            </h4>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 mt-1">
              Rejected
            </span>
          </div>
        </div>

        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed">
          Your KYC verification was not approved. Please review the reason below
          and resubmit with corrected information.
        </p>

        {kyc.rejectionReason && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                  Rejection Reason:
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {kyc.rejectionReason}
                </p>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={handleResubmitKYC}
          className="w-full font-semibold bg-red-600 hover:bg-red-700 text-white border-red-600 dark:bg-red-600 dark:hover:bg-red-700 dark:border-red-600"
        >
          <Shield className="w-4 h-4 mr-2" />
          Resubmit KYC
        </Button>
      </div>
    );
  }

  // Fallback for unknown status
  return (
    <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl shadow-lg p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </div>
        <div>
          <h4 className="text-gray-900 dark:text-white font-medium">
            KYC Status Unknown
          </h4>
        </div>
      </div>

      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
        There seems to be an issue with your KYC status. Please contact support
        for assistance.
      </p>

      <Button
        onClick={handleCompleteKYC}
        className="w-full font-semibold bg-gray-900 hover:text-white hover:bg-gray-800 border-white dark:bg-white dark:text-gray-900 dark:border-gray-700 dark:hover:bg-gray-300"
      >
        <Shield className="w-4 h-4 mr-2" />
        Contact Support
      </Button>
    </div>
  );
};

export default KYCCard;
