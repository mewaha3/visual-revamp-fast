
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobHeader from '@/components/jobs/JobHeader';
import JobDetailsCard from '@/components/jobs/JobDetailsCard';
import EmployerCard from '@/components/jobs/EmployerCard';
import { Button } from "@/components/ui/button";
import { useJobDetails } from '@/hooks/useJobDetails';
import { CheckCircle, RefreshCcw, Phone } from 'lucide-react';
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

const WorkerJobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  
  // Custom hooks
  const { jobDetails, employer, matchDetails, loading, error } = useJobDetails(jobId);
  
  console.log("Worker Job Detail Page - Job ID:", jobId);
  console.log("Job Details:", jobDetails);
  console.log("Employer:", employer);
  console.log("Match Details:", matchDetails);
  
  const handleJobDone = () => {
    if (jobId) {
      toast.success("กำลังไปยังหน้ารีวิวนายจ้าง");
      navigate(`/employer-review/${jobId}`, {
        state: {
          jobId,
          jobType: jobDetails?.job_type,
          employerName: employer?.name
        }
      });
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-6">
        <div className="container mx-auto px-4">
          <JobHeader backTo="/my-jobs/find" backLabel="กลับไปยังรายการงานของฉัน" />
          
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
                  <RefreshCcw className="mr-2" size={18} />
                  ลองใหม่อีกครั้ง
                </Button>
                
                <Button 
                  onClick={() => navigate("/my-jobs/find")} 
                  variant="outline" 
                  className="mx-auto"
                >
                  กลับไปยังรายการงาน
                </Button>
              </div>
            </div>
          ) : jobDetails ? (
            <>
              <JobDetailsCard jobDetails={jobDetails} />
              
              {employer && (
                <>
                  <EmployerCard 
                    employer={{
                      name: employer.name || `${employer.first_name || ''} ${employer.last_name || ''}`.trim() || 'ไม่ระบุชื่อ',
                      rating: employer.rating,
                      reviews: employer.reviews
                    }} 
                  />
                  
                  {(employer.phone || employer.phone) && (
                    <Card className="mb-6 mt-4">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                          <Phone className="text-fastlabor-600" size={18} />
                          <h3 className="text-lg font-medium">เบอร์ติดต่อนายจ้าง</h3>
                        </div>
                        <p className="ml-7 mt-1">{employer.phone}</p>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
              
              <div className="mt-6 space-y-4">
                <Button 
                  onClick={handleJobDone}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="mr-2" size={18} />
                  งานเสร็จสิ้น (Job Done)
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p>ไม่พบข้อมูลงาน</p>
              <Button 
                onClick={() => navigate("/my-jobs/find")} 
                variant="outline" 
                className="mt-4"
              >
                กลับไปยังรายการงาน
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WorkerJobDetailPage;
