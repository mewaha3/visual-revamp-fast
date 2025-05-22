
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Thai_Province, Thai_Amphure, Thai_Tambon } from '@/types/locationTypes';

interface UseThailandLocationsReturn {
  provinces: Thai_Province[];
  filteredAmphures: Thai_Amphure[];
  filteredTambons: Thai_Tambon[];
  selectedProvince: string;
  selectedAmphure: string;
  selectedTambon: string;
  zipCode: string;
  isLoading: boolean;
  error: string | null;
  handleProvinceChange: (provinceName: string) => void;
  handleAmphureChange: (amphureName: string) => void;
  handleTambonChange: (tambonName: string) => void;
  userProfileLoaded: boolean;
  setInitialLocationValues: (province: string, district: string, subdistrict: string) => void;
}

const useThailandLocations = (): UseThailandLocationsReturn => {
  // States for location data
  const [provinces, setProvinces] = useState<Thai_Province[]>([]);
  const [amphures, setAmphures] = useState<Thai_Amphure[]>([]);
  const [tambons, setTambons] = useState<Thai_Tambon[]>([]);
  
  // Selected location states
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedAmphure, setSelectedAmphure] = useState<string>('');
  const [selectedTambon, setSelectedTambon] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  
  // UI states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfileLoaded, setUserProfileLoaded] = useState<boolean>(false);
  
  // Filtered locations based on selections
  const [filteredAmphures, setFilteredAmphures] = useState<Thai_Amphure[]>([]);
  const [filteredTambons, setFilteredTambons] = useState<Thai_Tambon[]>([]);

  // Function to set initial location values from user profile
  const setInitialLocationValues = useCallback((province: string, district: string, subdistrict: string) => {
    console.log("Setting initial location values:", { province, district, subdistrict });
    if (province) {
      setSelectedProvince(province);
      
      // Find province by name
      const foundProvince = provinces.find(p => p.name_th === province);
      if (foundProvince && district) {
        const provinceAmphures = amphures.filter(a => a.province_id === foundProvince.id);
        setFilteredAmphures(provinceAmphures);
        
        // Find district by name
        const foundAmphure = provinceAmphures.find(a => a.name_th === district);
        if (foundAmphure && subdistrict) {
          setSelectedAmphure(district);
          
          const amphureTambons = tambons.filter(t => t.amphure_id === foundAmphure.id);
          setFilteredTambons(amphureTambons);
          
          // Find subdistrict and get zip code
          const foundTambon = amphureTambons.find(t => t.name_th === subdistrict);
          if (foundTambon) {
            setSelectedTambon(subdistrict);
            setZipCode(foundTambon.zip_code);
          }
        }
      }
    }
    setUserProfileLoaded(true);
  }, [provinces, amphures, tambons]);

  // Load Thailand location data
  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch provinces
        const provinceRes = await axios.get('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json');
        setProvinces(provinceRes.data);
        
        // Fetch amphures
        const amphureRes = await axios.get('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_amphure.json');
        setAmphures(amphureRes.data);
        
        // Fetch tambons
        const tambonRes = await axios.get('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json');
        setTambons(tambonRes.data);
        
        console.log("Thailand locations loaded:", {
          provinces: provinceRes.data.length,
          amphures: amphureRes.data.length,
          tambons: tambonRes.data.length
        });
      } catch (err) {
        console.error("Error fetching Thailand locations:", err);
        setError('ไม่สามารถโหลดข้อมูลตำแหน่งได้ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLocations();
  }, []);

  // Handle province selection
  const handleProvinceChange = useCallback((provinceName: string) => {
    setSelectedProvince(provinceName);
    setSelectedAmphure('');
    setSelectedTambon('');
    setZipCode('');
    
    const selectedProvinceData = provinces.find(province => province.name_th === provinceName);
    if (selectedProvinceData) {
      const provinceAmphures = amphures.filter(amphure => amphure.province_id === selectedProvinceData.id);
      setFilteredAmphures(provinceAmphures);
      setFilteredTambons([]);
    }
  }, [provinces, amphures]);

  // Handle amphure selection
  const handleAmphureChange = useCallback((amphureName: string) => {
    setSelectedAmphure(amphureName);
    setSelectedTambon('');
    setZipCode('');
    
    const selectedProvinceData = provinces.find(province => province.name_th === selectedProvince);
    if (selectedProvinceData) {
      const selectedAmphureData = amphures.find(
        amphure => amphure.name_th === amphureName && amphure.province_id === selectedProvinceData.id
      );
      
      if (selectedAmphureData) {
        const amphureTambons = tambons.filter(tambon => tambon.amphure_id === selectedAmphureData.id);
        setFilteredTambons(amphureTambons);
      }
    }
  }, [selectedProvince, provinces, amphures, tambons]);

  // Handle tambon selection
  const handleTambonChange = useCallback((tambonName: string) => {
    setSelectedTambon(tambonName);
    
    const selectedProvinceData = provinces.find(province => province.name_th === selectedProvince);
    if (selectedProvinceData) {
      const selectedAmphureData = amphures.find(
        amphure => amphure.name_th === selectedAmphure && amphure.province_id === selectedProvinceData.id
      );
      
      if (selectedAmphureData) {
        const selectedTambonData = tambons.find(
          tambon => tambon.name_th === tambonName && tambon.amphure_id === selectedAmphureData.id
        );
        
        if (selectedTambonData) {
          setZipCode(selectedTambonData.zip_code);
        }
      }
    }
  }, [selectedProvince, selectedAmphure, provinces, amphures, tambons]);

  return {
    provinces,
    filteredAmphures,
    filteredTambons,
    selectedProvince,
    selectedAmphure,
    selectedTambon,
    zipCode,
    isLoading,
    error,
    handleProvinceChange,
    handleAmphureChange,
    handleTambonChange,
    userProfileLoaded,
    setInitialLocationValues
  };
};

export default useThailandLocations;
