
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/jobs/SearchBar";
import FilterBar from "@/components/jobs/FilterBar";
import JobResults from "@/components/jobs/JobResults";
import { findJobs } from "@/data/findJobs";
import useThailandLocations from "@/hooks/useThailandLocations";

const FindJob = () => {
  const navigate = useNavigate();
  const {
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
  } = useThailandLocations();

  const [searchTerm, setSearchTerm] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [subdistrictFilter, setSubdistrictFilter] = useState("");

  // Update filters when location selections change
  useEffect(() => {
    if (selectedProvince) {
      setProvinceFilter(selectedProvince);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedAmphure) {
      setDistrictFilter(selectedAmphure);
    }
  }, [selectedAmphure]);

  useEffect(() => {
    if (selectedTambon) {
      setSubdistrictFilter(selectedTambon);
    }
  }, [selectedTambon]);

  // Filter jobs based on search term and filters
  const filteredJobs = findJobs.filter((job) => {
    // Filter by search term
    const matchesSearchTerm = searchTerm
      ? job.job_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    // Filter by job type
    const matchesJobType = jobTypeFilter && jobTypeFilter !== "all-types" 
      ? job.job_type === jobTypeFilter 
      : true;

    // Filter by location
    const matchesProvince = provinceFilter && provinceFilter !== "all-provinces" 
      ? job.province === provinceFilter 
      : true;
    const matchesDistrict = districtFilter && districtFilter !== "all-districts" 
      ? job.district === districtFilter 
      : true;
    const matchesSubdistrict = subdistrictFilter && subdistrictFilter !== "all-subdistricts" 
      ? job.subdistrict === subdistrictFilter 
      : true;

    return matchesSearchTerm && matchesJobType && matchesProvince && matchesDistrict && matchesSubdistrict;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleJobTypeChange = (value: string) => {
    setJobTypeFilter(value);
  };

  const handleProvinceFilterChange = (value: string) => {
    if (value === "all-provinces") {
      setProvinceFilter(value);
      setDistrictFilter("");
      setSubdistrictFilter("");
      return;
    }
    handleProvinceChange(value);
  };

  const handleDistrictFilterChange = (value: string) => {
    if (value === "all-districts") {
      setDistrictFilter(value);
      setSubdistrictFilter("");
      return;
    }
    handleAmphureChange(value);
  };

  const handleSubdistrictFilterChange = (value: string) => {
    if (value === "all-subdistricts") {
      setSubdistrictFilter(value);
      return;
    }
    handleTambonChange(value);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setJobTypeFilter("");
    setProvinceFilter("");
    setDistrictFilter("");
    setSubdistrictFilter("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container py-8">
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          {/* Search */}
          <SearchBar searchTerm={searchTerm} onChange={handleSearchChange} />

          {/* Filters */}
          <FilterBar 
            jobTypeFilter={jobTypeFilter}
            provinceFilter={provinceFilter}
            districtFilter={districtFilter}
            subdistrictFilter={subdistrictFilter}
            provinces={provinces}
            filteredAmphures={filteredAmphures}
            filteredTambons={filteredTambons}
            isLoading={isLoading}
            onJobTypeChange={handleJobTypeChange}
            onProvinceChange={handleProvinceFilterChange}
            onDistrictChange={handleDistrictFilterChange}
            onSubdistrictChange={handleSubdistrictFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Job Results */}
        <JobResults filteredJobs={filteredJobs} />
      </main>
      <Footer />
    </div>
  );
};

export default FindJob;
