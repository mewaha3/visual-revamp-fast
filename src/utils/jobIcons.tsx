
import { 
  Briefcase, Search, Pencil, Check, 
  List, Edit, Plus 
} from "lucide-react";
import { ReactNode } from "react";

// Function to get the icon component based on job type
export const getJobIcon = (iconName: string): ReactNode => {
  switch (iconName) {
    case "broom": return <Briefcase className="h-4 w-4 mr-2" />;
    case "shield": return <List className="h-4 w-4 mr-2" />;
    case "bath": return <Briefcase className="h-4 w-4 mr-2" />;
    case "scissors": return <Edit className="h-4 w-4 mr-2" />;
    case "factory": return <Briefcase className="h-4 w-4 mr-2" />;
    case "package": return <Plus className="h-4 w-4 mr-2" />;
    case "search": return <Search className="h-4 w-4 mr-2" />;
    case "dog": return <Briefcase className="h-4 w-4 mr-2" />;
    case "car": return <Briefcase className="h-4 w-4 mr-2" />;
    case "home": return <Briefcase className="h-4 w-4 mr-2" />;
    case "glasses": return <Check className="h-4 w-4 mr-2" />;
    case "file-text": return <Pencil className="h-4 w-4 mr-2" />;
    default: return null;
  }
};
