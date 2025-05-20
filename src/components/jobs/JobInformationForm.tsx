
import { JOB_TYPES } from "@/types/types";
import { getJobIcon } from "@/utils/jobIcons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";

interface JobInformationFormProps {
  jobType: string;
  jobDetail: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  salary: string;
  onJobTypeChange: (value: string) => void;
  onJobDetailChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onStartDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEndDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onSalaryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const JobInformationForm = ({
  jobType,
  jobDetail,
  startDate,
  endDate,
  startTime,
  endTime,
  salary,
  onJobTypeChange,
  onJobDetailChange,
  onStartDateChange,
  onEndDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onSalaryChange
}: JobInformationFormProps) => {
  return (
    <div className="space-y-4">
      <h2 className="font-medium text-gray-700">รายละเอียดงาน</h2>
      
      <div>
        <label htmlFor="JobType" className="block text-sm font-medium text-gray-700 mb-1">ประเภทงาน <span className="text-red-500">*</span></label>
        <Select
          value={jobType}
          onValueChange={onJobTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="เลือกประเภทงาน" />
          </SelectTrigger>
          <SelectContent>
            {JOB_TYPES.map((jobType) => (
              <SelectItem key={jobType.value} value={jobType.value} className="flex items-center">
                <div className="flex items-center">
                  {getJobIcon(jobType.icon as any)}
                  {jobType.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label htmlFor="jobDetail" className="block text-sm font-medium text-gray-700 mb-1">รายละเอียดงาน <span className="text-red-500">*</span></label>
        <div className="text-xs text-gray-500 mb-1 flex items-center">
          <Info className="h-3 w-3 mr-1" />
          สามารถกรอกได้ทั้งภาษาไทยและภาษาอังกฤษ เช่น "ทำความสะอาดสำนักงาน, Office Cleaning"
        </div>
        <Textarea
          id="jobDetail"
          name="jobDetail"
          value={jobDetail}
          onChange={onJobDetailChange}
          placeholder="ระบุรายละเอียดงาน เช่น ทำความสะอาดสำนักงาน 5 ชั้น พื้นที่ 1,000 ตร.ม."
          className="min-h-[100px]"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">วันที่เริ่มงาน <span className="text-red-500">*</span></label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={startDate}
            onChange={onStartDateChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">วันที่สิ้นสุด <span className="text-red-500">*</span></label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={endDate}
            onChange={onEndDateChange}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">เวลาเริ่มงาน <span className="text-red-500">*</span></label>
          <Select
            value={startTime}
            onValueChange={onStartTimeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="เลือกเวลา" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }).map((_, i) => (
                <SelectItem key={i} value={`${i}:00`}>{`${i}:00`}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">เวลาสิ้นสุด <span className="text-red-500">*</span></label>
          <Select
            value={endTime}
            onValueChange={onEndTimeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="เลือกเวลา" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }).map((_, i) => (
                <SelectItem key={i} value={`${i}:00`}>{`${i}:00`}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">ค่าจ้าง (บาท) <span className="text-red-500">*</span></label>
        <Input
          id="salary"
          name="salary"
          type="number"
          value={salary}
          onChange={onSalaryChange}
          placeholder="เช่น 500"
          required
        />
      </div>
    </div>
  );
};

export default JobInformationForm;
