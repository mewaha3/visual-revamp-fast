
export interface Province {
  id: number;
  name_th: string;
  name_en: string;
  geography_id: number;
}

export interface Amphure {
  id: number;
  name_th: string;
  name_en: string;
  province_id: number;
}

export interface Tambon {
  id: number;
  name_th: string;
  name_en: string;
  amphure_id: number;
  zip_code: number;
}
