
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addNewJob } from "@/services/jobService";
import JobInformationForm from "@/components/jobs/JobInformationForm";
import AddressInformationForm from "@/components/jobs/AddressInformationForm";
import LocationDetailsForm from "@/components/jobs/LocationDetailsForm";

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
              <JobInformationForm 
                jobType={formData.JobType}
                jobDetail={formData.jobDetail}
                startDate={formData.startDate}
                endDate={formData.endDate}
                startTime={formData.startTime}
                endTime={formData.endTime}
                salary={formData.salary}
                onJobTypeChange={(value) => handleSelectChange("JobType", value)}
                onJobDetailChange={handleChange}
                onStartDateChange={handleChange}
                onEndDateChange={handleChange}
                onStartTimeChange={(value) => handleSelectChange("startTime", value)}
                onEndTimeChange={(value) => handleSelectChange("endTime", value)}
                onSalaryChange={handleChange}
              />
              
              <AddressInformationForm 
                address={formData.address}
                onAddressChange={handleChange}
              />
              
              <LocationDetailsForm 
                province={formData.province}
                district={formData.district}
                subdistrict={formData.subdistrict}
                postalCode={formData.postalCode}
                onProvinceChange={(value) => handleSelectChange("province", value)}
                onDistrictChange={(value) => handleSelectChange("district", value)}
                onSubdistrictChange={(value) => handleSelectChange("subdistrict", value)}
                onPostalCodeChange={handleChange}
              />
              
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
