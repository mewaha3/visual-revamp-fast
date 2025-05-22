
import React from 'react';
import { Card } from "@/components/ui/card";
import { Star, User } from 'lucide-react';

interface EmployerCardProps {
  name: string;
  rating?: number;
  reviews?: number;
}

const EmployerCard: React.FC<EmployerCardProps> = ({ 
  name, 
  rating = 0, 
  reviews = 0 
}) => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="bg-gray-200 rounded-full p-3">
          <User size={24} className="text-gray-600" />
        </div>
        <div>
          <h3 className="font-medium">{name}</h3>
          {rating > 0 && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span>{rating.toFixed(1)}</span>
              {reviews > 0 && <span>({reviews} รีวิว)</span>}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default EmployerCard;
