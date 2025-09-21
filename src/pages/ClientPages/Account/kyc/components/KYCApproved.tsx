import { ShieldCheck } from "lucide-react";

export const KYCApproved = () => (
  <div className="flex flex-col flex-1">
    <div className="flex flex-col justify-center flex-1 w-full mx-auto">
      <div className="rounded-xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] p-8 transition-all duration-200">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <ShieldCheck className="w-16 h-16 text-green-500" />
          </div>

          <h1 className="mb-4 font-semibold text-gray-800 text-2xl dark:text-white/90 sm:text-3xl">
            KYC Verification Approved
          </h1>

          <div className=" p-6 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
            <p className="text-lg text-green-800 dark:text-green-300 font-medium mb-2">
              Congratulations! 🎉 Your identity has been successfully verified.
            </p>
            <p className="text-sm text-green-700 dark:text-green-400">
              You now have access to all platform features including
              withdrawals.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
