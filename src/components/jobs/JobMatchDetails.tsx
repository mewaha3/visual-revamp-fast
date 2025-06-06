
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MatchResult } from '@/types/types';
import { MapPin, Calendar, Clock, User, DollarSign, ArrowRight, ChevronUp, ChevronDown, Briefcase, FileText } from 'lucide-react';

interface JobMatchDetailsProps {
  matches: MatchResult[];
  showViewButton?: boolean;
  onViewDetails?: (jobId: string) => void;
  allowRanking?: boolean;
  rankLimit?: number;
  onRankChange?: (matchId: string, newRank: number) => void;
  showSkills?: boolean;
  hideButtonForStatus?: string[];
}

const JobMatchDetails: React.FC<JobMatchDetailsProps> = ({ 
  matches,
  showViewButton = false,
  onViewDetails,
  allowRanking = false,
  rankLimit = 5,
  onRankChange,
  showSkills = false,
  hideButtonForStatus = []
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

  // Helper function to get formatted gender in Thai
  const getFormattedGender = (gender: string) => {
    if (!gender) return 'ไม่ระบุ';
    
    switch (gender.toLowerCase()) {
      case 'male':
        return 'ชาย';
      case 'female':
        return 'หญิง';
      default:
        return gender;
    }
  };

  // Check if view button should be hidden for this status
  const shouldHideButton = (status: string | undefined) => {
    if (!status || !hideButtonForStatus.length) return false;
    return hideButtonForStatus.includes(status.toLowerCase());
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
              <div className="flex items-center gap-2">
                <h3 className="font-medium flex items-center gap-2">
                  <User size={18} className="text-fastlabor-600" />
                  {match.name || `${match.first_name || ""} ${match.last_name || ""}`}
                </h3>
                {match.gender && (
                  <Badge variant="outline" className="ml-2">
                    {getFormattedGender(match.gender)}
                  </Badge>
                )}
                {allowRanking && typeof match.priority === 'number' && (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    ลำดับ {match.priority}
                  </Badge>
                )}
              </div>
              {match.status && (
                <Badge className={getStatusColor(match.status || '')}>
                  {getStatusText(match.status || '')}
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
              {match.jobType && (
                <div className="flex items-center gap-2">
                  <Briefcase size={16} className="text-gray-500 flex-shrink-0" />
                  <span>{match.jobType || match.job_type || "ไม่ระบุประเภทงาน"}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-500 flex-shrink-0" />
                <span>{match.province || "ไม่ระบุจังหวัด"}/{match.district || "ไม่ระบุเขต"}/{match.subdistrict || "ไม่ระบุแขวง"}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-500 flex-shrink-0" />
                <span>{match.date || match.job_date || "ไม่ระบุวันที่"}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-500 flex-shrink-0" />
                <span>
                  {match.time || 
                    (match.start_time && match.end_time ? 
                      `${match.start_time} - ${match.end_time}` : 
                      "ไม่ระบุเวลา")}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-gray-500 flex-shrink-0" />
                <span>
                  {typeof match.salary === 'number' || match.salary ? 
                    `${match.salary} บาท` : 
                    "ไม่ระบุค่าจ้าง"}
                </span>
              </div>
              
              {showSkills && match.skills && (
                <div className="flex items-center gap-2 col-span-2">
                  <FileText size={16} className="text-gray-500 flex-shrink-0" />
                  <span>ทักษะ: {match.skills || "ไม่ระบุ"}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {allowRanking && onRankChange && (
                <div className="flex items-center gap-2 mr-4">
                  <span className="text-sm text-gray-600">ลำดับ:</span>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        if (match.id && match.priority !== undefined && match.priority > 1) {
                          onRankChange(match.id, match.priority - 1);
                        }
                      }}
                      disabled={!match.id || match.priority === undefined || match.priority <= 1}
                    >
                      <ChevronUp size={16} />
                    </Button>
                    <span className="mx-2 font-medium">{match.priority || '-'}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        if (match.id && match.priority !== undefined && match.priority < rankLimit) {
                          onRankChange(match.id, match.priority + 1);
                        }
                      }}
                      disabled={!match.id || match.priority === undefined || match.priority >= rankLimit}
                    >
                      <ChevronDown size={16} />
                    </Button>
                  </div>
                </div>
              )}
              
              {showViewButton && onViewDetails && match.job_id && 
               !shouldHideButton(match.status) && 
               match.status?.toLowerCase() !== 'declined' && 
               match.status?.toLowerCase() !== 'on_queue' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onViewDetails(match.job_id || "")}
                  className="text-fastlabor-600 border-fastlabor-600"
                >
                  ดูรายละเอียด
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default JobMatchDetails;
