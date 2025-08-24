import { useState } from "react";

interface ProfileCardProps {
  affiliate;
}

export default function ProfileCard({ affiliate }: ProfileCardProps) {
  const [copiedReferral, setCopiedReferral] = useState(false);

  const copyReferralLink = () => {
    const referralLink = `https://peakprofit.com/ref/${affiliate.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  return (
    <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex sm:items-center gap-6 flex-col sm:flex-row">
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
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
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
