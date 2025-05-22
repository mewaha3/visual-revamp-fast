import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { getFindJobById } from "@/services/firestoreService";
import { isJobMatched, getJobMatches } from "@/services/api";
import { FindJob } from "@/types/types";
import { Loader2, ArrowLeft, Clock, Calendar, MapPin, Briefcase, DollarSign, User } from "lucide-react";

interface JobMatch {
  id: string;
  status: string;
  jobId: string;
  matchScore: number;
  worker_name?: string;
  worker_id?: string;
}

const AIMatchingPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [job, setJob] = useState<FindJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMatched, setIsMatched] = useState(false);
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const fetchJobData = async () => {
      if (!jobId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch job details
        const jobData = await getFindJobById(jobId);
        
        if (!jobData) {
          toast({
            title: "ไม่พบข้อมูลงาน",
            description: "ไม่สามารถดึงข้อมูลงานที่ต้องการได้",
            variant: "destructive",
          });
          navigate("/my-jobs");
          return;
        }
        
        setJob(jobData);
        
        // Check if job is already matched
        const matched = await isJobMatched(jobId);
        setIsMatched(matched);
        
        // If matched, get the matches
        if (matched) {
          const jobMatches = await getJobMatches(jobId);
          setMatches(jobMatches);
        }
      } catch (error) {
        console.error("Error fetching job data:", error);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถดึงข้อมูลงานได้ กรุณาลองใหม่อีกครั้ง",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobData();
  }, [jobId, navigate, toast]);

  const handleStartMatching = async () => {
    if (!job) return;
    
    try {
      // Simulate AI matching process
      toast({
        title: "กำลังจับคู่งาน",
        description: "ระบบกำลังค้นหาคนงานที่เหมาะสมกับงานของคุณ",
      });
      
      // Redirect to status page to show matching progress
      navigate(`/status/${jobId}`);
    } catch (error) {
      console.error("Error starting matching:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเริ่มกระบวนการจับคู่งานได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
  };

  const handleGoBack = () => {
    navigate("/my-jobs");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-fastlabor-600" />
            <span className="ml-2">กำลังโหลดข้อมูล...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">ไม่พบข้อมูลงาน</h2>
            <p className="mb-6">ไม่สามารถดึงข้อมูลงานที่ต้องการได้</p>
            <Button onClick={handleGoBack}>กลับไปหน้างานของฉัน</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleGoBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> กลับไปหน้างานของฉัน
          </Button>
          <h1 className="text-2xl font-bold">จับคู่งานอัตโนมัติ</h1>
          <p className="text-gray-600">
            ระบบ AI จะช่วยจับคู่งานของคุณกับคนงานที่เหมาะสมที่สุด
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{job.job_type}</CardTitle>
                    <CardDescription>
                      รหัสงาน: {job.findjob_id || job.id}
                    </CardDescription>
                  </div>
                  <Badge variant={isMatched ? "success" : "outline"}>
                    {isMatched ? "จับคู่แล้ว" : "ยังไม่ได้จับคู่"}
                  </Badge>
                </div>
              </CardHeader>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="px-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">รายละเอียดงาน</TabsTrigger>
                    <TabsTrigger value="matches" disabled={!isMatched}>
                      ผลการจับคู่ {matches.length > 0 && `(${matches.length})`}
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="details" className="m-0">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="font-medium">วันที่ทำงาน</p>
                          <p className="text-gray-600">{job.job_date}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="font-medium">เวลาทำงาน</p>
                          <p className="text-gray-600">{job.start_time} - {job.end_time}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="font-medium">สถานที่ทำงาน</p>
                          <p className="text-gray-600">
                            {job.job_address}, {job.subdistrict}, {job.district}, {job.province} {job.zip_code}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Briefcase className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="font-medium">ทักษะที่ต้องการ</p>
                          <p className="text-gray-600">{job.skills || "ไม่ระบุ"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <DollarSign className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="font-medium">ค่าจ้าง</p>
                          <p className="text-gray-600">
                            {job.start_salary} - {job.start_salary + job.range_salary} บาท
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <User className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="font-medium">เพศที่ต้องการ</p>
                          <p className="text-gray-600">
                            {job.gender === "male" ? "ชาย" : 
                             job.gender === "female" ? "หญิง" : "ไม่ระบุ"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </TabsContent>
                
                <TabsContent value="matches" className="m-0">
                  <CardContent className="pt-6">
                    {matches.length > 0 ? (
                      <div className="space-y-4">
                        {matches.map((match) => (
                          <div key={match.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{match.worker_name || "คนงาน"}</p>
                                <p className="text-sm text-gray-500">
                                  คะแนนความเหมาะสม: {match.matchScore}%
                                </p>
                              </div>
                              <Badge variant={
                                match.status === "accepted" ? "success" : 
                                match.status === "declined" ? "destructive" : "outline"
                              }>
                                {match.status === "accepted" ? "ยอมรับแล้ว" : 
                                 match.status === "declined" ? "ปฏิเสธแล้ว" : "รอการตอบรับ"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500">ยังไม่มีผลการจับคู่</p>
                      </div>
                    )}
                  </CardContent>
                </TabsContent>
              </Tabs>
              
              <CardFooter className="flex justify-end">
                {!isMatched && (
                  <Button onClick={handleStartMatching} className="bg-fastlabor-600 hover:bg-fastlabor-700">
                    เริ่มจับคู่งาน
                  </Button>
                )}
                {isMatched && (
                  <Button onClick={() => navigate(`/status/${jobId}`)} variant="outline">
                    ดูสถานะการจับคู่
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>ระบบจับคู่อัตโนมัติ</CardTitle>
                <CardDescription>
                  AI จะช่วยจับคู่งานของคุณกับคนงานที่เหมาะสมที่สุด
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">ประมวลผลอัตโนมัติ</p>
                      <p className="text-sm text-gray-500">ระบบจะประมวลผลและจับคู่งานให้อัตโนมัติ</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center">
                    <div className="bg-green-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">คัดกรองคุณภาพ</p>
                      <p className="text-sm text-gray-500">คัดกรองคนงานที่มีคุณภาพและตรงตามความต้องการ</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center">
                    <div className="bg-purple-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                        <path d="M12 20h9"/>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">ยืนยันการจ้างงาน</p>
                      <p className="text-sm text-gray-500">ยืนยันการจ้างงานได้ทันทีเมื่อพบคนงานที่เหมาะสม</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AIMatchingPage;
