import React, { useState, useRef } from "react";
import { Calendar, Shield, AlertCircle } from "lucide-react";
import Label from "../../../../../components/form/Label";
import Input from "../../../../../components/form/input/InputField";
import Button from "../../../../../components/ui/button/Button";
import { FileUploadArea } from "./FileUploadArea";
import { useUser } from "../../../../../context/UserContext";
import { KYCPending } from "./KYCPending";
import { KYCApproved } from "./KYCApproved";
import { KYCRejected } from "./KYCRejected";
import axiosInstance from "../../../../../api/axiosInstance";

export type KycFormData = {
  dateOfBirth: string;
  socialSecurityNumber: string;
  idFrontImage: File | null;
  idBackImage: File | null;
};

export type KycFormErrors = {
  dateOfBirth?: string;
  socialSecurityNumber?: string;
  idFrontImage?: string;
  idBackImage?: string;
};

export type FilePreview = {
  url: string;
  type: string;
  name: string;
};

type FilePreviews = {
  idFrontImage: FilePreview | null;
  idBackImage: FilePreview | null;
};

const KYCForm = () => {
  const [formData, setFormData] = useState<KycFormData>({
    dateOfBirth: "",
    socialSecurityNumber: "",
    idFrontImage: null,
    idBackImage: null,
  });

  const [errors, setErrors] = useState<KycFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [previews, setPreviews] = useState<FilePreviews>({
    idFrontImage: null,
    idBackImage: null,
  });

  const frontImageRef = useRef<HTMLInputElement>(null);
  const backImageRef = useRef<HTMLInputElement>(null);

  //   const { kyc, refetchUser } = useUser();

  const kyc = null;

  const validateForm = () => {
    const newErrors: KycFormErrors = {};

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    if (!formData.socialSecurityNumber) {
      newErrors.socialSecurityNumber = "Social security number is required";
    } else if (!/^\d{3}-\d{2}-\d{4}$/.test(formData.socialSecurityNumber)) {
      newErrors.socialSecurityNumber = "Please enter in format: XXX-XX-XXXX";
    }

    if (!formData.idFrontImage) {
      newErrors.idFrontImage = "Front side of ID is required";
    }

    if (!formData.idBackImage) {
      newErrors.idBackImage = "Back side of ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Format SSN automatically
    if (name === "socialSecurityNumber") {
      const formatted = value
        .replace(/\D/g, "") // Remove non-digits
        .replace(/(\d{3})(\d{2})(\d{4})/, "$1-$2-$3") // Add dashes
        .slice(0, 11); // Limit length

      setFormData((prev) => ({
        ...prev,
        [name]: formatted,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileUpload = (e, fieldName) => {
    console.log(e);

    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "Please upload an image (JPG, PNG) or PDF file",
      }));
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "File size must be less than 10MB",
      }));
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      [fieldName]: file,
    }));

    setPreviews((prev) => ({
      ...prev,
      [fieldName]: {
        url: previewUrl,
        type: file.type,
        name: file.name,
      },
    }));

    // Clear error
    setErrors((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
  };

  const removeFile = (fieldName) => {
    if (previews[fieldName]) {
      URL.revokeObjectURL(previews[fieldName].url);
    }

    setFormData((prev) => ({
      ...prev,
      [fieldName]: null,
    }));

    setPreviews((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("dateOfBirth", formData.dateOfBirth);
      submitData.append("socials", formData.socialSecurityNumber);
      submitData.append("idFrontImage", formData.idFrontImage!);
      submitData.append("idBackImage", formData.idBackImage!);

      //   console.log("Submitting KYC form:", formData);

      const response = await axiosInstance.post("/kyc/submit", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        refetchUser();
        setUploadSuccess(true);
        // Clear form data
        setFormData({
          dateOfBirth: "",
          socialSecurityNumber: "",
          idFrontImage: null,
          idBackImage: null,
        });

        // Clean up preview URLs
        if (previews.idFrontImage) {
          URL.revokeObjectURL(previews.idFrontImage.url);
        }
        if (previews.idBackImage) {
          URL.revokeObjectURL(previews.idBackImage.url);
        }

        // Clear previews
        setPreviews({
          idFrontImage: null,
          idBackImage: null,
        });

        // Clear any errors
        setErrors({});
      }
    } catch (error) {
      console.error("Error submitting KYC:", error);

      if (error.response?.data?.message) {
        // Handle specific API errors
        const errorMessage = error.response.data.message;
        console.log(errorMessage);

        setErrors({
          ...errors,
          // You could set specific field errors based on API response
        });
      } else {
        // Handle generic errors
        console.error("Network or unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (kyc?.status === "pending" || uploadSuccess) {
    return <KYCPending />;
  }
  if (kyc?.status === "approved") {
    return <KYCApproved />;
  }
  if (kyc?.status === "rejected") {
    return (
      <KYCRejected
        rejectionReason={"Rejection reasong is following"}
        onResubmit={() => console.log("resubmitting")}
      />
    );
  }

  return (
    <div className="bg-white dark:border-white/[0.05] dark:bg-white/[0.03] border border-gray-200 rounded-xl shadow-lg">
      <div className="mb-5 mt-8 sm:mb-8 text-center flex flex-col items-center">
        <div className="p-2 my-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Shield className="h-14 w-14 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="mb-2 font-semibold text-gray-800 text-2xl dark:text-white/90 sm:text-3xl">
          KYC Verification
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Please provide the required information to verify your identity
        </p>
      </div>

      <div className="p-6 space-y-6 ">
        {/* Date of Birth */}
        <div className="sm:grid-cols-2 grid gap-4">
          <div>
            <Label className="mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date of Birth <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className={
                errors.dateOfBirth ? "border-red-500 focus:border-red-500" : ""
              }
              max={new Date().toISOString().split("T")[0]}
            />
            {errors.dateOfBirth && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.dateOfBirth}
              </p>
            )}
          </div>

          {/* Social Security Number */}
          <div>
            <Label className="mb-2">
              Social Security Number <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              name="socialSecurityNumber"
              value={formData.socialSecurityNumber}
              onChange={handleInputChange}
              placeholder="123-45-6789"
              className={
                errors.socialSecurityNumber
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }
            />
            {errors.socialSecurityNumber && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.socialSecurityNumber}
              </p>
            )}
          </div>
        </div>

        {/* Government ID Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Government-issued ID Required
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Please upload both sides of your Passport, National ID, or Driver's
            License. Files must be clear and all information must be visible.
          </p>
        </div>

        {/* ID Front Image */}
        <FileUploadArea
          fieldName="idFrontImage"
          label="Front Side of ID"
          currentFile={formData.idFrontImage}
          preview={previews.idFrontImage}
          inputRef={frontImageRef}
          removeFile={removeFile}
          errors={errors}
          handleFileUpload={handleFileUpload}
        />

        {/* ID Back Image */}
        <FileUploadArea
          fieldName="idBackImage"
          label="Back Side of ID"
          currentFile={formData.idBackImage}
          preview={previews.idBackImage}
          inputRef={backImageRef}
          removeFile={removeFile}
          errors={errors}
          handleFileUpload={handleFileUpload}
        />

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Submitting...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Shield className="h-4 w-4" />
                Submit KYC Verification
              </div>
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          By submitting this form, you agree to our{" "}
          <a
            href="https://peakprofitfunding.com/terms-and-services"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            terms of service
          </a>{" "}
          and{" "}
          <a
            href="https://peakprofitfunding.com/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            privacy policy
          </a>
          . Your information will be securely processed and stored.
        </p>
      </div>
    </div>
  );
};

export default KYCForm;
