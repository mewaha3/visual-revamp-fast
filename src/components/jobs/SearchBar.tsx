
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = ({ searchTerm, onChange }: SearchBarProps) => {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        Find Job <Search />
      </h1>
      <Input
        type="text"
        placeholder="Search for jobs..."
        value={searchTerm}
        onChange={onChange}
        className="w-full"
      />
    </div>
  );
};

export default SearchBar;
