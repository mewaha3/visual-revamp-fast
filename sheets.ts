// 🔥 sheets.ts (project root)

import { readFile } from 'fs/promises'
import { google } from 'googleapis'

// 1) load your service-account JSON
const creds = JSON.parse(
  await readFile(new URL('./credentials.json', import.meta.url), 'utf8')
)

// 2) set up GoogleAuth
const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})
const sheetsApi = google.sheets({ version: 'v4', auth })

// 3) your Spreadsheet ID
const SPREADSHEET_ID = '1ZUWl-l3qa0lOpW0-lfsrYmiuOO-0s0Nmlecq5Pr26Mg'

/**
 * Append a single row into the tab named "ชีต1"
 * @param rowValues array of cell-values in the order of your columns
 */
export async function addRowToSheet1(rowValues: any[]) {
  const res = await sheetsApi.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'ชีต1',                // ← your tab name
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [rowValues] },
  })
  return res.data.updates
}
