
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserJobs } from '@/services/api';
import { Job } from '@/types/types';
import { Clipboard, BarChart } from 'lucide-react';

const MyJobsPage: React.FC = () => {
  const { userEmail, userFullName } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchJobs = async () => {
      const userJobs = getUserJobs(userEmail);
      setJobs(userJobs);
    };
    
    fetchJobs();
  }, [userEmail]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-6">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Clipboard className="h-8 w-8 text-fastlabor-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">My Jobs</h1>
                  <p className="text-gray-600">สวัสดี, {userFullName || userEmail || 'ผู้ใช้งาน'}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate('/post-job')} className="flex items-center gap-2">
                  <span>Post Job</span>
                </Button>
                <Button variant="outline" onClick={() => navigate('/find-job')} className="flex items-center gap-2">
                  <span>Find Job</span>
                </Button>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">🚀 รายการที่ลงโพสต์งาน</h2>
            
            {jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <Card key={job.job_id} className="border border-gray-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">
                        Job ID: {job.job_id}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-3 gap-1">
                          <span className="font-medium">ชนิด:</span>
                          <span className="col-span-2">{job.job_type}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="font-medium">Detail:</span>
                          <span className="col-span-2">{job.job_detail}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="font-medium">Date:</span>
                          <span className="col-span-2">{job.job_date}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="font-medium">Time:</span>
                          <span className="col-span-2">{job.start_time} - {job.end_time}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="font-medium">Location:</span>
                          <span className="col-span-2">{job.job_address}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="font-medium">Salary:</span>
                          <span className="col-span-2">{job.salary} บาท</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/matching/${job.job_id}`)}
                        className="text-xs"
                      >
                        ดูการจับคู่
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/status/${job.job_id}`)}
                        className="text-xs"
                      >
                        ดูสถานะการจับคู่
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>คุณยังไม่มีรายการประกาศงาน</p>
                <p className="mt-2">
                  <Button variant="link" onClick={() => navigate('/post-job')} className="text-fastlabor-600">
                    ลงประกาศงานใหม่
                  </Button>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyJobsPage;
