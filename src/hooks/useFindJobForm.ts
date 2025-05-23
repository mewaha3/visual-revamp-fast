
import { useState } from 'react';
import { addFindJob } from '@/services/findJobService';
import { FindJob } from '@/types/types';
import { useNavigate } from 'react-router-dom';
import useThailandLocations from './useThailandLocations';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export const useFindJobForm = () => {
  const { userEmail, userFullName, userId } = useAuth();
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
  const [minSalary, setMinSalary] = useState<string>('100'); // Set default to 100
  const [maxSalary, setMaxSalary] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Get tomorrow's date in YYYY-MM-DD format
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Handle min salary change with validation
  const handleMinSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinSalary(value);
  };

  // Final validation before submit
  const validateSalary = () => {
    const minSalaryNum = parseInt(minSalary);
    if (isNaN(minSalaryNum) || minSalaryNum < 100) {
      setMinSalary('100');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Redirect to login if user is not authenticated
    if (!userEmail) {
      toast.error("กรุณาเข้าสู่ระบบก่อนค้นหางาน");
      navigate('/login', { state: { from: '/find-job' } });
      return;
    }
    
    setIsSubmitting(true);
    
    // Validation
    if (!jobType || !skills || !jobDate || !startTime || !endTime || !address || 
        !selectedProvince || !selectedAmphure || !selectedTambon || !minSalary) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      setIsSubmitting(false);
      return;
    }

    // Validate minimum salary
    if (!validateSalary()) {
      toast.error("ค่าจ้างขั้นต่ำต้องไม่น้อยกว่า 100 บาท");
      setIsSubmitting(false);
      return;
    }

    // Validate date
    const selectedDate = new Date(jobDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    if (selectedDate < tomorrow) {
      toast.error("วันที่ต้องเป็นวันพรุ่งนี้เป็นต้นไป");
      setIsSubmitting(false);
      return;
    }

    // Get user info from auth context or local storage
    const firstName = localStorage.getItem('userFirstName') || userFullName?.split(' ')[0] || '';
    const lastName = localStorage.getItem('userLastName') || userFullName?.split(' ')[1] || '';
    const gender = localStorage.getItem('userGender') || 'Male';
    
    // Create job data object with all required fields explicitly defined
    const jobData = {
      job_type: jobType,
      skills: skills,
      job_date: jobDate,
      start_time: startTime,
      end_time: endTime,
      job_address: address,
      province: selectedProvince,
      district: selectedAmphure,
      subdistrict: selectedTambon,
      start_salary: parseInt(minSalary, 10) || 100,
      range_salary: parseInt(maxSalary, 10) || 0,
      email: userEmail,
      first_name: firstName,
      last_name: lastName,
      gender,
      zip_code: zipCode,
    };

    // Add the new job
    try {
      await addFindJob(jobData);
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
    getTomorrowDate,
    handleMinSalaryChange,
    validateSalary,
  };
};

export default useFindJobForm;
