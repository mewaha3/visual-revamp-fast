
import { useState } from "react";
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
      <h2 className="font-medium text-gray-700">Job Information</h2>
      
      <div>
        <label htmlFor="JobType" className="block text-sm font-medium text-gray-700 mb-1">Job Type *</label>
        <Select
          value={jobType}
          onValueChange={onJobTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select job type" />
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
        <label htmlFor="jobDetail" className="block text-sm font-medium text-gray-700 mb-1">Job Detail *</label>
        <Textarea
          id="jobDetail"
          name="jobDetail"
          value={jobDetail}
          onChange={onJobDetailChange}
          placeholder="Enter job details"
          className="min-h-[100px]"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
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
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
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
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
          <Select
            value={startTime}
            onValueChange={onStartTimeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }).map((_, i) => (
                <SelectItem key={i} value={`${i}:00`}>{`${i}:00`}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
          <Select
            value={endTime}
            onValueChange={onEndTimeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
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
        <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">Salary (THB) *</label>
        <Input
          id="salary"
          name="salary"
          type="number"
          value={salary}
          onChange={onSalaryChange}
          placeholder="Enter salary"
          required
        />
      </div>
    </div>
  );
};

export default JobInformationForm;
