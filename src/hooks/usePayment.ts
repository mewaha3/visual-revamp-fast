
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePayment = (initialFromPayment: boolean = false) => {
  const location = useLocation();
  const fromPaymentState = location.state?.fromPayment || false;
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [hasPaid, setHasPaid] = useState(initialFromPayment || fromPaymentState);
  
  // Update hasPaid if the location state changes
  useEffect(() => {
    setHasPaid(prevState => prevState || fromPaymentState);
  }, [fromPaymentState]);
  
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
