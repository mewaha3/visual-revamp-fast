
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobHeader from '@/components/jobs/JobHeader';
import JobDetailsCard from '@/components/jobs/JobDetailsCard';
import { Button } from "@/components/ui/button";
import { useJobDetails } from '@/hooks/useJobDetails';
import { usePayment } from '@/hooks/usePayment';
import PaymentModal from '@/components/payment/PaymentModal';
import PaymentSuccessModal from '@/components/payment/PaymentSuccessModal';
import { RefreshCw, CreditCard, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getWorkerById } from '@/services/workerService';

const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const workerId = new URLSearchParams(location.search).get('workerId');
  
  // Get fromPayment from location state if available
  const { state } = location;
  const fromPaymentState = state?.fromPayment || false;
  
  // Worker information state
  const [workerDetails, setWorkerDetails] = useState<any>(null);
  
  // Custom hooks
  const { jobDetails, employer, matchDetails, loading, error } = useJobDetails(jobId);
  const { 
    showPaymentModal, 
    setShowPaymentModal, 
    showSuccessModal, 
    paymentMethod,
    hasPaid,
    handleOpenPaymentModal,
    handleConfirmPayment,
    handleCloseSuccessModal
  } = usePayment(fromPaymentState);
  
  // Get worker details when match details are available
  useEffect(() => {
    const fetchWorkerDetails = async () => {
      if (matchDetails && matchDetails.length > 0 && matchDetails[0].workerId) {
        try {
          const workerInfo = await getWorkerById(matchDetails[0].workerId);
          setWorkerDetails(workerInfo);
        } catch (error) {
          console.error("Failed to fetch worker details:", error);
        }
      }
    };
    
    fetchWorkerDetails();
  }, [matchDetails]);
  
  // For debugging
  console.log("Job Detail Page - Job ID:", jobId);
  console.log("Job Details:", jobDetails);
  console.log("Match Details:", matchDetails);
  console.log("Worker Details:", workerDetails);
  
  const handleRetry = () => {
    window.location.reload();
  };
  
  const handleJobDone = () => {
    if (jobId && matchDetails && matchDetails.length > 0) {
      const workerName = matchDetails[0].first_name_find_jobs && matchDetails[0].last_name_find_jobs
        ? `${matchDetails[0].first_name_find_jobs} ${matchDetails[0].last_name_find_jobs}`
        : matchDetails[0].name || `${matchDetails[0].first_name || ''} ${matchDetails[0].last_name || ''}`.trim() || 'ไม่ระบุชื่อ';
                         
      toast.success("กำลังไปยังหน้ารีวิวแรงงาน");
      navigate(`/review/${jobId}`, {
        state: {
          jobId,
          workerId: matchDetails[0].workerId,
          jobType: jobDetails?.job_type,
          workerName
        }
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-6">
        <div className="container mx-auto px-4">
          <JobHeader />
          
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
          ) : jobDetails ? (
            <>
              <JobDetailsCard jobDetails={jobDetails} />
              
              {/* Worker Information Card - Only showing the required information */}
              {matchDetails && matchDetails.length > 0 && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-2xl">รายละเอียดแรงงาน</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-fastlabor-100 text-fastlabor-600 text-xl">
                          {matchDetails[0].first_name_find_jobs?.charAt(0) || 
                           matchDetails[0].first_name?.charAt(0) || 
                           matchDetails[0].name?.charAt(0) || 'W'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-medium">
                          {(matchDetails[0].first_name_find_jobs && matchDetails[0].last_name_find_jobs) ? 
                            `${matchDetails[0].first_name_find_jobs} ${matchDetails[0].last_name_find_jobs}` : 
                            (matchDetails[0].first_name && matchDetails[0].last_name) ? 
                              `${matchDetails[0].first_name} ${matchDetails[0].last_name}` : 
                              matchDetails[0].name || 'ไม่ระบุชื่อ'}
                        </h3>
                        <p className="text-gray-500">{matchDetails[0].email || ''}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <h4 className="text-sm text-gray-500">เพศ</h4>
                        <p>{matchDetails[0].gender_find_jobs || matchDetails[0].gender || 'ไม่ระบุ'}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-gray-500">ประเภทงาน</h4>
                        <p>{matchDetails[0].jobType || matchDetails[0].job_type || 'ไม่ระบุ'}</p>
                      </div>
                      
                      {matchDetails[0].skills && (
                        <div className="col-span-2">
                          <h4 className="text-sm text-gray-500 mb-1">ทักษะ</h4>
                          <div className="flex flex-wrap gap-2">
                            {matchDetails[0].skills.split(',').map((skill: string, index: number) => (
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
              )}
              
              <div className="mt-6 space-y-4">
                {!hasPaid ? (
                  <Button 
                    onClick={handleOpenPaymentModal} 
                    className="w-full bg-fastlabor-600 hover:bg-fastlabor-700 text-white"
                  >
                    <CreditCard className="mr-2" size={18} />
                    ชำระเงิน
                  </Button>
                ) : (
                  <Button 
                    onClick={handleJobDone}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="mr-2" size={18} />
                    งานเสร็จสิ้น (Job Done)
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p>ไม่พบข้อมูลงาน</p>
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
      </main>
      
      {/* Payment Modals */}
      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handleConfirmPayment}
      />
      
      <PaymentSuccessModal 
        isOpen={showSuccessModal} 
        onClose={handleCloseSuccessModal}
        paymentMethod={paymentMethod}
        jobId={jobId}
      />
      
      <Footer />
    </div>
  );
};

export default JobDetailPage;
