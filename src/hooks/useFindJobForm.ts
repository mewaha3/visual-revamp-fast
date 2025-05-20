
import { useState } from 'react';
import { addNewFindJob } from '@/services/findJobService';
import { FindJob } from '@/types/types';
import { useNavigate } from 'react-router-dom';
import useThailandLocations from './useThailandLocations';
import { toast } from 'sonner';

export const useFindJobForm = () => {
  const navigate = useNavigate();
  const {
    provinces,
    filteredAmphures,
    filteredTambons,
    isLoading,
    error,
    zipCode,
    selectedProvince,
    selectedAmphure,
    selectedTambon,
    handleProvinceChange,
    handleAmphureChange,
    handleTambonChange,
  } = useThailandLocations();

  // Form states
  const [jobType, setJobType] = useState<string>('');
  const [skills, setSkills] = useState<string>('');
  const [jobDate, setJobDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [minSalary, setMinSalary] = useState<string>('');
  const [maxSalary, setMaxSalary] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validation
    if (!jobType || !skills || !jobDate || !startTime || !endTime || !address || 
        !selectedProvince || !selectedAmphure || !selectedTambon || !minSalary) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      setIsSubmitting(false);
      return;
    }

    // Get user info from local storage (would be from auth context in a real app)
    const email = localStorage.getItem('userEmail') || 'user@example.com';
    const firstName = localStorage.getItem('userFirstName') || 'Demo';
    const lastName = localStorage.getItem('userLastName') || 'User';
    const gender = localStorage.getItem('userGender') || 'male';
    
    // Create job data object
    const jobData: Partial<FindJob> = {
      job_type: jobType,
      skills: skills,
      job_date: jobDate,
      start_time: startTime,
      end_time: endTime,
      job_address: address,
      province: selectedProvince,
      district: selectedAmphure,
      subdistrict: selectedTambon,
      start_salary: parseInt(minSalary, 10) || 0,
      range_salary: parseInt(maxSalary, 10) || 0,
      email,
      first_name: firstName,
      last_name: lastName,
      gender,
      zip_code: zipCode,
    };

    // Add the new job
    try {
      await addNewFindJob(jobData);
      toast.success("ค้นหางานสำเร็จ!");
      
      // Navigate to the find tab of My Jobs
      setTimeout(() => {
        navigate('/my-jobs/find');
      }, 1000);
    } catch (error) {
      toast.error("ไม่สามารถค้นหางานได้");
      console.error("Error submitting job:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    jobType,
    setJobType,
    skills,
    setSkills,
    jobDate,
    setJobDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    address,
    setAddress,
    minSalary,
    setMinSalary,
    maxSalary,
    setMaxSalary,
    handleSubmit,
    provinces,
    filteredAmphures,
    filteredTambons,
    isLoading,
    error,
    zipCode,
    selectedProvince,
    selectedAmphure,
    selectedTambon,
    handleProvinceChange,
    handleAmphureChange,
    handleTambonChange,
    isSubmitting,
  };
};

export default useFindJobForm;
