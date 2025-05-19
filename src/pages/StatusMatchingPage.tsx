
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getJobById, getStatusResults, isMatchesConfirmed } from '@/services/api';
import { Job, StatusResult } from '@/types/types';
import { BarChart, ArrowLeft, Info } from 'lucide-react';

const StatusMatchingPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [statusResults, setStatusResults] = useState<StatusResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!jobId) return;
      
      // Get job details
      const jobDetails = getJobById(jobId);
      setJob(jobDetails);
      
      // Check if matches are confirmed
      const confirmed = isMatchesConfirmed(jobId);
      setIsConfirmed(confirmed);
      
      // Get status results
      try {
        const { status } = await getStatusResults(jobId);
        setStatusResults(status);
      } catch (error) {
        console.error("Error fetching status results:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [jobId]);
  
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
              <h1 className="text-2xl font-bold text-gray-800">Status Matching (5 อันดับแรก)</h1>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Job ID: {jobId}</h2>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <p>กำลังโหลดข้อมูล...</p>
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
                      <div className="flex items-center gap-2">
                        <span className="text-fastlabor-600">•</span>
                        <span>AI Score: {status.aiScore.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="mt-4 ml-6">
                      {status.status === 'on_queue' ? (
                        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">On Queue</Button>
                      ) : (
                        <Button className="bg-green-600 hover:bg-green-700 text-white">Job Done</Button>
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
