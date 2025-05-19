
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobHeader from '@/components/jobs/JobHeader';
import JobDetailsCard from '@/components/jobs/JobDetailsCard';
import EmployerCard from '@/components/jobs/EmployerCard';
import { useJobDetails } from '@/hooks/useJobDetails';
import { Button } from "@/components/ui/button";
import { CheckCircle } from 'lucide-react';
import { toast } from "sonner";

const WorkerJobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  
  // Custom hooks
  const { jobDetails, employer, loading } = useJobDetails(jobId);
  
  console.log("Worker Job Detail Page - Job ID:", jobId);
  console.log("Job Details:", jobDetails);
  console.log("Employer:", employer);
  
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
          ) : jobDetails ? (
            <>
              <JobDetailsCard jobDetails={jobDetails} />
              
              {employer && <EmployerCard employer={employer} />}
              
              <div className="mt-6 space-y-4">
                <Button 
                  onClick={handleJobDone}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="mr-2" size={18} />
                  Job Done
                </Button>
              </div>
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

export default WorkerJobDetailPage;
