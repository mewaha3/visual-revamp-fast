
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getJobById, getMatchingResults, confirmMatches } from '@/services/api';
import { Job, MatchResult } from '@/types/types';
import { Search, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const AIMatchingPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [job, setJob] = useState<Job | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!jobId) return;
      
      // Get job details
      const jobDetails = getJobById(jobId);
      setJob(jobDetails);
      
      // Get matching results
      try {
        const { matches } = await getMatchingResults(jobId);
        setMatches(matches);
      } catch (error) {
        console.error("Error fetching matching results:", error);
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
      toast({
        title: "สำเร็จ",
        description: "ยืนยันผลการจับคู่เรียบร้อย",
        variant: "success"
      });
      navigate(`/status/${jobId}`);
    } catch (error) {
      console.error("Error confirming matches:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถยืนยันผลการจับคู่ได้",
        variant: "destructive"
      });
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
            <ArrowLeft size={16} className="mr-2" />
            กลับไปยังรายการงาน
          </Button>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Search className="h-6 w-6 text-fastlabor-600" />
              <h1 className="text-2xl font-bold text-gray-800">AI Matching – ผลการจับคู่ (5 อันดับแรก)</h1>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <p>กำลังโหลดข้อมูล...</p>
              </div>
            ) : matches.length === 0 ? (
              <div className="text-center py-8">
                <p>ไม่พบผลการจับคู่</p>
              </div>
            ) : (
              <div className="space-y-6">
                {matches.map((match, index) => (
                  <Card key={index} className="border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">Candidate No.{index + 1}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Priority</span>
                          <div className="bg-gray-100 rounded px-2 py-1 min-w-14 text-center">
                            {index + 1}
                          </div>
                        </div>
                      </div>
                      <Separator className="my-3" />
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600">•</span>
                          <span>Name: {match.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600">•</span>
                          <span>Gender: {match.gender}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600">•</span>
                          <span>Job Type: {match.jobType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600">•</span>
                          <span>Date: {match.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600">•</span>
                          <span>Time: {match.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600">•</span>
                          <span>Location: {match.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600">•</span>
                          <span>Salary: {match.salary}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600">•</span>
                          <span>AI Score: {match.aiScore.toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <div className="mt-6 text-center">
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white w-full max-w-md"
                    onClick={handleConfirmMatches}
                    disabled={confirming}
                  >
                    {confirming ? (
                      <span className="flex items-center">
                        <span className="mr-2">กำลังยืนยัน...</span>
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Confirm AI Matches
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AIMatchingPage;
