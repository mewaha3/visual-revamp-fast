
import { useState } from 'react';

export const usePayment = (fromPayment: boolean) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [hasPaid, setHasPaid] = useState(fromPayment);
  
  const handleOpenPaymentModal = () => {
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = (selectedPaymentMethod: string) => {
    setPaymentMethod(selectedPaymentMethod);
    setShowPaymentModal(false);
    setShowSuccessModal(true);
    setHasPaid(true); // Mark as paid when payment is confirmed
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };
  
  return {
    showPaymentModal,
    setShowPaymentModal,
    showSuccessModal,
    paymentMethod,
    hasPaid,
    handleOpenPaymentModal,
    handleConfirmPayment,
    handleCloseSuccessModal
  };
};
