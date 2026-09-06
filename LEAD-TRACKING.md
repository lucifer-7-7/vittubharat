# Lead tracking (copy of every enquiry)

Every enquiry still opens WhatsApp exactly as before. Just before that, the site
posts a copy of the answers to a Google Sheet so nothing is lost if the person
never presses send in WhatsApp.

## One-time setup (~5 minutes)

1. Create a new Google Sheet. Name it e.g. `Vittu Bharat — Leads`.
2. In the Sheet: **Extensions → Apps Script**.
3. Delete whatever is in `Code.gs` and paste the contents of `lead-logger.gs`
   from this repo.
4. **Deploy → New deployment → type: Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Deploy, approve the permissions prompt, copy the **Web app URL**
   (it looks like `https://script.google.com/macros/s/AKfy.../exec`).
5. Open `main.js`, find `const LEAD_LOG_URL = '';` and paste the URL between the
   quotes.
6. Upload `main.js`. Done — submit a test enquiry and check the Sheet.

Until step 5 is done the logging is a no-op: the forms behave exactly as they do
today, nothing breaks.

## What gets stored

One row per enquiry, with everything we can honestly know about the person:

| Column | What it tells you |
| --- | --- |
| Time (IST) | When they enquired, in Indian time |
| Name, Phone | What they typed |
| Need | Buying / selling / home loan / legal / etc. |
| Budget | From the step-by-step form (blank on the quick form) |
| Note | Anything extra they wrote |
| Status | `Sent` or `Did not press send` |
| Source | Which form: `quick-enquiry`, `enquiry-form-whatsapp`, `enquiry-form-email` |
| Page, Page title | Which page they enquired from |
| Referrer | Google, a link somewhere, or direct |
| Campaign | utm_source / utm_campaign / gclid, if they arrived from an ad |
| Device | Mobile or desktop, screen size, language |
| Seconds on site | How long they read before enquiring |
| Session | Groups rows from the same visit |

### Unfinished enquiries

If someone fills in their name and a valid 10-digit phone number and then leaves
without pressing send, the row is still saved with status **Did not press send**.
Those are worth calling back — they were interested enough to type their number.

Rows with no usable phone number are never saved, and a lead that was actually
sent is never duplicated as an unfinished one.

## Email alerts

`NOTIFY_EMAIL` in `lead-logger.gs` is set to `sidhvin77@gmail.com`, so every
enquiry also arrives as an email with all of the above. Change or clear that line
to stop the emails.

## Notes

- The request uses `navigator.sendBeacon`, so it survives the tab switching to
  WhatsApp. If it fails, the enquiry still goes through — logging never blocks.
- Only what the visitor typed into the form, plus the page and campaign they came
  from, is sent. No tracking across the rest of the site.

## Tested

Verified in headless Chrome against a local copy of the site:

- quick enquiry form → row saved, WhatsApp still opens
- ad-campaign visit → `utm_source`, `utm_campaign` and `gclid` recorded
- filled the form then navigated away → saved as "Did not press send"
- phone number too short → nothing saved
- normal submission → exactly one row, no duplicate
