import RegisterForm from "../../components/auth/RegisterForm";
import AuthLayout from "../../layouts/AuthLayout";

const RegisterPage = () => {
  return (
    <AuthLayout
      title="Register"
      subtitle="Create your account"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;