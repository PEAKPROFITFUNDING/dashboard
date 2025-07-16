import { useState } from "react";
import Badge from "../../../../../../components/ui/badge/Badge";
import { Dropdown } from "../../../../../../components/ui/dropdown/Dropdown";
import { EllipsisVertical } from "lucide-react";
import { AffiliateDetails } from "./types";

interface ProfileCardProps {
  affiliate: AffiliateDetails;
  onOpenConfirmationModal: (action: "activate" | "deactivate") => void;
}

export default function ProfileCard({
  affiliate,
  onOpenConfirmationModal,
}: ProfileCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      case "pending":
        return "warning";
      default:
        return "primary";
    }
  };

  const copyReferralLink = () => {
    const referralLink = `https://peakprofit.com/ref/${affiliate.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  return (
    <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 overflow-hidden rounded-full bg-brand-500 flex items-center justify-center">
          <span className="text-white font-bold text-2xl">
            {affiliate.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {affiliate.fullName}
            </h1>
            <Badge size="md" color={getStatusColor(affiliate.status)}>
              {affiliate.status.charAt(0).toUpperCase() +
                affiliate.status.slice(1)}
            </Badge>
            <div className="relative ml-auto">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="dropdown-toggle p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <EllipsisVertical />
              </button>
              <Dropdown
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                className="w-48"
              >
                <div className="p-2">
                  {affiliate.status === "active" ? (
                    <button
                      onClick={() => onOpenConfirmationModal("deactivate")}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenConfirmationModal("activate")}
                      className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    >
                      Activate
                    </button>
                  )}
                </div>
              </Dropdown>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Email:</span>
              <p className="text-gray-900 dark:text-white font-medium">
                {affiliate.email}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Phone:</span>
              <p className="text-gray-900 dark:text-white font-medium">
                {affiliate.phone}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">
                Joined Date:
              </span>
              <p className="text-gray-900 dark:text-white font-medium">
                {new Date(affiliate.joinedDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">
                Referral Code:
              </span>
              <p className="text-gray-900 dark:text-white font-medium">
                {affiliate.referralCode}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">
                Referral Link:
              </span>
              <div className="flex items-center gap-2">
                <p className="text-gray-900 dark:text-white font-medium truncate">
                  https://peakprofit.com/ref/{affiliate.referralCode}
                </p>
                <button
                  onClick={copyReferralLink}
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 text-xs flex items-center gap-1"
                >
                  {copiedReferral ? (
                    <span className="text-green-500">Copied!</span>
                  ) : (
                    <span>Copy</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
