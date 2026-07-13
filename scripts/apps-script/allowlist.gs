// Paste this into Extensions > Apps Script on the Google Sheet that will
// store allowlist entries, then deploy it as a Web App (see README.md in
// this folder for the full setup steps).

const SHEET_NAME = "Allowlist";
const SECRET = "REPLACE_WITH_A_LONG_RANDOM_SECRET";

function doGet(e) {
  const sheet = getSheet();
  const count = Math.max(sheet.getLastRow() - 1, 0);
  return jsonResponse({ count: count });
}

function doPost(e) {
  const sheet = getSheet();
  let body;

  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ error: "Invalid request." });
  }

  if (body.secret !== SECRET) {
    return jsonResponse({ error: "Unauthorized." });
  }

  const wallet = String(body.wallet || "").trim();
  const twitter = String(body.twitter || "").trim();
  const quotePostLink = String(body.quotePostLink || "").trim();

  if (!wallet || !twitter || !quotePostLink) {
    return jsonResponse({ error: "Missing fields." });
  }

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][3]).toLowerCase() === wallet.toLowerCase()) {
      return jsonResponse({ error: "That wallet is already on the list." });
    }
  }

  const position = sheet.getLastRow(); // header occupies row 1
  const inviteCode =
    "TTN-" + Utilities.getUuid().split("-")[0].toUpperCase().slice(0, 6);

  sheet.appendRow([
    position,
    new Date().toISOString(),
    twitter,
    wallet,
    inviteCode,
    quotePostLink,
    "BOUND",
  ]);

  return jsonResponse({
    ok: true,
    position: position,
    inviteCode: inviteCode,
    count: position,
  });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "Position",
      "Timestamp",
      "Twitter",
      "Wallet",
      "Invite Code",
      "Quote Post Link",
      "Status",
    ]);
  }
  return sheet;
}

function jsonResponse(obj) {
  const output = ContentService.createTextOutput(JSON.stringify(obj));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
