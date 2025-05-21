
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { getPostJobById } from '@/services/firestoreService';
import { matchJobWithWorkers, saveMatchResults } from '@/services/matchingService';
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
  
  const handlePriorityChange = (index: number, value: string) => {
    const priority = parseInt(value);
    const updatedResults = [...matchingResults];
    
    // Find the worker that currently has this priority
    const currentWorkerIndex = updatedResults.findIndex(w => w.priority === priority);
    
    // If found, swap priorities
    if (currentWorkerIndex !== -1 && currentWorkerIndex !== index) {
      const currentPriority = updatedResults[index].priority || 0;
      updatedResults[currentWorkerIndex].priority = currentPriority;
    }
    
    // Set new priority for the selected worker
    updatedResults[index].priority = priority;
    
    setMatchingResults(updatedResults);
  };
  
  const handleConfirmMatches = async () => {
    if (!jobId) return;
    
    setConfirming(true);
    try {
      // Save matches to Firestore with priorities
      const success = await saveMatchResults(jobId, matchingResults);
      
      if (success) {
        toast.success("ระบบได้ทำการจับคู่งานเรียบร้อยแล้ว");
        // Navigate to status page after confirming matches
        navigate(`/status/${jobId}`);
      } else {
        toast.error("ไม่สามารถบันทึกข้อมูลการจับคู่ได้");
      }
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
                  เลือกลำดับความสำคัญของแรงงานและกดปุ่มยืนยันการจับคู่ ระบบจะส่งข้อมูลไปยังแรงงาน
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
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-24">
                          <Select 
                            value={match.priority?.toString() || (index + 1).toString()}
                            onValueChange={(value) => handlePriorityChange(index, value)}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue placeholder="ลำดับ" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">ลำดับ 1</SelectItem>
                              <SelectItem value="2">ลำดับ 2</SelectItem>
                              <SelectItem value="3">ลำดับ 3</SelectItem>
                              <SelectItem value="4">ลำดับ 4</SelectItem>
                              <SelectItem value="5">ลำดับ 5</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <h3 className="font-medium text-lg">แรงงาน {match.name}</h3>
                      </div>
                      
                      <div className="space-y-2 pl-6">
                        <div className="flex items-center gap-2">
                          <span className="text-fastlabor-600">•</span>
                          <span>Name: {match.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-fastlabor-600">•</span>
                          <span>Gender: {match.gender}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-fastlabor-600">•</span>
                          <span>Job Type: {match.jobType || match.job_type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-fastlabor-600">•</span>
                          <span>Date: {match.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-fastlabor-600">•</span>
                          <span>Time: {match.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-fastlabor-600">•</span>
                          <span>Location: {match.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-fastlabor-600">•</span>
                          <span>Salary: {match.salary}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-fastlabor-600">•</span>
                          <span>AI Score: {(match.aiScore || 0).toFixed(2)}</span>
                        </div>
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
