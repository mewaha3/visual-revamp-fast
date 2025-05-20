
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LocationDetailsFormProps {
  province: string;
  district: string;
  subdistrict: string;
  postalCode: string;
  onProvinceChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
  onSubdistrictChange: (value: string) => void;
  onPostalCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LocationDetailsForm = ({
  province,
  district,
  subdistrict,
  postalCode,
  onProvinceChange,
  onDistrictChange,
  onSubdistrictChange,
  onPostalCodeChange
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
            <SelectItem value="bangkok">กรุงเทพมหานคร</SelectItem>
            <SelectItem value="chiang_mai">เชียงใหม่</SelectItem>
            <SelectItem value="phuket">ภูเก็ต</SelectItem>
            <SelectItem value="chonburi">ชลบุรี</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">District *</label>
        <Select
          value={district}
          onValueChange={onDistrictChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select District" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="district1">เขตพระนคร</SelectItem>
            <SelectItem value="district2">เขตดุสิต</SelectItem>
            <SelectItem value="district3">เขตหนองจอก</SelectItem>
            <SelectItem value="district4">เขตบางรัก</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label htmlFor="subdistrict" className="block text-sm font-medium text-gray-700 mb-1">Subdistrict *</label>
        <Select
          value={subdistrict}
          onValueChange={onSubdistrictChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Subdistrict" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="subdistrict1">แขวงตลาดยอด</SelectItem>
            <SelectItem value="subdistrict2">แขวงวังบูรพาภิรมย์</SelectItem>
            <SelectItem value="subdistrict3">แขวงจักรวรรดิ</SelectItem>
            <SelectItem value="subdistrict4">แขวงสำราญราษฎร์</SelectItem>
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
        />
      </div>
    </div>
  );
};

export default LocationDetailsForm;
