
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Province, Amphure, Tambon } from '@/types/locationTypes';

/**
 * Hook for loading user's location data from their profile
 */
export const useUserLocationProfile = (
  provinces: Province[],
  amphures: Amphure[],
  tambons: Tambon[]
) => {
  // Auth context to get current user ID
  const { userId } = useAuth();
  
  // User profile data loaded flag
  const [userProfileLoaded, setUserProfileLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Selected locations from user profile
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedAmphure, setSelectedAmphure] = useState<string>('');
  const [selectedTambon, setSelectedTambon] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId || !provinces.length || !amphures.length || !tambons.length) {
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
        
        setUserProfileLoaded(true);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile data. Please try again later.');
      }
    };
    
    fetchUserProfile();
  }, [userId, provinces, amphures, tambons]);

  return {
    userProfileLoaded,
    selectedProvince,
    selectedAmphure,
    selectedTambon,
    zipCode,
    setSelectedProvince,
    setSelectedAmphure,
    setSelectedTambon,
    setZipCode,
    error
  };
};
