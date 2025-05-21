
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
    console.log("API: Retrieved rows count:", rows.length);
    
    // Return all rows including headers for debugging
    const users = rows.map((row, index) => {
      // Make sure we have enough columns to extract email and password
      if (row.length >= 13) {
        return {
          first_name: row[0] || '',
          last_name: row[1] || '',
          national_id: row[2] || '',
          dob: row[3] || '',
          gender: row[4] || '',
          nationality: row[5] || '',
          address: row[6] || '',
          province: row[7] || '',
          district: row[8] || '',
          subdistrict: row[9] || '',
          zip_code: row[10] || '',
          email: row[11] || '',
          password: row[12] || '',
          certificate: row[13] === 'Yes' ? 'Yes' : 'No',
          passport: row[14] === 'Yes' ? 'Yes' : 'No',
          visa: row[15] === 'Yes' ? 'Yes' : 'No',
          work_permit: row[16] === 'Yes' ? 'Yes' : 'No',
          fullName: `${row[0] || ''} ${row[1] || ''}`,
          rowIndex: index
        };
      }
      return null;
    }).filter(user => user !== null);

    console.log(`API: Formatted ${users.length} users for response`);
    res.status(200).json({ users });
  } catch (error) {
    console.error('API ERROR: Error fetching users from Google Sheets:', error);
    res.status(500).json({ error: 'Failed to fetch users', message: error.message });
  }
});

export default router;
