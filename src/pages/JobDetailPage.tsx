
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getJobById, getWorkerById } from '@/services/api';
import { Job } from '@/types/types';
import { ArrowLeft, Calendar, Clock, MapPin, Banknote, FileText, User } from 'lucide-react';

interface Worker {
  name: string;
  gender: string;
  skills: string;
  jobType: string;
}

const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [searchParams] = useSearchParams();
  const workerId = searchParams.get('workerId');
  const navigate = useNavigate();
  
  const [job, setJob] = useState<Job | null>(null);
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!jobId || !workerId) return;
      
      // Get job details
      const jobDetails = getJobById(jobId);
      setJob(jobDetails);
      
      // Get worker details (mock function - needs to be implemented in api.ts)
      try {
        const workerDetails = await getWorkerById(workerId);
        setWorker(workerDetails);
      } catch (error) {
        console.error("Error fetching worker details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [jobId, workerId]);

  if (!jobId || !workerId) {
    return <div className="container mx-auto p-4">Invalid job or worker ID</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-6">
        <div className="container mx-auto px-4">
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => navigate(`/status/${jobId}`)}
          >
            <ArrowLeft size={16} className="mr-2" />
            กลับไปยังหน้าสถานะการจับคู่
          </Button>
          
          {loading ? (
            <div className="text-center py-8">
              <p>กำลังโหลดข้อมูล...</p>
            </div>
          ) : job ? (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-2xl">รายละเอียดงาน</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="flex items-center gap-2 font-semibold text-lg">
                          <FileText className="text-fastlabor-600" size={18} /> ประเภทงาน
                        </h3>
                        <p className="ml-7 text-gray-700">{job.job_type}</p>
                      </div>
                      
                      <div>
                        <h3 className="flex items-center gap-2 font-semibold text-lg">
                          <Calendar className="text-fastlabor-600" size={18} /> วันที่
                        </h3>
                        <p className="ml-7 text-gray-700">{job.job_date}</p>
                      </div>
                      
                      <div>
                        <h3 className="flex items-center gap-2 font-semibold text-lg">
                          <Clock className="text-fastlabor-600" size={18} /> เวลา
                        </h3>
                        <p className="ml-7 text-gray-700">{job.start_time} - {job.end_time}</p>
                      </div>
                      
                      <div>
                        <h3 className="flex items-center gap-2 font-semibold text-lg">
                          <Banknote className="text-fastlabor-600" size={18} /> ค่าจ้าง
                        </h3>
                        <p className="ml-7 text-gray-700">{job.salary} บาท</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="flex items-center gap-2 font-semibold text-lg">
                        <MapPin className="text-fastlabor-600" size={18} /> สถานที่
                      </h3>
                      <p className="ml-7 text-gray-700">{job.job_address}</p>
                    </div>
                    
                    <div>
                      <h3 className="flex items-center gap-2 font-semibold text-lg">
                        <FileText className="text-fastlabor-600" size={18} /> รายละเอียดงาน
                      </h3>
                      <p className="ml-7 text-gray-700">{job.job_detail}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {worker && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">ข้อมูลแรงงานที่จับคู่</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="flex items-center gap-2 font-semibold text-lg">
                          <User className="text-fastlabor-600" size={18} /> ชื่อ
                        </h3>
                        <p className="ml-7 text-gray-700">{worker.name}</p>
                      </div>
                      
                      <div>
                        <h3 className="flex items-center gap-2 font-semibold text-lg">
                          <User className="text-fastlabor-600" size={18} /> เพศ
                        </h3>
                        <p className="ml-7 text-gray-700">{worker.gender}</p>
                      </div>
                      
                      <div>
                        <h3 className="flex items-center gap-2 font-semibold text-lg">
                          <FileText className="text-fastlabor-600" size={18} /> ประเภทงาน
                        </h3>
                        <p className="ml-7 text-gray-700">{worker.jobType}</p>
                      </div>
                      
                      <div>
                        <h3 className="flex items-center gap-2 font-semibold text-lg">
                          <FileText className="text-fastlabor-600" size={18} /> ทักษะ
                        </h3>
                        <p className="ml-7 text-gray-700">{worker.skills}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p>ไม่พบข้อมูลงาน</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobDetailPage;
