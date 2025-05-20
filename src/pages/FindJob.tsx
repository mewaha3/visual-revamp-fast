
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import JobList from "@/components/JobList";
import { findJobs } from "@/data/findJobs";
import useThailandLocations from "@/hooks/useThailandLocations";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    setProvinceFilter(selectedProvince);
  }, [selectedProvince]);

  useEffect(() => {
    setDistrictFilter(selectedAmphure);
  }, [selectedAmphure]);

  useEffect(() => {
    setSubdistrictFilter(selectedTambon);
  }, [selectedTambon]);

  // Filter jobs based on search term and filters
  const filteredJobs = findJobs.filter((job) => {
    // Filter by search term
    const matchesSearchTerm = searchTerm
      ? job.job_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.job_detail.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    // Filter by job type
    const matchesJobType = jobTypeFilter ? job.job_type === jobTypeFilter : true;

    // Filter by location
    const matchesProvince = provinceFilter ? job.province === provinceFilter : true;
    const matchesDistrict = districtFilter ? job.district === districtFilter : true;
    const matchesSubdistrict = subdistrictFilter ? job.subdistrict === subdistrictFilter : true;

    return matchesSearchTerm && matchesJobType && matchesProvince && matchesDistrict && matchesSubdistrict;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleJobTypeChange = (value: string) => {
    setJobTypeFilter(value);
  };

  const handleProvinceFilterChange = (value: string) => {
    handleProvinceChange(value);
  };

  const handleDistrictFilterChange = (value: string) => {
    handleAmphureChange(value);
  };

  const handleSubdistrictFilterChange = (value: string) => {
    handleTambonChange(value);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setJobTypeFilter("");
    setProvinceFilter("");
    setDistrictFilter("");
    setSubdistrictFilter("");
  };

  const handleJobClick = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container py-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          Find Job <Search />
        </h1>

        {/* Search and filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          {/* Search */}
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search for jobs..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Job Type Filter */}
            <div>
              <Select value={jobTypeFilter} onValueChange={handleJobTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Job Types</SelectItem>
                  <SelectItem value="Driver">Driver</SelectItem>
                  <SelectItem value="Housekeeping">Housekeeping</SelectItem>
                  <SelectItem value="Service">Service</SelectItem>
                  <SelectItem value="Teaching">Teaching</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Province Filter */}
            <div>
              <Select
                value={provinceFilter}
                onValueChange={handleProvinceFilterChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Province" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Provinces</SelectItem>
                  {isLoading ? (
                    <SelectItem value="loading" disabled>
                      กำลังโหลดข้อมูล...
                    </SelectItem>
                  ) : provinces.map((prov) => (
                    <SelectItem key={prov.id} value={prov.name_th}>
                      {prov.name_th}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* District Filter */}
            <div>
              <Select
                value={districtFilter}
                onValueChange={handleDistrictFilterChange}
                disabled={!provinceFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Districts</SelectItem>
                  {!provinceFilter ? (
                    <SelectItem value="select-province" disabled>
                      โปรดเลือกจังหวัดก่อน
                    </SelectItem>
                  ) : filteredAmphures.map((dist) => (
                    <SelectItem key={dist.id} value={dist.name_th}>
                      {dist.name_th}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subdistrict Filter */}
            <div>
              <Select
                value={subdistrictFilter}
                onValueChange={handleSubdistrictFilterChange}
                disabled={!districtFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Subdistrict" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Subdistricts</SelectItem>
                  {!districtFilter ? (
                    <SelectItem value="select-district" disabled>
                      โปรดเลือกอำเภอ/เขตก่อน
                    </SelectItem>
                  ) : filteredTambons.map((tamb) => (
                    <SelectItem key={tamb.id} value={tamb.name_th}>
                      {tamb.name_th}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="text-sm"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Job Results */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {filteredJobs.length} Jobs Found
          </h2>
          <JobList jobs={filteredJobs} onJobClick={handleJobClick} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FindJob;
