#!/usr/bin/env node
/**
 * Badge Link Fixer - Auto-identify and repair broken links in markdown
 * Handles trailing special characters (>, backticks) and invalid URL encoding
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXCLUDE_PATHS = ['node_modules', '.git', '.github/workflows'];

const PATTERNS = [
  { name: 'Trailing angle brackets', regex: /(https?:\/\/[^>\s`]+)>(?=[\s\n]|$)/g, replacement: '$1' },
  { name: 'Trailing backticks', regex: /(https?:\/\/[^`\s]+)`(?=[\s\n]|$)/g, replacement: '$1' },
];

function isExcluded(filePath) {
  return EXCLUDE_PATHS.some(exclude => filePath.includes(exclude));
}

function findMarkdownFiles(rootDir = '.') {
  const files = [];
  function walkDir(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (isExcluded(fullPath)) continue;
        if (entry.isDirectory()) walkDir(fullPath);
        else if (entry.name.endsWith('.md')) files.push(fullPath);
      }
    } catch (err) {
      console.error(`Error reading directory ${dir}:`, err.message);
    }
  }
  walkDir(rootDir);
  return files;
}

function main() {
  console.log('🔍 Badge Link Fixer - Starting...\n');
  const markdownFiles = findMarkdownFiles();
  console.log(`Found ${markdownFiles.length} markdown files\n`);

  let fixed = 0, broken = 0;

  for (const file of markdownFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    let updatedContent = content;
    let fileFixed = false;

    for (const pattern of PATTERNS) {
      const matches = updatedContent.match(pattern.regex);
      if (matches) {
        updatedContent = updatedContent.replace(pattern.regex, pattern.replacement);
        fileFixed = true;
      }
    }

    if (fileFixed) {
      fs.writeFileSync(file, updatedContent, 'utf-8');
      fixed++;
      console.log(`✅ ${file}`);
    }
  }

  console.log(`\n📊 Fixed: ${fixed} files\n`);
  process.exit(0);
}

main();
