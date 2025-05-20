
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Province, Amphure, Tambon } from "@/types/locationTypes";

interface FilterBarProps {
  jobTypeFilter: string;
  provinceFilter: string;
  districtFilter: string;
  subdistrictFilter: string;
  provinces: Province[];
  filteredAmphures: Amphure[];
  filteredTambons: Tambon[];
  isLoading: boolean;
  onJobTypeChange: (value: string) => void;
  onProvinceChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
  onSubdistrictChange: (value: string) => void;
  onClearFilters: () => void;
}

const FilterBar = ({
  jobTypeFilter,
  provinceFilter,
  districtFilter,
  subdistrictFilter,
  provinces,
  filteredAmphures,
  filteredTambons,
  isLoading,
  onJobTypeChange,
  onProvinceChange,
  onDistrictChange,
  onSubdistrictChange,
  onClearFilters,
}: FilterBarProps) => {
  return (
    <div>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Job Type Filter */}
        <div>
          <Select value={jobTypeFilter} onValueChange={onJobTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-types">All Job Types</SelectItem>
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
            onValueChange={onProvinceChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Province" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-provinces">All Provinces</SelectItem>
              {isLoading ? (
                <SelectItem value="loading-province" disabled>
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
            onValueChange={onDistrictChange}
            disabled={!provinceFilter || provinceFilter === "all-provinces"}
          >
            <SelectTrigger>
              <SelectValue placeholder="District" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-districts">All Districts</SelectItem>
              {!provinceFilter || provinceFilter === "all-provinces" ? (
                <SelectItem value="select-province-first" disabled>
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
            onValueChange={onSubdistrictChange}
            disabled={!districtFilter || districtFilter === "all-districts"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Subdistrict" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-subdistricts">All Subdistricts</SelectItem>
              {!districtFilter || districtFilter === "all-districts" ? (
                <SelectItem value="select-district-first" disabled>
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
          onClick={onClearFilters}
          className="text-sm"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
