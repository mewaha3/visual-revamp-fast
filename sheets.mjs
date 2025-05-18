// sheets.mjs
import { readFile } from 'fs/promises';
import { google } from 'googleapis';

const creds = JSON.parse(
  await readFile(new URL('./credentials.json', import.meta.url), 'utf8')
);

const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheetsApi = google.sheets({ version: 'v4', auth });

const SPREADSHEET_ID = '1ZUWl-l3qa0lOpW0-lfsrYmiuOO-0s0Nmlecq5Pr26Mg';

export async function addRowToSheet1(rowValues) {
  const res = await sheetsApi.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'ชีต1',
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [rowValues] },
  });
  return res.data.updates;
}
