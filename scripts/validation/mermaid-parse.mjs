#!/usr/bin/env node
/**
 * Mermaid parser gate (#3492).
 *
 * Validates every ```mermaid block with Mermaid's own parser
 * (`mermaid.parse()` from the repo's pinned mermaid package) instead of
 * pattern matching. Mermaid needs a DOM for its sanitiser, so a lightweight
 * happy-dom window stands in; no browser is required.
 *
 * Usage:
 *   node scripts/validation/mermaid-parse.mjs                 # all tracked Markdown
 *   node scripts/validation/mermaid-parse.mjs a.md b.md        # given files
 *   node scripts/validation/mermaid-parse.mjs --changed-files-list=list.txt
 *
 * Output: one `file:line: message` per failing diagram. Exit 1 if any fail.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { findMermaidBlocks } = require('../fix-mermaid-diagrams.cjs');

// Historical records keep the diagrams they were written with (#3490), and
// the invalid fixtures exist to be invalid.
const EXCLUDED = [
  /(^|\/)node_modules\//,
  /^\.github\/reports\//,
  /^tests\/fixtures\/mermaid\/invalid\//,
];

let mermaidPromise;

/** Load mermaid once, behind a happy-dom window. */
async function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = (async () => {
      const { Window } = await import('happy-dom');
      const window = new Window();
      globalThis.window ??= window;
      globalThis.document ??= window.document;
      const { default: mermaid } = await import('mermaid');
      mermaid.initialize({ startOnLoad: false });
      return mermaid;
    })();
  }
  return mermaidPromise;
}

/**
 * Parse one diagram source.
 * @returns {Promise<string|null>} error message, or null when it parses
 */
export async function parseDiagram(source) {
  const mermaid = await loadMermaid();
  try {
    await mermaid.parse(source);
    return null;
  } catch (error) {
    return String(error?.message ?? error)
      .split('\n')
      .filter((line) => line.trim() !== '')
      .slice(0, 3)
      .join(' | ');
  }
}

/**
 * Parse every mermaid block in a Markdown document.
 * @returns {Promise<{file: string, line: number, message: string}[]>}
 */
export async function parseFile(file, content) {
  const failures = [];
  for (const block of findMermaidBlocks(content)) {
    if (block.close === -1) {
      failures.push({
        file,
        line: block.line,
        message: 'Unclosed ```mermaid fence: the diagram and everything after it render as code',
      });
      continue;
    }
    const message = await parseDiagram(block.source);
    if (message) failures.push({ file, line: block.line, message });
  }
  return failures;
}

/**
 * Exclusions match repository-relative paths; lint-staged and CI can pass
 * absolute ones, so resolve against the working directory first.
 */
export function isExcluded(file) {
  const relative = path.relative(process.cwd(), path.resolve(file));
  const normalised = relative.split(path.sep).join('/');
  return EXCLUDED.some((pattern) => pattern.test(normalised));
}

function trackedMarkdown() {
  return execFileSync('git', ['ls-files', '-z', '--', '*.md', '*.mdx'], { encoding: 'utf8' })
    .split('\0')
    .filter(Boolean);
}

/**
 * Read a changed-files list. NUL-delimited (git -z) records are taken as-is,
 * so pathnames keep every byte; a list without NULs is read one path per line.
 */
function readFileList(listPath) {
  const content = fs.readFileSync(listPath, 'utf8');
  const records = content.includes('\0') ? content.split('\0') : content.split(/\r?\n/);
  return records.filter(Boolean);
}

function resolveTargets(args) {
  const listArg = args.find((arg) => arg.startsWith('--changed-files-list='));
  const files = listArg
    ? readFileList(listArg.slice('--changed-files-list='.length))
    : args.filter((arg) => !arg.startsWith('--'));
  const candidates = files.length > 0 || listArg ? files : trackedMarkdown();
  return candidates.filter((file) => /\.mdx?$/i.test(file) && !isExcluded(file));
}

export async function main(args = process.argv.slice(2)) {
  const targets = resolveTargets(args);
  let diagrams = 0;
  const failures = [];

  for (const file of targets) {
    if (!fs.existsSync(file)) continue; // deleted in the change set
    const content = fs.readFileSync(file, 'utf8');
    diagrams += findMermaidBlocks(content).length;
    failures.push(...(await parseFile(file, content)));
  }

  for (const failure of failures) {
    console.error(`${failure.file}:${failure.line}: ${failure.message}`);
  }
  console.log(
    `Mermaid parser gate: ${targets.length} file(s), ${diagrams} diagram(s), ${failures.length} failure(s)`
  );
  return failures.length > 0 ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = await main();
}
