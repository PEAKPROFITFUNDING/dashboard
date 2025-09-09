import { useState } from "react";

interface ProfileCardProps {
  affiliate: {
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
}

export default function AffiliateProfileCard({ affiliate }: ProfileCardProps) {
  const [copiedReferral, setCopiedReferral] = useState(false);

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

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "bronze":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      case "silver":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      case "gold":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "platinum":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  return (
    <div className="bg-white dark:border-white/[0.05] dark:bg-white/[0.03] rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6 sm:p-8">
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
    </div>
  );
}
