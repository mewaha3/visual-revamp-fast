
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { FindJob } from "@/types/types";
import { getUnmatchedFindJobs } from "@/services/findJobService"; 
import { Button } from "@/components/ui/button";
import { Clipboard, RefreshCw } from "lucide-react";

// Tab interface to match TabMenu component
interface Tab {
  id: string;
  label: string;
  path: string;
}

const MyJobs = () => {
  const { tab = "find" } = useParams();
  const navigate = useNavigate();
  const { userEmail, userId } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<FindJob[]>([]);

  // Tabs configuration
  const tabs: Tab[] = [
    { id: "find", label: "งานที่หา", path: "/my-jobs/find" },
    { id: "post", label: "งานที่ลงประกาศ", path: "/my-jobs/post" },
    { id: "matched", label: "งานที่จับคู่แล้ว", path: "/my-jobs/matched" },
  ];

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    navigate(`/my-jobs/${tabId}`);
  };

  // Fetch jobs based on the active tab
  useEffect(() => {
    const fetchJobs = async () => {
      if (!userEmail) {
        toast.error("กรุณาเข้าสู่ระบบก่อนดูประวัติงาน");
        navigate("/login", { state: { from: `/my-jobs/${tab}` } });
        return;
      }

      setIsLoading(true);

      try {
        let jobsData: FindJob[] = [];

        if (tab === "find" && userId) {
          // Fetch find jobs
          jobsData = await getUnmatchedFindJobs(userId);
        } else if (tab === "post" && userId) {
          // In a real implementation, this would fetch posted jobs
          // For now, we'll use an empty array
          jobsData = [];
        } else if (tab === "matched" && userId) {
          // In a real implementation, this would fetch matched jobs
          // For now, we'll use an empty array
          jobsData = [];
        }

        setJobs(jobsData);
      } catch (error) {
        console.error(`Error fetching ${tab} jobs:`, error);
        toast.error(`ไม่สามารถโหลดข้อมูลงานที่${tab === "find" ? "หา" : tab === "post" ? "ลงประกาศ" : "จับคู่แล้ว"}ได้`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [tab, userEmail, userId, navigate]);

  // Render empty message based on tab
  const renderEmptyMessage = () => {
    let message = "";
    
    if (tab === "find") {
      message = "คุณยังไม่มีงานที่หา";
    } else if (tab === "post") {
      message = "คุณยังไม่มีงานที่ลงประกาศ";
    } else {
      message = "คุณยังไม่มีงานที่จับคู่แล้ว";
    }
    
    return (
      <div className="text-center py-8">
        <p>{message}</p>
      </div>
    );
  };

  // Redirect to MyJobsPage which has the implementation
  useEffect(() => {
    navigate('/my-jobs');
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-6 flex-grow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clipboard className="h-6 w-6 text-fastlabor-600" />
            <h1 className="text-2xl font-bold">งานของฉัน</h1>
          </div>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>รีเฟรช</span>
          </Button>
        </div>

        {/* Redirecting to the full implementation */}
        <div className="text-center py-8">
          <p>กำลังโหลดข้อมูล...</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyJobs;
