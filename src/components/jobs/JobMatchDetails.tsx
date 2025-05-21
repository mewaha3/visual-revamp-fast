
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MatchResult } from '@/types/types';
import { User, Calendar, Clock, MapPin, Briefcase } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface JobMatchDetailsProps {
  matches: MatchResult[];
}

const JobMatchDetails: React.FC<JobMatchDetailsProps> = ({ matches }) => {
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
          {matches.map((match) => (
            <div key={match.id} className="border p-4 rounded-lg bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-lg flex items-center">
                  <User className="h-5 w-5 mr-2 text-gray-500" />
                  {match.first_name} {match.last_name}
                </h3>
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
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-700">{match.jobType}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-700">{match.gender}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-700">{match.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-700">{match.time}</span>
                </div>
              </div>
              
              <div className="flex items-start mt-2">
                <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                <span className="text-gray-700 text-sm">{match.location}</span>
              </div>
              
              {match.email && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">อีเมล:</span> {match.email}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobMatchDetails;
