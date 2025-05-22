
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

export default function AddressSection() {
  const { control, setValue, watch } = useFormContext<ProfileFormValues>();
  
  const provinceValue = watch("province");
  const districtValue = watch("district");
  const subdistrictValue = watch("subdistrict");
  const zipCodeValue = watch("zip_code");

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Province */}
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

        {/* District */}
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Subdistrict */}
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

        {/* Zip Code */}
        <FormField
          control={control}
          name="zip_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>รหัสไปรษณีย์</FormLabel>
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
      </div>
    </div>
  );
}
