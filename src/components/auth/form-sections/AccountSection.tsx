
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useFormContext } from "react-hook-form";
import PasswordInput from "../PasswordInput";

const AccountSection = () => {
  const form = useFormContext();
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold pt-4">ข้อมูลบัญชี</h2>
      {/* Email */}
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>อีเมล <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type="email"
                  className="pl-10"
                  {...field}
                  placeholder="เช่น example@email.com"
                />
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={16}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Password */}
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <PasswordInput
            {...field}
            name="password"
            label="รหัสผ่าน"
            placeholder="อย่างน้อย 6 ตัวอักษร"
          />
        )}
      />

      {/* Confirm Password */}
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <PasswordInput
            {...field}
            name="confirmPassword"
            label="ยืนยันรหัสผ่าน"
            placeholder="กรอกรหัสผ่านอีกครั้ง"
          />
        )}
      />
    </div>
  );
};

export default AccountSection;
