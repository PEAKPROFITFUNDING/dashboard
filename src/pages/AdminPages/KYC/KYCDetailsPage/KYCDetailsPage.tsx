import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  X,
  Calendar,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { Image } from "antd";
import axiosInstance from "../../../../api/axiosInstance";
import Button from "../../../../components/ui/button/Button";
import Badge from "../../../../components/ui/badge/Badge";
import { ConfirmationModal } from "../../../../components/ConfirmationModal";
import { Modal } from "../../../../components/ui/modal";
import Label from "../../../../components/form/Label";
import { useKYCAdmin } from "../../../../context/admin/KYCAdminContext";

const KYCDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const {
    applications,
    loading,
    error,
    fetchApplications: fetchKYCApplications,
  } = useKYCAdmin();

  const application = applications?.find((app) => app._id === id);

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id || !applications) {
      fetchKYCApplications(undefined, undefined, undefined, true);
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getUserInitials = (name: string) => {
    return name
      ?.split(" ")
      ?.map((n) => n[0])
      ?.join("")
      ?.slice(0, 2)
      ?.toUpperCase();
  };

  const getBadgeColor = (status: string): "warning" | "success" | "error" => {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "warning";
    }
  };

  const handleApprove = () => {
    setActionType("approve");
    setShowConfirmModal(true);
  };

  const handleReject = () => {
    setActionType("reject");
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (actionType === "reject") {
      setShowConfirmModal(false);
      setShowRejectModal(true);
      return;
    }

    // Handle approve action
    await performAction("approved");
  };

  const handleRejectWithReason = async () => {
    if (!rejectionReason.trim()) {
      return; // Don't proceed without reason
    }
    await performAction("rejected", rejectionReason);
  };

  const performAction = async (
    status: "approved" | "rejected",
    reason?: string
  ) => {
    try {
      setActionLoading(true);

      const payload: any = { status };
      if (reason) {
        payload.rejectionReason = reason;
      }

      await axiosInstance.put(`/admin/reviewKYCApplication/${id}`, payload);

      // Refresh the application data
      await fetchKYCApplications(undefined, undefined, undefined, true);

      // Close modals and reset state
      setShowConfirmModal(false);
      setShowRejectModal(false);
      setRejectionReason("");
      setActionType(null);
    } catch (err) {
      console.error("Error updating KYC status:", err);
      //   setError(err.response?.data?.message || "Failed to update KYC status");
    } finally {
      setActionLoading(false);
    }
  };

  const getImageUrl = (filename: string) => {
    // Assuming images are served from a specific endpoint
    return `${import.meta.env.VITE_API_BASE_URL}/uploads/${filename}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
          <span className="text-gray-600 dark:text-gray-400">
            Loading application...
          </span>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Application Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error || "The KYC application you're looking for doesn't exist."}
          </p>
          <Link to={"/kyc/applications"}>
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Applications
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          {/* <Button
            onClick={() => navigate("/admin/kyc")}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Applications
          </Button> */}

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                KYC Application Details
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Review and manage identity verification
              </p>
            </div>
            <Badge
              color={getBadgeColor(application.status)}
              variant="light"
              size="md"
            >
              {application.status.charAt(0).toUpperCase() +
                application.status.slice(1)}
            </Badge>
          </div>
          {application.status === "rejected" && application.rejectionReason && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-red-900 dark:text-red-200">
                    Rejection Reason:
                  </h3>
                  <p className="text-red-800 dark:text-red-300">
                    {application.rejectionReason}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Information */}
            <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium text-lg">
                  {getUserInitials(application.user.name)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {application.user.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {application.user.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Social Security
                    </p>
                    <p className="font-medium font-mono text-gray-900 dark:text-white">
                      {application.socials}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Images */}
            <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Identity Documents
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Front Side
                  </h4>

                  <Image
                    src={application.idFrontImage}
                    alt="ID Front Side"
                    className="w-full max-h-48 object-cover border-gray-200 dark:border-white/[0.05] border rounded-lg"
                    preview={{
                      mask: (
                        <div className="flex items-center justify-center text-white ">
                          <span>Click to preview</span>
                        </div>
                      ),
                    }}
                  />
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Back Side
                  </h4>
                  <Image
                    src={application.idBackImage}
                    alt="ID Back Side"
                    className="w-full max-h-48 object-top border-gray-200 dark:border-white/[0.05] border rounded-lg"
                    preview={{
                      mask: (
                        <div className="flex items-center justify-center text-white">
                          <span>Click to preview</span>
                        </div>
                      ),
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Rejection Reason (if rejected) */}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Timeline */}
            <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Timeline
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 dark:text-white">
                      Applied
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

            {/* Actions */}
            {application.status === "pending" && (
              <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Actions
                </h3>

                <div className="space-y-3">
                  <Button
                    onClick={handleApprove}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    startIcon={<Check className="w-4 h-4" />}
                  >
                    Approve Application
                  </Button>

                  <Button
                    onClick={handleReject}
                    variant="outline"
                    className="w-full border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                    startIcon={<X className="w-4 h-4" />}
                  >
                    Reject Application
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => {
            setShowConfirmModal(false);
            setActionType(null);
          }}
          onConfirm={handleConfirmAction}
          title={
            actionType === "approve"
              ? "Approve Application"
              : "Reject Application"
          }
          message={
            actionType === "approve"
              ? "Are you sure you want to approve this KYC application? This will grant the user full platform access."
              : "Are you sure you want to reject this KYC application? You will need to provide a reason for rejection."
          }
          confirmText={actionType === "approve" ? "Approve" : "Continue"}
          isDestructive={actionType === "reject"}
        />

        {/* Rejection Reason Modal */}
        <Modal
          isOpen={showRejectModal}
          onClose={() => {
            setShowRejectModal(false);
            setRejectionReason("");
          }}
          className="max-w-md w-full p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Rejection Reason
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Please provide a reason for rejecting this application. This will be
            shown to the user.
          </p>

          <div className="mb-6">
            <Label className="mb-2">Reason for Rejection *</Label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter the reason for rejection..."
              className="w-full h-24 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 dark:bg-gray-900 dark:border-white/[0.05] dark:text-white resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              onClick={() => {
                setShowRejectModal(false);
                setRejectionReason("");
              }}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectWithReason}
              disabled={!rejectionReason.trim() || actionLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {actionLoading ? "Rejecting..." : "Reject Application"}
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default KYCDetailsPage;
