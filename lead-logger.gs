/**
 * Vittu Bharat — lead logger.
 * Paste into Apps Script attached to the leads Google Sheet, then deploy as a
 * web app (execute as me, access: anyone). See LEAD-TRACKING.md.
 */

// Optional: put an address here to get an email for every enquiry.
var NOTIFY_EMAIL = 'sidhvin77@gmail.com';

var HEADERS = ['Time (IST)', 'Name', 'Phone', 'Need', 'Budget', 'Note', 'Status',
               'Source', 'Page', 'Page title', 'Referrer', 'Campaign', 'Device',
               'Seconds on site', 'Session'];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow(rowFor(data));
    sheet.autoResizeColumns(1, HEADERS.length);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(
        NOTIFY_EMAIL,
        'New enquiry: ' + (data.name || 'Unknown') + ' — ' + (data.phone || 'no phone'),
        HEADERS.map(function (h, i) {
          return h + ': ' + [data.at, data.name, data.phone, data.need, data.budget,
            data.note, data.source, data.page, data.referrer][i];
        }).join('\n')
      );
    }

    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err);
  }
}

/** Flattens an enquiry into a sheet row, in HEADERS order. */
function rowFor(data) {
  var when = data.at ? new Date(data.at) : new Date();
  return [
    Utilities.formatDate(when, 'Asia/Kolkata', 'dd MMM yyyy, hh:mm a'),
    data.name || '',
    data.phone || '',
    data.need || '',
    data.budget || '',
    data.note || '',
    data.status === 'partial' ? 'Did not press send' : 'Sent',
    data.source || '',
    data.page || '',
    data.pageTitle || '',
    data.referrer || 'Direct / typed the address',
    data.campaign || '',
    data.device || '',
    data.secondsOnSite || '',
    data.session || ''
  ];
}

function doGet() {
  return ContentService.createTextOutput('Vittu Bharat lead logger is running.');
}
