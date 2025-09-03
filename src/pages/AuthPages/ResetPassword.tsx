import ResetPasswordForm from "../../components/auth/ResetPasswordForm";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";

export default function ResetPassword() {
  return (
    <>
      <PageMeta
        title="Reset Password"
        description="Reset password page peakprofit dasboard"
      />
      <AuthLayout>
        <ResetPasswordForm />
      </AuthLayout>
    </>
  );
}
