import React, { useState, useEffect } from "react";
import Label from "../../../../../components/form/Label";
import Input from "../../../../../components/form/input/InputField";
import Button from "../../../../../components/ui/button/Button";
import axiosInstance from "../../../../../api/axiosInstance";
import { Handshake, Clock } from "lucide-react";
import { useUser } from "../../../../../context/UserContext";
import useFetchUser from "../../../../../hooks/useFetchUser";
import { useNavigate } from "react-router";

const BecomeAffiliateForm = () => {
  const { userName, userEmail, affiliateStatus } = useUser();
  const { refetchUser } = useFetchUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: userName || "",
    email: userEmail || "",
    strategy: "",
    socialMediaLink: "",
    websiteLink: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Keep formData in sync with user context if it changes
  useEffect(() => {
    if (affiliateStatus === "accepted") {
      navigate("/affiliate/account");
    }
    setFormData((prev) => ({
      ...prev,
      name: userName || prev.name,
      email: userEmail || prev.email,
    }));
  }, [userName, userEmail, affiliateStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post("/affiliate/apply", formData);
      refetchUser();

      setSuccess("Your affiliate application has been submitted successfully!");
      setFormData({
        name: userName || "",
        email: userEmail || "",
        strategy: "",
        socialMediaLink: "",
        websiteLink: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (affiliateStatus === "pending") {
    return (
      <div className="flex flex-col flex-1">
        <div className="flex flex-col justify-center flex-1 w-full mx-auto">
          <div className="rounded-xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] p-8 transition-all duration-200">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <Clock className="w-16 h-16 text-yellow-500" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              <h1 className="mb-4 font-semibold text-gray-800 text-2xl dark:text-white/90 sm:text-3xl">
                Application Under Review
              </h1>

              <div className="mb-6 p-6 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-800">
                <p className="text-lg text-yellow-800 dark:text-yellow-300 font-medium mb-2">
                  Your affiliate request has been submitted successfully! 🎉
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  Our team is currently reviewing your application. You will be
                  notified via email once the review process is complete. This
                  typically takes 2-3 business days.
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
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full mx-auto">
        <div className="rounded-xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] p-8 transition-all duration-200">
          <div className="mb-5 sm:mb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Handshake className="w-14 h-14 text-brand-600 dark:text-brand-400" />
            </div>
            <h1 className="mb-2 font-semibold text-gray-800 text-2xl dark:text-white/90 sm:text-3xl">
              Become an Affiliate
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Join our affiliate program and start earning commissions!
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-400">
                {success}
              </p>
            </div>
          )}

          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Label>
                      Name <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!!userName}
                    />
                  </div>

                  <div>
                    <Label>
                      Email <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!!userEmail}
                    />
                  </div>
                </div>

                {/* Marketing Strategy (Full Width) */}
                <div>
                  <Label>
                    Marketing Strategy <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="strategy"
                    placeholder="e.g., Content marketing and paid ads"
                    value={formData.strategy}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Social Media and Website Links Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Label>
                      Social Media Link{" "}
                      <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="url"
                      name="socialMediaLink"
                      placeholder="https://twitter.com/yourusername"
                      value={formData.socialMediaLink}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label>
                      Website Link <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="url"
                      name="websiteLink"
                      placeholder="https://yourwebsite.com"
                      value={formData.websiteLink}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <Button className="w-full" size="sm" disabled={loading}>
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting Application...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeAffiliateForm;
