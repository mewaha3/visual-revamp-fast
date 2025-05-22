
import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobHeader from '@/components/jobs/JobHeader';
import JobDetailsCard from '@/components/jobs/JobDetailsCard';
import EmployerCard from '@/components/jobs/EmployerCard';
import { Button } from "@/components/ui/button";
import { useJobDetails } from '@/hooks/useJobDetails';
import { usePayment } from '@/hooks/usePayment';
import PaymentModal from '@/components/payment/PaymentModal';
import PaymentSuccessModal from '@/components/payment/PaymentSuccessModal';
import { RefreshCw, CreditCard } from 'lucide-react';

const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const workerId = new URLSearchParams(location.search).get('workerId');
  
  // Get fromPayment from location state if available
  const { state } = location;
  const fromPaymentState = state?.fromPayment || false;
  
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
  
  // For debugging
  console.log("Job Detail Page - Job ID:", jobId);
  console.log("Job Details:", jobDetails);
  console.log("Employer:", employer);
  console.log("Match Details:", matchDetails);
  
  const handleRetry = () => {
    window.location.reload();
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
              
              {employer && <EmployerCard employer={employer} />}
              
              {/* Replace job match details with payment button */}
              <div className="mt-6 space-y-4">
                <Button 
                  onClick={handleOpenPaymentModal} 
                  className="w-full bg-fastlabor-600 hover:bg-fastlabor-700 text-white"
                  disabled={hasPaid}
                >
                  <CreditCard className="mr-2" size={18} />
                  {hasPaid ? "ชำระเงินแล้ว" : "ชำระเงิน"}
                </Button>
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
