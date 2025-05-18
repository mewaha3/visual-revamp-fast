// test.js
import { getAllRows, addRow } from './sheets.js';

(async () => {
  try {
    // ดึงข้อมูลจาก sheet ชื่อ 'post_job'
    const postJobs = await getAllRows('post_job');
    console.log('post_job data:', postJobs);

    // ดึงข้อมูลจาก sheet ชื่อ 'match_results'
    const matches = await getAllRows('match_results');
    console.log('match_results data:', matches);

    // (ตัวอย่าง) เพิ่มแถวใหม่ลงใน 'match_results'
    // const newRow = ['W999','Test job','None','2025-01-01'];
    // const result = await addRow('match_results', newRow);
    // console.log('append result:', result);

  } catch (err) {
    console.error('Error talking to Sheets API:', err);
  }
})();
