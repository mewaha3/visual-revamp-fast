
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, MapPin, User, Banknote, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface MatchJobDetail {
  id: string;
  job_id?: string;
  findjob_id?: string;
  first_name?: string;
  last_name?: string;
  first_name_post_jobs?: string;
  last_name_post_jobs?: string;
  job_type?: string;
  job_date?: string;
  start_time?: string;
  end_time?: string;
  province?: string;
  district?: string;
  subdistrict?: string;
  job_salary?: number;
  job_detail?: string;
  job_address?: string;
  status?: string;
  skills?: string;
  created_at?: any;
  updated_at?: any;
  gender?: string;
  email?: string;
  workerId?: string;
  userId?: string;
  user_id?: string; // Added this field as it may be used in match_results
}

const AcceptedJobDetailPage: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { userId } = useAuth();
  
  const [jobDetails, setJobDetails] = useState<MatchJobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!matchId) {
        setError('ไม่พบข้อมูลงาน');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log("Fetching match with ID:", matchId);
        // Get the match result document directly
        const matchDocRef = doc(db, "match_results", matchId);
        const matchDocSnap = await getDoc(matchDocRef);

        if (!matchDocSnap.exists()) {
          console.error("Match document not found:", matchId);
          setError('ไม่พบข้อมูลงานที่จับคู่');
          setLoading(false);
          return;
        }

        const matchData = matchDocSnap.data();
        console.log("Match data retrieved:", matchData);
        
        // Check if this match belongs to the current user
        if (userId !== matchData.workerId) {
          console.error("User doesn't match worker ID:", userId, matchData.workerId);
          setError('คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้');
          setLoading(false);
          return;
        }

        // Check if the job is in the correct status
        if (matchData.status !== 'accepted') {
          console.error("Job is not in accepted status:", matchData.status);
          setError('งานนี้ยังไม่ได้รับการยอมรับ');
          setLoading(false);
          return;
        }

        setJobDetails({
          id: matchDocSnap.id,
          ...matchData as MatchJobDetail
        });

      } catch (error) {
        console.error("Error fetching job details:", error);
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [matchId, userId]);

  const handleCompleteJob = async () => {
    if (!matchId || !jobDetails) return;
    
    setCompleting(true);
    
    try {
      // Update the match status to completed
      const matchDocRef = doc(db, "match_results", matchId);
      await updateDoc(matchDocRef, {
        status: "completed",
        updated_at: serverTimestamp()
      });
      
      toast.success("บันทึกสถานะงานเสร็จสิ้นเรียบร้อย");
      
      // Navigate to the worker review page
      navigate(`/worker-review/${matchId}`);
      
    } catch (error) {
      console.error("Error completing job:", error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setCompleting(false);
    }
  };

  // Format gender text
  const getFormattedGender = (gender: string | undefined) => {
    if (!gender) return 'ไม่ระบุ';
    
    switch (gender.toLowerCase()) {
      case 'male':
        return 'ชาย';
      case 'female':
        return 'หญิง';
      default:
        return gender;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-6">
        <div className="container mx-auto px-4">
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} className="mr-2" />
            ย้อนกลับ
          </Button>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">รายละเอียดงานที่รับแล้ว</h1>
              {jobDetails?.status && (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  สถานะ: {jobDetails.status === 'accepted' ? 'รับงานแล้ว' : 
                         jobDetails.status === 'completed' ? 'เสร็จสิ้น' : 
                         jobDetails.status}
                </Badge>
              )}
            </div>

            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>กำลังโหลดข้อมูล...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
                <Button 
                  onClick={() => navigate('/my-jobs')} 
                  variant="outline" 
                  className="mt-4"
                >
                  กลับไปยังรายการงาน
                </Button>
              </div>
            ) : jobDetails ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>ข้อมูลงาน</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <FileText className="text-fastlabor-600 mt-1 flex-shrink-0" size={18} />
                          <div>
                            <p className="font-medium">ประเภทงาน</p>
                            <p>{jobDetails.job_type || 'ไม่ระบุ'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <Calendar className="text-fastlabor-600 mt-1 flex-shrink-0" size={18} />
                          <div>
                            <p className="font-medium">วันที่</p>
                            <p>{jobDetails.job_date || 'ไม่ระบุ'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <Clock className="text-fastlabor-600 mt-1 flex-shrink-0" size={18} />
                          <div>
                            <p className="font-medium">เวลา</p>
                            <p>{jobDetails.start_time && jobDetails.end_time 
                                ? `${jobDetails.start_time} - ${jobDetails.end_time}` 
                                : 'ไม่ระบุ'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="text-fastlabor-600 mt-1 flex-shrink-0" size={18} />
                          <div>
                            <p className="font-medium">สถานที่</p>
                            <p>{jobDetails.job_address || 'ไม่ระบุ'}</p>
                            <p>{jobDetails.province && jobDetails.district && jobDetails.subdistrict ? 
                                `${jobDetails.subdistrict}, ${jobDetails.district}, ${jobDetails.province}` : 
                                'ไม่ระบุ'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <Banknote className="text-fastlabor-600 mt-1 flex-shrink-0" size={18} />
                          <div>
                            <p className="font-medium">ค่าจ้าง</p>
                            <p>{jobDetails.job_salary ? `${jobDetails.job_salary} บาท` : 'ไม่ระบุ'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {jobDetails.job_detail && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="font-medium">รายละเอียดงาน</p>
                        <p className="mt-1">{jobDetails.job_detail}</p>
                      </div>
                    )}

                    {jobDetails.skills && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="font-medium">ทักษะที่ต้องการ</p>
                        <p className="mt-1">{jobDetails.skills}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>ข้อมูลนายจ้าง</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-2">
                      <User className="text-fastlabor-600 mt-1 flex-shrink-0" size={18} />
                      <div>
                        <p className="font-medium">ชื่อ-นามสกุล</p>
                        <p>{jobDetails.first_name_post_jobs && jobDetails.last_name_post_jobs ? 
                            `${jobDetails.first_name_post_jobs} ${jobDetails.last_name_post_jobs}` : 
                            'ไม่ระบุ'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-8 flex justify-center">
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-8"
                    onClick={handleCompleteJob}
                    disabled={completing || jobDetails.status === 'completed'}
                  >
                    {completing ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        กำลังดำเนินการ...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} />
                        งานเสร็จสิ้น
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p>ไม่พบข้อมูล</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AcceptedJobDetailPage;
