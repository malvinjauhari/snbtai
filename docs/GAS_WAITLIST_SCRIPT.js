/**
 * SNBT AI Waitlist - Google Apps Script Backend
 * 
 * Instructions:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1YpnKzYCcj6scXPw9QfWP7TFihR3RrnCxOGnVA2aK8-A/edit?gid=0#gid=0
 * 2. Click Extensions -> Apps Script
 * 3. Paste this entire code into Code.gs
 * 4. Click Deploy -> New Deployment
 * 5. Select type "Web app"
 * 6. Set "Execute as" to "Me"
 * 7. Set "Who has access" to "Anyone"
 * 8. Click Deploy and copy the Web App URL.
 * 9. Set the URL in your app environment variable: VITE_GAS_WAITLIST_URL
 */

const SHEET_NAME = 'Sheet1'; // Make sure this matches your tab name

function doPost(e) {
  // Add CORS headers so frontend can read success status
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = doc.getSheetByName(SHEET_NAME) || doc.getSheets()[0];
    
    // Parse form data payload
    // Using string parameters or the body
    let params = e.parameter;
    
    // Optional fallback to payload if parameter is empty
    if (!params || Object.keys(params).length === 0) {
      try {
        if (e.postData && e.postData.contents) {
          params = JSON.parse(e.postData.contents);
        }
      } catch (ex) {
        // Fallback for form-urlencoded if URLSearchParams is not available in GAS
        const decodedParams = {};
        if (e.postData && e.postData.contents) {
          const pairs = e.postData.contents.split('&');
          for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i].split('=');
            if (pair.length === 2) {
              decodedParams[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1].replace(/\+/g, ' '));
            }
          }
        }
        params = decodedParams;
      }
    }

    // Required Google Sheet Columns: No, Nama, Email, No HP, Timestamp, PTN Impian
    // Plus "Jurusan" or "Source" if desired.

    // Calculate current row (No)
    const rowNum = sheet.getLastRow();
    const timestamp = new Date(); // Adds timestamp natively
    
    // Order based on the provided format image:
    // A: No
    // B: Nama
    // C: Email
    // D: No HP
    // E: Timestamp
    // F: PTN Impian
    
    const rowData = [
      rowNum,                                     // No
      params.name || '',                          // Nama
      params.email || '',                         // Email
      params.phone || '',                         // No HP
      timestamp,                                  // Timestamp
      params.dreamUniversity || ''                // PTN Impian
    ];
    
    sheet.appendRow(rowData);

    return ContentService.createTextOutput(JSON.stringify({ 
      "status": "success", 
      "message": "Data successfully added." 
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      "status": "error", 
      "message": error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  // Pre-flight request support for CORS
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}
