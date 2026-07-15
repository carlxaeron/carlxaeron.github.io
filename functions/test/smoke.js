/**
 * Minimal smoke checks before `npm run deploy`.
 * Does not init Firebase — verifies migrated endpoints were removed
 * and remaining legacy handlers still export.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.js');
const src = fs.readFileSync(indexPath, 'utf8');

let failed = 0;

const removed = ['assistant', 'license', 'weeklyVisitReport'];
for (const name of removed) {
  const re = new RegExp(`exports\\.${name}\\s*=`);
  if (re.test(src)) {
    console.error(`FAIL export should be removed: ${name}`);
    failed += 1;
  } else {
    console.log(`PASS export removed: ${name}`);
  }
}

const remaining = ['contact', 'quotation', 'trackVisit', 'previewFeedback', 'analyticsSummary'];
for (const name of remaining) {
  const re = new RegExp(`exports\\.${name}\\s*=`);
  if (!re.test(src)) {
    console.error(`FAIL missing legacy export: ${name}`);
    failed += 1;
  } else {
    console.log(`PASS legacy export present: ${name}`);
  }
}

if (failed > 0) {
  process.exit(1);
}
console.log('RESULT: functions smoke OK');
