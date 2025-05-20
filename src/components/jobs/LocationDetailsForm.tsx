
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Province, Amphure, Tambon } from "@/types/locationTypes";

interface LocationDetailsFormProps {
  province: string;
  district: string;
  subdistrict: string;
  postalCode: string;
  onProvinceChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
  onSubdistrictChange: (value: string) => void;
  onPostalCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  provinces?: Province[];
  districts?: Amphure[];
  subdistricts?: Tambon[];
  isLoading?: boolean;
  error?: string | null;
  zipCodeReadOnly?: boolean;
}

const LocationDetailsForm = ({
  province,
  district,
  subdistrict,
  postalCode,
  onProvinceChange,
  onDistrictChange,
  onSubdistrictChange,
  onPostalCodeChange,
  provinces = [],
  districts = [],
  subdistricts = [],
  isLoading = false,
  error = null,
  zipCodeReadOnly = false
}: LocationDetailsFormProps) => {
  return (
    <div className="space-y-4">
      <h2 className="font-medium text-gray-700">Location Details</h2>
      
      <div>
        <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
        <Select
          value={province}
          onValueChange={onProvinceChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Province" />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <SelectItem value="loading" disabled>กำลังโหลดข้อมูล...</SelectItem>
            ) : provinces.length > 0 ? (
              provinces.map((prov) => (
                <SelectItem key={prov.id} value={prov.name_th}>
                  {prov.name_th}
                </SelectItem>
              ))
            ) : (
              <>
                <SelectItem value="bangkok">กรุงเทพมหานคร</SelectItem>
                <SelectItem value="chiang_mai">เชียงใหม่</SelectItem>
                <SelectItem value="phuket">ภูเก็ต</SelectItem>
                <SelectItem value="chonburi">ชลบุรี</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
      
      <div>
        <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">District *</label>
        <Select
          value={district}
          onValueChange={onDistrictChange}
          disabled={!province}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select District" />
          </SelectTrigger>
          <SelectContent>
            {!province ? (
              <SelectItem value="select-province" disabled>โปรดเลือกจังหวัดก่อน</SelectItem>
            ) : districts.length > 0 ? (
              districts.map((dist) => (
                <SelectItem key={dist.id} value={dist.name_th}>
                  {dist.name_th}
                </SelectItem>
              ))
            ) : (
              <>
                <SelectItem value="district1">เขตพระนคร</SelectItem>
                <SelectItem value="district2">เขตดุสิต</SelectItem>
                <SelectItem value="district3">เขตหนองจอก</SelectItem>
                <SelectItem value="district4">เขตบางรัก</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label htmlFor="subdistrict" className="block text-sm font-medium text-gray-700 mb-1">Subdistrict *</label>
        <Select
          value={subdistrict}
          onValueChange={onSubdistrictChange}
          disabled={!district}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Subdistrict" />
          </SelectTrigger>
          <SelectContent>
            {!district ? (
              <SelectItem value="select-district" disabled>โปรดเลือกอำเภอ/เขตก่อน</SelectItem>
            ) : subdistricts.length > 0 ? (
              subdistricts.map((tambon) => (
                <SelectItem key={tambon.id} value={tambon.name_th}>
                  {tambon.name_th}
                </SelectItem>
              ))
            ) : (
              <>
                <SelectItem value="subdistrict1">แขวงตลาดยอด</SelectItem>
                <SelectItem value="subdistrict2">แขวงวังบูรพาภิรมย์</SelectItem>
                <SelectItem value="subdistrict3">แขวงจักรวรรดิ</SelectItem>
                <SelectItem value="subdistrict4">แขวงสำราญราษฎร์</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
        <Input
          id="postalCode"
          name="postalCode"
          value={postalCode}
          onChange={onPostalCodeChange}
          placeholder="Enter postal code"
          readOnly={zipCodeReadOnly}
          className={zipCodeReadOnly ? "bg-gray-100" : ""}
        />
      </div>
    </div>
  );
};

export default LocationDetailsForm;
