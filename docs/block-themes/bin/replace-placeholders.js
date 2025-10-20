// Mustache placeholder replacement script for {{slug}} block theme
// Usage: node bin/replace-placeholders.js <file> --map <mapping.json>
// See PLACEHOLDER-WORKFLOW.md for full instructions.

const fs = require('fs');
const path = require('path');
function replacePlaceholders(filePath, mapping) {
  let content = fs.readFileSync(filePath, 'utf8');
  Object.entries(mapping).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    content = content.replace(regex, value);
  });
  fs.writeFileSync(filePath, content, 'utf8');
}
const argv = process.argv.slice(2);
if (argv.length < 3 || argv[1] !== '--map') {
  console.error('Usage: node bin/replace-placeholders.js <file> --map <mapping.json>');
  process.exit(1);
}
const filePath = argv[0];
const mappingFile = argv[2];
if (!fs.existsSync(filePath) || !fs.existsSync(mappingFile)) {
  console.error('File or mapping JSON does not exist');
  process.exit(1);
}
const mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));
replacePlaceholders(filePath, mapping);
console.log(`Replaced placeholders in ${filePath}`);