
import { Input } from "@/components/ui/input";

interface SalaryExpectationsFormProps {
  minSalary: string;
  maxSalary: string;
  onMinSalaryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMaxSalaryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SalaryExpectationsForm = ({
  minSalary,
  maxSalary,
  onMinSalaryChange,
  onMaxSalaryChange
}: SalaryExpectationsFormProps) => {
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
            onChange={onMinSalaryChange}
            placeholder="เช่น 500"
          />
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
          />
        </div>
      </div>
    </div>
  );
};

export default SalaryExpectationsForm;
