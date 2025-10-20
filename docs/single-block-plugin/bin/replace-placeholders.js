// Mustache placeholder replacement script for {{slug}} plugin
// Usage: node bin/replace-placeholders.js <file> --map <mapping.json>
const fs = require('fs');
const path = require('path');

function replacePlaceholders(file, mapping) {
  let content = fs.readFileSync(file, 'utf8');
  Object.keys(mapping).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    content = content.replace(regex, mapping[key]);
  });
  fs.writeFileSync(file, content, 'utf8');
}

if (process.argv.length < 5 || process.argv[3] !== '--map') {
  console.error('Usage: node bin/replace-placeholders.js <file> --map <mapping.json>');
  process.exit(1);
}

const targetFile = process.argv[2];
const mappingFile = process.argv[4];
const mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));
replacePlaceholders(targetFile, mapping);

console.log(`Placeholders replaced in ${targetFile}`);