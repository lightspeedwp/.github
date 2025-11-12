#!/usr/bin/env node
const fs = require('fs'), path = require('path');
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname,'..','package.json'),'utf8'));
const scripts = new Set(Object.keys(pkg.scripts || {}));
const docs = ['docs/LINTING.md','docs/HUSKY-PRECOMMITS.md'];

let ok = true;
for (const p of docs) {
  if (!fs.existsSync(p)) continue;
  const m = fs.readFileSync(p,'utf8').matchAll(/npm run ([\w:-]+)/g);
  for (const [,s] of m) if (!scripts.has(s)) { console.error(`Missing script: ${s} in ${p}`); ok = false; }
}
process.exit(ok ? 0 : 1);
