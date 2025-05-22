
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import EmployerCard from '@/components/jobs/EmployerCard';
import JobHeader from '@/components/jobs/JobHeader';
import { mockMatches } from '@/data/mocks/matchMocks';

const AIMatchingPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null);

  // Get the job details from matchMocks
  const job = mockMatches.find(match => match.job_id === jobId);
  
  // Get all matching workers for this job
  const matchingWorkers = mockMatches.filter(match => 
    match.job_id === jobId && match.findjob_id
  );
  
  // Group by worker to avoid duplicates
  const uniqueWorkers = matchingWorkers.reduce((acc: any[], current) => {
    const exists = acc.find(w => w.findjob_id === current.findjob_id);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, []);
  
  // Sort by priority or score (highest first)
  const sortedWorkers = [...uniqueWorkers].sort((a, b) => {
    if (a.priority !== undefined && b.priority !== undefined) {
      return b.priority - a.priority;
    }
    return (b.score || b.aiScore || 0) - (a.score || a.aiScore || 0);
  });
  
  const handleSelectWorker = (workerId: string) => {
    setSelectedWorker(workerId === selectedWorker ? null : workerId);
  };
  
  const handleAcceptWorker = () => {
    if (selectedWorker) {
      // Logic to accept worker would go here
      // For now, just navigate to the status page
      navigate(`/status/${jobId}`);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-6">
        <div className="container mx-auto px-4">
          <JobHeader 
            backTo="/my-jobs"
            backLabel="กลับไปยังรายการงานของฉัน"
          />
          
          {job && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-2xl">รายละเอียดงาน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">ประเภทงาน:</h3>
                    <p>{job.job_type || "ไม่ระบุ"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">วันที่:</h3>
                    <p>{job.job_date || "ไม่ระบุ"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">เวลา:</h3>
                    <p>{job.start_time} - {job.end_time}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">สถานที่:</h3>
                    <p>{job.province}/{job.district}/{job.subdistrict}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">รายละเอียดงาน:</h3>
                    <p>{job.detail || "ไม่ระบุรายละเอียด"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">ค่าจ้าง:</h3>
                    <p>{job.salary} บาท</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">แรงงานที่แนะนำ ({sortedWorkers.length})</h2>
            
            {sortedWorkers.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {sortedWorkers.map((worker) => (
                  <Card 
                    key={worker.findjob_id} 
                    className={`border-2 cursor-pointer transition-all ${
                      selectedWorker === worker.findjob_id 
                        ? "border-fastlabor-600 shadow-md" 
                        : "border-transparent hover:border-gray-200"
                    }`}
                    onClick={() => handleSelectWorker(worker.findjob_id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-14 w-14">
                            <AvatarFallback className="bg-fastlabor-100 text-fastlabor-600 text-xl">
                              {worker.name?.charAt(0) || 'W'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-lg">{worker.name}</h3>
                            <p className="text-sm text-gray-500">{worker.gender} • {worker.jobType}</p>
                            
                            <div className="mt-2 flex flex-wrap gap-1">
                              <Badge variant="outline" className="bg-fastlabor-50">
                                {worker.time}
                              </Badge>
                              <Badge variant="outline" className="bg-fastlabor-50">
                                {worker.location}
                              </Badge>
                              {worker.skills && worker.skills.split(',').map((skill: string, i: number) => (
                                <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-800">
                                  {skill.trim()}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="bg-fastlabor-50 rounded-full p-3">
                            <span className="text-lg font-bold text-fastlabor-600">
                              {Math.round((worker.score || worker.aiScore || 0) * 100)}%
                            </span>
                          </div>
                          <p className="text-xs mt-1">คะแนนจับคู่</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center py-8">ไม่พบแรงงานที่เหมาะสมกับงานนี้</p>
            )}
          </div>
          
          {/* Employer information section */}
          {job && (
            <EmployerCard 
              employer={{
                id: job.job_id || "",
                name: "นายจ้าง",
                email: "",
                first_name: "",
                last_name: "",
                rating: 0,
                reviews: 0
              }} 
            />
          )}
          
          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleAcceptWorker}
              className="bg-fastlabor-600 hover:bg-fastlabor-700 text-white px-6"
              disabled={!selectedWorker}
            >
              ยืนยันการจับคู่แรงงาน
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AIMatchingPage;
