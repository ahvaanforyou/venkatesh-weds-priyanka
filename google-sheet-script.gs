/**
 * =======================================================================
 * 💍 CHI. CHAITHANYA & CHI.LA.SOW. MALLIKA WEDDING
 * 🌟 GOOGLE SHEETS RSVP DASHBOARD & WEBHOOK SCRIPT (setupSheet)
 * =======================================================================
 * 
 * FEATURES:
 * 1. EXECUTIVE LIVE METRICS DASHBOARD (Rows 1-3):
 *    - Total Responses: COUNTA(B8:B)
 *    - Total Attending Guests: SUM(E8:E)
 *    - Attending Parties: COUNTIF(D8:D, "Joyfully Accept")
 *    - Wedding Attendees (15 Nov · Kakinada): COUNTIF(F8:F, "Yes")
 *    - Reception Attendees (18 Nov · Warangal): COUNTIF(G8:G, "Yes")
 *    - Declined Count: COUNTIF(D8:D, "Regretfully Decline")
 *    - Real-time Attendance Summary
 * 
 * 2. STRUCTURED DATA COLUMNS (Row 7+):
 *    - Col A: Timestamp
 *    - Col B: Guest / Family Name
 *    - Col C: Phone / WhatsApp Number
 *    - Col D: Attendance Status (Joyfully Accept / Regretfully Decline)
 *    - Col E: Total Guests
 *    - Col F: Wedding (15 Nov · Kakinada)
 *    - Col G: Reception (18 Nov · Warangal)
 *    - Col H: Warm Wishes / Blessings
 * 
 * 3. SMART IN-PLACE EDITING (Zero Duplicates):
 *    - If a guest submits an updated RSVP, this script finds their row
 *      by phone number or name and updates it in place!
 * 
 * =======================================================================
 * HOW TO SET UP (Takes ~1 minute):
 * 1. Open Google Sheets (https://sheets.new)
 * 2. Rename the sheet tab at the bottom to: "RSVP Responses"
 * 3. Click "Extensions" > "Apps Script" in top menu
 * 4. Replace any code in Code.gs with this ENTIRE file
 * 5. From the function dropdown at the top, select "setupSheet" and click "Run"
 *    (Authorize permissions: "Review permissions" -> Choose account -> "Advanced" -> "Go to Untitled project" -> "Allow")
 *    Your Google Sheet will transform into a luxury Royal Navy & Gold dashboard!
 * 6. Click the blue "Deploy" button (top right) > "New deployment"
 *    - Click the gear icon > select "Web app"
 *    - Description: "Chaithanya & Mallika Wedding RSVP"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (CRITICAL: Must choose Anyone so guests can submit)
 *    - Click "Deploy"
 * 7. Copy the "Web app URL" (ends in /exec)
 * 8. Paste it into `RSVP_CONFIG.googleSheetWebhookUrl` in `script.js`
 * =======================================================================
 */

var SHEET_NAME = "RSVP Responses";

var HEADERS = [
  "Timestamp",
  "Guest / Family Name",
  "Phone / WhatsApp Number",
  "Attendance Status",
  "Total Guests",
  "Wedding (15 Nov · Kakinada)",
  "Reception (18 Nov · Warangal)",
  "Warm Wishes / Blessings"
];

/**
 * Normalizes phone numbers to digits only for accurate matching
 */
function cleanPhone(p) {
  if (!p) return "";
  return String(p).replace(/\D/g, "");
}

/**
 * Normalizes text for clean comparison
 */
function cleanText(t) {
  if (!t) return "";
  return String(t).trim().toLowerCase();
}

/**
 * Searches the sheet to find an existing row for this guest to update in-place
 */
function findExistingRowIndex(sheet, data, startRow) {
  var lastRow = sheet.getLastRow();
  if (lastRow < startRow) return -1;

  var numRows = lastRow - startRow + 1;
  // Read Col B (Name) & Col C (Phone) from startRow to lastRow
  var values = sheet.getRange(startRow, 2, numRows, 2).getValues();

  var targetPhone = cleanPhone(data.phone || data.contact || data.tel);
  var targetName = cleanText(data.name || data.fullName);

  // 1. Primary check: Phone match (search newest rows first)
  if (targetPhone && targetPhone.length >= 7) {
    for (var i = values.length - 1; i >= 0; i--) {
      var rowPhone = cleanPhone(values[i][1]); // Col C
      if (rowPhone && rowPhone.length >= 7) {
        if (rowPhone === targetPhone || rowPhone.slice(-10) === targetPhone.slice(-10)) {
          return startRow + i;
        }
      }
    }
  }

  // 2. Secondary check: Exact Name match
  if (targetName && targetName.length > 2) {
    for (var j = values.length - 1; j >= 0; j--) {
      var rowName = cleanText(values[j][0]); // Col B
      if (rowName && rowName === targetName) {
        return startRow + j;
      }
    }
  }

  return -1; // New guest RSVP
}

/**
 * =========================================================================
 * INITIALIZES THE ROYAL NAVY & GOLD DASHBOARD & STYLED DATA TABLE
 * Run this function once from the Apps Script editor!
 * =========================================================================
 */
function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.getActiveSheet();
    sheet.setName(SHEET_NAME);
  }
  sheet.clear();

  // Set column widths for optimal luxury presentation
  sheet.setColumnWidth(1, 165); // Timestamp
  sheet.setColumnWidth(2, 220); // Guest Name
  sheet.setColumnWidth(3, 180); // Phone / WhatsApp
  sheet.setColumnWidth(4, 160); // Attendance Status
  sheet.setColumnWidth(5, 110); // Total Guests
  sheet.setColumnWidth(6, 170); // Wedding (15 Nov)
  sheet.setColumnWidth(7, 170); // Reception (18 Nov)
  sheet.setColumnWidth(8, 360); // Warm Wishes / Blessings

  // =========================================================================
  // ROW 1: MASTER TITLE BANNER (Royal Blue #133979 & Radiant Gold #FFE58F)
  // =========================================================================
  sheet.getRange("A1:H1").merge()
    .setValue("✨ CHI. CHAITHANYA & CHI.LA.SOW. MALLIKA — WEDDING RSVP DASHBOARD ✨")
    .setBackground("#133979")
    .setFontColor("#FFE58F")
    .setFontFamily("Georgia")
    .setFontSize(13)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  sheet.setRowHeight(1, 40);

  // =========================================================================
  // ROW 2: DASHBOARD METRIC LABELS
  // =========================================================================
  sheet.getRange("A2:B2").merge().setValue("📊 TOTAL RESPONSES").setHorizontalAlignment("center");
  sheet.getRange("C2").setValue("👥 TOTAL GUESTS").setHorizontalAlignment("center");
  sheet.getRange("D2").setValue("🌸 ATTENDING PARTIES").setHorizontalAlignment("center");
  sheet.getRange("E2").setValue("💒 WEDDING (15 NOV)").setHorizontalAlignment("center");
  sheet.getRange("F2").setValue("🎉 RECEPTION (18 NOV)").setHorizontalAlignment("center");
  sheet.getRange("G2").setValue("🕊️ DECLINED").setHorizontalAlignment("center");
  sheet.getRange("H2").setValue("📋 ATTENDANCE SUMMARY").setHorizontalAlignment("center");

  // Style Metric Headers
  sheet.getRange("A2:B2").setBackground("#0D234C").setFontColor("#FFE58F").setFontSize(9).setFontWeight("bold").setVerticalAlignment("middle");
  sheet.getRange("C2").setBackground("#133979").setFontColor("#FFFFFF").setFontSize(9).setFontWeight("bold").setVerticalAlignment("middle");
  sheet.getRange("D2").setBackground("#1A4B9C").setFontColor("#FFFFFF").setFontSize(9).setFontWeight("bold").setVerticalAlignment("middle");
  sheet.getRange("E2").setBackground("#235FB3").setFontColor("#FFFFFF").setFontSize(9).setFontWeight("bold").setVerticalAlignment("middle");
  sheet.getRange("F2").setBackground("#E11D48").setFontColor("#FFFFFF").setFontSize(9).setFontWeight("bold").setVerticalAlignment("middle");
  sheet.getRange("G2").setBackground("#4A5568").setFontColor("#FFFFFF").setFontSize(9).setFontWeight("bold").setVerticalAlignment("middle");
  sheet.getRange("H2").setBackground("#0D234C").setFontColor("#FFE58F").setFontSize(9).setFontWeight("bold").setVerticalAlignment("middle");
  sheet.setRowHeight(2, 24);

  // =========================================================================
  // ROW 3: LIVE METRIC FORMULAS (Recalculate automatically with every RSVP)
  // =========================================================================
  sheet.getRange("A3:B3").merge().setFormula('=COUNTA(B8:B)');
  sheet.getRange("C3").setFormula('=SUM(E8:E)');
  sheet.getRange("D3").setFormula('=COUNTIF(D8:D, "Joyfully Accept")');
  sheet.getRange("E3").setFormula('=COUNTIF(F8:F, "Yes")');
  sheet.getRange("F3").setFormula('=COUNTIF(G8:G, "Yes")');
  sheet.getRange("G3").setFormula('=COUNTIF(D8:D, "Regretfully Decline")');
  sheet.getRange("H3").setFormula('="Attending: " & COUNTIF(D8:D, "Joyfully Accept") & " parties (" & SUM(E8:E) & " guests) | Declined: " & COUNTIF(D8:D, "Regretfully Decline")');

  // Format Metric Values
  var valRange = sheet.getRange("A3:H3");
  valRange.setFontFamily("Georgia")
    .setFontSize(15)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setBorder(true, true, true, true, true, true, "#D4AF37", SpreadsheetApp.BorderStyle.SOLID);
  sheet.setRowHeight(3, 34);

  // Custom Card Backgrounds
  sheet.getRange("A3:B3").setBackground("#F4F7FC").setFontColor("#0D234C");
  sheet.getRange("C3").setBackground("#FFFBEA").setFontColor("#133979").setFontSize(17);
  sheet.getRange("D3").setBackground("#EBF3FE").setFontColor("#1A4B9C").setFontSize(16);
  sheet.getRange("E3").setBackground("#EFF6FF").setFontColor("#235FB3").setFontSize(16);
  sheet.getRange("F3").setBackground("#FFF1F2").setFontColor("#E11D48").setFontSize(16);
  sheet.getRange("G3").setBackground("#F7FAFC").setFontColor("#4A5568").setFontSize(16);
  sheet.getRange("H3").setBackground("#F4F7FC").setFontColor("#0D234C").setFontSize(10);

  // Empty separator rows
  sheet.setRowHeight(4, 8);
  sheet.setRowHeight(5, 8);

  // =========================================================================
  // ROW 6: TABLE SECTION BANNER
  // =========================================================================
  sheet.getRange("A6:H6").merge()
    .setValue("  📋 DETAILED GUEST RESPONSES (SMART IN-PLACE UPDATING)")
    .setBackground("#E8EEF8")
    .setFontColor("#133979")
    .setFontFamily("Georgia")
    .setFontSize(10)
    .setFontWeight("bold")
    .setVerticalAlignment("middle");
  sheet.setRowHeight(6, 24);

  // =========================================================================
  // ROW 7: COLUMN HEADERS
  // =========================================================================
  sheet.getRange(7, 1, 1, HEADERS.length).setValues([HEADERS]);
  var headerRange = sheet.getRange("A7:H7");
  headerRange.setBackground("#133979")
    .setFontColor("#FFFFFF")
    .setFontFamily("Georgia")
    .setFontSize(10)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setBorder(true, true, true, true, true, true, "#D4AF37", SpreadsheetApp.BorderStyle.SOLID);
  sheet.setRowHeight(7, 30);

  // Freeze top 7 rows so dashboard & headers stay locked when scrolling
  sheet.setFrozenRows(7);

  // =========================================================================
  // ROW 8: SAMPLE TEST ROW
  // =========================================================================
  var testRow = [
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    "Ramesh Kumar & Family (Sample)",
    "+91 98765 43210",
    "Joyfully Accept",
    2,
    "Yes",
    "Yes",
    "Warmest congratulations to Chaithanya & Mallika! Wishing you an eternity of happiness and divine love."
  ];

  sheet.appendRow(testRow);
  formatDataRow(sheet, 8, "Joyfully Accept");

  Logger.log("🎉 SUCCESS! Dashboard initialized with live Wedding & Reception metrics!");
  return "SUCCESS: Dashboard initialized with live Wedding & Reception metrics!";
}

/**
 * Styles a guest row with clean fonts and badge styling
 */
function formatDataRow(sheet, rowNum, status) {
  var rowRange = sheet.getRange(rowNum, 1, 1, 8);
  rowRange.setFontFamily("Arial")
    .setFontSize(10)
    .setVerticalAlignment("middle")
    .setBorder(true, true, true, true, true, true, "#E2E8F0", SpreadsheetApp.BorderStyle.SOLID);

  sheet.setRowHeight(rowNum, 28);

  // Center Attendance Status, Total Guests, Wedding, and Reception
  sheet.getRange(rowNum, 4, 1, 4).setHorizontalAlignment("center");
  sheet.getRange(rowNum, 5).setFontWeight("bold"); // Bold total guests

  // Badge colors for Attendance Status (Col D)
  var cellStatus = sheet.getRange(rowNum, 4);
  if (status === "Joyfully Accept") {
    cellStatus.setBackground("#EBF3FE").setFontColor("#133979").setFontWeight("bold");
  } else {
    cellStatus.setBackground("#F1F5F9").setFontColor("#64748B").setFontWeight("normal");
  }
}

/**
 * Ensures table structure exists before receiving webhooks
 */
function ensureInitialized(sheet) {
  if (sheet.getLastRow() < 7 || sheet.getRange(7, 1).getValue() !== "Timestamp") {
    setupSheet();
  }
}

/**
 * Handles incoming RSVP POST submissions from the website
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.getActiveSheet();
      sheet.setName(SHEET_NAME);
    }
    ensureInitialized(sheet);

    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var startRow = 8;
    if (sheet.getRange(1, 1).getValue() === "Timestamp") {
      startRow = 2;
    } else if (sheet.getRange(7, 1).getValue() === "Timestamp") {
      startRow = 8;
    }

    var baseTimestamp = data.timestamp 
      ? new Date(data.timestamp).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }) 
      : new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

    var name = (data.name || data.fullName || "-").toString().trim();
    var phone = (data.phone || data.contact || "-").toString().trim();
    var isAccept = (data.attending === "yes" || data.attending === "Joyfully Accept" || data.attending === true);
    var attending = isAccept ? "Joyfully Accept" : "Regretfully Decline";
    
    var guestCount = 0;
    if (isAccept) {
      guestCount = Number(data.guests !== undefined ? data.guests : (data.guestCount || 1));
      if (isNaN(guestCount) || guestCount <= 0) {
        guestCount = 1;
      }
    }

    var eventsStr = (data.events || "").toString();
    var wedding = (isAccept && (eventsStr.indexOf("Wedding") !== -1 || data.wedding === "Yes")) ? "Yes" : "-";
    var reception = (isAccept && (eventsStr.indexOf("Reception") !== -1 || data.reception === "Yes")) ? "Yes" : "-";
    var message = (data.message || data.note || data.warm_wishes || "-").toString().trim();

    // Check for existing RSVP (Smart In-Place Row Edit)
    var existingRow = findExistingRowIndex(sheet, data, startRow);
    var isUpdate = (existingRow > 0);
    var targetRow = isUpdate ? existingRow : Math.max(startRow, sheet.getLastRow() + 1);
    var displayTimestamp = isUpdate ? (baseTimestamp + " (Edited)") : baseTimestamp;

    var rowValues = [
      displayTimestamp,
      name,
      phone,
      attending,
      guestCount,
      wedding,
      reception,
      message
    ];

    sheet.getRange(targetRow, 1, 1, rowValues.length).setValues([rowValues]);
    formatDataRow(sheet, targetRow, attending);

    SpreadsheetApp.flush();

    var actionTaken = isUpdate ? "updated" : "created";
    Logger.log("RSVP " + actionTaken + " successfully at row " + targetRow + " for " + name);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      action: actionTaken,
      message: isUpdate ? "RSVP updated in same row in Google Sheets" : "RSVP recorded in Google Sheets",
      name: name,
      rowNumber: targetRow
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("Error in doPost: " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

/**
 * Health check endpoint for testing in browser
 */
function doGet(e) {
  return ContentService.createTextOutput("💍 Chaithanya & Mallika Wedding RSVP Webhook is ACTIVE and ready to receive RSVPs!")
    .setMimeType(ContentService.MimeType.TEXT);
}
