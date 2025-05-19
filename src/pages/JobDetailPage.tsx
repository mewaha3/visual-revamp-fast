
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobHeader from '@/components/jobs/JobHeader';
import JobDetailsCard from '@/components/jobs/JobDetailsCard';
import EmployerCard from '@/components/jobs/EmployerCard';
import JobActionButtons from '@/components/jobs/JobActionButtons';
import { useJobDetails } from '@/hooks/useJobDetails';
import { usePayment } from '@/hooks/usePayment';
import PaymentModal from '@/components/payment/PaymentModal';
import PaymentSuccessModal from '@/components/payment/PaymentSuccessModal';

const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const location = useLocation();
  const workerId = new URLSearchParams(location.search).get('workerId');
  
  // Get fromPayment from location state if available
  const { state } = location;
  const fromPaymentState = state?.fromPayment || false;
  
  // Custom hooks
  const { jobDetails, employer, loading } = useJobDetails(jobId);
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
  console.log("Payment state:", { 
    hasPaid, 
    fromPaymentState, 
    showPaymentModal, 
    showSuccessModal 
  });

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
          ) : jobDetails ? (
            <>
              <JobDetailsCard jobDetails={jobDetails} />
              
              {employer && <EmployerCard employer={employer} />}
              
              <JobActionButtons 
                jobId={jobId}
                workerId={workerId}
                hasPaid={hasPaid}
                fromPayment={fromPaymentState}
                onOpenPaymentModal={handleOpenPaymentModal}
              />
            </>
          ) : (
            <div className="text-center py-8">
              <p>ไม่พบข้อมูลงาน</p>
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
