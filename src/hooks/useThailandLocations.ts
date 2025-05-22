
import { useState, useEffect, useCallback } from 'react';
import { Province, Amphure, Tambon } from '@/types/locationTypes';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export const useThailandLocations = () => {
  // Auth context to get current user ID
  const { userId } = useAuth();
  
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
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  
  // User profile data
  const [userProfileLoaded, setUserProfileLoaded] = useState<boolean>(false);

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log("Fetching Thailand location data...");
        
        // Fetch provinces
        const provinceResponse = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json');
        if (!provinceResponse.ok) {
          throw new Error(`Failed to fetch provinces: ${provinceResponse.status}`);
        }
        const provinceData: Province[] = await provinceResponse.json();
        
        // Fetch amphures
        const amphureResponse = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_amphure.json');
        if (!amphureResponse.ok) {
          throw new Error(`Failed to fetch amphures: ${amphureResponse.status}`);
        }
        const amphureData: Amphure[] = await amphureResponse.json();
        
        // Fetch tambons
        const tambonResponse = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json');
        if (!tambonResponse.ok) {
          throw new Error(`Failed to fetch tambons: ${tambonResponse.status}`);
        }
        const tambonData: Tambon[] = await tambonResponse.json();
        
        setProvinces(provinceData);
        setAmphures(amphureData);
        setTambons(tambonData);
        setDataLoaded(true);
        console.log("Thailand location data loaded successfully", {
          provinces: provinceData.length,
          amphures: amphureData.length,
          tambons: tambonData.length
        });
        
        // Now fetch user profile if userId is available
        if (userId) {
          try {
            const userDocRef = doc(db, "users", userId);
            const userDocSnap = await getDoc(userDocRef);
            
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              console.log("User data loaded:", userData);
              
              if (userData.province && userData.district && userData.subdistrict) {
                console.log("Initializing locations from user profile:", {
                  province: userData.province,
                  district: userData.district,
                  subdistrict: userData.subdistrict,
                  zip_code: userData.zip_code
                });
                
                // Initialize location data from user profile
                initializeLocation(
                  userData.province,
                  userData.district,
                  userData.subdistrict
                );
                
                setUserProfileLoaded(true);
              } else {
                console.log("User has no location data saved");
              }
            } else {
              console.log("No user document found");
            }
          } catch (userError) {
            console.error("Error fetching user data:", userError);
          }
        }
      } catch (err) {
        console.error('Error fetching location data:', err);
        setError('Failed to load location data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [userId]);

  // Initialize location dropdowns with saved user data
  const initializeLocation = useCallback((provinceName: string, districtName: string, subdistrictName: string) => {
    if (!dataLoaded || !provinces.length) {
      console.log("Cannot initialize locations: Data not loaded yet");
      return;
    }
    
    console.log("Initializing with location data:", { provinceName, districtName, subdistrictName });
    
    try {
      // Find province by name
      const provinceObj = provinces.find(p => p.name_th === provinceName);
      if (!provinceObj) {
        console.log("Province not found:", provinceName);
        return;
      }
      
      // Set province and filter amphures
      setSelectedProvince(provinceName);
      const filteredAmp = amphures.filter(a => a.province_id === provinceObj.id);
      setFilteredAmphures(filteredAmp);
      
      // Find amphure by name
      const amphureObj = filteredAmp.find(a => a.name_th === districtName);
      if (!amphureObj) {
        console.log("Amphure not found:", districtName);
        return;
      }
      
      // Set amphure and filter tambons
      setSelectedAmphure(districtName);
      const filteredTmb = tambons.filter(t => t.amphure_id === amphureObj.id);
      setFilteredTambons(filteredTmb);
      
      // Find tambon by name
      const tambonObj = filteredTmb.find(t => t.name_th === subdistrictName);
      if (!tambonObj) {
        console.log("Tambon not found:", subdistrictName);
        return;
      }
      
      // Set tambon and zip code
      setSelectedTambon(subdistrictName);
      const zipCodeValue = String(tambonObj.zip_code);
      setZipCode(zipCodeValue);
      console.log("Location initialization complete with zip code:", zipCodeValue);
      
    } catch (error) {
      console.error("Error during location initialization:", error);
    }
  }, [provinces, amphures, tambons, dataLoaded]);

  // Filter amphures when province changes
  const handleProvinceChange = (provinceNameTh: string) => {
    console.log("Province changed to:", provinceNameTh);
    
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
      console.log(`Found ${filteredAmp.length} districts for province ${provinceNameTh}`);
    } else {
      console.log("Province not found:", provinceNameTh);
      setFilteredAmphures([]);
    }
  };

  // Filter tambons when amphure changes
  const handleAmphureChange = (amphureNameTh: string) => {
    console.log("District changed to:", amphureNameTh);
    
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
      console.log(`Found ${filteredTmb.length} subdistricts for district ${amphureNameTh}`);
    } else {
      console.log("District not found:", amphureNameTh);
      setFilteredTambons([]);
    }
  };

  // Set zip code when tambon changes
  const handleTambonChange = (tambonNameTh: string) => {
    console.log("Subdistrict changed to:", tambonNameTh);
    setSelectedTambon(tambonNameTh);
    
    // Find the tambon by Thai name within the filtered tambons
    const selectedTmbObj = filteredTambons.find(t => t.name_th === tambonNameTh);
    
    if (selectedTmbObj) {
      // Set zip code immediately - convert the numeric value to a string
      const zipCodeValue = String(selectedTmbObj.zip_code);
      console.log("Setting zip code to:", zipCodeValue);
      setZipCode(zipCodeValue);
    } else {
      console.log("Subdistrict not found:", tambonNameTh);
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
    handleTambonChange,
    initializeLocation,
    dataLoaded,
    userProfileLoaded
  };
};

export default useThailandLocations;
