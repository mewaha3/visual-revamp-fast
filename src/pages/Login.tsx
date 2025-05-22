
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const { userEmail, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [redirectPath, setRedirectPath] = useState("/");
  
  // Extract redirect path from location state
  useEffect(() => {
    if (location.state && location.state.from) {
      setRedirectPath(location.state.from);
    }
  }, [location]);
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (!isLoading && userEmail) {
      navigate(redirectPath);
    }
  }, [userEmail, navigate, isLoading, redirectPath]);

  // Don't render content until authentication state is determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fastlabor-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">กำลังตรวจสอบข้อมูลผู้ใช้...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-16">
        <div className="container max-w-md mx-auto">
          <AuthCard title="เข้าสู่ระบบ">
            <LoginForm redirectPath={redirectPath} />
          </AuthCard>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
