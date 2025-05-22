
import { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Province, Amphure, Tambon } from '@/types/locationTypes';

export const useThailandLocations = () => {
  // Auth context to get current user ID
  const { userId } = useAuth();
  
  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // User profile data loaded flag
  const [userProfileLoaded, setUserProfileLoaded] = useState<boolean>(false);

  // Thailand location data
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [amphures, setAmphures] = useState<Amphure[]>([]);
  const [tambons, setTambons] = useState<Tambon[]>([]);
  
  // Selected locations
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedAmphure, setSelectedAmphure] = useState<string>('');
  const [selectedTambon, setSelectedTambon] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');

  // Filtered locations based on selections
  const [filteredAmphures, setFilteredAmphures] = useState<Amphure[]>([]);
  const [filteredTambons, setFilteredTambons] = useState<Tambon[]>([]);

  // Fetch Thailand location data
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch provinces
        const provincesRef = collection(db, "provinces");
        const provinceSnapshot = await getDocs(provincesRef);
        const provincesList: Province[] = [];
        
        provinceSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data) {
            provincesList.push({ 
              id: data.id,
              name_th: data.name_th,
              name_en: data.name_en,
              geography_id: data.geography_id
            });
          }
        });
        
        setProvinces(provincesList);
        
        // Fetch amphures
        const amphuresRef = collection(db, "amphures");
        const amphureSnapshot = await getDocs(amphuresRef);
        const amphuresList: Amphure[] = [];
        
        amphureSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data) {
            amphuresList.push({ 
              id: data.id,
              name_th: data.name_th,
              name_en: data.name_en,
              province_id: data.province_id
            });
          }
        });
        
        setAmphures(amphuresList);
        
        // Fetch tambons
        const tambonsRef = collection(db, "tambons");
        const tambonSnapshot = await getDocs(tambonsRef);
        const tambonsList: Tambon[] = [];
        
        tambonSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data) {
            tambonsList.push({ 
              id: data.id,
              name_th: data.name_th,
              name_en: data.name_en,
              amphure_id: data.amphure_id,
              zip_code: data.zip_code
            });
          }
        });
        
        setTambons(tambonsList);
        console.log('Location data loaded:', {
          provinces: provincesList.length,
          amphures: amphuresList.length,
          tambons: tambonsList.length
        });
        
        // If we have no provinces, there might be an issue with the database
        if (provincesList.length === 0) {
          console.warn('No provinces found in the database');
          setError('ไม่พบข้อมูลจังหวัดในระบบ กรุณาติดต่อผู้ดูแล');
        }
        
      } catch (err) {
        console.error('Error fetching location data:', err);
        setError('ไม่สามารถโหลดข้อมูลพื้นที่ได้ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLocationData();
  }, []);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        console.log("Fetching user profile from Firestore...");
        
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          console.log("User profile loaded:", userData);
          
          if (userData.province && userData.district && userData.subdistrict) {
            // Set user location data
            setSelectedProvince(userData.province);
            setSelectedAmphure(userData.district);
            setSelectedTambon(userData.subdistrict);
            if (userData.zip_code) setZipCode(userData.zip_code);
            
            // Only try to filter if we actually have location data
            if (provinces.length > 0 && amphures.length > 0 && tambons.length > 0) {
              // Filter amphures and tambons based on user data
              if (userData.province) {
                const foundProvince = provinces.find(p => p.name_th === userData.province);
                if (foundProvince) {
                  const filteredAmphures = amphures.filter(a => a.province_id === foundProvince.id);
                  setFilteredAmphures(filteredAmphures);
                }
              }
              
              if (userData.district) {
                const foundAmphure = amphures.find(a => a.name_th === userData.district);
                if (foundAmphure) {
                  const filteredTambons = tambons.filter(t => t.amphure_id === foundAmphure.id);
                  setFilteredTambons(filteredTambons);
                }
              }
            }
            
            setUserProfileLoaded(true);
            console.log("User address data found:", {
              province: userData.province,
              district: userData.district,
              subdistrict: userData.subdistrict,
              zip_code: userData.zip_code
            });
          } else {
            console.log("User has no location data saved");
          }
        } else {
          console.log("No user document found");
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile data. Please try again later.');
      }
    };
    
    if (provinces.length > 0 && amphures.length > 0 && tambons.length > 0) {
      fetchUserProfile();
    }
  }, [userId, provinces, amphures, tambons]);

  // Handle province change
  const handleProvinceChange = (provinceName: string) => {
    setSelectedProvince(provinceName);
    setSelectedAmphure('');
    setSelectedTambon('');
    setZipCode('');
    
    // Find the selected province
    const selectedProv = provinces.find(p => p.name_th === provinceName);
    
    if (selectedProv) {
      // Filter amphures by province_id
      const filteredAmph = amphures.filter(a => a.province_id === selectedProv.id);
      setFilteredAmphures(filteredAmph);
      setFilteredTambons([]);
    }
  };
  
  // Handle amphure change
  const handleAmphureChange = (amphureName: string) => {
    setSelectedAmphure(amphureName);
    setSelectedTambon('');
    setZipCode('');
    
    // Find the selected amphure
    const selectedAmph = amphures.find(a => a.name_th === amphureName);
    
    if (selectedAmph) {
      // Filter tambons by amphure_id
      const filteredTamb = tambons.filter(t => t.amphure_id === selectedAmph.id);
      setFilteredTambons(filteredTamb);
    }
  };
  
  // Handle tambon change
  const handleTambonChange = (tambonName: string) => {
    setSelectedTambon(tambonName);
    
    // Find the selected tambon
    const selectedTamb = tambons.find(t => t.name_th === tambonName && 
      filteredTambons.some(ft => ft.name_th === tambonName));
    
    if (selectedTamb) {
      // Set zip code
      setZipCode(selectedTamb.zip_code?.toString() || "");
    }
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
