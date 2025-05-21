
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getPostJobById } from '@/services/firestoreService';
import { matchJobWithWorkers } from '@/services/matchingService';
import { PostJob, StatusResult } from '@/types/types';
import { BarChart, ArrowLeft, Info, Check, X, ArrowRight, RefreshCw } from 'lucide-react';

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
        setIsConfirmed(true); // For now, assume matches are confirmed
        
        // Get matching results - use the same as AI matching for now
        // In a real app, this would fetch the status of confirmed matches from Firestore
        const matchResults = await matchJobWithWorkers(jobId);
        
        // Transform match results to status results
        const statusResults: StatusResult[] = matchResults.map((match, index) => ({
          id: match.id || `status-${index}`,
          job_id: jobId,
          findjob_id: match.workerId || '',
          status: index % 3 === 0 ? 'accepted' : (index % 3 === 1 ? 'declined' : 'on_queue'),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          name: match.name,
          gender: match.gender,
          jobType: match.jobType,
          date: match.date,
          time: match.time,
          location: match.location,
          salary: match.salary,
          workerId: match.workerId
        }));
        
        setStatusResults(statusResults);
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
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">On Queue</Badge>;
      case 'accepted':
        return <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1"><Check size={14} /> Accepted</Badge>;
      case 'declined':
        return <Badge className="bg-red-500 hover:bg-red-600 flex items-center gap-1"><X size={14} /> Declined</Badge>;
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
              <div className="space-y-8">
                {statusResults.map((status, index) => (
                  <div key={index} className="border-b border-gray-100 pb-8 last:border-b-0">
                    <h3 className="font-medium text-lg mb-3">Match No.{index + 1}</h3>
                    <div className="space-y-2 pl-6">
                      <div className="flex items-center gap-2">
                        <span className="text-fastlabor-600">•</span>
                        <span>Name: {status.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-fastlabor-600">•</span>
                        <span>Gender: {status.gender}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-fastlabor-600">•</span>
                        <span>Job Type: {status.jobType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-fastlabor-600">•</span>
                        <span>Date: {status.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-fastlabor-600">•</span>
                        <span>Time: {status.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-fastlabor-600">•</span>
                        <span>Location: {status.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-fastlabor-600">•</span>
                        <span>Salary: {status.salary}</span>
                      </div>
                    </div>
                    <div className="mt-4 ml-6 flex items-center gap-3">
                      {getStatusBadge(status.status)}
                      
                      {status.status === 'accepted' && status.workerId && (
                        <Button 
                          onClick={() => handleViewJobDetail(status.workerId || '')}
                          className="bg-fastlabor-600 hover:bg-fastlabor-700 text-white flex items-center gap-1"
                        >
                          รายละเอียดงาน <ArrowRight size={16} />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StatusMatchingPage;
