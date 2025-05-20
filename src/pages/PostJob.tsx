
import { useState } from "react";
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
import { addNewJob } from "@/services/jobService";
import { JOB_TYPES } from "@/types/types";
import { 
  Bath, Car, Dog, Factory, FileText, Glasses, Home, 
  Broom, Package, Scissors, Search, Shield 
} from "lucide-react";

const PostJob = () => {
  const navigate = useNavigate();
  const { userEmail, userFullName } = useAuth();
  const [formData, setFormData] = useState({
    JobType: "",
    jobDetail: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    address: "",
    province: "",
    district: "",
    subdistrict: "",
    postalCode: "",
    salary: "",
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

  // Function to get the icon component based on job type
  const getJobIcon = (iconName: string) => {
    switch (iconName) {
      case "broom": return <Broom className="h-4 w-4 mr-2" />;
      case "shield": return <Shield className="h-4 w-4 mr-2" />;
      case "bath": return <Bath className="h-4 w-4 mr-2" />;
      case "scissors": return <Scissors className="h-4 w-4 mr-2" />;
      case "factory": return <Factory className="h-4 w-4 mr-2" />;
      case "package": return <Package className="h-4 w-4 mr-2" />;
      case "search": return <Search className="h-4 w-4 mr-2" />;
      case "dog": return <Dog className="h-4 w-4 mr-2" />;
      case "car": return <Car className="h-4 w-4 mr-2" />;
      case "home": return <Home className="h-4 w-4 mr-2" />;
      case "glasses": return <Glasses className="h-4 w-4 mr-2" />;
      case "file-text": return <FileText className="h-4 w-4 mr-2" />;
      default: return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate form (simple validation)
      if (!formData.JobType || !formData.jobDetail || !formData.startDate || 
          !formData.startTime || !formData.endTime || !formData.address || 
          !formData.province || !formData.salary) {
        toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }

      // Create job data
      const jobData = {
        job_type: formData.JobType,
        job_detail: formData.jobDetail,
        job_date: formData.startDate,
        start_time: formData.startTime,
        end_time: formData.endTime,
        job_address: `${formData.address}, ${formData.subdistrict}, ${formData.district}, ${formData.province} ${formData.postalCode}`,
        salary: parseInt(formData.salary) || 0,
        email: userEmail || "",
        first_name: userFullName?.split(" ")[0] || "",
        last_name: userFullName?.split(" ")[1] || "",
        gender: "",
        province: formData.province,
        district: formData.district,
        subdistrict: formData.subdistrict,
        zip_code: formData.postalCode,
      };

      // Add the new job
      const newJob = addNewJob(jobData);
      console.log("New job added:", newJob);
      
      // Show success message
      toast.success("ประกาศงานสำเร็จ");
      
      // Redirect to My Jobs page
      setTimeout(() => {
        navigate("/my-jobs");
      }, 1500);
    } catch (error) {
      console.error("Error submitting job:", error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
            Post Job <span className="text-red-500">📢</span>
          </h1>
          
          <div className="p-6 bg-white rounded-lg shadow">
            <img 
              src="/lovable-uploads/365674fc-1bea-4770-b4cb-f2f99ec0e841.png"
              alt="FastLabor Logo" 
              className="w-24 h-24 mx-auto mb-6"
            />
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h2 className="font-medium text-gray-700">Job Information</h2>
                
                <div>
                  <label htmlFor="JobType" className="block text-sm font-medium text-gray-700 mb-1">Job Type *</label>
                  <Select
                    value={formData.JobType}
                    onValueChange={(value) => handleSelectChange("JobType", value)}
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
                  <label htmlFor="jobDetail" className="block text-sm font-medium text-gray-700 mb-1">Job Detail *</label>
                  <Textarea
                    id="jobDetail"
                    name="jobDetail"
                    value={formData.jobDetail}
                    onChange={handleChange}
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
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
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

                <div>
                  <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">Salary (THB) *</label>
                  <Input
                    id="salary"
                    name="salary"
                    type="number"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="Enter salary"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="font-medium text-gray-700">Address Information</h2>
                
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
              </div>
              
              <div className="space-y-4">
                <h2 className="font-medium text-gray-700">Location Details</h2>
                
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
                
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-fastlabor-600 hover:bg-fastlabor-700 text-white"
              >
                Post Job
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostJob;
