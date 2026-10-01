#!/usr/bin/env node

/**
 * Detect and repair shields.io badge URLs truncated by an unencoded space.
 *
 * `scripts/agents/branding.agent.js` used to interpolate a badge label into a
 * shields.io path without encoding, so a label containing a space produced
 *
 *     ![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
 *
 * The URL ends at the first space. shields.io receives no label, so it renders a
 * malformed badge rather than the intended one, and wrapping the destination in
 * angle brackets does not help: a bare space still terminates a Markdown link
 * destination. The generator now percent-encodes, and this check keeps the
 * already-written files honest.
 *
 * The fix is `%20`, which shields.io accepts, and it leaves the readable alt
 * text untouched.
 *
 * Not in `validate:all` yet, and deliberately so: the repository carries
 * 76,594 findings across 7,657 files, so adding it there would fail every pull
 * request against a backlog this check did not create. The backlog is tracked
 * for a dedicated repair pull request; once it is cleared this belongs in
 * `validate:all` and in CI, exactly as `validate:skill-doc-contracts` already
 * is.
 *
 * Usage:
 *   node scripts/validation/validate-badge-urls.cjs            # report only
 *   node scripts/validation/validate-badge-urls.cjs --fix      # repair in place
 *   node scripts/validation/validate-badge-urls.cjs --files a.md b.md
 */

const fs = require('fs');
const path = require('path');

/**
 * A shields.io image whose destination contains an unencoded space.
 *
 * Scoped deliberately to the bare form `![alt](https://... Docs Validation-...)`,
 * which is the only shape present in the repository (76,594 occurrences across
 * 7,657 files at the time of writing). A second, rarer malformation wraps the
 * destination in angle brackets and places the `>` mid-URL, as in
 * `![alt](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)`.
 * That one is not matched here: the closing `>` sits inside the destination, so
 * it needs a different pattern, and no file in the repository currently uses it.
 * Adding it blind would mean guessing at a shape with no evidence to test
 * against.
 *
 * Group 1 is the alt text, group 2 the destination, so a repair can keep the
 * accessible name and rewrite only the URL.
 */
const BROKEN_BADGE =
  /!\[\s*([^\]]*?)\s*\]\(\s*(https:\/\/img\.shields\.io\/[^)\s]*\s[^)]*?)\s*\)/gu;

/** Directories never walked, matching the other repository validators. */
const SKIP_DIRECTORIES = new Set(['node_modules', '.git', 'coverage', 'dist', 'build', 'vendor']);

/**
 * Rebuild one broken badge.
 *
 * The destination is already a full `https://img.shields.io/...` URL, so it is
 * percent-encoded in place rather than reassembled — reassembling it against a
 * hard-coded host duplicated the prefix. Only the spaces are encoded; a colon
 * is legal in a shields.io path and is left readable. The alt text is preserved
 * exactly, since it is the accessible name and not the defect.
 */
function repairBadge(_match, altText, destination) {
  const encoded = destination.trim().replace(/\s+/gu, '%20');
  return `![${altText}](${encoded})`;
}

/**
 * Every broken badge in one Markdown file, each with its line number.
 *
 * @param {string} content File contents.
 * @returns {Array<{lineNumber: number, line: string}>}
 */
function findBrokenBadges(content) {
  const findings = [];
  let inFence = false;
  content.split(/\r?\n/u).forEach((line, index) => {
    // A fenced block holds an example, not a rendered badge, so track the
    // fence rather than only skipping its opening line.
    if (/^\s*(?:```|~~~)/u.test(line)) {
      inFence = !inFence;
      return;
    }
    if (inFence) {
      return;
    }
    BROKEN_BADGE.lastIndex = 0;
    if (BROKEN_BADGE.test(line)) {
      findings.push({ lineNumber: index + 1, line });
    }
  });
  return findings;
}

/**
 * Apply the repair to every line that carries a broken badge.
 *
 * @param {string} content File contents.
 * @returns {string} Repaired contents.
 */
function repairContent(content) {
  let inFence = false;
  return content
    .split(/\r?\n/u)
    .map((line) => {
      if (/^\s*(?:```|~~~)/u.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence) {
        return line;
      }
      return line.replace(BROKEN_BADGE, (match, altText, destination) =>
        repairBadge(match, altText, destination)
      );
    })
    .join('\n');
}

function collectMarkdownFiles(directory, found = []) {
  let entries;
  try {
    entries = fs.readdirSync(directory, { withFileTypes: true });
  } catch {
    return found;
  }
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRECTORIES.has(entry.name)) {
        collectMarkdownFiles(absolute, found);
      }
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.md')) {
      found.push(absolute);
    }
  }
  return found;
}

function main() {
  const args = process.argv.slice(2);
  const shouldFix = args.includes('--fix');
  const explicitFiles = args.filter((arg) => !arg.startsWith('--'));

  const root = process.cwd();
  const files = explicitFiles.length
    ? explicitFiles.map((file) => path.resolve(root, file))
    : collectMarkdownFiles(root);

  const offenders = [];
  for (const file of files) {
    if (!fs.existsSync(file)) {
      continue;
    }
    const content = fs.readFileSync(file, 'utf8');
    const findings = findBrokenBadges(content);
    if (findings.length === 0) {
      continue;
    }
    if (shouldFix) {
      fs.writeFileSync(file, repairContent(content), 'utf8');
    }
    offenders.push({ file, findings });
  }

  const total = offenders.reduce((count, entry) => count + entry.findings.length, 0);

  if (offenders.length === 0) {
    console.log('[validate-badge-urls] OK');
    return;
  }

  // At repository scale the offender list runs to thousands of files, which
  // past a threshold is unreadable in a CI log and drowns the summary. Report
  // the worst offenders in full, count the rest, and point at `--fix`.
  const MAX_LISTED = 25;
  const ranked = offenders
    .map(({ file, findings }) => ({
      file: path.relative(root, file),
      count: findings.length,
      lines: findings.map((finding) => finding.lineNumber),
    }))
    .sort((a, b) => b.count - a.count || a.file.localeCompare(b.file));

  const format = (entry) => `${entry.file}: ${entry.count} badge(s) — ${entry.lines.join(', ')}`;
  const listed = ranked.slice(0, MAX_LISTED).map(format).join('\n');
  const remainder = ranked.length - Math.min(MAX_LISTED, ranked.length);
  const summary = remainder > 0 ? `${listed}\n... and ${remainder} more file(s)` : listed;

  if (shouldFix) {
    console.log(
      `[validate-badge-urls] repaired ${total} badge(s) in ${offenders.length} file(s).\n${summary}`
    );
    return;
  }

  console.error(
    `[validate-badge-urls] ${total} badge URL(s) end at an unencoded space, so shields.io renders no label:\n${summary}\n` +
      'Run `npm run validate:badge-urls:fix` to repair them.'
  );
  process.exit(1);
}

module.exports = {
  BROKEN_BADGE,
  findBrokenBadges,
  repairContent,
};

if (require.main === module) {
  main();
}
