
import { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Province, Amphure, Tambon } from '@/types/locationTypes';

/**
 * Hook for fetching Thailand location data from Firestore
 */
export const useLocationData = () => {
  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Thailand location data
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [amphures, setAmphures] = useState<Amphure[]>([]);
  const [tambons, setTambons] = useState<Tambon[]>([]);

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

  return {
    isLoading,
    error,
    provinces,
    amphures,
    tambons
  };
};
