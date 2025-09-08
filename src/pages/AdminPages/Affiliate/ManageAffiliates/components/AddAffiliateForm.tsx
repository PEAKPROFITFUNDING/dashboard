import { FC, useState, FormEvent } from "react";
import Form from "../../../../../components/form/Form";
import Label from "../../../../../components/form/Label";
import Input from "../../../../../components/form/input/InputField";
import Select from "../../../../../components/form/Select";
import Button from "../../../../../components/ui/button/Button";
import { Affiliate } from "./types";
import { AffiliateDetails } from "../AffiliateDetails/components";

interface AddAffiliateFormData {
  fullName: string;
  email: string;
  joinedDate: string;
  referralCode: string;
  status: "active" | "inactive" | "pending" | "";
  socialMediaLink: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

interface AddAffiliateFormProps {
  setAffiliates: React.Dispatch<React.SetStateAction<AffiliateDetails[]>>;
}

const AddAffiliateForm: FC<AddAffiliateFormProps> = ({ setAffiliates }) => {
  const [formData, setFormData] = useState<AddAffiliateFormData>({
    fullName: "",
    email: "",
    joinedDate: "",
    referralCode: "",
    status: "",
    socialMediaLink: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const {
      fullName,
      email,
      joinedDate,
      referralCode,
      status,
      socialMediaLink,
    } = formData;

    if (!fullName.trim()) newErrors.fullName = "Full Name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format.";
    if (!joinedDate) newErrors.joinedDate = "Joined Date is required.";
    if (!referralCode.trim())
      newErrors.referralCode = "Referral Code is required.";
    if (!status) newErrors.status = "Status is required.";
    if (!socialMediaLink.trim())
      newErrors.socialMediaLink = "Social Media Link is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) {
      setErrorMessage("Please fix the errors and try again.");
      setLoading(false);
      return;
    }

    const newAffiliate: AffiliateDetails = {
      id: Date.now(),
      fullName: formData.fullName,
      email: formData.email,
      joinedDate: formData.joinedDate,
      referralCode: formData.referralCode,
      phone: "+1 (555) 567-8901",
      status: formData.status as "active" | "inactive" | "pending",
      // socialMediaLink: formData.socialMediaLink,
      performance: {
        totalClicks: 0,
        totalSignups: 0,
        totalFundedAccounts: 0,
        totalCommissionEarned: 0,
      },
      referralStats: {
        totalReferrals: 0,
        signedUp: 0,
        deposited: 0,
        passedChallenge: 0,
      },
    };

    try {
      console.log("Adding affiliate:", newAffiliate);
      await new Promise((res) => setTimeout(res, 1000)); // simulate request

      setAffiliates((prev) => [...prev, newAffiliate]); // ✅ only here
      setSuccessMessage("Affiliate added successfully!");
      setFormData({
        fullName: "",
        email: "",
        joinedDate: "",
        referralCode: "",
        status: "",
        socialMediaLink: "",
      });
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to add affiliate. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" mt-6">
      {successMessage && (
        <p className="p-2 mb-4 text-green-700 bg-green-100 rounded">
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p className="p-2 mb-4 text-red-700 bg-red-100 rounded">
          {errorMessage}
        </p>
      )}

      <Form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="John Doe"
              className={errors.fullName ? "border-red-500" : ""}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div>
            <Label htmlFor="joinedDate">Joined Date *</Label>
            <Input
              type="date"
              name="joinedDate"
              value={formData.joinedDate}
              onChange={handleInputChange}
              className={errors.joinedDate ? "border-red-500" : ""}
            />
            {errors.joinedDate && (
              <p className="text-red-500 text-sm">{errors.joinedDate}</p>
            )}
          </div>
          <div>
            <Label htmlFor="referralCode">Referral Code *</Label>
            <Input
              name="referralCode"
              value={formData.referralCode}
              onChange={handleInputChange}
              placeholder="ABC123"
              className={errors.referralCode ? "border-red-500" : ""}
            />
            {errors.referralCode && (
              <p className="text-red-500 text-sm">{errors.referralCode}</p>
            )}
          </div>
          <div>
            <Label htmlFor="status">Status *</Label>
            <Select
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "pending", label: "Pending" },
              ]}
              placeholder="Select status"
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  status: value as "active" | "inactive" | "pending" | "",
                }))
              }
              defaultValue={formData.status}
              className={errors.status ? "border-red-500" : ""}
            />
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status}</p>
            )}
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="socialMediaLink">Social Media Link *</Label>
            <Input
              name="socialMediaLink"
              value={formData.socialMediaLink}
              onChange={handleInputChange}
              placeholder="https://twitter.com/..."
              className={errors.socialMediaLink ? "border-red-500" : ""}
            />
            {errors.socialMediaLink && (
              <p className="text-red-500 text-sm">{errors.socialMediaLink}</p>
            )}
          </div>
        </div>
        <Button disabled={loading} className="w-full">
          {loading ? "Adding..." : "Add Affiliate"}
        </Button>
      </Form>
    </div>
  );
};

export default AddAffiliateForm;
