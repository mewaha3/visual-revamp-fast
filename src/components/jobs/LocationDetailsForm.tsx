
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Province, Amphure, Tambon } from "@/types/locationTypes";
import { Info } from "lucide-react";
import { useEffect } from 'react';

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
  
  // Find the selected tambon to get its zip code
  useEffect(() => {
    if (subdistrict && subdistricts && subdistricts.length > 0) {
      const selectedTambon = subdistricts.find(
        (t) => t.name_th === subdistrict
      );
      
      if (selectedTambon && selectedTambon.zip_code) {
        // Create a synthetic event to update the postal code
        // Fix: Convert the zip_code number to string and cast the event to the correct type
        const event = {
          target: {
            name: 'postalCode',
            value: String(selectedTambon.zip_code)
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        onPostalCodeChange(event);
      }
    }
  }, [subdistrict, subdistricts, onPostalCodeChange]);

  return (
    <div className="space-y-4">
      <h2 className="font-medium text-gray-700">รายละเอียดสถานที่</h2>
      
      <div>
        <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">จังหวัด <span className="text-red-500">*</span></label>
        <Select
          value={province}
          onValueChange={onProvinceChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="เลือกจังหวัด" />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <SelectItem value="loading-province" disabled>กำลังโหลดข้อมูล...</SelectItem>
            ) : provinces && provinces.length > 0 ? (
              provinces.map((prov) => (
                <SelectItem key={prov.id} value={prov.name_th}>
                  {prov.name_th}
                </SelectItem>
              ))
            ) : (
              <>
                <SelectItem value="no-data" disabled>ไม่พบข้อมูลจังหวัด</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
      
      <div>
        <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">อำเภอ/เขต <span className="text-red-500">*</span></label>
        <Select
          value={district}
          onValueChange={onDistrictChange}
          disabled={!province}
        >
          <SelectTrigger>
            <SelectValue placeholder="เลือกอำเภอ/เขต" />
          </SelectTrigger>
          <SelectContent>
            {!province ? (
              <SelectItem value="select-province-first" disabled>โปรดเลือกจังหวัดก่อน</SelectItem>
            ) : districts && districts.length > 0 ? (
              districts.map((dist) => (
                <SelectItem key={dist.id} value={dist.name_th}>
                  {dist.name_th}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-data" disabled>ไม่พบข้อมูล</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label htmlFor="subdistrict" className="block text-sm font-medium text-gray-700 mb-1">ตำบล/แขวง <span className="text-red-500">*</span></label>
        <Select
          value={subdistrict}
          onValueChange={onSubdistrictChange}
          disabled={!district}
        >
          <SelectTrigger>
            <SelectValue placeholder="เลือกตำบล/แขวง" />
          </SelectTrigger>
          <SelectContent>
            {!district ? (
              <SelectItem value="select-district-first" disabled>โปรดเลือกอำเภอ/เขตก่อน</SelectItem>
            ) : subdistricts && subdistricts.length > 0 ? (
              subdistricts.map((tambon) => (
                <SelectItem key={tambon.id} value={tambon.name_th}>
                  {tambon.name_th}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-data" disabled>ไม่พบข้อมูล</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">รหัสไปรษณีย์</label>
        <Input
          id="postalCode"
          name="postalCode"
          value={postalCode}
          onChange={onPostalCodeChange}
          placeholder="ระบุรหัสไปรษณีย์"
          readOnly={zipCodeReadOnly}
          className={zipCodeReadOnly ? "bg-gray-100" : ""}
        />
      </div>
    </div>
  );
};

export default LocationDetailsForm;
