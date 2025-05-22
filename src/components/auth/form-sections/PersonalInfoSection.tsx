
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Info, User, Flag } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { nationalities } from "@/data/nationalities";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const PersonalInfoSection = () => {
  const form = useFormContext();
  
  // Calculate a reasonable year range for birthdate selection
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 80; // Allow birth years up to 80 years ago
  const maxYear = 2007; // As per requirement
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">ข้อมูลส่วนบุคคล</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First name */}
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อ <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <div className="relative">
                  <Input className="pl-10" {...field} placeholder="เช่น สมชาย, John" />
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={16}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Last name */}
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>นามสกุล <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <div className="relative">
                  <Input className="pl-10" {...field} placeholder="เช่น ใจดี, Smith" />
                  <User
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

      {/* Nationality Dropdown */}
      <FormField
        control={form.control}
        name="nationality"
        render={({ field }) => (
          <FormItem>
            <FormLabel>สัญชาติ <span className="text-red-500">*</span></FormLabel>
            <Select 
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger className="pl-10">
                  <Flag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
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

      {/* National ID */}
      <FormField
        control={form.control}
        name="national_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {form.watch("nationality") === "Thai" 
                ? "เลขรหัสบัตรประชาชน" 
                : "เลขพาสปอร์ต"} 
              <span className="text-red-500">*</span>
            </FormLabel>
            <div className="text-xs text-gray-500 mb-1 flex items-center">
              <Info className="h-3 w-3 mr-1" />
              {form.watch("nationality") === "Thai" 
                ? "กรอกเลขประจำตัวประชาชน 13 หลัก" 
                : "กรอกเลขพาสปอร์ตสำหรับชาวต่างชาติ"}
            </div>
            <FormControl>
              <Input 
                {...field} 
                placeholder={form.watch("nationality") === "Thai" 
                  ? "เช่น 1234567890123" 
                  : "เช่น AA12345678"} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Enhanced Date of Birth - with better accessibility and user experience */}
      <FormField
        control={form.control}
        name="dob"
        render={({ field }) => (
          <FormItem className="flex flex-col space-y-1">
            <FormLabel>วันเกิด <span className="text-red-500">*</span></FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-10 text-left font-normal flex justify-between items-center",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center">
                      <Calendar
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                        size={16}
                      />
                      <span>
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          "เลือกวันเกิด"
                        )}
                      </span>
                    </div>
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3 border-b border-gray-100">
                  <div className="text-sm font-medium">เลือกวันเกิด</div>
                  <div className="text-xs text-gray-500">
                    กรุณาเลือกวันเดือนปีเกิดของคุณ
                  </div>
                </div>
                <CalendarComponent
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date(`${minYear}-01-01`)
                  }
                  initialFocus
                  defaultMonth={field.value || new Date(2000, 0)}
                  fromYear={minYear}
                  toYear={maxYear}
                  captionLayout="dropdown-buttons"
                  className="rounded-md border-none shadow-none"
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Gender */}
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>เพศ <span className="text-red-500">*</span></FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
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
    </div>
  );
};

export default PersonalInfoSection;
