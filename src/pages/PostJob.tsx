
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
import useThailandLocations from "@/hooks/useThailandLocations";
import { Info } from "lucide-react";
import { useEffect } from "react";

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

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userEmail) {
      toast.error("กรุณาเข้าสู่ระบบก่อนลงประกาศงาน");
      navigate('/login', { state: { from: '/post-job' } });
    }
  }, [userEmail, navigate]);

  // Use the Thailand locations hook
  const {
    provinces,
    filteredAmphures,
    filteredTambons,
    isLoading,
    error,
    zipCode,
    handleProvinceChange,
    handleAmphureChange,
    handleTambonChange,
  } = useThailandLocations();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "province") {
      handleProvinceChange(value);
      setFormData({
        ...formData,
        [name]: value,
        district: "",
        subdistrict: "",
        postalCode: "",
      });
    } else if (name === "district") {
      handleAmphureChange(value);
      setFormData({
        ...formData,
        [name]: value,
        subdistrict: "",
        postalCode: "",
      });
    } else if (name === "subdistrict") {
      handleTambonChange(value);
      // Find selected tambon to get zip code
      const selectedTambon = filteredTambons.find(t => t.name_th === value);
      setFormData({
        ...formData,
        [name]: value,
        postalCode: selectedTambon?.zip_code || "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
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
            ลงประกาศงาน <span className="text-red-500">📢</span>
          </h1>
          
          <div className="p-6 bg-white rounded-lg shadow">
            <img 
              src="/lovable-uploads/b.png"
              alt="FastLabor Logo" 
              className="w-24 h-24 mx-auto mb-6"
            />
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-700">คำแนะนำในการกรอกข้อมูล</p>
                  <p className="text-sm text-blue-600">คุณสามารถกรอกข้อมูลได้ทั้งภาษาไทยและภาษาอังกฤษ โปรดระบุรายละเอียดให้ชัดเจนเพื่อให้ระบบช่วยจับคู่คนงานที่เหมาะสมกับงานของคุณได้ดียิ่งขึ้น</p>
                </div>
              </div>
            </div>
            
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
                provinces={provinces}
                districts={filteredAmphures}
                subdistricts={filteredTambons}
                isLoading={isLoading}
                error={error}
                zipCodeReadOnly={false}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-fastlabor-600 hover:bg-fastlabor-700 text-white"
              >
                ลงประกาศงาน
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
