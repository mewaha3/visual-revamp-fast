
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserJobs } from '@/services/jobService';
import { getUserFindJobs } from '@/services/findJobService';
import { getUserMatches, acceptJobMatch, declineJobMatch } from '@/services/matchService';
import { Job } from '@/types/types';
import { FindJob } from '@/data/findJobs';
import { FindMatch } from '@/types/types';
import { Clipboard, BarChart, Check, X, RefreshCw } from 'lucide-react';
import { toast } from "sonner";

const MyJobsPage: React.FC = () => {
  const { userEmail, userFullName } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [findJobs, setFindJobs] = useState<FindJob[]>([]);
  const [matches, setMatches] = useState<FindMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.includes('/my-jobs/find') ? 'find' : 'post';
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch posted jobs
        const userJobs = getUserJobs(userEmail);
        setJobs(userJobs);
        
        // Fetch find jobs
        const userFindJobs = getUserFindJobs(userEmail);
        setFindJobs(userFindJobs);
        
        // Fetch job matches
        if (userEmail) {
          const userMatches = await getUserMatches(userEmail);
          setMatches(userMatches);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userEmail]);
  
  const handleRefresh = () => {
    fetchData();
  };
  
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch posted jobs
      const userJobs = getUserJobs(userEmail);
      setJobs(userJobs);
      
      // Fetch find jobs
      const userFindJobs = getUserFindJobs(userEmail);
      setFindJobs(userFindJobs);
      
      // Fetch job matches
      if (userEmail) {
        const userMatches = await getUserMatches(userEmail);
        setMatches(userMatches);
      }
      
      toast.success("อัปเดตข้อมูลล่าสุด");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("ไม่สามารถอัปเดตข้อมูล กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };
  
  const handleAcceptJob = async (findjobId: string, jobId: string) => {
    try {
      await acceptJobMatch(findjobId);
      toast.success("รับงานสำเร็จ กำลังไปยังหน้ารายละเอียด");
      // Navigate to new worker job detail page
      navigate(`/worker/jobs/${jobId}`);
    } catch (error) {
      console.error("Error accepting job:", error);
      toast.error("ไม่สามารถรับงานได้ กรุณาลองใหม่อีกครั้ง");
    }
  };
  
  const handleDeclineJob = async (findjobId: string) => {
    try {
      await declineJobMatch(findjobId);
      // Remove the declined job from the list
      setMatches(matches.filter(match => match.findjob_id !== findjobId));
      toast.success("ปฏิเสธงานสำเร็จ");
    } catch (error) {
      console.error("Error declining job:", error);
      toast.error("ไม่สามารถปฏิเสธงานได้ กรุณาลองใหม่อีกครั้ง");
    }
  };

  const handleTabChange = (value: string) => {
    if (value === 'post') {
      navigate('/my-jobs');
    } else {
      navigate('/my-jobs/find');
    }
  };

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
                <Button variant="outline" onClick={handleRefresh} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </Button>
                <Button variant="outline" onClick={() => navigate('/post-job')} className="flex items-center gap-2">
                  <span>Post Job</span>
                </Button>
                <Button variant="outline" onClick={() => navigate('/find-job')} className="flex items-center gap-2">
                  <span>Find Job</span>
                </Button>
              </div>
            </div>

            <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="post">🚀 Post Job</TabsTrigger>
                <TabsTrigger value="find">🔍 Find Job</TabsTrigger>
              </TabsList>
              
              <TabsContent value="post">
                <h2 className="text-xl font-semibold mb-4">🚀 รายการที่ลงโพสต์งาน</h2>
                {loading ? (
                  <div className="text-center py-8">
                    <p>กำลังโหลดข้อมูล...</p>
                  </div>
                ) : jobs.length > 0 ? (
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
              </TabsContent>
              
              <TabsContent value="find">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">🔍 รายการค้นหางานของฉัน</h2>
                    {loading ? (
                      <div className="text-center py-8">
                        <p>กำลังโหลดข้อมูล...</p>
                      </div>
                    ) : findJobs.length > 0 ? (
                      <div className="space-y-4">
                        {findJobs.map((job) => (
                          <Card key={job.findjob_id} className="border border-gray-200">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg font-medium">
                                Find Job ID: {job.findjob_id}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <div className="space-y-2 text-sm">
                                <div className="grid grid-cols-3 gap-1">
                                  <span className="font-medium">ประเภทงาน:</span>
                                  <span className="col-span-2">{job.job_type}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                  <span className="font-medium">ทักษะ:</span>
                                  <span className="col-span-2">{job.skills}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                  <span className="font-medium">วันที่:</span>
                                  <span className="col-span-2">{job.job_date}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                  <span className="font-medium">เวลา:</span>
                                  <span className="col-span-2">{job.start_time} - {job.end_time}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                  <span className="font-medium">สถานที่:</span>
                                  <span className="col-span-2">{job.province}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                  <span className="font-medium">ค่าจ้าง:</span>
                                  <span className="col-span-2">{job.start_salary} - {job.range_salary} บาท</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>คุณยังไม่มีรายการค้นหางาน</p>
                        <p className="mt-2">
                          <Button variant="link" onClick={() => navigate('/find-job')} className="text-fastlabor-600">
                            ค้นหางานใหม่
                          </Button>
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-4">🎯 งานที่จับคู่ให้คุณ</h2>
                    {loading ? (
                      <div className="text-center py-8">
                        <p>กำลังโหลดข้อมูล...</p>
                      </div>
                    ) : matches.length > 0 ? (
                      <div className="space-y-4">
                        {matches.map((match) => (
                          <Card key={match.findjob_id} className="border border-gray-200">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg font-medium flex justify-between">
                                <span>Find Job ID: {match.findjob_id}</span>
                                <span className="text-sm text-gray-500 font-normal">Job ID: {match.job_id}</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <div className="space-y-2 text-sm">
                                <div className="grid grid-cols-3 gap-1">
                                  <span className="font-medium">ประเภทงาน:</span>
                                  <span className="col-span-2">{match.job_type}</span>
                                </div>
                                {match.detail && (
                                  <div className="grid grid-cols-3 gap-1">
                                    <span className="font-medium">รายละเอียด:</span>
                                    <span className="col-span-2">{match.detail}</span>
                                  </div>
                                )}
                                <div className="grid grid-cols-3 gap-1">
                                  <span className="font-medium">วันที่:</span>
                                  <span className="col-span-2">{match.job_date}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                  <span className="font-medium">เวลา:</span>
                                  <span className="col-span-2">{match.start_time} - {match.end_time}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                  <span className="font-medium">สถานที่:</span>
                                  <span className="col-span-2">
                                    {match.province}, {match.district}, {match.subdistrict}
                                  </span>
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                  <span className="font-medium">ค่าจ้าง:</span>
                                  <span className="col-span-2">{match.salary} THB/day</span>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="pt-2 flex justify-between">
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeclineJob(match.findjob_id)}
                                className="text-xs flex items-center gap-1"
                              >
                                <X size={16} /> Decline
                              </Button>
                              <Button 
                                className="text-xs bg-green-600 hover:bg-green-700 flex items-center gap-1"
                                size="sm"
                                onClick={() => handleAcceptJob(match.findjob_id, match.job_id)}
                              >
                                <Check size={16} /> Accept
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>คุณยังไม่มีรายการจับคู่งาน</p>
                        <p className="mt-2">
                          <Button variant="link" onClick={() => navigate('/find-job')} className="text-fastlabor-600">
                            ค้นหางานใหม่
                          </Button>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyJobsPage;
