#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

const srcDir = path.join('.github', 'automation', 'canonical');
const outDir = path.join('.github', 'automation', 'canonical', 'json');

fs.mkdirSync(outDir, { recursive: true });

for (const file of ['repository-categories.yml','repository-names.yml','labels.yml']) {
  const y = fs.readFileSync(path.join(srcDir, file), 'utf8');
  const j = YAML.parse(y);
  fs.writeFileSync(path.join(outDir, file.replace(/\.yml$/, '.json')), JSON.stringify(j, null, 2));
}
console.log('Canonical JSON generated.');
