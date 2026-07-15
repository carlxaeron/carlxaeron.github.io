#!/usr/bin/env node
/**
 * Build hosting-php/data/assistant-context.json from src/external-config.js
 * Run from repo root:
 *   node api-carlxaeron/hosting-php/scripts/build-assistant-context.cjs
 */
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../../..');
const cfg = require(path.join(root, 'src/external-config.js'));

const context = {
  SKILLS: cfg.SKILLS,
  DESCRIPTION: cfg.PROJECT_DESCRIPTION,
  DESCRIPTIONAI: cfg.PROJECT_DESCRIPTION2,
  COMPANIES: cfg.COMPANIES,
  EXPERIENCES: cfg.EXPERIENCES,
};

const outDir = path.join(__dirname, '..', 'data');
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, 'assistant-context.json');
fs.writeFileSync(outFile, JSON.stringify(context, null, 0));
console.log('Wrote', outFile, `(${Buffer.byteLength(JSON.stringify(context))} bytes)`);
