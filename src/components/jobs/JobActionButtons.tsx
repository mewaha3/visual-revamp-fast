
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle } from 'lucide-react';

interface JobActionButtonsProps {
  jobId?: string;
  workerId?: string | null;
  hasPaid: boolean;
  fromPayment: boolean;
  onOpenPaymentModal: () => void;
}

const JobActionButtons: React.FC<JobActionButtonsProps> = ({ 
  jobId, 
  workerId, 
  hasPaid, 
  fromPayment,
  onOpenPaymentModal
}) => {
  const navigate = useNavigate();
  
  const handleJobDone = () => {
    if (jobId) {
      navigate(`/jobs/${jobId}/review`, {
        state: {
          jobId,
          workerId
        }
      });
    }
  };
  
  return (
    <div className="mt-6 space-y-4">
      {/* Payment Button - Show only if workerId exists and not paid yet */}
      {workerId && !hasPaid && (
        <Button 
          onClick={onOpenPaymentModal}
          className="w-full bg-fastlabor-600 hover:bg-fastlabor-700 text-white"
        >
          <CreditCard className="mr-2" size={18} />
          ชำระเงินค่าบริการ
        </Button>
      )}
      
      {/* Job Done Button - Show only after payment */}
      {hasPaid && workerId && (
        <Button 
          onClick={handleJobDone}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <CheckCircle className="mr-2" size={18} />
          Job Done
        </Button>
      )}
    </div>
  );
};

export default JobActionButtons;
