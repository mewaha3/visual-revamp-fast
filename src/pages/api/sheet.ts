
// 🔥 sheets.ts  (project root, ESM)

import { readFile } from "fs/promises";
import { google } from "googleapis";

// 1) load your service-account JSON
const creds = JSON.parse(
  await readFile(new URL("./credentials.json", import.meta.url), "utf8")
);

// 2) set up GoogleAuth
const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheetsApi = google.sheets({ version: "v4", auth });

// 3) your Spreadsheet ID
const SPREADSHEET_ID = "1ZUWl-l3qa0lOpW0-lfsrYmiuOO-0s0Nmlecq5Pr26Mg";
const TAB_NAME = "ชีต1"; // the exact Thai tab name

/**
 * Append a single row into the tab named "ชีต1"
 * @param rowValues array of cell-values in the order of your columns
 */
export async function addRowToSheet1(rowValues: any[]) {
  const res = await sheetsApi.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: TAB_NAME,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [rowValues] },
  });
  return res.data.updates;
}

/**
 * Read all rows from the tab "ชีต1"
 * @returns Array of rows, each row is an array of strings
 */
export async function getAllRowsFromSheet1(): Promise<string[][]> {
  const res = await sheetsApi.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    // omit headers row if you have one; here we read everything
    range: `${TAB_NAME}`, 
  });
  // values is a 2D array [ [colA, colB, …], [row2colA, …], ... ]
  return res.data.values ?? [];
}
