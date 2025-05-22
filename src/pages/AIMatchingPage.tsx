
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobHeader from "@/components/jobs/JobHeader";
import EmployerCard from "@/components/jobs/EmployerCard";
import JobActionButtons from "@/components/jobs/JobActionButtons";
import { useAuth } from "@/context/AuthContext";
import { getJobMatches } from "@/services/matchService";
import type { JobMatch } from "@/services/matchService";
import { toast } from "sonner";

const AIMatchingPage = () => {
  const navigate = useNavigate();
  const { userEmail, userId } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [showNoMore, setShowNoMore] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!userEmail) {
      toast.error("กรุณาเข้าสู่ระบบก่อนใช้งาน");
      navigate("/login");
      return;
    }

    const fetchMatches = async () => {
      try {
        setIsLoading(true);
        if (!userId) return;
        
        const matchesData = await getJobMatches(userId);
        console.log("Matches found:", matchesData);
        setMatches(matchesData);
        
        // Show "no more matches" if no matches found
        if (matchesData.length === 0) {
          setShowNoMore(true);
        }
      } catch (error) {
        console.error("Error fetching matches:", error);
        toast.error("ไม่สามารถโหลดข้อมูลการจับคู่ได้");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [navigate, userEmail, userId]);

  const handleAccept = () => {
    // Accept the current job match
    if (currentMatchIndex < matches.length) {
      const currentMatch = matches[currentMatchIndex];
      toast.success(`คุณได้ยืนยันการจับคู่กับ ${currentMatch.employer_name || "นายจ้าง"} แล้ว`);
      
      // Move to the next match
      if (currentMatchIndex < matches.length - 1) {
        setCurrentMatchIndex(prevIndex => prevIndex + 1);
      } else {
        setShowNoMore(true);
      }
    }
  };

  const handleDecline = () => {
    // Decline the current job match
    if (currentMatchIndex < matches.length) {
      const currentMatch = matches[currentMatchIndex];
      toast(`คุณได้ปฏิเสธการจับคู่กับ ${currentMatch.employer_name || "นายจ้าง"} แล้ว`);
      
      // Move to the next match
      if (currentMatchIndex < matches.length - 1) {
        setCurrentMatchIndex(prevIndex => prevIndex + 1);
      } else {
        setShowNoMore(true);
      }
    }
  };

  const handleViewDetails = () => {
    // Navigate to job details page
    if (currentMatchIndex < matches.length) {
      const currentMatch = matches[currentMatchIndex];
      navigate(`/job/${currentMatch.job_id}`);
    }
  };

  const currentMatch = matches[currentMatchIndex];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-6">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-center">การจับคู่งานแบบอัตโนมัติ</h1>
            <p className="text-center text-gray-600 mt-2">
              ระบบได้จับคู่งานที่เหมาะสมกับคุณแล้ว
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : showNoMore ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center py-20">
              <h2 className="text-xl font-semibold mb-4">ไม่พบการจับคู่งานเพิ่มเติม</h2>
              <p className="text-gray-600 mb-6">
                ขณะนี้ไม่มีงานที่ตรงกับความต้องการของคุณ โปรดกลับมาตรวจสอบในภายหลัง
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  className="px-6"
                  onClick={() => navigate("/")}
                >
                  กลับสู่หน้าหลัก
                </Button>
                <Button
                  variant="default"
                  className="px-6 bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate("/find-job")}
                >
                  ค้นหางานเพิ่มเติม
                </Button>
              </div>
            </div>
          ) : currentMatch ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <JobHeader
                  jobType={currentMatch.job_type}
                  location={`${currentMatch.district}, ${currentMatch.province}`}
                  date={currentMatch.job_date}
                  time={`${currentMatch.start_time} - ${currentMatch.end_time}`}
                  salary={`${currentMatch.start_salary} - ${currentMatch.range_salary} บาท`}
                  skills={currentMatch.skills}
                />

                <div className="border-t border-gray-200 my-6"></div>

                <div className="space-y-6">
                  <EmployerCard
                    name={currentMatch.employer_name || "ไม่ระบุชื่อ"}
                    rating={4.5}
                    reviews={12}
                  />
                  
                  <div className="text-center mt-6 space-y-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleViewDetails}
                    >
                      ดูรายละเอียดเพิ่มเติม
                    </Button>
                    
                    <JobActionButtons
                      onAccept={handleAccept}
                      onDecline={handleDecline}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {!isLoading && !showNoMore && matches.length > 0 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                กำลังแสดง {currentMatchIndex + 1} จาก {matches.length} การจับคู่
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AIMatchingPage;
