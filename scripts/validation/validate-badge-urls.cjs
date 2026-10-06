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
 * This pattern is the bare form `![alt](https://... Docs Validation-...)`, the
 * shape that made up the 76,594 occurrences across 7,657 files counted when this
 * check was written. The second malformation wraps the destination in angle
 * brackets and places the `>` mid-URL, as in
 * `![alt](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)`.
 * It has its own pattern, `ANGLE_BADGE`, because the closing `>` sits inside the
 * destination. It was left out at first for lack of an example; the README
 * regeneration pull request #3803 produced ten real ones in
 * `.github/agentic-workflows/README.md`, so it is matched now.
 *
 * Markdown permits an optional quoted title after the destination, as in
 * `![X](https://example.com/a.svg "Build status")`. A title is not part of the
 * URL, so it is excluded from the capture and from the repair; without that,
 * `--fix` would percent-encode the title into the path and corrupt a valid
 * badge.
 *
 * A title may itself contain parentheses (`"Build (main)"`; CommonMark allows
 * it), so the text inside the image's parentheses is matched as plain characters
 * or whole quoted strings, never as "anything up to the first `)`". Stopping at
 * the first `)` split such a title in two, reported a valid badge and let `--fix`
 * rewrite part of the title into the URL.
 *
 * Group 1 is the alt text, group 2 is everything inside the parentheses. The
 * destination and the optional title are separated explicitly by
 * `splitDestination` rather than by one more regex, because the two cases that
 * must not be reported — an already-encoded URL and a quoted title — are easier
 * to get right as steps than as nested groups.
 */
const BROKEN_BADGE = /!\[([^\]]*)\]\(((?:[^)"']|"[^"]*"|'[^']*')*)\)/gu;

/**
 * An image whose destination opens with `<https://img.shields.io/...` and whose
 * `>` closes before the label ends. Group 1 is the alt text, group 2 the URL up to
 * the `>`, group 3 everything after it inside the parentheses. A group 3 that is
 * only a quoted title is valid CommonMark (`![x](<url> "title")`) and not a defect.
 */
const ANGLE_BADGE =
  /!\[([^\]]*)\]\(<(https:\/\/img\.shields\.io\/[^>\s]*)>((?:[^)"']|"[^"]*"|'[^']*')*)\)/gu;

const SHIELDS_HOST = 'https://img.shields.io/';

/**
 * Split what follows the closing `>` into the leftover label text and an
 * optional trailing quoted title.
 *
 * @param {string} tail Text between the `>` and the closing parenthesis.
 * @returns {{body: string, title: string}} `body` is empty for a valid titled image.
 */
function splitAngleTail(tail) {
  const titled = tail.match(/^(.*?)\s+("[^"]*"|'[^']*')\s*$/u);
  return titled ? { body: titled[1], title: titled[2] } : { body: tail, title: '' };
}

/**
 * Whether an angle-bracket image has label text stranded after its `>`.
 *
 * @param {string} tail Text between the `>` and the closing parenthesis.
 * @returns {boolean}
 */
function isBrokenAngleTail(tail) {
  return splitAngleTail(tail).body.trim() !== '';
}

/**
 * Rebuild one angle-bracket badge as a single encoded URL.
 *
 * The text after the `>` continues the label, so it is joined back on: with a
 * `%20` when it starts with whitespace (`<.../Docs> Validation-...`), directly
 * when it starts with a character such as a colon (`<.../Badges>: Documentation
 * Update-...`). Every whitespace run becomes `%20`. The alt text is untouched.
 */
function repairAngleBadge(altText, head, tail) {
  const { body, title } = splitAngleTail(tail);
  const joiner = /^\s/u.test(body) ? '%20' : '';
  const encoded = body.trim().replace(/\s+/gu, '%20');
  return `![${altText}](${head}${joiner}${encoded}${title ? ` ${title}` : ''})`;
}

/**
 * Split the inside of an image into its destination and optional title.
 *
 * Markdown allows a quoted title after the destination, separated by
 * whitespace. The title is not part of the URL, so a badge that carries one is
 * not a broken-URL case, and encoding the title into the path would corrupt it.
 *
 * @param {string} inner Contents between the image's parentheses.
 * @returns {{destination: string, title: string}|null} Null when unparseable.
 */
function splitDestination(inner) {
  const text = inner.trim();
  if (text === '') {
    return null;
  }

  // Anchor on the shields host rather than on non-space characters: the
  // destination of a *broken* badge contains spaces by definition, so a
  // `\S+` prefix would never match it and the title would be swallowed.
  const quoted = text.match(/^(https:\/\/img\.shields\.io\/.*?)\s+("[^"]*")$/u);
  if (quoted) {
    return { destination: quoted[1], title: quoted[2] };
  }
  return { destination: text, title: '' };
}

/**
 * Whether one image's destination is a shields.io URL broken by a space.
 *
 * A space is only a defect when it sits inside the shields.io path, since that
 * is where the URL ends. A space between the destination and a title is not.
 *
 * @param {string} destination Image destination.
 * @returns {boolean}
 */
function isBrokenBadgeDestination(destination) {
  if (!destination.startsWith(SHIELDS_HOST)) {
    return false;
  }
  return destination.slice(SHIELDS_HOST.length).includes(' ');
}

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
/**
 * Tracks fenced code blocks using CommonMark's closing rules.
 *
 * A fence closes only on a marker of the same character that is at least as
 * long as the opening run and carries nothing but whitespace after it. Toggling
 * on any fence-like line misreads a four-backtick example that contains a
 * three-backtick block, which is how badge examples inside documentation would
 * be rewritten as if they were live badges.
 */
function createFenceTracker() {
  let marker = null;
  let length = 0;

  return {
    consume(line) {
      const match = line.match(/^\s{0,3}(`{3,}|~{3,})(.*)$/u);
      if (marker === null) {
        if (match) {
          if (match[1].startsWith('`') && match[2].includes('`')) {
            return false;
          }
          marker = match[1][0];
          length = match[1].length;
          return true;
        }
        return false;
      }
      if (match && match[1][0] === marker && match[1].length >= length && match[2].trim() === '') {
        marker = null;
        length = 0;
      }
      return true;
    },
  };
}

/**
 * Whether a line carries at least one image whose destination is broken.
 *
 * @param {string} line Single line of Markdown.
 * @returns {boolean}
 */
function lineHasBrokenBadge(line) {
  BROKEN_BADGE.lastIndex = 0;
  let match;
  while ((match = BROKEN_BADGE.exec(line)) !== null) {
    const parsed = splitDestination(match[2]);
    if (parsed && isBrokenBadgeDestination(parsed.destination)) {
      return true;
    }
  }
  ANGLE_BADGE.lastIndex = 0;
  while ((match = ANGLE_BADGE.exec(line)) !== null) {
    if (isBrokenAngleTail(match[3])) {
      return true;
    }
  }
  return false;
}

/**
 * Every broken badge in one Markdown file, each with its line number.
 *
 * @param {string} content File contents.
 * @returns {Array<{lineNumber: number, line: string}>}
 */
function findBrokenBadges(content) {
  const findings = [];
  const fence = createFenceTracker();
  content.split(/\r?\n/u).forEach((line, index) => {
    // A fenced block holds an example, not a rendered badge.
    if (fence.consume(line)) {
      return;
    }
    if (lineHasBrokenBadge(line)) {
      findings.push({ lineNumber: index + 1, line });
    }
  });
  return findings;
}

function repairBadge(match, altText, inner) {
  const parsed = splitDestination(inner);
  if (!parsed) {
    return match;
  }
  const encoded = parsed.destination.replace(/\s+/gu, '%20');
  const title = parsed.title ? ` ${parsed.title}` : '';
  return `![${altText}](${encoded}${title})`;
}

/**
 * Apply the repair to every line that carries a broken badge.
 *
 * @param {string} content File contents.
 * @returns {string} Repaired contents.
 */
function repairContent(content) {
  const fence = createFenceTracker();
  return content
    .split(/\r?\n/u)
    .map((line) => {
      if (fence.consume(line)) {
        return line;
      }
      const angleRepaired = line.replace(ANGLE_BADGE, (match, altText, head, tail) =>
        isBrokenAngleTail(tail) ? repairAngleBadge(altText, head, tail) : match
      );
      return angleRepaired.replace(BROKEN_BADGE, (match, altText, inner) => {
        const parsed = splitDestination(inner);
        return parsed && isBrokenBadgeDestination(parsed.destination)
          ? repairBadge(match, altText, inner)
          : match;
      });
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
    `[validate-badge-urls] ${total} badge URL(s) end at an unencoded space or close early inside angle brackets, so shields.io renders no label:\n${summary}\n` +
      'Run `npm run validate:badge-urls:fix` to repair them.'
  );
  process.exit(1);
}

module.exports = {
  ANGLE_BADGE,
  BROKEN_BADGE,
  isBrokenAngleTail,
  createFenceTracker,
  findBrokenBadges,
  isBrokenBadgeDestination,
  lineHasBrokenBadge,
  repairContent,
  splitDestination,
};

if (require.main === module) {
  main();
}
