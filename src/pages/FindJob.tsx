
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { addNewFindJob } from "@/services/findJobService";
import { JOB_TYPES } from "@/types/types";
import { getJobIcon } from "@/utils/jobIcons";
import AddressInformationForm from "@/components/jobs/AddressInformationForm";

const FindJob: React.FC = () => {
  const navigate = useNavigate();
  const { userEmail, userFullName } = useAuth();
  const [formData, setFormData] = useState({
    jobType: "",
    skills: "",
    jobDate: "",
    startTime: "",
    endTime: "",
    province: "",
    district: "",
    subdistrict: "",
    startSalary: "",
    rangeSalary: "",
    address: "", // Added address field
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate form
      if (!formData.jobType || !formData.skills || !formData.jobDate || 
          !formData.startTime || !formData.endTime || !formData.province || 
          !formData.startSalary || !formData.address) {  // Added address to validation
        toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }

      // Create find job data - use jobType value directly without modification
      const jobData = {
        job_type: formData.jobType, // Use the selected value directly
        skills: formData.skills,
        job_date: formData.jobDate,
        start_time: formData.startTime,
        end_time: formData.endTime,
        province: formData.province,
        district: formData.district,
        subdistrict: formData.subdistrict,
        start_salary: parseInt(formData.startSalary) || 0,
        range_salary: parseInt(formData.rangeSalary) || 0,
        email: userEmail || "",
        first_name: userFullName?.split(" ")[0] || "",
        last_name: userFullName?.split(" ")[1] || "",
        job_address: formData.address, // Using the address field
        zip_code: "", // Required field but not collected in this form
        gender: "", // Required field but not collected in this form
      };

      // Add the new find job
      const newJob = addNewFindJob(jobData);
      console.log("New find job added:", newJob);
      
      // Show success message
      toast.success("สร้างการค้นหางานสำเร็จ");
      
      // Redirect to My Jobs page
      setTimeout(() => {
        navigate("/my-jobs/find");
      }, 1500);
    } catch (error) {
      console.error("Error submitting find job:", error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
            Find Job <span className="text-blue-500">🔍</span>
          </h1>
          
          <div className="p-6 bg-white rounded-lg shadow">
            <img 
              src="/lovable-uploads/a.png"
              alt="FastLabor Logo" 
              className="w-24 h-24 mx-auto mb-6"
            />
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h2 className="font-medium text-gray-700">Job Information</h2>
                
                <div>
                  <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">Job Type *</label>
                  <Select
                    value={formData.jobType}
                    onValueChange={(value) => handleSelectChange("jobType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      {JOB_TYPES.map((jobType) => (
                        <SelectItem key={jobType.value} value={jobType.value} className="flex items-center">
                          <div className="flex items-center">
                            {getJobIcon(jobType.icon)}
                            {jobType.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">Skills *</label>
                  <Textarea
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="Enter your skills"
                    className="min-h-[100px]"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="jobDate" className="block text-sm font-medium text-gray-700 mb-1">Available Date *</label>
                  <Input
                    id="jobDate"
                    name="jobDate"
                    type="date"
                    value={formData.jobDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                    <Select
                      value={formData.startTime}
                      onValueChange={(value) => handleSelectChange("startTime", value)}
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
                      value={formData.endTime}
                      onValueChange={(value) => handleSelectChange("endTime", value)}
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
              </div>
              
              <div className="space-y-4">
                <h2 className="font-medium text-gray-700">Address Information</h2>
                
                {/* Added address field */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address (House No, Street, Area) *</label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
                  <Select
                    value={formData.province}
                    onValueChange={(value) => handleSelectChange("province", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bangkok">กรุงเทพมหานคร</SelectItem>
                      <SelectItem value="chiang_mai">เชียงใหม่</SelectItem>
                      <SelectItem value="phuket">ภูเก็ต</SelectItem>
                      <SelectItem value="chonburi">ชลบุรี</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                  <Select
                    value={formData.district}
                    onValueChange={(value) => handleSelectChange("district", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="district1">เขตพระนคร</SelectItem>
                      <SelectItem value="district2">เขตดุสิต</SelectItem>
                      <SelectItem value="district3">เขตหนองจอก</SelectItem>
                      <SelectItem value="district4">เขตบางรัก</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="subdistrict" className="block text-sm font-medium text-gray-700 mb-1">Subdistrict *</label>
                  <Select
                    value={formData.subdistrict}
                    onValueChange={(value) => handleSelectChange("subdistrict", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subdistrict" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subdistrict1">แขวงตลาดยอด</SelectItem>
                      <SelectItem value="subdistrict2">แขวงวังบูรพาภิรมย์</SelectItem>
                      <SelectItem value="subdistrict3">แขวงจักรวรรดิ</SelectItem>
                      <SelectItem value="subdistrict4">แขวงสำราญราษฎร์</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="font-medium text-gray-700">Salary Expectations</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startSalary" className="block text-sm font-medium text-gray-700 mb-1">Minimum Salary (THB) *</label>
                    <Input
                      id="startSalary"
                      name="startSalary"
                      type="number"
                      value={formData.startSalary}
                      onChange={handleChange}
                      placeholder="Enter minimum salary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="rangeSalary" className="block text-sm font-medium text-gray-700 mb-1">Maximum Salary (THB)</label>
                    <Input
                      id="rangeSalary"
                      name="rangeSalary"
                      type="number"
                      value={formData.rangeSalary}
                      onChange={handleChange}
                      placeholder="Enter maximum salary"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-fastlabor-600 hover:bg-fastlabor-700 text-white"
              >
                Find Job
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FindJob;
