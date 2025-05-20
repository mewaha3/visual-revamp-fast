
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import useFindJobForm from "@/hooks/useFindJobForm";
import { Search, Loader2 } from "lucide-react";
import FindJobInformationForm from "@/components/jobs/FindJobInformationForm";
import AddressInformationForm from "@/components/jobs/AddressInformationForm";
import LocationDetailsForm from "@/components/jobs/LocationDetailsForm";
import SalaryExpectationsForm from "@/components/jobs/SalaryExpectationsForm";

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
    handleSubmit,
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
    isSubmitting,
  } = useFindJobForm();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
            Find Job <Search className="h-5 w-5" />
          </h1>
          
          <div className="p-6 bg-white rounded-lg shadow">
            <img 
              src="/lovable-uploads/b.png"
              alt="FastLabor Logo" 
              className="w-24 h-24 mx-auto mb-6"
            />
            
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
                    Processing...
                  </>
                ) : (
                  "Find Job"
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
