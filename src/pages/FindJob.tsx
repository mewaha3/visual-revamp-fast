
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFindJobForm from "@/hooks/useFindJobForm";
import { JOB_TYPES } from "@/types/types";
import LocationDetailsForm from "@/components/jobs/LocationDetailsForm";
import AddressInformationForm from "@/components/jobs/AddressInformationForm";
import { Search } from "lucide-react";

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
              <div className="space-y-4">
                <h2 className="font-medium text-gray-700 mb-4">Job Information</h2>
                
                <div>
                  <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Type <span className="text-red-500">*</span>
                  </label>
                  <Select value={jobType} onValueChange={setJobType}>
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
                    onChange={(e) => setSkills(e.target.value)}
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
                    onChange={(e) => setJobDate(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <Select value={startTime} onValueChange={setStartTime}>
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
                    <Select value={endTime} onValueChange={setEndTime}>
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
              <div className="space-y-4">
                <h2 className="font-medium text-gray-700 mb-4">Salary Expectations</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="minSalary" className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Salary (THB) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="minSalary"
                      type="number"
                      value={minSalary}
                      onChange={(e) => setMinSalary(e.target.value)}
                      placeholder="Enter minimum salary"
                      min="0"
                    />
                  </div>

                  <div>
                    <label htmlFor="maxSalary" className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Salary (THB)
                    </label>
                    <Input
                      id="maxSalary"
                      type="number"
                      value={maxSalary}
                      onChange={(e) => setMaxSalary(e.target.value)}
                      placeholder="Enter maximum salary"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
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
