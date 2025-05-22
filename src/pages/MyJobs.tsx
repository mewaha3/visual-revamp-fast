
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TabMenu } from "@/components/TabMenu";
import { JobResults } from "@/components/jobs/JobResults";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { FindJob } from "@/types/types";
import { getUnmatchedFindJobs } from "@/services/findJobService"; 

const MyJobs = () => {
  const { tab = "find" } = useParams();
  const navigate = useNavigate();
  const { userEmail, userId } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<FindJob[]>([]);

  // Tabs configuration
  const tabs = [
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-6 flex-grow">
        <h1 className="text-2xl font-bold mb-6">งานของฉัน</h1>

        {/* Tab Menu */}
        <TabMenu
          tabs={tabs}
          activeTabId={tab}
          onChange={handleTabChange}
        />

        {/* Job Results */}
        <div className="mt-6">
          <JobResults
            jobs={jobs}
            isLoading={isLoading}
            emptyMessage={
              tab === "find"
                ? "คุณยังไม่มีงานที่หา"
                : tab === "post"
                ? "คุณยังไม่มีงานที่ลงประกาศ"
                : "คุณยังไม่มีงานที่จับคู่แล้ว"
            }
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyJobs;
