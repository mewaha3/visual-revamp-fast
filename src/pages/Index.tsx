
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        
        {/* Job Action Buttons */}
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/post-job">
              <Button className="w-full sm:w-auto bg-fastlabor-600 hover:bg-fastlabor-700 text-white text-lg py-6 px-8">
                🚀 Post Job
              </Button>
            </Link>
            <Link to="/find-job">
              <Button className="w-full sm:w-auto bg-fastlabor-600 hover:bg-fastlabor-700 text-white text-lg py-6 px-8">
                🔍 Find Job
              </Button>
            </Link>
          </div>
        </div>
        
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
