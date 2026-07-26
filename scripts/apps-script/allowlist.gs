// Paste this into Extensions > Apps Script on the Google Sheet that will
// store allowlist entries, then deploy it as a Web App (see README.md in
// this folder for the full setup steps).

const SHEET_ID = 'REPLACE_WITH_YOUR_SHEET_ID';
const SECRET = 'REPLACE_WITH_A_LONG_RANDOM_SECRET';

function doGet(e) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  const count = Math.max(sheet.getLastRow() - 1, 0);
  return jsonResponse({ count: count });
}

function doPost(e) {
  let body;

  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ error: 'Invalid request.' });
  }

  if (body.secret !== SECRET) {
    return jsonResponse({ error: 'Unauthorized.' });
  }

  const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 'Username', 'Wallet', 'Follow', 'Quote', 'Tag',
      'Referred By', 'Invite Code',
    ]);
  }

  const wallet = String(body.wallet || '').trim();
  const username = String(body.username || '').trim();

  if (!wallet || !username) {
    return jsonResponse({ error: 'Missing fields.' });
  }

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][2]).toLowerCase() === wallet.toLowerCase()) {
      return jsonResponse({ error: 'That wallet is already on the list.' });
    }
  }

  const position = sheet.getLastRow(); // header occupies row 1
  const inviteCode =
    'TTN-' + Utilities.getUuid().split('-')[0].toUpperCase().slice(0, 6);

  sheet.appendRow([
    body.timestamp || new Date().toISOString(),
    username,
    wallet,
    body.follow || '',
    body.quote || '',
    body.tag || '',
    body.refBy || '',
    inviteCode,
  ]);

  return jsonResponse({
    ok: true,
    position: position,
    inviteCode: inviteCode,
    count: position,
  });
}

function jsonResponse(obj) {
  const output = ContentService.createTextOutput(JSON.stringify(obj));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
