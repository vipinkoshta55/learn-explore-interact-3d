
import { useParams, Navigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

const AuthPages = () => {
  const { authType } = useParams<{ authType: string }>();

  if (authType === "login") {
    return (
      <AuthLayout
        title="Welcome back"
        description="Sign in to your account to continue"
      >
        <LoginForm />
      </AuthLayout>
    );
  }

  if (authType === "register") {
    return (
      <AuthLayout
        title="Create an account"
        description="Enter your details below to create your account"
      >
        <RegisterForm />
      </AuthLayout>
    );
  }

  // If the auth type is not valid, redirect to login
  return <Navigate to="/auth/login" replace />;
};

export default AuthPages;
