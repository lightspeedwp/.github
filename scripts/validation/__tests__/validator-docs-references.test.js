/**
 * Reference check for the validator documentation.
 *
 * These three documents describe what the agent validators enforce. When that
 * text drifted from the code it did so silently, and twice it named a script
 * or a file that did not exist. This suite checks the mechanical half of that:
 * every npm script and every repository path these documents mention must
 * resolve. What the validators actually enforce is covered by
 * structure-validation.test.js.
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const DOCS_DIR = path.join(ROOT, '.github', 'docs');
const DOCS = ['AGENT_FOLDER_STRUCTURE.md', 'CHANGELOG_FORMAT.md', 'PACKAGE_JSON_REQUIREMENTS.md'];

const rootPackage = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8'));

function readDoc(name) {
  return fs.readFileSync(path.join(DOCS_DIR, name), 'utf-8');
}

describe('validator documentation references', () => {
  test.each(DOCS)('%s exists', (name) => {
    expect(fs.existsSync(path.join(DOCS_DIR, name))).toBe(true);
  });

  test.each(DOCS)('%s names only npm scripts that exist', (name) => {
    // Matches the script names in `npm run <script>` and in inline code spans
    // that start with "npm run".
    const referenced = new Set();
    const pattern = /npm run ([a-z0-9:_-]+)/g;

    for (const match of readDoc(name).matchAll(pattern)) {
      referenced.add(match[1]);
    }

    for (const script of referenced) {
      expect(Object.keys(rootPackage.scripts ?? {})).toContain(script);
    }
  });

  test.each(DOCS)('%s links only to files that exist', (name) => {
    const broken = [];
    const pattern = /\[[^\]]*\]\(([^)#][^)]*)\)/g;

    for (const match of readDoc(name).matchAll(pattern)) {
      const target = match[1].trim();
      if (/^[a-z]+:/i.test(target)) continue; // external link

      const resolved = path.resolve(DOCS_DIR, target.split('#')[0]);
      if (!fs.existsSync(resolved)) broken.push(target);
    }

    expect(broken).toEqual([]);
  });

  test.each(DOCS)('%s names only scripts that exist', (name) => {
    // Bare relative paths to scripts or validators, for example
    // scripts/validation/phase-4-structure-audit.js.
    const missing = [];
    const pattern = /(scripts\/[A-Za-z0-9_./-]+\.(?:js|cjs|mjs|sh))/g;

    for (const match of readDoc(name).matchAll(pattern)) {
      if (!fs.existsSync(path.join(ROOT, match[1]))) missing.push(match[1]);
    }

    expect(missing).toEqual([]);
  });
});
