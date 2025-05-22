
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getPostJobById } from '@/services/firestoreService';
import { getMatchResultsForJob } from '@/services/matchingService';
import { PostJob, StatusResult } from '@/types/types';
import { BarChart, ArrowLeft, Info, Check, X, ArrowRight, RefreshCw } from 'lucide-react';
import JobMatchDetails from '@/components/jobs/JobMatchDetails';

const StatusMatchingPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<PostJob | null>(null);
  const [statusResults, setStatusResults] = useState<StatusResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!jobId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Get job details from Firestore
        const jobDetails = await getPostJobById(jobId);
        if (!jobDetails) {
          setError("ไม่พบข้อมูลงาน");
          return;
        }
        
        setJob(jobDetails as PostJob);
        
        // Get matching results from Firestore
        const matchResults = await getMatchResultsForJob(jobId);
        
        if (matchResults.length > 0) {
          setIsConfirmed(true);
          setStatusResults(matchResults);
        } else {
          setIsConfirmed(false);
        }
      } catch (error) {
        console.error("Error fetching status results:", error);
        setError("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [jobId]);
  
  const handleRefresh = () => {
    window.location.reload();
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on_queue':
        return <Badge className="bg-yellow-500 hover:bg-yellow-500">On Queue</Badge>;
      case 'accepted':
        return <Badge className="bg-green-500 hover:bg-green-500 flex items-center gap-1"><Check size={14} /> Accepted</Badge>;
      case 'declined':
        return <Badge className="bg-red-500 hover:bg-red-500 flex items-center gap-1"><X size={14} /> Declined</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  const handleViewJobDetail = (workerId: string) => {
    // Navigate to job detail page with jobId and workerId
    navigate(`/job-detail/${jobId}?workerId=${workerId}`);
  };
  
  if (!jobId) {
    return <div>Invalid job ID</div>;
  }

  // Convert statusResults to match the format expected by JobMatchDetails
  const formattedResults = statusResults.map(result => ({
    ...result,
    jobType: result.jobType,
    gender: result.gender,
    date: result.date,
    time: result.time,
    location: result.location,
    salary: result.salary,
    first_name: result.first_name,
    last_name: result.last_name,
    name: result.name
  }));

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
              <BarChart className="h-6 w-6 text-fastlabor-600" />
              <h1 className="text-2xl font-bold text-gray-800">Status Matching</h1>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Job ID: {jobId}</h2>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <p>กำลังโหลดข้อมูล...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
                <div className="mt-4 flex flex-col gap-3">
                  <Button 
                    onClick={handleRefresh} 
                    variant="outline" 
                    className="mx-auto"
                  >
                    <RefreshCw className="mr-2" size={18} />
                    ลองใหม่อีกครั้ง
                  </Button>
                  
                  <Button 
                    onClick={() => navigate("/my-jobs")} 
                    variant="outline" 
                    className="mx-auto"
                  >
                    กลับไปยังรายการงาน
                  </Button>
                </div>
              </div>
            ) : !isConfirmed ? (
              <div className="text-center py-8 bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                <Info className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">ยังไม่ได้ยืนยันผลการจับคู่</h3>
                <p className="text-gray-600 mb-4">กรุณายืนยันผลการจับคู่ที่หน้า AI Matching ก่อน</p>
                <Button 
                  onClick={() => navigate(`/matching/${jobId}`)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  ไปยังหน้า AI Matching
                </Button>
              </div>
            ) : statusResults.length === 0 ? (
              <div className="text-center py-8">
                <p>ไม่พบข้อมูลสถานะการจับคู่</p>
              </div>
            ) : (
              <JobMatchDetails matches={formattedResults} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StatusMatchingPage;
