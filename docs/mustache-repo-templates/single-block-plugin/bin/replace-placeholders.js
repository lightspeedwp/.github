// Mustache placeholder replacement and rename script for {{slug}}
// Usage: node bin/replace-placeholders.js <file> --map <mapping.json>

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Replaces all mustache placeholders in a given file and its subdirectories.
 * @param {string} file - The mapping file containing placeholders.
 * @param {object} mapping - The mapping file containing placeholders.
 */
function replacePlaceholders(file, mapping) {

  if (process.argv.length < 4) {
    console.error('Usage: node bin/replace-placeholders.js <mapping.json> <rootDir>');
    process.exit(1);
  }

  const mapping = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const rootDir = process.argv[3] || '.';

  glob.sync(`${rootDir}/**/*.mustache`).forEach((file) => {
    let content = fs.readFileSync(file, 'utf8');
    Object.keys(mapping).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(regex, mapping[key]);
    });
    const dest = file.replace(/\.mustache$/, '');
    fs.writeFileSync(dest, content, 'utf8');
    fs.unlinkSync(file);
    console.log(`Processed ${dest}`);
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
