
import { Textarea } from "@/components/ui/textarea";

interface AddressInformationFormProps {
  address: string;
  onAddressChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const AddressInformationForm = ({
  address,
  onAddressChange
}: AddressInformationFormProps) => {
  return (
    <div className="space-y-4">
      <h2 className="font-medium text-gray-700">Address Information</h2>
      
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address (House No, Street, Area) *</label>
        <Textarea
          id="address"
          name="address"
          value={address}
          onChange={onAddressChange}
          placeholder="Enter your address"
          required
        />
      </div>
    </div>
  );
};

export default AddressInformationForm;
