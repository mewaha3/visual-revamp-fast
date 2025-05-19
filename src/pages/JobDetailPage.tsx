
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getJobDetails, getEmployerDetails } from '@/services/matchService';
import { JobDetail, Employer } from '@/types/types';
import { ArrowLeft, Calendar, Clock, MapPin, Banknote, FileText, User, Phone, Mail } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  
  const [jobDetails, setJobDetails] = useState<JobDetail | null>(null);
  const [employer, setEmployer] = useState<Employer | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!jobId) return;
      
      setLoading(true);
      try {
        // Get job details
        const details = await getJobDetails(jobId);
        setJobDetails(details);
        
        // Get employer details
        const employerInfo = await getEmployerDetails(jobId);
        setEmployer(employerInfo);
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [jobId]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-6">
        <div className="container mx-auto px-4">
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => navigate('/my-jobs/find')}
          >
            <ArrowLeft size={16} className="mr-2" />
            กลับไปยังรายการจับคู่
          </Button>
          
          {loading ? (
            <div className="text-center py-8">
              <p>กำลังโหลดข้อมูล...</p>
            </div>
          ) : jobDetails ? (
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
                        <p className="ml-7 text-gray-700">{jobDetails.job_type}</p>
                      </div>
                      
                      <div>
                        <h3 className="flex items-center gap-2 font-semibold text-lg">
                          <Calendar className="text-fastlabor-600" size={18} /> วันที่
                        </h3>
                        <p className="ml-7 text-gray-700">{jobDetails.job_date}</p>
                      </div>
                      
                      <div>
                        <h3 className="flex items-center gap-2 font-semibold text-lg">
                          <Clock className="text-fastlabor-600" size={18} /> เวลา
                        </h3>
                        <p className="ml-7 text-gray-700">{jobDetails.start_time} - {jobDetails.end_time}</p>
                      </div>
                      
                      <div>
                        <h3 className="flex items-center gap-2 font-semibold text-lg">
                          <Banknote className="text-fastlabor-600" size={18} /> ค่าจ้าง
                        </h3>
                        <p className="ml-7 text-gray-700">{jobDetails.salary} บาท/วัน</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="flex items-center gap-2 font-semibold text-lg">
                        <MapPin className="text-fastlabor-600" size={18} /> สถานที่
                      </h3>
                      <p className="ml-7 text-gray-700">
                        {jobDetails.job_address}<br />
                        {jobDetails.subdistrict}, {jobDetails.district}, {jobDetails.province}
                      </p>
                    </div>
                    
                    {jobDetails.detail && (
                      <div>
                        <h3 className="flex items-center gap-2 font-semibold text-lg">
                          <FileText className="text-fastlabor-600" size={18} /> รายละเอียดงาน
                        </h3>
                        <p className="ml-7 text-gray-700">{jobDetails.detail}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {employer && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">ข้อมูลนายจ้าง</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="flex items-center gap-2 font-semibold text-lg">
                          <User className="text-fastlabor-600" size={18} /> ชื่อ-นามสกุล
                        </h3>
                        <p className="ml-7 text-gray-700">{employer.name}</p>
                      </div>
                      
                      <div>
                        <h3 className="flex items-center gap-2 font-semibold text-lg">
                          <Phone className="text-fastlabor-600" size={18} /> เบอร์โทรศัพท์
                        </h3>
                        <p className="ml-7 text-gray-700">{employer.phone}</p>
                      </div>
                      
                      <div>
                        <h3 className="flex items-center gap-2 font-semibold text-lg">
                          <Mail className="text-fastlabor-600" size={18} /> อีเมล
                        </h3>
                        <p className="ml-7 text-gray-700">{employer.email}</p>
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
