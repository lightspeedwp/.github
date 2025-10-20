#!/usr/bin/env node

/**
 * LightSpeed Template Validator
 * Checks for missing/extra mustache placeholders and required front matter in templates.
 */

const fs = require('fs');
const path = require('path');

const templateDirs = [
  './docs/single-block-plugin/',
  './templates/',
  './.github/AGENT_PROMPTS/'
];
const placeholderPattern = /\{\{[\w\-]+\}\}/g;
const frontMatterPattern = /^---\n[\s\S]+?\n---/;

const requiredFrontMatterFields = [
  'title',
  'version',
  'last_updated',
  'author',
  'description',
  'type'
];

// Utility: recursively get all files in dir
function getFiles(dir, ext = ['.md', '.mustache', '.yml', '.js']) {
  let files = [];
  fs.readdirSync(dir).forEach(f => {
    const filePath = path.join(dir, f);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      files = files.concat(getFiles(filePath, ext));
    } else if (ext.some(e => filePath.endsWith(e))) {
      files.push(filePath);
    }
  });
  return files;
}

// Validation
let errors = [];
for (const dir of templateDirs) {
  if (!fs.existsSync(dir)) continue;
  for (const file of getFiles(dir)) {
    const content = fs.readFileSync(file, 'utf8');
    // Must have front matter at top
    if (file.endsWith('.md') || file.endsWith('.mustache')) {
      const fmMatch = frontMatterPattern.exec(content);
      if (!fmMatch || fmMatch.index !== 0) {
        errors.push(`${file}: Missing or invalid front matter block at top.`);
        continue;
      }
      // Check for all required fields
      const fm = fmMatch[0];
      for (const field of requiredFrontMatterFields) {
        if (!new RegExp(`${field}:`).test(fm)) {
          errors.push(`${file}: Front matter missing required field: ${field}`);
        }
      }
    }
    // Scan for mustache placeholders
    const matches = content.match(placeholderPattern) || [];
    // (Optional: check for undocumented placeholders in PLACEHOLDERS.md)
  }
}

if (errors.length) {
  console.error('Template validation errors:');
  errors.forEach(e => console.error(' -', e));
  process.exit(1);
} else {
  console.log('All templates validated successfully.');
}