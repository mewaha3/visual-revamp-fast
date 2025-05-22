
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, X } from 'lucide-react';

export interface JobActionButtonsProps {
  onAccept: () => void;
  onDecline: () => void;
}

const JobActionButtons: React.FC<JobActionButtonsProps> = ({ onAccept, onDecline }) => {
  return (
    <div className="flex gap-4 justify-center mt-4">
      <Button 
        variant="destructive" 
        className="flex-1"
        onClick={onDecline}
      >
        <X size={20} className="mr-2" />
        ปฏิเสธงาน
      </Button>
      <Button 
        variant="default" 
        className="flex-1 bg-green-600 hover:bg-green-700"
        onClick={onAccept}
      >
        <Check size={20} className="mr-2" />
        ยอมรับงาน
      </Button>
    </div>
  );
};

export default JobActionButtons;
