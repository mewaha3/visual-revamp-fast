
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import useFindJobForm from "@/hooks/useFindJobForm";
import { Search, Loader2, Info } from "lucide-react";
import FindJobInformationForm from "@/components/jobs/FindJobInformationForm";
import AddressInformationForm from "@/components/jobs/AddressInformationForm";
import LocationDetailsForm from "@/components/jobs/LocationDetailsForm";
import SalaryExpectationsForm from "@/components/jobs/SalaryExpectationsForm";
import { addFindJob } from "@/services/firestoreService";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const FindJob = () => {
  const {
    jobType,
    setJobType,
    skills,
    setSkills,
    jobDate,
    setJobDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    address,
    setAddress,
    minSalary,
    setMinSalary,
    maxSalary,
    setMaxSalary,
    handleSubmit: originalSubmit,
    provinces,
    filteredAmphures,
    filteredTambons,
    isLoading,
    error,
    zipCode,
    selectedProvince,
    selectedAmphure,
    selectedTambon,
    handleProvinceChange,
    handleAmphureChange,
    handleTambonChange,
  } = useFindJobForm();

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userProfile, userId } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobType || !jobDate || !startTime || !endTime || !selectedProvince || !minSalary) {
      toast.error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for Firestore
      const findJobData = {
        first_name: userProfile?.first_name || "",
        last_name: userProfile?.last_name || "",
        email: userProfile?.email || "",
        job_type: jobType,
        skills: skills,
        job_date: jobDate,
        start_time: startTime,
        end_time: endTime,
        job_address: address,
        province: selectedProvince,
        district: selectedAmphure,
        subdistrict: selectedTambon,
        zip_code: zipCode,
        start_salary: Number(minSalary),
        range_salary: Number(maxSalary),
        gender: userProfile?.gender || "",
      };
      
      // Save to Firestore
      const findjobId = await addFindJob(findJobData, userId || undefined);
      
      toast.success("บันทึกข้อมูลการหางานสำเร็จ");
      
      // Redirect to find job listing or results page
      setTimeout(() => {
        navigate("/my-find-jobs");
      }, 1500);
      
    } catch (error) {
      console.error("Error submitting find job:", error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
            ค้นหางาน <Search className="h-5 w-5" />
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
                  <p className="text-sm text-blue-600">คุณสามารถกรอกข้อมูลได้ทั้งภาษาไทยและภาษาอังกฤษ โปรดระบุรายละเอียดให้ชัดเจนเพื่อให้ระบบช่วยค้นหางานที่เหมาะสมกับคุณได้ดียิ่งขึ้น</p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Information Section */}
              <FindJobInformationForm
                jobType={jobType}
                skills={skills}
                jobDate={jobDate}
                startTime={startTime}
                endTime={endTime}
                onJobTypeChange={setJobType}
                onSkillsChange={(e) => setSkills(e.target.value)}
                onJobDateChange={(e) => setJobDate(e.target.value)}
                onStartTimeChange={setStartTime}
                onEndTimeChange={setEndTime}
              />

              {/* Address Information */}
              <AddressInformationForm 
                address={address}
                onAddressChange={(e) => setAddress(e.target.value)}
              />

              {/* Location Details */}
              <LocationDetailsForm
                province={selectedProvince}
                district={selectedAmphure}
                subdistrict={selectedTambon}
                postalCode={zipCode}
                onProvinceChange={handleProvinceChange}
                onDistrictChange={handleAmphureChange}
                onSubdistrictChange={handleTambonChange}
                onPostalCodeChange={() => {}} // Postal code is auto-populated
                provinces={provinces}
                districts={filteredAmphures}
                subdistricts={filteredTambons}
                isLoading={isLoading}
                error={error}
                zipCodeReadOnly={true}
              />

              {/* Salary Expectations */}
              <SalaryExpectationsForm
                minSalary={minSalary}
                maxSalary={maxSalary}
                onMinSalaryChange={(e) => setMinSalary(e.target.value)}
                onMaxSalaryChange={(e) => setMaxSalary(e.target.value)}
              />

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-fastlabor-600 hover:bg-fastlabor-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    กำลังบันทึกข้อมูล...
                  </>
                ) : (
                  "บันทึกข้อมูลการหางาน"
                )}
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
