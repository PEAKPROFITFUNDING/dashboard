import { useState } from "react";
import { MoreVertical, Edit } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { Modal } from "../ui/modal";
import { getTierColor } from "../../utils/getTierColor";

interface ProfileCardProps {
  affiliate: {
    _id?: string; // Add this for admin functionality
    fullName: string;
    email: string;
    joinedDate: string;
    referralCode: string;
    referralLink: string;
    tier: string;
    totalEarnings: number;
    balance: number;
    commissionPercentage: number;
    totalReferrals: number;
    totalWithdrawn: number;
  };
  isAdmin?: boolean;
  onCommissionUpdate?: (newPercentage: number) => void;
}

export default function AffiliateProfileCard({
  affiliate,
  isAdmin = false,
  onCommissionUpdate,
}: ProfileCardProps) {
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newCommissionPercentage, setNewCommissionPercentage] = useState(
    affiliate.commissionPercentage.toString()
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(affiliate.referralLink);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  
  const handleEditCommission = () => {
    setDropdownOpen(false);
    setEditModalOpen(true);
    setNewCommissionPercentage(affiliate.commissionPercentage.toString());
  };

  const handleCommissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliate._id) return setErrorMessage("Affiliate ID is missing");

    const percentage = parseFloat(newCommissionPercentage);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      return setErrorMessage("Enter a valid commission % between 0 and 100");
    }

    setIsUpdating(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await axiosInstance.put(`/admin/platinumAffiliate/${affiliate._id}`, {
        commissionPercentage: percentage,
      });

      if (onCommissionUpdate) onCommissionUpdate(percentage);

      setSuccessMessage("Commission updated successfully!");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to update commission. Try again."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const isPlatinum = affiliate.tier.toLowerCase() === "platinum";

  return (
    <div className="bg-white dark:border-white/[0.05] dark:bg-white/[0.03] rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6 sm:p-8 relative">
        {/* Admin Menu */}
        {isAdmin && (
          <div className="absolute top-4 right-4 ">
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="dropdown-toggle p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>

              <Dropdown
                isOpen={dropdownOpen}
                onClose={() => setDropdownOpen(false)}
                className="w-60"
              >
                <div className="">
                  <button
                    onClick={handleEditCommission}
                    disabled={!isPlatinum}
                    className={`w-full px-4 py-2 text-left text-sm flex rounded-lg items-center space-x-2 transition-colors ${
                      isPlatinum
                        ? "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                        : "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <Edit className="w-4 h-4" />
                    <div className="flex flex-col">
                      <span>Edit Commission %</span>
                      {!isPlatinum && (
                        <span className="text-xs">(Platinum only)</span>
                      )}
                    </div>
                  </button>
                </div>
              </Dropdown>
            </div>
          </div>
        )}

        {/* Header with Avatar and Basic Info */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6 mb-6 sm:mb-8">
          <div className="flex-shrink-0 flex justify-center sm:justify-start mb-4 sm:mb-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl sm:text-2xl font-bold">
                {getInitials(affiliate.fullName)}
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex flex-col items-center sm:flex-row sm:items-center sm:space-x-3 mb-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {affiliate.fullName}
              </h2>
              <span
                className={`inline-flex w-fit items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 sm:mt-0 ${getTierColor(
                  affiliate.tier
                )}`}
              >
                {affiliate.tier}
              </span>
            </div>

            <div className="space-y-2 text-sm sm:text-base">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  Email:
                </span>
                <span className="text-gray-900 dark:text-white break-all">
                  {affiliate.email}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  Joined:
                </span>
                <span className="text-gray-900 dark:text-white">
                  {formatDate(affiliate.joinedDate)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Information */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 text-sm sm:text-base">
            <span className="font-medium text-gray-600 dark:text-gray-300">
              Referral Code:
            </span>
            <span className="mt-1 sm:mt-0 text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded break-all">
              {affiliate.referralCode}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-2 text-sm sm:text-base">
            <span className="font-medium text-gray-600 dark:text-gray-300">
              Referral Link:
            </span>
            <div className="flex-1 mt-1 sm:mt-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                <span className="text-gray-900 dark:text-white break-all bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded font-mono text-xs sm:text-sm">
                  {affiliate.referralLink}
                </span>
                <button
                  onClick={copyReferralLink}
                  className={`mt-2 sm:mt-0 px-3 py-2 text-xs sm:text-sm font-medium rounded transition-colors ${
                    copiedReferral
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                  }`}
                >
                  {copiedReferral ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Commission Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        className="max-w-md mx-4"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Edit Commission Percentage
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            Update the commission percentage for {affiliate.fullName}
          </p>

          <form onSubmit={handleCommissionSubmit}>
            <div className="mb-4">
              <label
                htmlFor="commissionPercentage"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Commission Percentage
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="commissionPercentage"
                  value={newCommissionPercentage}
                  onChange={(e) => setNewCommissionPercentage(e.target.value)}
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                  disabled={isUpdating}
                />
                <span className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400">
                  %
                </span>
              </div>
            </div>

            {/* Feedback Messages */}
            {isUpdating && (
              <div className="text-sm text-blue-600 dark:text-blue-400 mb-4">
                Updating commission...
              </div>
            )}
            {!isUpdating && successMessage && (
              <div className="text-sm text-green-600 dark:text-green-400 mb-4">
                {successMessage}
              </div>
            )}
            {!isUpdating && errorMessage && (
              <div className="text-sm text-red-600 dark:text-red-400 mb-4">
                {errorMessage}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
