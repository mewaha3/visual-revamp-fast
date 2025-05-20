
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";

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
      <h2 className="font-medium text-gray-700">ข้อมูลที่อยู่</h2>
      
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          ที่อยู่ <span className="text-red-500">*</span>
        </label>
        <div className="text-xs text-gray-500 mb-1 flex items-center">
          <Info className="h-3 w-3 mr-1" />
          สามารถกรอกได้ทั้งภาษาไทยและภาษาอังกฤษ
        </div>
        <Textarea
          id="address"
          value={address}
          onChange={onAddressChange}
          placeholder="ระบุบ้านเลขที่ ถนน ซอย อาคาร หมู่บ้าน เช่น 123/45 ถ.สุขุมวิท ซ.15"
          rows={3}
        />
      </div>
    </div>
  );
};

export default AddressInformationForm;
