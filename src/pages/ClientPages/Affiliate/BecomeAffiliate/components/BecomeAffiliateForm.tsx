import React, { useState } from "react";
import Label from "../../../../../components/form/Label";
import Input from "../../../../../components/form/input/InputField";
import Button from "../../../../../components/ui/button/Button";
import axiosInstance from "../../../../../api/axiosInstance";
import { Handshake } from "lucide-react";

const BecomeAffiliateForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    strategy: "",
    socialMediaLink: "",
    websiteLink: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      setSuccess("Your affiliate application has been submitted successfully!");
      setFormData({
        name: "",
        email: "",
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
                      Full Name <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
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
