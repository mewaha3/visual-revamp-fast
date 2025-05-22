import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";

// Props for standalone usage
interface StandalonePasswordInputProps {
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
}

// Props for form usage
interface FormPasswordInputProps {
  name: string;
  label: string;
  placeholder: string;
}

// Determine which props interface to use
type PasswordInputProps = StandalonePasswordInputProps | FormPasswordInputProps;

// Helper to check if this is form field props
const isFormField = (props: PasswordInputProps): props is FormPasswordInputProps => {
  return 'name' in props && 'label' in props;
};

const PasswordInput = (props: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useFormContext();
  
  // If we have a form context and form field props, render the form field
  if (form && isFormField(props)) {
    const { name, label, placeholder } = props;
    
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={placeholder}
                  className="pl-10"
                  {...field}
                />
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={16}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
  
  // Otherwise render as standalone input
  if (!isFormField(props)) {
    const { id, value, onChange, className = "", placeholder = "", required = false } = props;
    
    return (
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className={`pl-10 ${className}`}
          placeholder={placeholder}
          required={required}
        />
        <Lock
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          size={16}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff size={16} />
          ) : (
            <Eye size={16} />
          )}
        </button>
      </div>
    );
  }
  
  // Fallback return (should never happen)
  return null;
};

export default PasswordInput;
