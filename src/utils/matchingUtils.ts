
// Utility functions for matching calculations

// คำนวณคะแนนความคล้ายกันระหว่างสตริง
export const calculateStringSimilarity = (str1: string, str2: string): number => {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  // ตัดคำและเปรียบเทียบคำที่ตรงกัน
  const words1 = s1.split(/\s+|,/).filter(Boolean);
  const words2 = s2.split(/\s+|,/).filter(Boolean);
  
  // หาจำนวนคำที่มีร่วมกัน
  const commonWords = words1.filter(word => words2.includes(word)).length;
  
  // คำนวณคะแนนความคล้ายคลึง
  const similarity = commonWords / Math.max(words1.length, words2.length, 1);
  return similarity;
};

// คำนวณคะแนนความใกล้เคียงของตำแหน่งที่ตั้ง
export const calculateLocationSimilarity = (
  job1Province: string, 
  job1District: string, 
  job1Subdistrict: string, 
  job2Province: string, 
  job2District: string, 
  job2Subdistrict: string
): number => {
  if (job1Province === job2Province) {
    if (job1District === job2District) {
      if (job1Subdistrict === job2Subdistrict) {
        return 1.0; // ตรงกันทั้งหมด
      }
      return 0.8; // ตรงกันแค่จังหวัดและอำเภอ
    }
    return 0.5; // ตรงกันแค่จังหวัด
  }
  return 0.0; // ไม่ตรงกันเลย
};

// คำนวณความสอดคล้องของเวลา
export const calculateTimeOverlap = (
  startTime1: string, 
  endTime1: string, 
  startTime2: string, 
  endTime2: string
): number => {
  const parseTime = (timeStr: string) => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return hours * 60 + minutes; // แปลงเป็นนาที
  };
  
  const start1 = parseTime(startTime1);
  const end1 = parseTime(endTime1);
  const start2 = parseTime(startTime2);
  const end2 = parseTime(endTime2);
  
  // ตรวจสอบว่ามีช่วงเวลาที่ซ้อนทับกันหรือไม่
  if (end1 <= start2 || end2 <= start1) {
    return 0; // ไม่มีการซ้อนทับ
  }
  
  // คำนวณช่วงเวลาที่ซ้อนทับกัน
  const overlapStart = Math.max(start1, start2);
  const overlapEnd = Math.min(end1, end2);
  const overlapDuration = overlapEnd - overlapStart;
  
  // คำนวณความยาวของช่วงเวลาทั้งสอง
  const duration1 = end1 - start1;
  const duration2 = end2 - start2;
  const maxDuration = Math.max(duration1, duration2);
  
  return overlapDuration / maxDuration;
};

// คำนวณความตรงกันของวันที่
export const calculateDateMatch = (date1: string, date2: string): number => {
  // เปรียบเทียบแบบง่าย ถ้าวันที่ตรงกันให้คะแนนเต็ม ถ้าไม่ตรงให้ 0
  return date1 === date2 ? 1.0 : 0.0;
};

// คำนวณความสอดคล้องของเงินเดือน
export const calculateSalaryMatch = (jobSalary: number, workerMinSalary: number, workerMaxSalary: number): number => {
  if (jobSalary >= workerMinSalary && jobSalary <= workerMaxSalary) {
    return 1.0; // อยู่ในช่วงที่ต้องการพอดี
  }
  
  // หากเงินเดือนงานน้อยกว่าเงินเดือนขั้นต่ำของพนักงาน
  if (jobSalary < workerMinSalary) {
    const diff = workerMinSalary - jobSalary;
    const maxDiff = workerMinSalary * 0.5; // สมมติว่าต่างกันได้ไม่เกิน 50% ของเงินเดือนขั้นต่ำ
    return Math.max(0, 1 - (diff / maxDiff));
  }
  
  // หากเงินเดือนงานมากกว่าเงินเดือนขั้นสูงของพนักงาน (กรณีนี้น่าจะไม่มีปัญหา แต่เราให้คะแนนตามสัดส่วน)
  const diff = jobSalary - workerMaxSalary;
  const maxDiff = workerMaxSalary * 0.5; // สมมติว่าต่างกันได้ไม่เกิน 50% ของเงินเดือนขั้นสูง
  return Math.max(0, 1 - (diff / maxDiff));
};
