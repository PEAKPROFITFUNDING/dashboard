import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Login"
        description="Sign In page dashboard peakprofit funding"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
