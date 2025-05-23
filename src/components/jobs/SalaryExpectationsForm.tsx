
import { Input } from "@/components/ui/input";

interface SalaryExpectationsFormProps {
  minSalary: string;
  maxSalary: string;
  onMinSalaryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMaxSalaryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  minimumValue?: number; // Added minimum value prop
}

const SalaryExpectationsForm = ({
  minSalary,
  maxSalary,
  onMinSalaryChange,
  onMaxSalaryChange,
  minimumValue = 0 // Default value if not provided
}: SalaryExpectationsFormProps) => {
  // Custom handler for min salary to enforce minimum value
  const handleMinSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseInt(value);
    
    // If value is less than minimum, set to minimum value
    if (numValue < minimumValue) {
      const newEvent = {
        ...e,
        target: {
          ...e.target,
          value: minimumValue.toString()
        }
      };
      onMinSalaryChange(newEvent);
    } else {
      onMinSalaryChange(e);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="font-medium text-gray-700">ความคาดหวังด้านรายได้</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="minSalary" className="block text-sm font-medium text-gray-700 mb-1">
            ค่าจ้างขั้นต่ำที่ต้องการ (บาท) <span className="text-red-500">*</span>
          </label>
          <Input
            id="minSalary"
            type="number"
            value={minSalary}
            onChange={handleMinSalaryChange}
            placeholder="เช่น 500"
            min={minimumValue}
          />
          {minimumValue > 0 && (
            <p className="text-xs text-gray-500 mt-1">ค่าจ้างขั้นต่ำ {minimumValue} บาท</p>
          )}
        </div>
        
        <div>
          <label htmlFor="maxSalary" className="block text-sm font-medium text-gray-700 mb-1">
            ค่าจ้างสูงสุดที่ต้องการ (บาท)
          </label>
          <Input
            id="maxSalary"
            type="number"
            value={maxSalary}
            onChange={onMaxSalaryChange}
            placeholder="เช่น 1000"
            min={minSalary || minimumValue}
          />
        </div>
      </div>
    </div>
  );
};

export default SalaryExpectationsForm;
