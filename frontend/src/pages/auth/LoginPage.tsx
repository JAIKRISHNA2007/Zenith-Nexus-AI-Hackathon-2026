import LoginForm from "../../components/auth/LoginForm";
import AuthLayout from "../../layouts/AuthLayout";

const LoginPage = () => {
  return (
    <AuthLayout
      title="Login"
      subtitle="Sign in to continue"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;