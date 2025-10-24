#!/usr/bin/env node
/**
 * UK English normalisation script.
 *
 * Converts common US spellings to UK variants in markdown files while:
 *  - Skipping code fences, inline code, and frontmatter keys
 *  - Avoiding changes inside JSON, JS, or CSS fenced blocks
 *  - Preserving case (Colour vs colour)
 *  - Dry-run by default (no file writes) unless --apply supplied
 *
 * Usage:
 *   node scripts/en-gb-normalise.js              # dry run summary
 *   node scripts/en-gb-normalise.js --apply      # apply in-place edits
 *   node scripts/en-gb-normalise.js path/thing.md other/*.md
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const EXPLICIT_FILES = args.filter(a => !a.startsWith('--'));

// Basic mapping (extend cautiously). Order matters (longer first to prevent partial overlaps).
// NOTE: 'color'/'colors' intentionally excluded because JSON schemas (theme.json), CSS properties,
// and block support keys must retain US spelling. Narrative prose may use "colour", but automation
// should not transform these tokens to avoid corrupting examples or misleading users copying code.
const MAP = [
  ['behavior', 'behaviour'],
  ['behaviors', 'behaviours'],
  ['organize', 'organise'],
  ['organizing', 'organising'],
  ['optimization', 'optimisation'],
  ['optimize', 'optimise'],
  ['optimized', 'optimised'],
  ['license', 'licence'],
  ['customization', 'customisation'],
  ['customize', 'customise'],
  ['analyze', 'analyse'],
  ['analyzing', 'analysing'],
  ['initialize', 'initialise'],
  ['initialization', 'initialisation']
];

// Exceptions: tokens / identifiers we must not touch (exact match case-insensitive tests in code spans or JSON keys not necessary due to skip logic, but add safety net for plain text contexts).
const EXCEPT_REGEX = /\b(ColorPicker|BehaviorSubject|useColorMode|licenseKey)\b/i;

function listMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(e => {
    const res = path.join(dir, e.name);
    if (e.isDirectory()) return listMarkdownFiles(res);
    if (e.isFile() && res.endsWith('.md')) return [res];
    return [];
  });
}

function applyMappings(segment) {
  return MAP.reduce((acc, [us, uk]) => {
    return acc.replace(new RegExp(`\\b${us}\\b`, 'gi'), match => {
      if (EXCEPT_REGEX.test(match)) return match; // skip exceptions
      // Preserve case: all caps, capitalised, or lower
      if (match === match.toUpperCase()) return uk.toUpperCase();
      if (match[0] === match[0].toUpperCase()) return uk.charAt(0).toUpperCase() + uk.slice(1);
      return uk;
    });
  }, segment);
}

function processFile(file) {
  const original = fs.readFileSync(file, 'utf8');
  const lines = original.split(/\n/);

  let inFence = false;
  let fenceLang = '';
  let inFrontMatter = false;
  let changed = false;

  const processed = lines.map((line, idx) => {
    // Frontmatter toggling
    if (idx === 0 && line.trim() === '---') {
      inFrontMatter = true;
      return line; // do not transform frontmatter keys/values
    }
    if (inFrontMatter) {
      if (line.trim() === '---') inFrontMatter = false;
      return line;
    }

    // Code fence detection
    const fenceMatch = line.match(/^```(.*)$/);
    if (fenceMatch) {
      if (!inFence) {
        inFence = true;
        fenceLang = fenceMatch[1].trim();
      } else {
        inFence = false;
        fenceLang = '';
      }
      return line; // do not transform fence markers or contents
    }

    if (inFence) return line; // skip content inside fenced code blocks entirely

    // Skip inline code spans by splitting on backticks and only transforming even index segments
    if (line.includes('`')) {
      const parts = line.split(/(`[^`]*`)/); // keep delimiters
      const transformed = parts.map(part => {
        if (part.startsWith('`') && part.endsWith('`')) return part; // code span
        const newPart = applyMappings(part);
        if (newPart !== part) changed = true;
        return newPart;
      });
      return transformed.join('');
    }

    const newLine = applyMappings(line);
    if (newLine !== line) changed = true;
    return newLine;
  }).join('\n');

  if (changed) {
    if (APPLY) {
      fs.writeFileSync(file, processed, 'utf8');
    }
  }
  return { file, changed };
}

function run() {
  const targets = EXPLICIT_FILES.length ? EXPLICIT_FILES : listMarkdownFiles(process.cwd());
  const results = targets.map(processFile);
  const changed = results.filter(r => r.changed).map(r => r.file);
  if (!APPLY) {
    console.log('Dry run: files that would change (run with --apply to write):');
    changed.forEach(f => console.log('  ' + f));
  } else {
    console.log('Applied UK English normalisation to files:');
    changed.forEach(f => console.log('  ' + f));
  }
  console.log(`Total changed: ${changed.length}`);
}

run();
