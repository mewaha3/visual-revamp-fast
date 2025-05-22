
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { getPostJobById } from '@/services/firestoreService';
import { getMatchesForJob } from '@/services/matchOperationsService';
import { PostJob, MatchResult } from '@/types/types';
import { BarChart, ArrowLeft, Info, RefreshCw } from 'lucide-react';
import JobMatchDetails from '@/components/jobs/JobMatchDetails';

const StatusMatchingPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<PostJob | null>(null);
  const [statusResults, setStatusResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const fetchData = async (isRefreshing = false) => {
    if (!jobId) return;
    
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      // Get job details from Firestore
      const jobDetails = await getPostJobById(jobId);
      if (!jobDetails) {
        setError("ไม่พบข้อมูลงาน");
        return;
      }
      
      setJob(jobDetails as PostJob);
      
      // Get matching results using our service
      const matchResults = await getMatchesForJob(jobId);
      
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
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [jobId]);
  
  const handleRefresh = () => {
    fetchData(true);
  };

  const handleViewJobDetails = (jobId: string) => {
    navigate(`/job-detail/${jobId}`);
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart className="h-6 w-6 text-fastlabor-600" />
                <h1 className="text-2xl font-bold text-gray-800">Status Matching</h1>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? "กำลังรีเฟรช..." : "รีเฟรช"}
              </Button>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Job ID: {jobId}</h2>
              {job && (
                <div className="flex flex-col gap-1 mt-2">
                  <p className="text-gray-600">ประเภทงาน: {job.job_type}</p>
                </div>
              )}
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
                <div className="space-y-3">
                  <Button 
                    onClick={() => navigate(`/matching/${jobId}`)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    ไปยังหน้า AI Matching
                  </Button>
                </div>
              </div>
            ) : statusResults.length === 0 ? (
              <div className="text-center py-8">
                <p>ไม่พบข้อมูลการจับคู่แรงงาน</p>
              </div>
            ) : (
              <JobMatchDetails 
                matches={statusResults} 
                showViewButton={true}
                onViewDetails={handleViewJobDetails}
                showSkills={true}
                hideButtonForStatus={['on_queue', 'declined']} // Hide view button for on_queue and declined status
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StatusMatchingPage;
