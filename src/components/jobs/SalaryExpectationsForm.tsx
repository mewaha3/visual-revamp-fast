
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
  onMaxSalaryChange,
}: SalaryExpectationsFormProps) => {
  return (
    <div className="space-y-4">
      <h2 className="font-medium text-gray-700 mb-4">Salary Expectations</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="minSalary" className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Salary (THB) <span className="text-red-500">*</span>
          </label>
          <Input
            id="minSalary"
            type="number"
            value={minSalary}
            onChange={onMinSalaryChange}
            placeholder="Enter minimum salary"
            min="0"
          />
        </div>

        <div>
          <label htmlFor="maxSalary" className="block text-sm font-medium text-gray-700 mb-1">
            Maximum Salary (THB)
          </label>
          <Input
            id="maxSalary"
            type="number"
            value={maxSalary}
            onChange={onMaxSalaryChange}
            placeholder="Enter maximum salary"
            min="0"
          />
        </div>
      </div>
    </div>
  );
};

export default SalaryExpectationsForm;
