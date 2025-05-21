
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { getPostJobById } from '@/services/firestoreService';
import { matchJobWithWorkers } from '@/services/matchingService';
import { confirmMatches } from '@/services/api';
import { MatchResult, PostJob } from '@/types/types';
import { BarChart, Check, UserCheck } from 'lucide-react';

const AIMatchingPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<PostJob | null>(null);
  const [matchingResults, setMatchingResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!jobId) return;
      
      setLoading(true);
      
      try {
        // Get job details from Firestore
        const jobDetails = await getPostJobById(jobId);
        if (jobDetails) {
          setJob(jobDetails as PostJob);
          
          // Get matching results from Firestore using the matcher
          const matches = await matchJobWithWorkers(jobId);
          console.log("Matching results:", matches);
          setMatchingResults(matches);
        } else {
          console.error("No job found with ID:", jobId);
        }
      } catch (error) {
        console.error("Error fetching matching results:", error);
        toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [jobId]);
  
  const handleConfirmMatches = async () => {
    if (!jobId) return;
    
    setConfirming(true);
    try {
      await confirmMatches(jobId);
      toast.success("ระบบได้ทำการจับคู่งานเรียบร้อยแล้ว");
      // Navigate to status page after confirming matches
      navigate(`/status/${jobId}`);
    } catch (error) {
      console.error("Error confirming matches:", error);
      toast.error("ไม่สามารถยืนยันการจับคู่ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setConfirming(false);
    }
  };
  
  if (!jobId) {
    return <div>Invalid job ID</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-6">
        <div className="container mx-auto px-4">
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => navigate('/my-jobs')}
          >
            กลับไปยังรายการงาน
          </Button>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart className="h-6 w-6 text-fastlabor-600" />
              <h1 className="text-2xl font-bold text-gray-800">AI Matching</h1>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Job ID: {jobId}</h2>
              <p className="text-gray-600">แสดงแรงงานที่มีผลการจับคู่สูงสุด</p>
            </div>
            
            <div className="mb-6">
              <Alert>
                <UserCheck className="h-4 w-4" />
                <AlertDescription>
                  เมื่อกดปุ่มยืนยันการจับคู่ ระบบจะส่งข้อมูลไปยังแรงงาน
                </AlertDescription>
              </Alert>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <p>กำลังโหลดข้อมูล...</p>
              </div>
            ) : matchingResults.length === 0 ? (
              <div className="text-center py-8">
                <p>ไม่พบข้อมูลการจับคู่</p>
              </div>
            ) : (
              <>
                <div className="space-y-8">
                  {matchingResults.map((match, index) => (
                    <div key={index} className="border-b border-gray-100 pb-8 last:border-b-0">
                      <h3 className="font-medium text-lg mb-3">แรงงาน {index + 1}</h3>
                      <div className="space-y-2 pl-6">
                        {Object.entries(match).map(([key, value]) => {
                          // Skip internal fields
                          if (key === "aiScore" || key === "workerId") return null;
                          
                          return (
                            <div key={key} className="flex items-center gap-2">
                              <span className="text-fastlabor-600">•</span>
                              <span>{key.charAt(0).toUpperCase() + key.slice(1)}: {value}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 flex justify-center">
                  <Button 
                    onClick={handleConfirmMatches} 
                    disabled={confirming}
                    className="bg-fastlabor-600 hover:bg-fastlabor-700 flex items-center gap-2 px-8 py-6 text-lg"
                  >
                    {confirming ? (
                      "กำลังดำเนินการ..."
                    ) : (
                      <>
                        <Check size={20} />
                        ยืนยันการจับคู่
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AIMatchingPage;
