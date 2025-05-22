
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MatchResult } from '@/types/types';
import { User, Calendar, Clock, MapPin, Briefcase, Star, ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface JobMatchDetailsProps {
  matches: MatchResult[];
  rankLimit?: number;
  allowRanking?: boolean;
  onRankChange?: (id: string, newRank: number) => void;
  showViewButton?: boolean;
  onViewDetails?: (jobId: string) => void;
}

const JobMatchDetails: React.FC<JobMatchDetailsProps> = ({ 
  matches, 
  rankLimit,
  allowRanking = false,
  onRankChange,
  showViewButton = false,
  onViewDetails 
}) => {
  // If rankLimit is provided, only show that many matches
  const [displayMatches, setDisplayMatches] = useState<MatchResult[]>(
    rankLimit ? matches.slice(0, rankLimit) : matches
  );
  
  const handleRankUp = (index: number) => {
    if (!allowRanking || index === 0 || !onRankChange) return;
    
    const newMatches = [...displayMatches];
    const temp = newMatches[index];
    newMatches[index] = newMatches[index - 1];
    newMatches[index - 1] = temp;
    
    // Update priority based on new positions
    if (temp.id && onRankChange) {
      onRankChange(temp.id, index);
    }
    
    setDisplayMatches(newMatches);
  };
  
  const handleRankDown = (index: number) => {
    if (!allowRanking || index === displayMatches.length - 1 || !onRankChange) return;
    
    const newMatches = [...displayMatches];
    const temp = newMatches[index];
    newMatches[index] = newMatches[index + 1];
    newMatches[index + 1] = temp;
    
    // Update priority based on new positions
    if (temp.id && onRankChange) {
      onRankChange(temp.id, index + 2);
    }
    
    setDisplayMatches(newMatches);
  };
  
  if (!matches || matches.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">รายละเอียดการจับคู่</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            ยังไม่มีข้อมูลการจับคู่สำหรับงานนี้
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">รายละเอียดการจับคู่</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {displayMatches.map((match, index) => (
            <div key={match.id || index} className="border p-4 rounded-lg bg-gray-50 relative">
              {/* Rank indicator */}
              {rankLimit && (
                <Badge className="absolute top-2 right-2 bg-fastlabor-600">
                  อันดับ {index + 1}
                </Badge>
              )}
              
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-lg flex items-center">
                  <User className="h-5 w-5 mr-2 text-gray-500" />
                  {(match.first_name && match.last_name) ? 
                    `${match.first_name} ${match.last_name}` : 
                    match.name || "ไม่ระบุชื่อ"}
                </h3>
                {match.status && (
                  <Badge 
                    className={`${
                      match.status === "accepted" ? "bg-green-500" :
                      match.status === "declined" ? "bg-red-500" :
                      "bg-amber-500"
                    }`}
                  >
                    {match.status === "accepted" ? "รับงานแล้ว" :
                     match.status === "declined" ? "ปฏิเสธงาน" :
                     "รอตอบรับ"}
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-700">{match.jobType || match.job_type || "ไม่ระบุประเภทงาน"}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-700">{match.gender || "ไม่ระบุเพศ"}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-700">{match.date || match.job_date || "ไม่ระบุวันที่"}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-700">
                    {match.time || 
                     (match.start_time && match.end_time ? 
                      `${match.start_time} - ${match.end_time}` : 
                      "ไม่ระบุเวลา")}
                  </span>
                </div>
              </div>
              
              <div className="flex items-start mt-2">
                <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                <span className="text-gray-700 text-sm">
                  {match.location || 
                   (match.province || match.district || match.subdistrict ? 
                    `${match.province || "ไม่ระบุจังหวัด"} / ${match.district || "ไม่ระบุเขต"} / ${match.subdistrict || "ไม่ระบุแขวง"}` : 
                    "ไม่ระบุสถานที่")}
                </span>
              </div>
              
              {match.email && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">อีเมล:</span> {match.email}
                </div>
              )}
              
              {/* Ranking buttons shown only when allowed */}
              {allowRanking && index > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="absolute left-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => handleRankUp(index)}
                >
                  <ArrowUp size={16} />
                </Button>
              )}
              
              {allowRanking && index < displayMatches.length - 1 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => handleRankDown(index)}
                >
                  <ArrowDown size={16} />
                </Button>
              )}
              
              {/* View details button */}
              {showViewButton && match.status === "accepted" && onViewDetails && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => onViewDetails(match.job_id || "")}
                >
                  ดูรายละเอียดงาน
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobMatchDetails;
