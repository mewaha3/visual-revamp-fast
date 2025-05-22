
import { Province, Amphure, Tambon } from '@/types/locationTypes';

/**
 * Filter amphures based on selected province
 */
export const filterAmphuresByProvince = (
  amphures: Amphure[],
  provinces: Province[],
  provinceName: string
): Amphure[] => {
  // Find the selected province
  const selectedProv = provinces.find(p => p.name_th === provinceName);
    
  if (selectedProv) {
    // Filter amphures by province_id
    return amphures.filter(a => a.province_id === selectedProv.id);
  }
  
  return [];
};

/**
 * Filter tambons based on selected amphure
 */
export const filterTambonsByAmphure = (
  tambons: Tambon[],
  amphures: Amphure[],
  amphureName: string
): Tambon[] => {
  // Find the selected amphure
  const selectedAmph = amphures.find(a => a.name_th === amphureName);
  
  if (selectedAmph) {
    // Filter tambons by amphure_id
    return tambons.filter(t => t.amphure_id === selectedAmph.id);
  }
  
  return [];
};

/**
 * Get zip code from selected tambon
 */
export const getZipCodeFromTambon = (
  tambons: Tambon[],
  tambonName: string,
  filteredTambons: Tambon[]
): string => {
  // Find the selected tambon
  const selectedTamb = tambons.find(t => 
    t.name_th === tambonName && 
    filteredTambons.some(ft => ft.name_th === tambonName)
  );
  
  if (selectedTamb && selectedTamb.zip_code) {
    return selectedTamb.zip_code.toString();
  }
  
  return "";
};
