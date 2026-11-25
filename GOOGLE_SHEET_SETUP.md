# 💍 Chi. Chaithanya & Chi.La.Sow. Mallika — Wedding RSVP Google Sheets Setup

Connect your live wedding invitation RSVP form to a private Google Sheet in **under 2 minutes** with real-time live metric formulas and smart zero-duplicate in-place editing.

---

## ⚡ 1-Minute Setup Instructions

### Step 1: Create a New Google Sheet
1. Open your browser and go to: **[https://sheets.new](https://sheets.new)**
2. In the top-left, rename the document to: `Chaithanya & Mallika Wedding RSVPs`
3. At the bottom tab bar, double-click the sheet tab named `Sheet1` and rename it to:  
   **`RSVP Responses`**

---

### Step 2: Open Google Apps Script
1. In the top Google Sheets menu bar, click:  
   **`Extensions` ➔ `Apps Script`**
2. A new tab will open with a code editor showing `Code.gs`.
3. Select and delete any default code inside `Code.gs`.

---

### Step 3: Paste the Script Code
1. Open the file [google-sheet-script.gs](file:///C:/Users/sohai/.gemini/antigravity/scratch/chaitanya-weds-mallika/google-sheet-script.gs).
2. Copy the **entire contents** of `google-sheet-script.gs` and paste it into the Apps Script editor window.
3. Press **`Ctrl + S`** (or click the disk icon 💾) to save.

---

### Step 4: Run `setupSheet` to Generate the Royal Dashboard
1. Look at the toolbar at the top of Apps Script: locate the function dropdown (it might say `myFunction` or `doGet`).
2. Click the dropdown and select: **`setupSheet`**
3. Click the **`▶ Run`** button.
4. **Google will ask for one-time permission:**
   - Click **Review permissions**
   - Choose your Google account
   - Click **Advanced** (small link at bottom left)
   - Click **Go to Untitled project (unsafe)**
   - Click **Allow**
5. Switch back to your Google Sheets tab — you will see your sheet instantly formatted with:
   - 🌟 Royal Navy & Gold Title Banner
   - 📊 Live KPI Metrics (Total RSVPs, Total Guests, Wedding Headcount, Reception Headcount, Declined Count)
   - 📋 Beautiful column headers and locked top rows!

---

### Step 5: Deploy as a Web App (Public Webhook)
1. In the top-right corner of the Apps Script window, click the blue **`Deploy`** button ➔ choose **`New deployment`**.
2. Click the **Gear icon ⚙️** (next to "Select type") and choose **`Web app`**.
3. Fill in the fields:
   - **Description**: `Chaithanya & Mallika RSVP Webhook`
   - **Execute as**: `Me (your email)`
   - **Who has access**: **`Anyone`**  
     *(⚠️ IMPORTANT: You MUST choose "Anyone" so wedding guests can submit RSVPs without logging into your account)*
4. Click **`Deploy`**.
5. Copy the generated **Web app URL** (it ends in `/exec`).

---

### Step 6: Connect to Website
1. Open [script.js](file:///C:/Users/sohai/.gemini/antigravity/scratch/chaitanya-weds-mallika/script.js).
2. Near the top of `script.js`, locate:
   ```javascript
   const RSVP_CONFIG = {
     googleSheetWebhookUrl: "PASTE_YOUR_WEB_APP_URL_HERE"
   };
   ```
3. Paste your `/exec` URL between the quotes.
4. Save and deploy to Vercel!

---

## 🌟 What Happens When Guests RSVP?
- **Instant sync**: Submissions appear in your Google Sheet immediately.
- **Smart in-place edit**: If a guest resubmits with the same phone or name, their existing row is updated in-place without cluttering your sheet with duplicates.
- **Formulas recalculate automatically**: The dashboard at the top tracks live guest headcounts for catering and event planning.
