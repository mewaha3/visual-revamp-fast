
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check } from "lucide-react";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethod: string;
  jobId?: string;
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({ 
  isOpen, 
  onClose, 
  paymentMethod
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-xl text-center">Payment Success</DialogTitle>
        </DialogHeader>
        
        <div className="text-center">
          <p className="text-lg mb-8">
            คุณเลือกวิธีชำระเงิน: <span className="font-semibold">{paymentMethod}</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSuccessModal;
