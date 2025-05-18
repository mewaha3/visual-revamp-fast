
import express from 'express';
import { google } from 'googleapis';
import { readFile } from 'fs/promises';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
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

    // ดึงข้อมูลทั้งหมดจากแท็บ "ชีต1"
    const response = await sheetsApi.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: TAB_NAME,
    });

    // แปลงข้อมูลเป็นรูปแบบที่เหมาะสม
    const rows = response.data.values || [];
    
    // สมมติว่าข้อมูลในชีต มีการจัดเรียงดังนี้: email (คอลัมน์ 0), password (คอลัมน์ 1)
    const users = rows.slice(1).map(row => ({
      email: row[0],
      password: row[1]
    }));

    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users from Google Sheets:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
