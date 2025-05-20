
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { JOB_TYPES } from "@/types/types";
import { getJobIcon } from "@/utils/jobIcons";
import { Info } from "lucide-react";

interface FindJobInformationFormProps {
  jobType: string;
  skills: string;
  jobDate: string;
  startTime: string;
  endTime: string;
  onJobTypeChange: (value: string) => void;
  onSkillsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onJobDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}

const FindJobInformationForm = ({
  jobType,
  skills,
  jobDate,
  startTime,
  endTime,
  onJobTypeChange,
  onSkillsChange,
  onJobDateChange,
  onStartTimeChange,
  onEndTimeChange,
}: FindJobInformationFormProps) => {
  return (
    <div className="space-y-4">
      <h2 className="font-medium text-gray-700 mb-4">รายละเอียดงานที่ต้องการ</h2>
      
      <div>
        <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
          ประเภทงาน <span className="text-red-500">*</span>
        </label>
        <Select value={jobType} onValueChange={onJobTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="เลือกประเภทงาน" />
          </SelectTrigger>
          <SelectContent>
            {JOB_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value} className="flex items-center">
                <div className="flex items-center">
                  {getJobIcon(type.icon as any)}
                  {type.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
          ทักษะ/ความสามารถ <span className="text-red-500">*</span>
        </label>
        <div className="text-xs text-gray-500 mb-1 flex items-center">
          <Info className="h-3 w-3 mr-1" />
          สามารถกรอกได้ทั้งภาษาไทยและภาษาอังกฤษ เช่น "ทำความสะอาดบ้าน 3 ปี, House Cleaning"
        </div>
        <Textarea
          id="skills"
          value={skills}
          onChange={onSkillsChange}
          placeholder="ระบุทักษะหรือประสบการณ์ของคุณ เช่น ทำความสะอาดบ้าน 3 ปี"
          rows={4}
        />
      </div>

      <div>
        <label htmlFor="jobDate" className="block text-sm font-medium text-gray-700 mb-1">
          วันที่สะดวกทำงาน <span className="text-red-500">*</span>
        </label>
        <Input
          id="jobDate"
          type="date"
          value={jobDate}
          onChange={onJobDateChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
            เวลาเริ่มต้น <span className="text-red-500">*</span>
          </label>
          <Select value={startTime} onValueChange={onStartTimeChange}>
            <SelectTrigger>
              <SelectValue placeholder="เลือกเวลา" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                  {`${hour}:00`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
            เวลาสิ้นสุด <span className="text-red-500">*</span>
          </label>
          <Select value={endTime} onValueChange={onEndTimeChange}>
            <SelectTrigger>
              <SelectValue placeholder="เลือกเวลา" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                  {`${hour}:00`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FindJobInformationForm;
