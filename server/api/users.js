
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
    
    // สมมติว่าข้อมูลในชีต มีการจัดเรียงดังนี้: email (คอลัมน์ 0), password (คอลัมน์ 1), fullName (คอลัมน์ 2)
    // Skip header row if it exists
    const dataRows = rows.length > 0 ? rows.slice(1) : [];
    const users = dataRows.map(row => ({
      email: row[0] || '',
      password: row[1] || '',
      fullName: row[2] || '' // เพิ่มฟิลด์ fullName
    }));

    console.log(`API: Formatted ${users.length} users for response`);
    res.status(200).json({ users });
  } catch (error) {
    console.error('API ERROR: Error fetching users from Google Sheets:', error);
    res.status(500).json({ error: 'Failed to fetch users', message: error.message });
  }
});

export default router;
