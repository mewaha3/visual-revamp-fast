
import React from 'react';
import { Card } from "@/components/ui/card";
import { Star, User } from 'lucide-react';

export interface Employer {
  name: string;
  rating?: number;
  reviews?: number;
  [key: string]: any; // For any additional fields
}

export interface EmployerCardProps {
  employer?: Employer;
}

const EmployerCard: React.FC<EmployerCardProps> = ({ employer }) => {
  // If employer is provided, use its properties
  const displayName = employer?.name || "ไม่ระบุชื่อ";
  const displayRating = employer?.rating || 0;
  const displayReviews = employer?.reviews || 0;

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="bg-gray-200 rounded-full p-3">
          <User size={24} className="text-gray-600" />
        </div>
        <div>
          <h3 className="font-medium">{displayName}</h3>
          {displayRating > 0 && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span>{displayRating.toFixed(1)}</span>
              {displayReviews > 0 && <span>({displayReviews} รีวิว)</span>}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default EmployerCard;
