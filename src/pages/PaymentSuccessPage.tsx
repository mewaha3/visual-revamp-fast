
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

interface LocationState {
  paymentMethod?: string;
  jobId?: string;
  workerId?: string;
}

const PaymentSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  
  useEffect(() => {
    if (!state?.paymentMethod) {
      // If no payment method in state, redirect to homepage
      navigate('/', { replace: true });
    } else if (state?.jobId) {
      // Save payment completion status
      localStorage.setItem(`payment-completed-${state.jobId}`, 'true');
    }
  }, [state, navigate]);
  
  const handleGoToJobDetails = () => {
    if (state?.jobId) {
      // Navigate back to job details with payment completed info
      // Fix: Use the correct job detail path with the jobId parameter
      navigate(`/job-detail/${state.jobId}`, { 
        replace: true,
        state: { 
          paymentCompleted: true,
          workerId: state.workerId
        }
      });
    } else {
      navigate('/');
    }
  };
  
  if (!state?.paymentMethod) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-10 pb-8 px-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold mb-6">Payment Success</h1>
              
              <p className="text-lg mb-8">
                คุณเลือกวิธีชำระเงิน: <span className="font-semibold">{state.paymentMethod}</span>
              </p>
              
              <Button 
                onClick={handleGoToJobDetails}
                className="bg-fastlabor-600 hover:bg-fastlabor-700 text-white w-full"
              >
                ไปสรุปผลการจ้างงาน
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;
