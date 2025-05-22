
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
  const [userProfileLoaded, setUserProfileLoaded] = useState<boolean>(false);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfileData = async () => {
      if (!userId) {
        console.log("No userId available, cannot fetch user profile");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        console.log("Fetching user profile data for userId:", userId);
        
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          console.log("User profile data loaded:", userData);
          
          setUserProfileLoaded(true);
        } else {
          console.log("No user document found");
          setError("ไม่พบข้อมูลผู้ใช้");
        }
      } catch (err) {
        console.error('Error fetching user profile data:', err);
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfileData();
  }, [userId]);

  return {
    isLoading,
    error,
    userProfileLoaded
  };
};

export default useThailandLocations;
