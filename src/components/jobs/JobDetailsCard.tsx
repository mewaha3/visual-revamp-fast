
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobDetail } from '@/types/types';
import { Calendar, Clock, MapPin, Banknote, FileText, Phone } from 'lucide-react';

interface JobDetailsCardProps {
  jobDetails: JobDetail;
}

const JobDetailsCard: React.FC<JobDetailsCardProps> = ({ jobDetails }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-2xl">รายละเอียดงาน</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-lg">
                <FileText className="text-fastlabor-600" size={18} /> ประเภทงาน
              </h3>
              <p className="ml-7 text-gray-700">{jobDetails.job_type}</p>
            </div>
            
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-lg">
                <Calendar className="text-fastlabor-600" size={18} /> วันที่
              </h3>
              <p className="ml-7 text-gray-700">{jobDetails.job_date || "ไม่ระบุ"}</p>
            </div>
            
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-lg">
                <Clock className="text-fastlabor-600" size={18} /> เวลา
              </h3>
              <p className="ml-7 text-gray-700">
                {jobDetails.start_time && jobDetails.end_time ? 
                  `${jobDetails.start_time} - ${jobDetails.end_time}` : 
                  "ไม่ระบุ"}
              </p>
            </div>
            
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-lg">
                <Banknote className="text-fastlabor-600" size={18} /> ค่าจ้าง
              </h3>
              <p className="ml-7 text-gray-700">
                {typeof jobDetails.salary === 'number' && jobDetails.salary > 0 ? 
                  `${jobDetails.salary.toLocaleString()} บาท/วัน` : 
                  "ไม่ระบุ"}
              </p>
            </div>

            {jobDetails.phone && (
              <div className="col-span-1 md:col-span-2">
                <h3 className="flex items-center gap-2 font-semibold text-lg">
                  <Phone className="text-fastlabor-600" size={18} /> เบอร์ติดต่อ
                </h3>
                <p className="ml-7 text-gray-700">{jobDetails.phone}</p>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-lg">
              <MapPin className="text-fastlabor-600" size={18} /> สถานที่
            </h3>
            <p className="ml-7 text-gray-700">
              {jobDetails.job_address}<br />
              {jobDetails.subdistrict}, {jobDetails.district}, {jobDetails.province}
            </p>
          </div>
          
          {jobDetails.detail && (
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-lg">
                <FileText className="text-fastlabor-600" size={18} /> รายละเอียดงาน
              </h3>
              <p className="ml-7 text-gray-700">{jobDetails.detail}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobDetailsCard;
