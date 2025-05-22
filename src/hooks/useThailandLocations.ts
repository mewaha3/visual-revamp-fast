
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export const useThailandLocations = () => {
  // Auth context to get current user ID
  const { userId } = useAuth();
  
  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // User profile data loaded flag
  const [userProfileLoaded, setUserProfileLoaded] = useState<boolean>(false);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        console.log("Fetching user profile from Firestore...");
        
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          console.log("User profile loaded:", userData);
          
          if (userData.province && userData.district && userData.subdistrict) {
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
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [userId]);

  return {
    isLoading,
    error,
    userProfileLoaded
  };
};

export default useThailandLocations;
