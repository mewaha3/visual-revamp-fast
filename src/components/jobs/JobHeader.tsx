
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

interface JobHeaderProps {
  backTo?: string;
  backLabel?: string;
}

const JobHeader: React.FC<JobHeaderProps> = ({ 
  backTo = '/my-jobs/find',
  backLabel = 'กลับไปยังรายการจับคู่'
}) => {
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="outline" 
      className="mb-4"
      onClick={() => navigate(backTo)}
    >
      <ArrowLeft size={16} className="mr-2" />
      {backLabel}
    </Button>
  );
};

export default JobHeader;
