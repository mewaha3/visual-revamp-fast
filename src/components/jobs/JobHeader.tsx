
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

interface JobHeaderProps {
  backTo?: string;
  backLabel?: string;
  jobType?: string;
  location?: string;
  date?: string;
  time?: string;
  salary?: string;
  skills?: string[];
}

const JobHeader: React.FC<JobHeaderProps> = ({ 
  backTo = '/my-jobs/find',
  backLabel = 'กลับไปยังรายการจับคู่',
  jobType,
  location,
  date,
  time,
  salary,
  skills
}) => {
  const navigate = useNavigate();
  
  return (
    <div>
      <Button 
        variant="outline" 
        className="mb-4"
        onClick={() => navigate(backTo)}
      >
        <ArrowLeft size={16} className="mr-2" />
        {backLabel}
      </Button>
      
      {jobType && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">{jobType}</h2>
          {location && <p className="text-gray-600">{location}</p>}
          {date && <p className="text-gray-600">วันที่: {date}</p>}
          {time && <p className="text-gray-600">เวลา: {time}</p>}
          {salary && <p className="text-gray-600">ค่าตอบแทน: {salary}</p>}
          {skills && skills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobHeader;
