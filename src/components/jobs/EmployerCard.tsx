
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Employer } from '@/types/types';
import { User, Phone, Mail } from 'lucide-react';

interface EmployerCardProps {
  employer: Employer;
}

const EmployerCard: React.FC<EmployerCardProps> = ({ employer }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-2xl">ข้อมูลนายจ้าง</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-lg">
              <User className="text-fastlabor-600" size={18} /> ชื่อ-นามสกุล
            </h3>
            <p className="ml-7 text-gray-700">{employer.name}</p>
          </div>
          
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-lg">
              <Phone className="text-fastlabor-600" size={18} /> เบอร์โทรศัพท์
            </h3>
            <p className="ml-7 text-gray-700">{employer.phone}</p>
          </div>
          
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-lg">
              <Mail className="text-fastlabor-600" size={18} /> อีเมล
            </h3>
            <p className="ml-7 text-gray-700">{employer.email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployerCard;
