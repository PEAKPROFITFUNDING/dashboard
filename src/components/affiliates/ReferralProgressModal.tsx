import Badge from "../ui/badge/Badge";
import { Modal } from "../ui/modal";

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  referral: {
    fullName: string;
    email: string;
    currentStatus: string;
    totalCommission: number;
    steps: Array<{
      id: string;
      type: string;
      title: string;
      date: string;
      status: string;
      details;
    }>;
  };
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "completed":
    case "active_trader":
      return "success";
    case "signed_up":
      return "info";
    case "pending":
    default:
      return "primary";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "completed":
      return "Completed";
    case "active_trader":
      return "Active Trader";
    case "signed_up":
      return "Signed Up";
    case "pending":
      return "Pending";
    default:
      return "Unknown";
  }
};

const getStepIcon = (step, index: number) => {
  if (step.status === "completed") {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
        <svg
          className="h-4 w-4 text-green-600 dark:text-green-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  } else if (step.status === "active") {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
        <div className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
      </div>
    );
  } else {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {index + 1}
        </span>
      </div>
    );
  }
};

const renderStepDetails = (step) => {
  if (step.type === "signup") {
    return (
      <div className="space-y-2">
        <div className="text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Commission Earned:
          </span>
          <span className="ml-2 font-medium text-green-600 dark:text-green-400">
            {formatCurrency(step.details.commissionEarned || 0)}
          </span>
        </div>
      </div>
    );
  } else if (step.type === "challenge" && step.details.challenge) {
    const challenge = step.details.challenge;
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">
              Challenge Name:
            </span>
            <span className="ml-2 font-medium text-black dark:text-white">
              {challenge.name}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Price:</span>
            <span className="ml-2 font-medium text-black dark:text-white">
              {formatCurrency(challenge.price)}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Status:</span>
            <span className="ml-2">
              <Badge
                size="md"
                color={
                  challenge.status === "completed"
                    ? "success"
                    : challenge.status === "active"
                    ? "warning"
                    : "error"
                }
              >
                {challenge.status.charAt(0).toUpperCase() +
                  challenge.status.slice(1)}
              </Badge>
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">
              Commission:
            </span>
            <span className="ml-2 font-medium text-green-600 dark:text-green-400">
              {formatCurrency(challenge.commissionEarned)}
            </span>
          </div>
        </div>
        {challenge.completedDate && (
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400">Completed:</span>
            <span className="ml-2 font-medium text-black dark:text-white">
              {formatDate(challenge.completedDate)}
            </span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function ProgressModal({
  isOpen,
  onClose,
  referral,
}: ProgressModalProps) {
  if (!referral) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl mx-4">
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            {referral.fullName}'s Progress
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{referral.email}</span>
            <span className="hidden sm:inline">•</span>
            <Badge
              size="sm"
              color={getStatusBadgeColor(referral.currentStatus)}
            >
              {getStatusLabel(referral.currentStatus)}
            </Badge>
          </div>
          <div className="mt-2 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
            Total Commission: {formatCurrency(referral.totalCommission)}
          </div>
        </div>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          {referral.steps.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 dark:text-gray-600 text-lg mb-2">
                No progress yet
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                This referral hasn't taken any action yet
              </div>
            </div>
          ) : (
            referral.steps.map((step, index) => (
              <div key={step.id} className="flex items-start space-x-4">
                <div className="flex flex-col items-center">
                  {getStepIcon(step, index)}
                  {index < referral.steps.length - 1 && (
                    <div className="w-px h-12 bg-gray-200 dark:bg-gray-700 mt-2" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {step.title}
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(step.date)}
                    </span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    {renderStepDetails(step)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
