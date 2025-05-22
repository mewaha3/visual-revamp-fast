
import { useFormContext } from "react-hook-form";
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
import { ProfileFormValues } from "@/pages/ProfileEdit";
import { nationalities } from "@/data/nationalities";

export default function PersonalInfoSection({ userEmail }: { userEmail: string | null }) {
  const { control } = useFormContext<ProfileFormValues>();

  return (
    <div className="space-y-6">
      {/* Email field - readonly */}
      <FormItem>
        <FormLabel>อีเมล</FormLabel>
        <Input
          type="email"
          value={userEmail || ""}
          readOnly
          disabled
          className="bg-gray-50"
        />
      </FormItem>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First name */}
        <FormField
          control={control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อ</FormLabel>
              <FormControl>
                <Input placeholder="ชื่อ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Last name */}
        <FormField
          control={control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>นามสกุล</FormLabel>
              <FormControl>
                <Input placeholder="นามสกุล" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* ID */}
      <FormField
        control={control}
        name="national_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>เลขบัตรประชาชน/พาสปอร์ต</FormLabel>
            <FormControl>
              <Input placeholder="เลขบัตรประชาชนหรือพาสปอร์ต" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date of birth */}
        <FormField
          control={control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>วันเกิด</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Gender - with "Other" option removed */}
        <FormField
          control={control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>เพศ</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || undefined}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกเพศ" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Male">ชาย</SelectItem>
                  <SelectItem value="Female">หญิง</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nationality - updated to use full list like in registration */}
        <FormField
          control={control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>สัญชาติ</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || undefined}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสัญชาติ" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[200px]">
                  {nationalities.map((nationality) => (
                    <SelectItem key={nationality} value={nationality}>
                      {nationality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
