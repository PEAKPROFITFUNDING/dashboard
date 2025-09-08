import { useState } from "react";
import Badge from "../../../../../components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../../components/ui/table";
import { Modal } from "../../../../../components/ui/modal";

interface AffiliateReferralListProps {
  referrals: Array<{
    id: string;
    fullName: string;
    email: string;
    signUpDate: string;
    totalCommission: number;
    currentStatus: string;
    steps: Array<{
      id: string;
      type: string;
      title: string;
      date: string;
      status: string;
      details;
    }>;
  }>;
}

export default function AffiliateReferralList({
  referrals,
}: AffiliateReferralListProps) {
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        return "success";
      case "active_trader":
        return "success";
      case "signed_up":
        return "info";
      case "pending":
        return "primary";
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

  const openModal = (referral) => {
    setSelectedReferral(referral);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReferral(null);
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
          <div className="grid grid-cols-2 gap-4 text-sm">
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
              <span className="text-gray-500 dark:text-gray-400">
                Completed:
              </span>
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

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Your Referrals
      </h2>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Total Commission
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Sign Up Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {referrals.map((referral) => (
                <TableRow
                  key={referral.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="px-5 py-4 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {referral.fullName}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {referral.email}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-start">
                    <div className="font-medium text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(referral.totalCommission)}
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {referral.signUpDate
                      ? formatDate(referral.signUpDate)
                      : "-"}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                      color={getStatusBadgeColor(referral.currentStatus)}
                    >
                      {getStatusLabel(referral.currentStatus)}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-start">
                    <button
                      onClick={() => openModal(referral)}
                      className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-200 hover:border-blue-300 dark:border-blue-800 dark:hover:border-blue-700 rounded-lg transition-colors"
                    >
                      Show Progress
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {referrals.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600 text-lg mb-2">
            No referrals yet
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            Share your referral link to start earning commissions
          </div>
        </div>
      )}

      {/* Progress Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        className="max-w-2xl mx-4"
      >
        {selectedReferral && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                {selectedReferral.fullName}'s Progress
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span>{selectedReferral.email}</span>
                <span>•</span>
                <Badge
                  size="sm"
                  color={getStatusBadgeColor(selectedReferral.currentStatus)}
                >
                  {getStatusLabel(selectedReferral.currentStatus)}
                </Badge>
              </div>
              <div className="mt-2 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                Total Commission:{" "}
                {formatCurrency(selectedReferral.totalCommission)}
              </div>
            </div>

            {/* Progress Steps */}
            <div className="space-y-6 max-h-[70vh] overflow-y-auto">
              {selectedReferral.steps.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 dark:text-gray-600 text-lg mb-2">
                    No progress yet
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">
                    This referral hasn't taken any action yet
                  </div>
                </div>
              ) : (
                selectedReferral.steps.map((step, index) => (
                  <div key={step.id} className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      {getStepIcon(step, index)}
                      {index < selectedReferral.steps.length - 1 && (
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
        )}
      </Modal>
    </div>
  );
}
