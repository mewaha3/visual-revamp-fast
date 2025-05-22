
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
import { ProfileFormValues } from "@/pages/ProfileEdit";
import { Loader2 } from "lucide-react";
import useThailandLocations from "@/hooks/useThailandLocations";

export default function AddressSection() {
  const { control, setValue, watch } = useFormContext<ProfileFormValues>();
  
  // Initialize Thailand locations hook - we still need this to fetch data
  const {
    isLoading: isLocationLoading,
    userProfileLoaded
  } = useThailandLocations();

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

      {/* Province - now read-only */}
      <FormField
        control={control}
        name="province"
        render={({ field }) => (
          <FormItem>
            <FormLabel>จังหวัด</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                readOnly
                className="bg-gray-50"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* District - now read-only */}
        <FormField
          control={control}
          name="district"
          render={({ field }) => (
            <FormItem>
              <FormLabel>อำเภอ/เขต</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  readOnly
                  className="bg-gray-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Subdistrict - now read-only */}
        <FormField
          control={control}
          name="subdistrict"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ตำบล/แขวง</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  readOnly
                  className="bg-gray-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Zip Code - now read-only */}
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
                  readOnly
                  className="bg-gray-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Show loading indicator if location data is still loading */}
      {isLocationLoading && (
        <div className="flex items-center text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span>กำลังโหลดข้อมูลที่อยู่...</span>
        </div>
      )}
    </div>
  );
}
