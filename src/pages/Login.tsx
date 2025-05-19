
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-16">
        <div className="container max-w-md mx-auto">
          <AuthCard title="เข้าสู่ระบบ">
            <LoginForm />
          </AuthCard>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
