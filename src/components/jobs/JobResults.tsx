
import { FindJob } from "@/types/types";
import { FindJobList } from "@/components/JobList";

interface JobResultsProps {
  filteredJobs: FindJob[];
}

const JobResults = ({ filteredJobs }: JobResultsProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">
        {filteredJobs.length} Jobs Found
      </h2>
      <FindJobList jobs={filteredJobs} />
    </div>
  );
};

export default JobResults;
