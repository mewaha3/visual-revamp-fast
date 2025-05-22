
import { findJobs } from "@/data/findJobs";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Store matched worker data for reference
const matchedWorkers: Record<string, any> = {};

// Function to get worker by ID
export const getWorkerById = async (workerId: string): Promise<any> => {
  if (!workerId) {
    console.warn("No workerId provided to getWorkerById");
    return null;
  }

  try {
    // First check if the worker is in our cache
    if (matchedWorkers[workerId]) {
      return matchedWorkers[workerId];
    }

    // Try to get worker details from match_results collection
    const matchesRef = collection(db, "match_results");
    const q = query(matchesRef, where("workerId", "==", workerId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const workerData = querySnapshot.docs[0].data();
      const formattedWorker = {
        name: `${workerData.first_name || ''} ${workerData.last_name || ''}`.trim(),
        gender: workerData.gender || '',
        skills: workerData.skills || '',
        jobType: workerData.job_type || '',
        email: workerData.email || ''
      };

      // Cache the worker data
      matchedWorkers[workerId] = formattedWorker;
      return formattedWorker;
    }

    // If not found in match_results, try users collection
    const usersRef = collection(db, "users");
    const userQuery = query(usersRef, where("user_id", "==", workerId));
    const userSnapshot = await getDocs(userQuery);

    if (!userSnapshot.empty) {
      const userData = userSnapshot.docs[0].data();
      const formattedWorker = {
        name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
        gender: userData.gender || '',
        skills: userData.skills || '',
        jobType: userData.job_type || '',
        email: userData.email || ''
      };

      // Cache the worker data
      matchedWorkers[workerId] = formattedWorker;
      return formattedWorker;
    }

    // Try to find worker in findJobs data based on workerId
    const worker = findJobs.find(w => w.findjob_id === workerId || w.user_id === workerId);
    
    if (worker) {
      const workerData = {
        name: `${worker.first_name || ''} ${worker.last_name || ''}`.trim(),
        gender: worker.gender || '',
        skills: worker.skills || '',
        jobType: worker.job_type || '',
        email: worker.email || ''
      };
      
      // Cache the worker data for future reference
      matchedWorkers[workerId] = workerData;
      return workerData;
    }

    console.warn("Worker not found for ID:", workerId);
    return null;
  } catch (error) {
    console.error("Error in getWorkerById:", error);
    return null;
  }
};

// Export the matchedWorkers for use in other services
export { matchedWorkers };
