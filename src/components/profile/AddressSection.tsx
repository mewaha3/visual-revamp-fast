
import { useEffect, useState } from "react";
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
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function AddressSection() {
  const { control, setValue, watch } = useFormContext<ProfileFormValues>();
  const { userId } = useAuth();
  
  // Address field values
  const addressValue = watch("address");
  const provinceValue = watch("province");
  const districtValue = watch("district");
  const subdistrictValue = watch("subdistrict");
  const zipCodeValue = watch("zip_code");
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user profile data from Firestore
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching user profile data from Firestore...");
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          console.log("User data loaded:", userData);
          
          // Set form values with user data
          if (userData.address) setValue("address", userData.address);
          if (userData.province) setValue("province", userData.province);
          if (userData.district) setValue("district", userData.district);
          if (userData.subdistrict) setValue("subdistrict", userData.subdistrict);
          if (userData.zip_code) setValue("zip_code", userData.zip_code);
        } else {
          console.log("No user document found");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("ไม่สามารถโหลดข้อมูลที่อยู่ได้");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [userId, setValue]);

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-fastlabor-600 mr-2" />
          <span className="text-fastlabor-700">กำลังโหลดข้อมูลที่อยู่...</span>
        </div>
      ) : (
        <>
          {error && (
            <div className="p-4 bg-red-50 text-red-800 rounded-md mb-4">
              {error}
            </div>
          )}
          
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
                <FormControl>
                  <Input 
                    {...field}
                    readOnly
                    className="bg-gray-50"
                    placeholder="ไม่มีข้อมูล"
                  />
                </FormControl>
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
                  <FormControl>
                    <Input 
                      {...field}
                      readOnly
                      className="bg-gray-50"
                      placeholder="ไม่มีข้อมูล"
                    />
                  </FormControl>
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
                  <FormControl>
                    <Input 
                      {...field}
                      readOnly
                      className="bg-gray-50"
                      placeholder="ไม่มีข้อมูล"
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
        </>
      )}
    </div>
  );
}
