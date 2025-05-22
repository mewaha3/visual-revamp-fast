
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useThailandLocations from "@/hooks/useThailandLocations";
import { ProfileFormValues } from "@/pages/ProfileEdit";
import { Loader2 } from "lucide-react";

export default function AddressSection() {
  const { control, setValue, watch } = useFormContext<ProfileFormValues>();
  
  const provinceValue = watch("province");
  const districtValue = watch("district");
  const subdistrictValue = watch("subdistrict");
  const zipCodeValue = watch("zip_code");
  
  // Initialize Thailand locations hook
  const {
    provinces,
    filteredAmphures,
    filteredTambons,
    isLoading: isLocationLoading,
    error: locationError,
    handleProvinceChange,
    handleAmphureChange,
    handleTambonChange,
    zipCode,
    selectedProvince,
    selectedAmphure,
    selectedTambon,
    userProfileLoaded,
    setInitialLocationValues
  } = useThailandLocations();

  // Initialize location data from user profile
  useEffect(() => {
    if (provinceValue && !userProfileLoaded) {
      console.log("Setting initial location values from user profile:", { 
        provinceValue, 
        districtValue, 
        subdistrictValue 
      });
      setInitialLocationValues(provinceValue, districtValue, subdistrictValue);
    }
  }, [provinceValue, districtValue, subdistrictValue, userProfileLoaded, setInitialLocationValues]);

  // Update form fields when locations are selected from dropdowns
  useEffect(() => {
    if (selectedProvince && selectedProvince !== provinceValue) {
      console.log("Setting province form value:", selectedProvince);
      setValue("province", selectedProvince);
    }
  }, [selectedProvince, setValue, provinceValue]);

  useEffect(() => {
    if (selectedAmphure && selectedAmphure !== districtValue) {
      console.log("Setting district form value:", selectedAmphure);
      setValue("district", selectedAmphure);
    }
  }, [selectedAmphure, setValue, districtValue]);

  useEffect(() => {
    if (selectedTambon && selectedTambon !== subdistrictValue) {
      console.log("Setting subdistrict form value:", selectedTambon);
      setValue("subdistrict", selectedTambon);
    }
  }, [selectedTambon, setValue, subdistrictValue]);

  // Update zip_code when tambon changes
  useEffect(() => {
    if (zipCode && zipCode !== zipCodeValue) {
      console.log("Setting zip_code form value:", zipCode);
      setValue("zip_code", zipCode);
    }
  }, [zipCode, setValue, zipCodeValue]);

  console.log("Current address values:", {
    provinceValue,
    districtValue,
    subdistrictValue,
    zipCodeValue,
    selectedProvince,
    selectedAmphure,
    selectedTambon,
    provincesCount: provinces.length,
    filteredAmphuresCount: filteredAmphures.length,
    filteredTambonsCount: filteredTambons.length,
    userProfileLoaded
  });

  return (
    <div className="space-y-6">
      {/* Address */}
      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ที่อยู่</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="บ้านเลขที่ หมู่ ซอย ถนน" 
                {...field}
                className="min-h-[80px]"  
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Province */}
      <FormField
        control={control}
        name="province"
        render={({ field }) => (
          <FormItem>
            <FormLabel>จังหวัด</FormLabel>
            <Select 
              value={field.value || ""}
              onValueChange={(value) => {
                field.onChange(value);
                handleProvinceChange(value);
                // Clear dependent fields
                setValue("district", "");
                setValue("subdistrict", "");
                setValue("zip_code", "");
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกจังหวัด" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-[300px] overflow-y-auto bg-white">
                {isLocationLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>กำลังโหลดข้อมูล...</span>
                  </div>
                ) : provinces.length === 0 ? (
                  <SelectItem value="no-data" disabled>ไม่พบข้อมูลจังหวัด</SelectItem>
                ) : (
                  provinces.map((province) => (
                    <SelectItem key={province.id} value={province.name_th}>
                      {province.name_th}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {locationError && <p className="text-sm text-red-500 mt-1">{locationError}</p>}
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* District */}
        <FormField
          control={control}
          name="district"
          render={({ field }) => (
            <FormItem>
              <FormLabel>อำเภอ/เขต</FormLabel>
              <Select 
                value={field.value || ""}
                onValueChange={(value) => {
                  field.onChange(value);
                  handleAmphureChange(value);
                  // Clear dependent fields
                  setValue("subdistrict", "");
                  setValue("zip_code", "");
                }}
                disabled={!provinceValue || isLocationLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกอำเภอ/เขต" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[300px] overflow-y-auto bg-white">
                  {isLocationLoading ? (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>กำลังโหลดข้อมูล...</span>
                    </div>
                  ) : !provinceValue ? (
                    <SelectItem value="select-province" disabled>โปรดเลือกจังหวัดก่อน</SelectItem>
                  ) : filteredAmphures.length === 0 ? (
                    <SelectItem value="no-data" disabled>ไม่พบข้อมูล</SelectItem>
                  ) : (
                    filteredAmphures.map((amphure) => (
                      <SelectItem key={amphure.id} value={amphure.name_th}>
                        {amphure.name_th}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Subdistrict */}
        <FormField
          control={control}
          name="subdistrict"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ตำบล/แขวง</FormLabel>
              <Select 
                value={field.value || ""}
                onValueChange={(value) => {
                  field.onChange(value);
                  handleTambonChange(value);
                }}
                disabled={!districtValue || isLocationLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกตำบล/แขวง" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[300px] overflow-y-auto bg-white">
                  {isLocationLoading ? (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>กำลังโหลดข้อมูล...</span>
                    </div>
                  ) : !districtValue ? (
                    <SelectItem value="select-district" disabled>โปรดเลือกอำเภอ/เขตก่อน</SelectItem>
                  ) : filteredTambons.length === 0 ? (
                    <SelectItem value="no-data" disabled>ไม่พบข้อมูล</SelectItem>
                  ) : (
                    filteredTambons.map((tambon) => (
                      <SelectItem key={tambon.id} value={tambon.name_th}>
                        {tambon.name_th}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Zip Code */}
        <FormField
          control={control}
          name="zip_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>รหัสไปรษณีย์</FormLabel>
              <FormControl>
                <Input 
                  placeholder="รหัสไปรษณีย์" 
                  {...field} 
                  readOnly={!!subdistrictValue}
                  className={subdistrictValue ? "bg-gray-50" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
