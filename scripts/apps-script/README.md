# Google Sheets allowlist backend

The Sheet is the source of truth for allowlist entries, live join count, and
each entry's position number (used on the pass card).

## 1. Create the Sheet

Create a new Google Sheet (any name). You don't need to add headers or a
tab named "Allowlist" yourself — the script creates that sheet/tab and its
header row automatically the first time it runs.

## 2. Add the script

1. In the Sheet, go to **Extensions → Apps Script**.
2. Delete the placeholder `Code.gs` contents and paste in
   [`allowlist.gs`](./allowlist.gs) from this folder.
3. Replace `REPLACE_WITH_A_LONG_RANDOM_SECRET` at the top with a long
   random string (e.g. generate one with `openssl rand -hex 24`). This
   secret stops randoms from writing to your sheet directly — anyone who
   has the deployed URL but not the secret gets rejected.
4. Save the project (name it whatever you like, e.g. "Titans Allowlist").

## 3. Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set:
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**, authorize the permissions it asks for (it needs
   access to the spreadsheet it's bound to).
5. Copy the **Web app URL** it gives you — it ends in `/exec`. Test it by
   opening it directly in a browser tab; it should return `{"count":0}`,
   not a Google sign-in/access-denied page. If it doesn't, double-check
   "Who has access" is set to "Anyone."

## 4. Wire it into the site

In the project root, create `.env.local` (already gitignored) with:

```
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXXXXXX/exec
GOOGLE_SHEETS_WEBHOOK_SECRET=the-same-secret-you-put-in-the-script
```

Restart the dev server after adding these. When you deploy the site
(Vercel, etc.), add the same two environment variables there too.

Once this is confirmed working end-to-end, the URL can be hardcoded
directly into `app/api/allowlist/route.ts` if you'd rather not manage it
as an env var — that route only runs server-side and is never shipped to
the browser, so the URL itself isn't sensitive. Keep the secret in the env
var either way.

## Notes

- If you ever redeploy the Apps Script as a *new* deployment (not "Manage
  deployments → Edit"), you'll get a new URL — update it wherever it's
  configured.
- Position numbers and invite codes come from the sheet itself, so the row
  order in the "Allowlist" tab is the definitive record.
- To rotate the secret, change it in both the script and wherever the env
  var is set, together.
