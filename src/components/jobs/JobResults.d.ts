
import { FindJob } from "@/types/types";

export interface JobResultsProps {
  jobs: FindJob[];
  isLoading: boolean;
  emptyMessage: string;
}
