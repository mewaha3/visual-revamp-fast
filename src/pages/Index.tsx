
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { userEmail } = useAuth();
  const navigate = useNavigate();
  
  const handlePostJob = () => {
    if (!userEmail) {
      navigate("/login", { state: { from: "/post-job" } });
    } else {
      navigate("/post-job");
    }
  };
  
  const handleFindWorker = () => {
    if (!userEmail) {
      navigate("/login", { state: { from: "/find-worker" } });
    } else {
      navigate("/find-worker");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        
        {/* Job Action Buttons - Updated */}
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              className="w-full sm:w-auto bg-fastlabor-600 hover:bg-fastlabor-700 text-white text-lg py-6 px-8"
              onClick={handlePostJob}
            >
              🚀 ลงประกาศหางาน
            </Button>
            <Button 
              className="w-full sm:w-auto bg-fastlabor-600 hover:bg-fastlabor-700 text-white text-lg py-6 px-8"
              onClick={handleFindWorker}
            >
              🔍 ค้นหาแรงงาน
            </Button>
          </div>
        </div>
        
        {/* Features section removed as requested */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
