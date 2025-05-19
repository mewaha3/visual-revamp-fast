
import express from 'express';
import { google } from 'googleapis';
import { readFile } from 'fs/promises';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    console.log("API: Fetching users from Google Sheets");
    
    // อ่านไฟล์ credentials
    const creds = JSON.parse(
      await readFile(new URL('../../credentials.json', import.meta.url), 'utf8')
    );

    // สร้าง GoogleAuth
    const auth = new google.auth.GoogleAuth({
      credentials: creds,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheetsApi = google.sheets({ version: 'v4', auth });

    // ID ของ Spreadsheet และชื่อแท็บ
    const SPREADSHEET_ID = '1ZUWl-l3qa0lOpW0-lfsrYmiuOO-0s0Nmlecq5Pr26Mg';
    const TAB_NAME = 'ชีต1';

    console.log(`API: Retrieving data from spreadsheet ${SPREADSHEET_ID}, tab ${TAB_NAME}`);

    // ดึงข้อมูลทั้งหมดจากแท็บ "ชีต1"
    const response = await sheetsApi.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: TAB_NAME,
    });

    // แปลงข้อมูลเป็นรูปแบบที่เหมาะสม
    const rows = response.data.values || [];
    console.log("API: Retrieved rows from sheet:", rows);
    
    // คอลัมน์ข้อมูลในชีต "ชีต1" (กำหนดตามโครงสร้างข้อมูลจริง)
    // อ้างอิงจาก RegisterForm แถวข้อมูลจะเป็น [fullName, email, password]
    const users = [];
    
    // ตรวจสอบข้อมูลที่ได้รับ
    if (rows.length > 0) {
      // ข้ามหัวตารางหากมี
      const headerRow = rows[0];
      const startIndex = (headerRow && (headerRow[0] === 'ชื่อ' || headerRow[0] === 'fullName')) ? 1 : 0;
      
      // วิเคราะห์โครงสร้างข้อมูล
      for (let i = startIndex; i < rows.length; i++) {
        const row = rows[i];
        if (row && row.length >= 2) {
          // ตรวจสอบโครงสร้างข้อมูลและปรับให้เหมาะสม
          // fullName อยู่ที่คอลัมน์ 0, email คอลัมน์ 1, password คอลัมน์ 2
          users.push({
            fullName: row[0] || '',
            email: row[1] || '',
            password: row[2] || '',
          });
        }
      }
    }

    console.log(`API: Formatted ${users.length} users for response`);
    res.status(200).json({ users });
  } catch (error) {
    console.error('API ERROR: Error fetching users from Google Sheets:', error);
    res.status(500).json({ error: 'Failed to fetch users', message: error.message });
  }
});

export default router;
