
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MatchResult } from '@/types/types';
import { MapPin, Calendar, Clock, User, DollarSign, ArrowRight } from 'lucide-react';

interface JobMatchDetailsProps {
  matches: MatchResult[];
  showViewButton?: boolean;
  onViewDetails?: (jobId: string) => void;
}

const JobMatchDetails: React.FC<JobMatchDetailsProps> = ({ 
  matches,
  showViewButton = false,
  onViewDetails 
}) => {
  if (!matches || matches.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl">รายละเอียดการจับคู่</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">ไม่พบข้อมูลการจับคู่</p>
        </CardContent>
      </Card>
    );
  }

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'paid':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'on_queue':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Function to get readable status in Thai
  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'ยอมรับ';
      case 'declined':
        return 'ปฏิเสธ';
      case 'paid':
        return 'ชำระเงินแล้ว';
      case 'completed':
        return 'เสร็จสิ้น';
      case 'on_queue':
        return 'รอการตอบรับ';
      default:
        return status || 'ไม่ระบุ';
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl">รายละเอียดการจับคู่</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {matches.map((match, index) => (
          <div key={match.id || index} className="border rounded-md p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium flex items-center gap-2">
                <User size={18} className="text-fastlabor-600" />
                {match.name}
                {match.gender && (
                  <Badge variant="outline" className="ml-2">
                    {match.gender === 'male' ? 'ชาย' : match.gender === 'female' ? 'หญิง' : match.gender}
                  </Badge>
                )}
              </h3>
              <Badge className={getStatusColor(match.status)}>
                {getStatusText(match.status)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-500 flex-shrink-0" />
                <span>{match.province || "ไม่ระบุจังหวัด"}/{match.district || "ไม่ระบุเขต"}/{match.subdistrict || "ไม่ระบุแขวง"}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-500 flex-shrink-0" />
                <span>{match.date || "ไม่ระบุวันที่"}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-500 flex-shrink-0" />
                <span>{match.time || `${match.start_time || ""} - ${match.end_time || ""}`}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-gray-500 flex-shrink-0" />
                <span>{match.salary ? `${match.salary} บาท` : "ไม่ระบุค่าจ้าง"}</span>
              </div>
            </div>
            
            {showViewButton && onViewDetails && (
              <div className="mt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onViewDetails(match.job_id || "")}
                  className="w-full text-fastlabor-600 border-fastlabor-600"
                >
                  ดูรายละเอียด
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default JobMatchDetails;
