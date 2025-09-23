import React, { useState, useEffect } from "react";
import { Image } from "antd"; // Assuming you're using Ant Design
import { Calendar, AlertCircle, Check, X } from "lucide-react"; // Assuming you're using lucide-react
import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import KYCForm from "./components/KYCForm";
import { KYCPending } from "./components/KYCPending";
import { KYCApproved } from "./components/KYCApproved";
import { KYCRejected } from "./components/KYCRejected";
import { useUser } from "../../../../context/UserContext";
import axiosInstance from "../../../../api/axiosInstance";
import Badge from "../../../../components/ui/badge/Badge";
import LoadingSpinner from "../../../../components/LoadingSpinner";

const KYC = () => {
  const { kyc } = useUser();
  const [showResubmitForm, setShowResubmitForm] = useState(false);
  const [kycData, setKycData] = useState(null);
  const [loading, setLoading] = useState(true);

  const showKYCForm = !kyc || showResubmitForm;

  const fetchKYCStatus = async () => {
    try {
      const response = await axiosInstance.get("/kyc/status");
      setKycData(response.data.result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching KYC status:", error);
      setLoading(false);
    }
  };

  // Fetch KYC status and history
  useEffect(() => {
    fetchKYCStatus();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function to get badge color based on status
  const getBadgeColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      default:
        return "light"; // fallback for unknown statuses
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageMeta title="KYC" description="Peak Profit User KYC" />
      <PageBreadcrumb pageTitle="KYC" />

      {showKYCForm && (
        <KYCForm
          setShowResubmitForm={setShowResubmitForm}
          fetchKYCStatus={fetchKYCStatus}
        />
      )}

      {kyc?.status === "pending" && <KYCPending />}

      {kyc?.status === "approved" && <KYCApproved />}

      {kyc?.status === "rejected" && !showResubmitForm && (
        <KYCRejected
          rejectionReason={kyc.rejectionReason || "Your KYC was rejected."}
          onResubmit={() => setShowResubmitForm(true)}
        />
      )}

      {/* KYC History Section */}
      {kycData && !showKYCForm && (
        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              KYC Application History
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Review your previous KYC submissions and their status
            </p>
          </div>

          {/* Submission Stats */}
          <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Submission Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    {kycData.submissionStats.totalSubmissions}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Submissions
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {kycData.submissionStats.totalSubmissions}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 font-semibold">
                    {kycData.submissionStats.submissionsLeft}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Submissions Left
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {kycData.submissionStats.submissionsLeft}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    kycData.submissionStats.canResubmit
                      ? "bg-green-100 dark:bg-green-900/20"
                      : "bg-red-100 dark:bg-red-900/20"
                  }`}
                >
                  <span className="font-semibold">
                    {kycData.submissionStats.canResubmit ? (
                      <Check className="text-green-600 dark:text-green-400 h-4 w-4" />
                    ) : (
                      <X className="text-red-600 dark:text-red-400 h-4 w-4" />
                    )}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Can Resubmit
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {kycData.submissionStats.canResubmit ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Applications List */}
          <div className="space-y-6">
            {kycData.kycHistory.map((application, index) => (
              <div
                key={application._id}
                className={`bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] p-6 ${
                  index === 0 ? "ring-2 ring-blue-500/20" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Application #{kycData.kycHistory.length - index}
                      </h3>
                      {index === 0 && (
                        <Badge color="info" size="sm">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Submitted on {formatDate(application.createdAt)}
                    </p>
                  </div>
                  <Badge color={getBadgeColor(application.status)} size="sm">
                    {application.status.charAt(0).toUpperCase() +
                      application.status.slice(1)}
                  </Badge>
                </div>

                {/* Rejection Reason */}
                {application.status === "rejected" &&
                  application.rejectionReason && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-red-900 dark:text-red-200 mb-1">
                            Rejection Reason:
                          </h4>
                          <p className="text-red-800 dark:text-red-300">
                            {application.rejectionReason}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Application Details */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                        Personal Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Date of Birth
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {formatDate(application.dateOfBirth)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Document Images */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                        Identity Documents
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            Front Side
                          </p>
                          <Image
                            src={application.idFrontImageUrl}
                            alt="ID Front Side"
                            className="w-full h-32 w-32 object-cover border-gray-200 dark:border-white/[0.05] border rounded-lg"
                            preview={{
                              mask: (
                                <div className="flex items-center justify-center text-white">
                                  <span className="text-sm">
                                    Click to preview
                                  </span>
                                </div>
                              ),
                            }}
                          />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            Back Side
                          </p>
                          <Image
                            src={application.idBackImageUrl}
                            alt="ID Back Side"
                            className="w-full h-32 object-cover border-gray-200 dark:border-white/[0.05] border rounded-lg"
                            preview={{
                              mask: (
                                <div className="flex items-center justify-center text-white">
                                  <span className="text-sm">
                                    Click to preview
                                  </span>
                                </div>
                              ),
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Timeline
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="text-sm">
                          <p className="font-medium text-gray-900 dark:text-white">
                            Submitted
                          </p>
                          <p className="text-gray-500 dark:text-gray-400">
                            {formatDate(application.createdAt)}
                          </p>
                        </div>
                      </div>

                      {application.status !== "pending" && (
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              application.status === "approved"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                          <div className="text-sm">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {application.status === "approved"
                                ? "Approved"
                                : "Rejected"}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">
                              {formatDate(application.updatedAt)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default KYC;
