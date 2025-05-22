
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArrowLeft, Briefcase, Calendar, Clock, MapPin, RefreshCw, Phone, Mail, User } from 'lucide-react';

interface MatchDetails {
  id?: string;
  job_id?: string;
  findjob_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  gender?: string;
  job_type?: string;
  job_date?: string;
  start_time?: string;
  end_time?: string;
  job_address?: string;
  province?: string;
  district?: string;
  subdistrict?: string;
  zip_code?: string;
  job_salary?: number;
  status?: string;
  skills?: string;
  workerId?: string;
  phone?: string;
}

const MatchDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      if (!jobId) {
        setError("ไม่พบข้อมูลงาน");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Query match_results collection for this job
        const matchesRef = collection(db, "match_results");
        const q = query(matchesRef, where("job_id", "==", jobId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError("ไม่พบข้อมูลการจับคู่สำหรับงานนี้");
          setLoading(false);
          return;
        }

        // Find the accepted match
        let acceptedMatch = null;
        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          if (data.status === "accepted") {
            acceptedMatch = { id: doc.id, ...data };
            break;
          }
        }

        if (!acceptedMatch) {
          setError("ไม่พบข้อมูลการจับคู่ที่ได้รับการยอมรับ");
          setLoading(false);
          return;
        }

        // Try to get additional worker details if workerId exists
        if (acceptedMatch.workerId) {
          try {
            const workerDoc = await getDoc(doc(db, "users", acceptedMatch.workerId));
            if (workerDoc.exists()) {
              const workerData = workerDoc.data();
              acceptedMatch = {
                ...acceptedMatch,
                phone: workerData.phone || acceptedMatch.phone,
                // Add any other worker details here
              };
            }
          } catch (workerError) {
            console.error("Error fetching worker details:", workerError);
            // Continue with the match data we have
          }
        }

        setMatchDetails(acceptedMatch);
      } catch (error) {
        console.error("Error fetching match details:", error);
        setError("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [jobId]);

  const handleRetry = () => {
    window.location.reload();
  };

  const getFormattedGender = (gender?: string) => {
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
            กลับ
          </Button>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Briefcase className="h-6 w-6 text-fastlabor-600" />
              <h1 className="text-2xl font-bold text-gray-800">รายละเอียดงานที่จับคู่</h1>
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
                    onClick={handleRetry} 
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
            ) : matchDetails ? (
              <div className="space-y-6">
                {/* Worker Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">ข้อมูลแรงงาน</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-fastlabor-100 text-fastlabor-600 text-xl">
                          {matchDetails.first_name?.charAt(0) || 'W'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-medium">
                          {`${matchDetails.first_name || ''} ${matchDetails.last_name || ''}`}
                        </h3>
                        <p className="text-gray-500">{matchDetails.email || ''}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <h4 className="text-sm text-gray-500">เพศ</h4>
                        <p>{getFormattedGender(matchDetails.gender)}</p>
                      </div>
                      
                      {matchDetails.phone && (
                        <div>
                          <h4 className="text-sm text-gray-500">เบอร์โทรศัพท์</h4>
                          <p className="flex items-center gap-2">
                            <Phone size={16} className="text-gray-500" />
                            {matchDetails.phone}
                          </p>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="text-sm text-gray-500">อีเมล</h4>
                        <p className="flex items-center gap-2">
                          <Mail size={16} className="text-gray-500" />
                          {matchDetails.email || 'ไม่ระบุ'}
                        </p>
                      </div>
                      
                      {matchDetails.skills && (
                        <div className="col-span-2">
                          <h4 className="text-sm text-gray-500 mb-1">ทักษะ</h4>
                          <div className="flex flex-wrap gap-2">
                            {matchDetails.skills.split(',').map((skill: string, index: number) => (
                              <Badge key={index} variant="secondary" className="px-2 py-1">
                                {skill.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Job Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">ข้อมูลงาน</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm text-gray-500">ประเภทงาน</h4>
                        <p className="flex items-center gap-2">
                          <Briefcase size={16} className="text-gray-500" />
                          {matchDetails.job_type || 'ไม่ระบุ'}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-gray-500">วันที่</h4>
                        <p className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-500" />
                          {matchDetails.job_date || 'ไม่ระบุ'}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-gray-500">เวลา</h4>
                        <p className="flex items-center gap-2">
                          <Clock size={16} className="text-gray-500" />
                          {matchDetails.start_time && matchDetails.end_time 
                            ? `${matchDetails.start_time} - ${matchDetails.end_time}` 
                            : 'ไม่ระบุ'}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-gray-500">ค่าจ้าง</h4>
                        <p>{matchDetails.job_salary ? `${matchDetails.job_salary} บาท` : 'ไม่ระบุ'}</p>
                      </div>
                      
                      <div className="col-span-2">
                        <h4 className="text-sm text-gray-500">สถานที่</h4>
                        <p className="flex items-center gap-2">
                          <MapPin size={16} className="text-gray-500" />
                          {matchDetails.job_address || 
                            `${matchDetails.province || ''} ${matchDetails.district || ''} ${matchDetails.subdistrict || ''} ${matchDetails.zip_code || ''}`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button
                        onClick={() => navigate('/my-jobs')}
                        variant="outline"
                        className="text-fastlabor-600 border-fastlabor-600"
                      >
                        กลับไปยังรายการงาน
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8">
                <p>ไม่พบข้อมูล</p>
                <Button 
                  onClick={() => navigate("/my-jobs")} 
                  variant="outline" 
                  className="mt-4"
                >
                  กลับไปยังรายการงาน
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MatchDetailPage;
