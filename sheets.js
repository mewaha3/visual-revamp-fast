// sheets.js
import { readFile } from 'fs/promises';
import { google } from 'googleapis';

// 1) โหลด service-account credentials
const creds = JSON.parse(
  await readFile(new URL('./credentials.json', import.meta.url), 'utf8')
);

// 2) สร้าง GoogleAuth client พร้อมสโคปสเปรดชีต
const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// 3) สร้าง instance ของ Sheets API
const sheets = google.sheets({ version: 'v4', auth });

// 4) ใส่ Spreadsheet ID ของคุณ (จาก URL)
const SPREADSHEET_ID = '1ZUWl-l3qa0lOpW0-lfsrYmiuOO-0s0Nmlecq5Pr26Mg';

/**
 * ดึงข้อมูลทั้งหมดจาก tab (sheet) ที่กำหนด
 * @param {string} sheetName เช่น 'post_job' หรือ 'match_results'
 * @returns {Promise<string[][]>}  2D array ของค่าทุกเซลล์
 */
export async function getAllRows(sheetName) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: sheetName,           // ทั้ง tab จะได้ header + data
  });
  // res.data.values คือ 2D array หรือ undefined ถ้าแถวว่าง
  return res.data.values || [];
}

/**
 * เพิ่มแถวใหม่เข้าไปท้าย sheet
 * @param {string} sheetName
 * @param {string[]} rowArray  เช่น ['W999','Test','None','2025-01-01']
 */
export async function addRow(sheetName, rowArray) {
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: sheetName,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [rowArray] },
  });
  return res.data.updates;  // รายละเอียดการ append
}
