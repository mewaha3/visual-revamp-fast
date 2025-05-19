
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthCard from "@/components/auth/AuthCard";
import RegisterForm from "@/components/auth/RegisterForm";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-16">
        <div className="container max-w-md mx-auto">
          <AuthCard title="สมัครสมาชิกใหม่">
            <RegisterForm />
          </AuthCard>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
