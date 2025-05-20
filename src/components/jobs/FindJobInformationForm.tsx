
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
      <h2 className="font-medium text-gray-700 mb-4">Job Information</h2>
      
      <div>
        <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
          Job Type <span className="text-red-500">*</span>
        </label>
        <Select value={jobType} onValueChange={onJobTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select job type" />
          </SelectTrigger>
          <SelectContent>
            {JOB_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
          Skills <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="skills"
          value={skills}
          onChange={onSkillsChange}
          placeholder="Enter your skills"
          rows={4}
        />
      </div>

      <div>
        <label htmlFor="jobDate" className="block text-sm font-medium text-gray-700 mb-1">
          Available Date <span className="text-red-500">*</span>
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
            Start Time <span className="text-red-500">*</span>
          </label>
          <Select value={startTime} onValueChange={onStartTimeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
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
            End Time <span className="text-red-500">*</span>
          </label>
          <Select value={endTime} onValueChange={onEndTimeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
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
