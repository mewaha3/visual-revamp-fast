
import { useState, useEffect } from 'react';
import { useLocationData } from './locations/useLocationData';
import { useUserLocationProfile } from './locations/useUserLocationProfile';
import { 
  filterAmphuresByProvince, 
  filterTambonsByAmphure,
  getZipCodeFromTambon
} from './locations/locationFilters';
import { Province, Amphure, Tambon } from '@/types/locationTypes';

export const useThailandLocations = () => {
  // Fetch location data from Firestore
  const { 
    isLoading, 
    error: locationDataError, 
    provinces, 
    amphures, 
    tambons 
  } = useLocationData();
  
  // Get user profile location data
  const {
    userProfileLoaded,
    selectedProvince,
    selectedAmphure,
    selectedTambon,
    zipCode,
    setSelectedProvince,
    setSelectedAmphure,
    setSelectedTambon,
    setZipCode,
    error: userProfileError
  } = useUserLocationProfile(provinces, amphures, tambons);
  
  // Filtered locations based on selections
  const [filteredAmphures, setFilteredAmphures] = useState<Amphure[]>([]);
  const [filteredTambons, setFilteredTambons] = useState<Tambon[]>([]);

  // Combined error state
  const error = locationDataError || userProfileError;

  // Filter locations when user profile is loaded
  useEffect(() => {
    if (userProfileLoaded && provinces.length > 0 && amphures.length > 0 && tambons.length > 0) {
      if (selectedProvince) {
        const filteredAmphures = filterAmphuresByProvince(amphures, provinces, selectedProvince);
        setFilteredAmphures(filteredAmphures);
      }
      
      if (selectedAmphure) {
        const filteredTambons = filterTambonsByAmphure(tambons, amphures, selectedAmphure);
        setFilteredTambons(filteredTambons);
      }
    }
  }, [userProfileLoaded, selectedProvince, selectedAmphure, provinces, amphures, tambons]);

  // Handle province change
  const handleProvinceChange = (provinceName: string) => {
    setSelectedProvince(provinceName);
    setSelectedAmphure('');
    setSelectedTambon('');
    setZipCode('');
    
    const filteredAmph = filterAmphuresByProvince(amphures, provinces, provinceName);
    setFilteredAmphures(filteredAmph);
    setFilteredTambons([]);
  };
  
  // Handle amphure change
  const handleAmphureChange = (amphureName: string) => {
    setSelectedAmphure(amphureName);
    setSelectedTambon('');
    setZipCode('');
    
    const filteredTamb = filterTambonsByAmphure(tambons, amphures, amphureName);
    setFilteredTambons(filteredTamb);
  };
  
  // Handle tambon change
  const handleTambonChange = (tambonName: string) => {
    setSelectedTambon(tambonName);
    
    const newZipCode = getZipCodeFromTambon(tambons, tambonName, filteredTambons);
    setZipCode(newZipCode);
  };

  return {
    isLoading,
    error,
    userProfileLoaded,
    provinces,
    amphures,
    tambons,
    filteredAmphures,
    filteredTambons,
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
