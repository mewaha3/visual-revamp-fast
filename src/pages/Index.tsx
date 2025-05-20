
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import TabMenu from "@/components/TabMenu";
import { useState } from "react";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'post' | 'find'>('post');

  const handleTabChange = (tab: 'post' | 'find') => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        
        {/* Job Action Buttons */}
        <div className="container mx-auto px-4 py-8 text-center">
          <TabMenu activeTab={activeTab} onTabChange={handleTabChange} />
          
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            {activeTab === 'post' ? (
              <Link to="/post-job">
                <Button className="w-full sm:w-auto bg-fastlabor-600 hover:bg-fastlabor-700 text-white text-lg py-6 px-8">
                  🚀 Post Job
                </Button>
              </Link>
            ) : (
              <Link to="/find-job">
                <Button className="w-full sm:w-auto bg-fastlabor-600 hover:bg-fastlabor-700 text-white text-lg py-6 px-8">
                  🔍 Find Job
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
