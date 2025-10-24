#!/usr/bin/env node
// scripts/json-validation/update-coderabbit-schema.cjs
// Download the latest CodeRabbit schema for offline validation

const fs = require('fs');
const path = require('path');
const https = require('https');

const schemaUrl = 'https://coderabbit.ai/integrations/coderabbit-overrides.v2.json';
const localSchemaPath = path.resolve(__dirname, '../../schemas/coderabbit-overrides.v2.json');

https.get(schemaUrl, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Failed to fetch schema: HTTP ${res.statusCode}`);
    process.exit(1);
  }
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      // Validate JSON before writing
      const parsed = JSON.parse(data);
      fs.writeFileSync(localSchemaPath, JSON.stringify(parsed, null, 2));
      console.log(`✅ Schema updated at ${localSchemaPath}`);
    } catch (e) {
      console.error('Failed to parse schema JSON:', e.message);
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error('Error fetching schema:', err.message);
  process.exit(1);
});
