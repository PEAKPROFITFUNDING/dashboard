import { useState } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import axiosInstance from "../../api/axiosInstance";
import { EyeCloseIcon, EyeIcon } from "../../icons";

export default function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Password validation function
  const validatePassword = (password) => {
    // At least 8 characters long
    const minLength = password.length >= 8;

    // Contains letters (both uppercase and lowercase), numbers, and special characters
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      password
    );

    // Not only numeric (avoid numeric-only passwords)
    const notNumericOnly = !/^\d+$/.test(password);

    // Not common passwords (basic check - you might want to expand this list)
    const commonPasswords = [
      "password",
      "12345678",
      "qwerty",
      "abc123",
      "password1",
    ];
    const notCommon = !commonPasswords.includes(password.toLowerCase());

    return {
      minLength,
      hasLetters,
      hasNumbers,
      hasSpecialChars,
      notNumericOnly,
      notCommon,
      isValid:
        minLength &&
        hasLetters &&
        hasNumbers &&
        hasSpecialChars &&
        notNumericOnly &&
        notCommon,
    };
  };

  const passwordValidation = validatePassword(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return setError("All fields are required.");
    }

    // Validate new password
    if (!passwordValidation.isValid) {
      return setError("New password does not meet the required criteria.");
    }

    if (newPassword !== confirmNewPassword) {
      return setError("New passwords do not match.");
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/auth/change-password", {
        oldPassword,
        newPassword,
        confirmNewPassword,
      });
      setSuccess(res.data.message || "Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10" />
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Change Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your current and new password to update.
            </p>
          </div>

          {success && (
            <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-400">
                {success}
              </p>
            </div>
          )}

          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label>
                  Old Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showOld ? "text" : "password"}
                    placeholder="Enter current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <span
                    onClick={() => setShowOld(!showOld)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showOld ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Your password must:
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li
                    className={
                      newPassword
                        ? passwordValidation.minLength
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                        : ""
                    }
                  >
                    Be at least 8 characters long
                  </li>
                  <li
                    className={
                      newPassword
                        ? passwordValidation.hasLetters &&
                          passwordValidation.hasNumbers &&
                          passwordValidation.hasSpecialChars
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                        : ""
                    }
                  >
                    Include letters, numbers, and special characters
                  </li>
                  <li
                    className={
                      newPassword
                        ? passwordValidation.notNumericOnly &&
                          passwordValidation.notCommon
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                        : ""
                    }
                  >
                    Avoid common or numeric-only passwords
                  </li>
                </ul>
              </p>

              <div>
                <Label>
                  New Password <span className="text-error-500">*</span>
                </Label>

                <div className="relative mt-2">
                  <Input
                    type={showNew ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={
                      newPassword
                        ? passwordValidation.isValid
                          ? "border-green-300 dark:border-green-600"
                          : "border-red-300 dark:border-red-600"
                        : ""
                    }
                  />
                  <span
                    onClick={() => setShowNew(!showNew)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showNew ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>

              <div>
                <Label>
                  Confirm New Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className={
                      confirmNewPassword
                        ? newPassword === confirmNewPassword
                          ? "border-green-300 dark:border-green-600"
                          : "border-red-300 dark:border-red-600"
                        : ""
                    }
                  />
                  <span
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showConfirm ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
                {confirmNewPassword && newPassword !== confirmNewPassword && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    Passwords do not match
                  </p>
                )}
              </div>

              <Button
                className="w-full mb-8"
                size="sm"
                disabled={
                  loading ||
                  !passwordValidation.isValid ||
                  newPassword !== confirmNewPassword
                }
              >
                {loading ? "Updating..." : "Change Password"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
