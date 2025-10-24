#!/usr/bin/env node
/*
 * Internal Markdown Link Auditor
 * Scans all .md files and validates relative links to local markdown files or asset paths.
 * - Ignores absolute URLs (http/https/mailto)
 * - Resolves relative paths from the file location
 * - Reports missing targets and aggregates summary
 * - Supports optional --json output
 * - Skips code fences to reduce false positives
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const JSON_MODE = args.includes('--json');
const ROOT = process.cwd();

function listMarkdownFiles(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith('.git')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listMarkdownFiles(full));
    else if (e.isFile() && e.name.endsWith('.md')) out.push(full);
  }
  return out;
}

function extractLinks(content) {
  // crude markdown link regex: [text](target) capturing target; exclude images ![]()
  const linkRegex = /(?<!!)\[[^\]]*\]\(([^)]+)\)/g;
  const links = [];
  let match;
  while ((match = linkRegex.exec(content))) {
    links.push(match[1].trim());
  }
  return links;
}

function isInternalTarget(target) {
  if (!target) return false;
  if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('mailto:')) return false;
  if (target.startsWith('#')) return false; // same page anchor only
  if (target.startsWith('data:')) return false;
  return true;
}

function stripHash(target) {
  const i = target.indexOf('#');
  return i === -1 ? target : target.slice(0, i);
}

function auditFile(file) {
  const raw = fs.readFileSync(file, 'utf8');
  // Remove fenced code blocks to avoid capturing code markdown examples
  const content = raw.replace(/```[\s\S]*?```/g, '');
  const links = extractLinks(content).filter(isInternalTarget);
  const issues = [];
  for (const link of links) {
    const bare = stripHash(link);
    if (bare === '') continue; // just an anchor
    const resolved = path.resolve(path.dirname(file), bare);
    // allow directory links that might rely on default README.md
    if (fs.existsSync(resolved)) continue;
    // If no file, try README fallback for directory style links
    if (fs.existsSync(path.join(resolved, 'README.md'))) continue;
    issues.push({ target: link, resolved });
  }
  return { file, issues };
}

function main() {
  const files = listMarkdownFiles(ROOT);
  const results = files.map(auditFile).filter(r => r.issues.length > 0);
  if (JSON_MODE) {
    console.log(JSON.stringify({ brokenCount: results.length, files: results }, null, 2));
    return;
  }
  if (!results.length) {
    console.log('No broken internal link targets detected.');
    return;
  }
  console.log('Broken internal link targets found:\n');
  results.forEach(r => {
    console.log(r.file);
    r.issues.forEach(i => {
      console.log(`  -> ${i.target}  (resolved: ${i.resolved})`);
    });
    console.log('');
  });
  console.log(`Summary: ${results.reduce((a,b)=>a+b.issues.length,0)} broken links across ${results.length} files.`);
  console.log('Run with --json for machine-readable output.');
}

main();
