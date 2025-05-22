
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import useThailandLocations from "@/hooks/useThailandLocations";

const AddressSection = () => {
  const form = useFormContext();
  
  // Use the Thailand locations hook
  const {
    provinces = [],
    filteredAmphures = [],
    filteredTambons = [],
    isLoading,
    error,
    zipCode,
    handleProvinceChange,
    handleAmphureChange,
    handleTambonChange,
  } = useThailandLocations();
  
  // Update zip_code when tambon changes
  const handleTambonSelect = (value: string) => {
    handleTambonChange(value);
    form.setValue("subdistrict", value);
    
    // Find the selected tambon to get its zip code
    if (filteredTambons && filteredTambons.length > 0) {
      const selectedTambon = filteredTambons.find(t => t.name_th === value);
      if (selectedTambon && selectedTambon.zip_code) {
        // Fix: Convert zip_code to string explicitly
        form.setValue("zip_code", String(selectedTambon.zip_code));
      }
    }
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold pt-4">ข้อมูลที่อยู่</h2>
      {/* Address */}
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ที่อยู่ <span className="text-red-500">*</span></FormLabel>
            <div className="text-xs text-gray-500 mb-1 flex items-center">
              <Info className="h-3 w-3 mr-1" />
              สามารถกรอกได้ทั้งภาษาไทยและภาษาอังกฤษ
            </div>
            <FormControl>
              <div className="relative">
                <Textarea className="min-h-[80px]" {...field} placeholder="บ้านเลขที่ ถนน ซอย เช่น 123/45 ถ.สุขุมวิท ซ.15" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Province */}
      <FormField
        control={form.control}
        name="province"
        render={({ field }) => (
          <FormItem>
            <FormLabel>จังหวัด <span className="text-red-500">*</span></FormLabel>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                handleProvinceChange(value);
                // Clear dependent fields
                form.setValue("district", "");
                form.setValue("subdistrict", "");
                form.setValue("zip_code", "");
              }}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกจังหวัด" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>กำลังโหลดข้อมูล...</SelectItem>
                ) : provinces && provinces.length > 0 ? (
                  provinces.map((province) => (
                    <SelectItem key={province.id} value={province.name_th}>
                      {province.name_th}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-data" disabled>ไม่พบข้อมูลจังหวัด</SelectItem>
                )}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* District */}
      <FormField
        control={form.control}
        name="district"
        render={({ field }) => (
          <FormItem>
            <FormLabel>อำเภอ/เขต <span className="text-red-500">*</span></FormLabel>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                handleAmphureChange(value);
                // Clear dependent fields
                form.setValue("subdistrict", "");
                form.setValue("zip_code", "");
              }}
              value={field.value}
              disabled={!form.getValues("province")}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกอำเภอ/เขต" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {!form.getValues("province") ? (
                  <SelectItem value="select-province" disabled>โปรดเลือกจังหวัดก่อน</SelectItem>
                ) : filteredAmphures && filteredAmphures.length > 0 ? (
                  filteredAmphures.map((amphure) => (
                    <SelectItem key={amphure.id} value={amphure.name_th}>
                      {amphure.name_th}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-data" disabled>ไม่พบข้อมูล</SelectItem>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Subdistrict */}
      <FormField
        control={form.control}
        name="subdistrict"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ตำบล/แขวง <span className="text-red-500">*</span></FormLabel>
            <Select 
              onValueChange={handleTambonSelect}
              value={field.value}
              disabled={!form.getValues("district")}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกตำบล/แขวง" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {!form.getValues("district") ? (
                  <SelectItem value="select-district" disabled>โปรดเลือกอำเภอ/เขตก่อน</SelectItem>
                ) : filteredTambons && filteredTambons.length > 0 ? (
                  filteredTambons.map((tambon) => (
                    <SelectItem key={tambon.id} value={tambon.name_th}>
                      {tambon.name_th}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-data" disabled>ไม่พบข้อมูล</SelectItem>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Zip Code */}
      <FormField
        control={form.control}
        name="zip_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>รหัสไปรษณีย์ <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  className="pl-10" 
                  {...field} 
                  placeholder="เช่น 10110" 
                  readOnly
                  style={{ backgroundColor: "#f3f4f6" }}
                />
                <MapPin
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={16}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AddressSection;
