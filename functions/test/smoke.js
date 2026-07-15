/**
 * Minimal smoke checks before `npm run deploy`.
 * Does not init Firebase — only verifies expected export names stay present.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.js');
const src = fs.readFileSync(indexPath, 'utf8');

const requiredExports = ['assistant', 'license', 'weeklyVisitReport'];
let failed = 0;

for (const name of requiredExports) {
  const re = new RegExp(`exports\\.${name}\\s*=`);
  if (!re.test(src)) {
    console.error(`FAIL missing export: ${name}`);
    failed += 1;
  } else {
    console.log(`PASS export present: ${name}`);
  }
}

if (failed > 0) {
  process.exit(1);
}
console.log('RESULT: functions smoke OK');
