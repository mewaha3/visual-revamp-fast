
import { useState, useEffect } from 'react';
import { Province, Amphure, Tambon } from '@/types/locationTypes';

export const useThailandLocations = () => {
  // State for raw data
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [amphures, setAmphures] = useState<Amphure[]>([]);
  const [tambons, setTambons] = useState<Tambon[]>([]);
  
  // State for filtered data
  const [filteredAmphures, setFilteredAmphures] = useState<Amphure[]>([]);
  const [filteredTambons, setFilteredTambons] = useState<Tambon[]>([]);
  
  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Selected values
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedAmphure, setSelectedAmphure] = useState<string>("");
  const [selectedTambon, setSelectedTambon] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch provinces
        const provinceResponse = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json');
        const provinceData: Province[] = await provinceResponse.json();
        
        // Fetch amphures
        const amphureResponse = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_amphure.json');
        const amphureData: Amphure[] = await amphureResponse.json();
        
        // Fetch tambons
        const tambonResponse = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json');
        const tambonData: Tambon[] = await tambonResponse.json();
        
        setProvinces(provinceData);
        setAmphures(amphureData);
        setTambons(tambonData);
      } catch (err) {
        console.error('Error fetching location data:', err);
        setError('Failed to load location data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter amphures when province changes
  const handleProvinceChange = (provinceNameTh: string) => {
    // Reset dependent fields
    setSelectedProvince(provinceNameTh);
    setSelectedAmphure("");
    setSelectedTambon("");
    setZipCode("");
    setFilteredTambons([]);
    
    // Find the province by Thai name
    const selectedProvObj = provinces.find(p => p.name_th === provinceNameTh);
    
    if (selectedProvObj) {
      // Filter amphures by province_id
      const filteredAmp = amphures.filter(a => a.province_id === selectedProvObj.id);
      setFilteredAmphures(filteredAmp);
    } else {
      setFilteredAmphures([]);
    }
  };

  // Filter tambons when amphure changes
  const handleAmphureChange = (amphureNameTh: string) => {
    // Reset dependent fields
    setSelectedAmphure(amphureNameTh);
    setSelectedTambon("");
    setZipCode("");
    
    // Find the amphure by Thai name
    const selectedAmpObj = filteredAmphures.find(a => a.name_th === amphureNameTh);
    
    if (selectedAmpObj) {
      // Filter tambons by amphure_id
      const filteredTmb = tambons.filter(t => t.amphure_id === selectedAmpObj.id);
      setFilteredTambons(filteredTmb);
    } else {
      setFilteredTambons([]);
    }
  };

  // Set zip code when tambon changes
  const handleTambonChange = (tambonNameTh: string) => {
    setSelectedTambon(tambonNameTh);
    
    // Find the tambon by Thai name within the filtered tambons
    const selectedTmbObj = filteredTambons.find(t => t.name_th === tambonNameTh);
    
    if (selectedTmbObj) {
      // Set zip code immediately - convert the numeric value to a string
      const zipCodeValue = String(selectedTmbObj.zip_code);
      console.log("Setting zip code to:", zipCodeValue);
      setZipCode(zipCodeValue);
    } else {
      setZipCode("");
    }
  };

  return {
    provinces,
    filteredAmphures,
    filteredTambons,
    isLoading,
    error,
    selectedProvince,
    selectedAmphure,
    selectedTambon,
    zipCode,
    handleProvinceChange,
    handleAmphureChange,
    handleTambonChange
  };
};

export default useThailandLocations;
