import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserPostJobs } from '@/services/jobService';
import { getUnmatchedFindJobs } from '@/services/firestoreService';
import { updateMatchResultStatus } from '@/services/matchingService';
import { StatusResult } from '@/types/types';
import { Clipboard, Check, X, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from '@/lib/firebase';

const MyJobsPage: React.FC = () => {
  const { userProfile, userId, userEmail, userFullName } = useAuth();
  const [postJobs, setPostJobs] = useState<any[]>([]);
  const [findJobs, setFindJobs] = useState<any[]>([]);
  const [matches, setMatches] = useState<StatusResult[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.includes('/my-jobs/find') ? 'find' : 'post';
  
  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!userEmail) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [userEmail, navigate, location.pathname]);
  
  useEffect(() => {
    if (userId) {
      fetchData();
    }
    
    // Listen for find jobs updated event
    const handleFindJobsUpdated = () => {
      fetchData();
    };
    
    document.addEventListener('findJobsUpdated', handleFindJobsUpdated);
    
    return () => {
      document.removeEventListener('findJobsUpdated', handleFindJobsUpdated);
    };
  }, [userId]);
  
  const fetchData = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // Fetch posted jobs from Firestore
      const userPostedJobs = await getUserPostJobs(userId);
      setPostJobs(userPostedJobs);
      
      // Fetch ONLY unmatched find jobs from Firestore
      const unmatchedFindJobs = await getUnmatchedFindJobs(userId);
      setFindJobs(unmatchedFindJobs);
      
      // Fetch job matches for this user
      if (userId) {
        const matchResults: StatusResult[] = [];
        
        try {
          const matchResultsRef = collection(db, "match_results");
          // Get matches where the findjob belongs to this user and status is "on_queue"
          const q = query(
            matchResultsRef, 
            where("status", "==", "on_queue")
          );
          
          const querySnapshot = await getDocs(q);
          
          // Filter for this user's findjobs
          for (const doc of querySnapshot.docs) {
            const data = doc.data();
            
            // Check if this is the user's find job using the worker ID in each document
            if (data.workerId !== userId) {
              // Get the find job to check ownership
              const findJobRef = query(
                collection(db, "find_jobs"),
                where("findjob_id", "==", data.findjob_id)
              );
              const findJobSnapshot = await getDocs(findJobRef);
              
              // Skip if no find job or not owned by this user
              if (findJobSnapshot.empty) continue;
              
              const findJobData = findJobSnapshot.docs[0].data();
              if (findJobData.user_id !== userId) continue;
            }
            
            matchResults.push({
              id: doc.id,
              job_id: data.job_id,
              findjob_id: data.findjob_id,
              status: data.status,
              created_at: data.created_at?.toDate()?.toISOString() || new Date().toISOString(),
              updated_at: data.updated_at?.toDate()?.toISOString() || new Date().toISOString(),
              name: `${data.first_name} ${data.last_name}`,
              gender: data.gender,
              jobType: data.job_type,
              date: data.job_date,
              time: `${data.start_time} - ${data.end_time}`,
              location: `${data.province}/${data.district}/${data.subdistrict}`,
              salary: data.job_salary,
              workerId: data.findjob_id
            });
          }
        } catch (error) {
          console.error("Error fetching job matches:", error);
        }
        
        setMatches(matchResults);
      }
      
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("ไม่สามารถอัปเดตข้อมูล กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefresh = () => {
    fetchData();
    toast.success("อัปเดตข้อมูลล่าสุด");
  };
  
  const handleAcceptJob = async (matchId: string, jobId: string) => {
    try {
      // Update the status to accepted
      const success = await updateMatchResultStatus(matchId, "accepted");
      
      if (success) {
        toast.success("รับงานสำเร็จ กำลังไปยังหน้ารายละเอียด");
        
        // Remove this job from the list
        setMatches(matches.filter(match => match.id !== matchId));
        
        // Navigate to worker job detail page
        navigate(`/worker/jobs/${jobId}`);
      } else {
        toast.error("ไม่สามารถรับงานได้ กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      console.error("Error accepting job:", error);
      toast.error("ไม่สามารถรับงานได้ กรุณาลองใหม่อีกครั้ง");
    }
  };
  
  const handleDeclineJob = async (matchId: string) => {
    try {
      // Update the status to declined
      const success = await updateMatchResultStatus(matchId, "declined");
      
      if (success) {
        // Remove this job from the list
        setMatches(matches.filter(match => match.id !== matchId));
        toast.success("ปฏิเสธงานสำเร็จ");
      } else {
        toast.error("ไม่สามารถปฏิเสธงานได้ กรุณาลองใหม่อีกครั้ง");
      }
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

  // If user is not authenticated, we return null (redirect happens in useEffect)
  if (!userEmail) {
    return null;
  }

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
                  <h1 className="text-2xl font-bold text-gray-800">งานของฉัน</h1>
                  <p className="text-gray-600">สวัสดี, {userFullName || userEmail || 'ผู้ใช้งาน'}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleRefresh} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>รีเฟรช</span>
                </Button>
                <Button variant="outline" onClick={() => navigate('/post-job')} className="flex items-center gap-2">
                  <span>ลงประกาศงาน</span>
                </Button>
                <Button variant="outline" onClick={() => navigate('/find-job')} className="flex items-center gap-2">
                  <span>หางาน</span>
                </Button>
              </div>
            </div>

            <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="post">🚀 ลงประกาศงาน</TabsTrigger>
                <TabsTrigger value="find">🔍 หางาน</TabsTrigger>
              </TabsList>
              
              <TabsContent value="post">
                <h2 className="text-xl font-semibold mb-4">🚀 รายการที่ลงประกาศงาน</h2>
                {loading ? (
                  <div className="text-center py-8 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
                  </div>
                ) : postJobs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {postJobs.map((job) => (
                      <Card key={job.job_id || job.id} className="border border-gray-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg font-medium">
                            Job ID: {job.job_id || job.id}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-2 text-sm">
                            <div className="grid grid-cols-3 gap-1">
                              <span className="font-medium">ประเภทงาน:</span>
                              <span className="col-span-2">{job.job_type}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1">
                              <span className="font-medium">รายละเอียด:</span>
                              <span className="col-span-2">{job.job_detail}</span>
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
                              <span className="col-span-2">{job.job_address}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1">
                              <span className="font-medium">ค่าจ้าง:</span>
                              <span className="col-span-2">{job.salary} บาท</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-2 flex justify-between">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/matching/${job.job_id || job.id}`)}
                            className="text-xs"
                          >
                            ดูการจับคู่
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/status/${job.job_id || job.id}`)}
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
                      <div className="text-center py-8 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
                      </div>
                    ) : findJobs.length > 0 ? (
                      <div className="space-y-4">
                        {findJobs.map((job) => (
                          <Card key={job.findjob_id || job.id} className="border border-gray-200">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg font-medium">
                                Find Job ID: {job.findjob_id || job.id}
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
                      <div className="text-center py-8 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
                      </div>
                    ) : matches.length > 0 ? (
                      <div className="space-y-4">
                        {matches.map((match) => (
                          <Card key={match.id} className="border border-gray-200">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg font-medium flex justify-between">
                                <span>Job ID: {match.job_id}</span>
                                <span className="text-sm text-gray-500 font-normal">Find ID: {match.findjob_id}</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <div className="space-y-2 text-sm">
                                <div className="grid grid-cols-3 gap-1">
                                  <span className="font-medium">ประเภทงาน:</span>
                                  <span className="col-span-2">{match.jobType}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                  <span className="font-medium">วันที่:</span>
                                  <span className="col-span-2">{match.date}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                  <span className="font-medium">เวลา:</span>
                                  <span className="col-span-2">{match.time}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                  <span className="font-medium">สถานที่:</span>
                                  <span className="col-span-2">{match.location}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                  <span className="font-medium">ค่าจ้าง:</span>
                                  <span className="col-span-2">{match.salary} บาท</span>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="pt-2 flex justify-between">
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeclineJob(match.id)}
                                className="text-xs flex items-center gap-1"
                              >
                                <X size={16} /> ปฏิเสธ
                              </Button>
                              <Button 
                                className="text-xs bg-green-600 hover:bg-green-700 flex items-center gap-1"
                                size="sm"
                                onClick={() => handleAcceptJob(match.id, match.job_id || '')}
                              >
                                <Check size={16} /> รับงาน
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
