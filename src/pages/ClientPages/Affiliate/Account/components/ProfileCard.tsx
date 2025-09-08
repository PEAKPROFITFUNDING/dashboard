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

export default function ProfileCard({ affiliate }: ProfileCardProps) {
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
    <div className="bg-white dark:border-white/[0.05] dark:bg-white/[0.03] rounded-xl shadow-lg border border-gray-200  overflow-hidden">
      <div className="p-8">
        {/* Header with Avatar and Basic Info */}
        <div className="flex items-start space-x-6 mb-8">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {getInitials(affiliate.fullName)}
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {affiliate.fullName}
              </h2>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTierColor(
                  affiliate.tier
                )}`}
              >
                {affiliate.tier}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
                <span className="font-medium">Email:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {affiliate.email}
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6v14l-6-6V7z"
                  />
                </svg>
                <span className="font-medium">Joined Date:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {formatDate(affiliate.joinedDate)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Information */}
        <div className="space-y-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
              />
            </svg>
            <span className="font-medium">Referral Code:</span>
            <span className="ml-2 text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {affiliate.referralCode}
            </span>
          </div>

          <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
            <svg
              className="w-4 h-4 mr-2 mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <div className="flex-1">
              <span className="font-medium block mb-1">Referral Link:</span>
              <div className="flex items-center space-x-2">
                <span className="text-gray-900 dark:text-white break-all bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded font-mono text-xs">
                  {affiliate.referralLink}
                </span>
                <button
                  onClick={copyReferralLink}
                  className={`px-3 py-2 text-xs font-medium rounded transition-colors ${
                    copiedReferral
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                  }`}
                >
                  {copiedReferral ? (
                    <>
                      <svg
                        className="w-3 h-3 mr-1 inline"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3 h-3 mr-1 inline"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copy
                    </>
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
