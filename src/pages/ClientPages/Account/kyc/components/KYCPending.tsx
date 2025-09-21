import { Clock } from "lucide-react";

export const KYCPending = () => (
  <div className="flex flex-col flex-1">
    <div className="flex flex-col justify-center flex-1 w-full mx-auto">
      <div className="rounded-xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] p-8 transition-all duration-200">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Clock className="w-16 h-16 text-blue-600 dark:text-blue-400" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          <h1 className="mb-4 font-semibold text-gray-800 text-2xl dark:text-white/90 sm:text-3xl">
            KYC Application Under Review
          </h1>

          <div className="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
            <p className="text-lg text-blue-800 dark:text-blue-200 font-medium mb-2">
              Your KYC verification has been submitted successfully! 🎉
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Our compliance team is reviewing your documents. You will be
              notified via email once the process is complete. This typically
              takes 1–3 business days.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-white/[0.02] rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>What's next?</strong>
              <br />
              While you wait, make sure to check your email regularly for
              updates. If you have any questions, feel free to contact our
              support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
