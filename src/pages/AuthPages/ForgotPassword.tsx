import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";

export default function ForgotPassword() {
  return (
    <>
      <PageMeta
        title="Forgot Password"
        description="Forgot password page peakprofit dasboard"
      />
      <AuthLayout>
        <ForgotPasswordForm />
      </AuthLayout>
    </>
  );
}
