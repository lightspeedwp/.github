#!/usr/bin/env node

/**
 * dedupe-footers.js
 * Detect and collapse compounded footer blocks in Markdown files (#3451).
 *
 * Background. Before #3443 the generator's dedup regex did not match
 * asterisk-wrapped footers, so `ensureFooter()` concluded "no footer present"
 * on every run and appended another copy. With deterministic per-file seeding
 * (`seed = filePath`) every copy written to a given file was byte-identical,
 * and the end-anchored regex only ever replaced the last one — so the copies
 * above it accumulated untouched. The generator is fixed; this tool clears the
 * backlog and guards against it returning.
 *
 * WHAT THIS TOOL GUARANTEES. It only ever deletes lines it can positively
 * identify as part of a footer block:
 *   - a line matching a footer phrase from `footer-policy.js` (never inside a
 *     fenced code block — real content legitimately starts with these phrases,
 *     e.g. a SAVED_REPLIES draft line "Thanks for helping us get this to the
 *     right place!"),
 *   - the standalone link line immediately following such a phrase,
 *   - a thematic break that introduces such a block, and only when the
 *     generator would treat it as the block's separator,
 *   - the blank lines inside a removed block's span.
 * Frontmatter delimiters and fenced code are immutable. Anything not provably
 * part of a footer block is left byte-for-byte alone.
 *
 * WHAT THIS TOOL DELIBERATELY DOES NOT DO. It never selects or rewrites a
 * footer phrase. Placing the canonical footer at EOF is the generator's job
 * (`ensureFooter()`), and duplicating phrase selection here would recreate
 * exactly the two-copies-of-the-truth problem #3546 just removed. A file whose
 * stranded blocks are removed is therefore left with no footer until the next
 * generator run, which is a normal, passing state.
 *
 * Usage:
 *   node scripts/dedupe-footers.js                    # dry-run report (default)
 *   node scripts/dedupe-footers.js --fix              # rewrite files in place
 *                                                     # (refuses a dirty tree;
 *                                                     #  add --force to override)
 *   node scripts/dedupe-footers.js --paths-from=f.txt # restrict to a file list
 *   node scripts/dedupe-footers.js --changed-only --base=origin/develop --head=HEAD
 *   node scripts/dedupe-footers.js --json             # machine-readable report
 *
 * Exit codes: 0 = clean (or dry-run), 1 = violations found in check mode,
 * 2 = bad usage / IO error.
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { execFileSync } from 'child_process';
import {
  isFooterPhraseLine,
  isHighConfidenceFooterPhraseLine,
  isFooterLinkLine,
  isThematicBreakLine,
  isFooterExemptPath,
} from './agents/includes/footer-policy.js';
import { findShapeMultiples } from './agents/includes/footer-shape.js';

/** How many findings the human-readable report lists before summarising the rest. */
const TOP_REPORT_ROWS = 15;

/**
 * Locate the YAML frontmatter block, if the document opens with one.
 *
 * Both delimiters are returned as part of the range so callers can treat them
 * as immutable — removing an opening or closing `---` here would turn a
 * documented file into a body that starts with frontmatter text.
 *
 * @param {string[]} lines - Document split on '\n'
 * @returns {{start: number, end: number}|null} Inclusive delimiter indices
 */
export function findFrontmatterRange(lines) {
  if (lines.length === 0 || lines[0].trim() !== '---') {
    return null;
  }
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      return { start: 0, end: i };
    }
  }
  return null;
}

/**
 * Mark every line that belongs to a fenced code block, including the fences.
 *
 * Fence tracking follows CommonMark closely enough for this purpose: a fence is
 * opened by three or more backticks/tildes at the start of a line and closed by
 * a line opening with the same character and at least as many of them. A line
 * inside a fence is never classified as a footer, which is what keeps the tool
 * from deleting example footers out of documentation.
 *
 * @param {string[]} lines - Document split on '\n'
 * @returns {boolean[]} True where the line is inside (or is) a fence
 */
export function computeFenceMask(lines) {
  const mask = new Array(lines.length).fill(false);
  let openChar = null;
  let openLength = 0;

  for (let i = 0; i < lines.length; i++) {
    // A CRLF document leaves a trailing carriage return on every line, and in
    // JavaScript `.` does not match `\r` -- so `(.*)$` cannot reach the end of
    // such a line and the fence is never recognised at all. Every byte after
    // the opening ``` would then be unmasked, and a footer phrase inside a
    // code block on a CRLF file would be deleted as real content. The phrase
    // matchers already tolerate the `\r` because they trim, so the mask has
    // to tolerate it too.
    const line = lines[i].replace(/\r$/, '');
    // CommonMark: a fence opens or closes only after 0-3 spaces of indent. A
    // line indented 4+ is an indented code block, not a fence, so it must not
    // be read as one -- trimming first would misread indented code as a
    // delimiter and unmask everything after it.
    const match = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (match) {
      const char = match[1][0];
      const length = match[1].length;
      const info = match[2];
      if (openChar === null) {
        // A backtick fence's info string may not contain a backtick, so
        // ```a`b` is code, not a fence opener.
        if (char === '`' && info.includes('`')) {
          continue;
        }
        openChar = char;
        openLength = length;
        mask[i] = true;
      } else if (char === openChar && length >= openLength && info.trim() === '') {
        // A closing fence is the marker plus whitespace only. Without this, a
        // line such as ```bash inside an open block would close it early and
        // the rest of the real code block would be unmasked -- which is how
        // footer-shaped lines inside code blocks come to be deleted.
        openChar = null;
        mask[i] = true;
      } else {
        mask[i] = true; // Nested or annotated fence: content, not a delimiter.
      }
      continue;
    }
    if (openChar !== null) {
      mask[i] = true;
    }
  }
  return mask;
}

/**
 * Analyse a document and produce the cleaned version.
 *
 * Regions are the unit of decision. A region is a maximal run of footer
 * phrases separated only by blank lines, thematic breaks and link lines; any
 * other content ends it. That split matters because the two cases need
 * opposite outcomes:
 *
 *   - Region at EOF: this is the canonical footer position. More than one block
 *     here is compounding, so all but the last block are removed. The last is
 *     kept because it is the one the generator's end-anchored regex treats as
 *     canonical, so keeping it means the next generator run is a no-op instead
 *     of a rewrite.
 *   - Region with content after it: the blocks are stranded intrusions, not
 *     footers any more (the end-anchored regex cannot see them either, so the
 *     generator will place a fresh footer at EOF). All are removed.
 *   - Exempt path: all are removed, because the documented policy says these
 *     files carry no footer at all.
 *
 * @param {string} content - Full file content
 * @param {object} [options]
 * @param {boolean} [options.exempt=false] - Path is exempt from footers
 * @returns {{cleaned: string, blocks: number, removedBlocks: number, removedLines: number,
 *   changed: boolean, atEofRegions: number, strandedRegions: number, reason: string}}
 */
export function analyseContent(content, options = {}) {
  const { exempt = false } = options;
  const hadTrailingNewline = content.endsWith('\n');
  const lines = content.split('\n');

  const frontmatter = findFrontmatterRange(lines);
  const fenceMask = computeFenceMask(lines);

  const isImmutable = (i) =>
    fenceMask[i] || (frontmatter !== null && i >= frontmatter.start && i <= frontmatter.end);
  const isBlank = (i) => lines[i].trim() === '';
  const isPhrase = (i) => !isImmutable(i) && isFooterPhraseLine(lines[i]);
  const isLink = (i) => !isImmutable(i) && isFooterLinkLine(lines[i]);
  const isSep = (i) => !isImmutable(i) && isThematicBreakLine(lines[i]);

  const phraseIndices = [];
  for (let i = 0; i < lines.length; i++) {
    if (isPhrase(i)) {
      phraseIndices.push(i);
    }
  }

  if (phraseIndices.length === 0) {
    return {
      cleaned: content,
      blocks: 0,
      removedBlocks: 0,
      removedLines: 0,
      changed: false,
      atEofRegions: 0,
      strandedRegions: 0,
      reason: 'no-footer-blocks',
    };
  }

  // A block ends at its phrase, plus the standalone link line that immediately
  // follows it (the optional second line of every footer pattern).
  const blockEnd = (phraseIndex) => (isLink(phraseIndex + 1) ? phraseIndex + 1 : phraseIndex);

  // Group phrases into regions: two phrases belong to the same region when only
  // blank/separator/link lines separate them.
  const regions = [];
  let regionStartIdx = 0;
  for (let k = 1; k < phraseIndices.length; k++) {
    const prev = phraseIndices[k - 1];
    const cur = phraseIndices[k];
    let contiguous = true;
    for (let j = prev + 1; j < cur; j++) {
      if (!(isBlank(j) || isSep(j) || isLink(j))) {
        contiguous = false;
        break;
      }
    }
    if (!contiguous) {
      regions.push(phraseIndices.slice(regionStartIdx, k));
      regionStartIdx = k;
    }
  }
  regions.push(phraseIndices.slice(regionStartIdx));

  // Separator attribution: the first theme break above a block, with only blank
  // lines between, and with at least one blank line separating them. The blank
  // requirement keeps a `---` that is immediately followed by a phrase (a
  // content divider, or the frontmatter closer) out of the removal set.
  const sepFor = new Map(); // phraseIndex -> separator index
  const claimed = new Set();
  for (const phraseIndex of phraseIndices) {
    for (let j = phraseIndex - 1; j >= 0; j--) {
      if (isSep(j) && !claimed.has(j)) {
        const between = phraseIndex - j - 1;
        const onlyBlanks = lines.slice(j + 1, phraseIndex).every((l) => l.trim() === '');
        if (between >= 1 && onlyBlanks) {
          sepFor.set(phraseIndex, j);
          claimed.add(j);
        }
        break;
      }
      if (!isBlank(j)) {
        break;
      }
    }
  }

  const toRemove = new Set();
  let removedBlocks = 0;
  let atEofRegions = 0;
  let strandedRegions = 0;

  for (const region of regions) {
    const lastPhrase = region[region.length - 1];
    const afterLast = blockEnd(lastPhrase) + 1;
    const atEof = lines.slice(afterLast).every((l) => l.trim() === '');

    if (atEof) {
      atEofRegions++;
    } else {
      strandedRegions++;
    }

    // Safety gate for anything not at end of file. At EOF, position already
    // proves the match is a footer, so the full pattern list is safe there.
    // Mid-document it is not: several patterns are generic enough to begin an
    // ordinary sentence ("Update when ...", "Questions? ...", "Keep tone
    // ..."), and this tool rewrites ~9,500 files, so one false positive
    // silently deletes real prose. A stranded region is therefore removed only
    // when every phrase in it is unmistakable -- see
    // isHighConfidenceFooterPhraseLine.
    const allHighConfidence = region.every((p) => isHighConfidenceFooterPhraseLine(lines[p]));
    if (!atEof && !allHighConfidence) {
      continue;
    }

    // Keep the trailing block of an at-EOF region; drop everything else.
    //
    // On an exempt path nothing is kept, so every block in the region is a
    // removal candidate -- and the generic phrases ("Update when", "Questions?",
    // "Keep tone", ...) also match ordinary prose that merely ends a document.
    // Requiring high confidence there is what stops a bulk --fix from deleting
    // real content across the ~5,500 exempt files. On a non-exempt path the
    // trailing block is always kept, so position already provides that safety.
    const keep = !exempt && atEof ? lastPhrase : null;
    if (exempt && atEof && !allHighConfidence) {
      continue;
    }
    // Every earlier block needs its own evidence before it is deleted. Sharing
    // a blank-line-separated group with a genuine footer is not evidence: the
    // group is assembled from phrase matches, and the generic patterns ("Update
    // when", "Questions?", "Keep tone", ...) also begin ordinary prose. That
    // prose is real content, so it is left alone rather than being deleted
    // because a real footer happens to sit a few lines below it.
    const keptText = keep === null ? null : lines[keep].trim();
    const doomed = region.filter((p) => {
      if (p === keep) {
        return false;
      }
      if (isHighConfidenceFooterPhraseLine(lines[p])) {
        return true;
      }
      // A literal repeat of the footer being kept is redundant by definition.
      return keptText !== null && lines[p].trim() === keptText;
    });

    for (const phraseIndex of doomed) {
      const sepIndex = sepFor.get(phraseIndex);
      const start = sepIndex === undefined ? phraseIndex : sepIndex;
      const end = blockEnd(phraseIndex);
      for (let j = start; j <= end; j++) {
        toRemove.add(j);
      }
      // Absorb the blank run that followed the block so removing it does not
      // leave a widening gap between the surviving neighbours.
      let j = end + 1;
      while (j < lines.length && isBlank(j)) {
        toRemove.add(j);
        j++;
      }
      removedBlocks++;
    }
  }

  const removedLines = toRemove.size;
  if (removedLines === 0) {
    return {
      cleaned: content,
      blocks: phraseIndices.length,
      removedBlocks: 0,
      removedLines: 0,
      changed: false,
      atEofRegions,
      strandedRegions,
      reason: exempt ? 'exempt-single-block' : 'single-block-at-eof',
    };
  }

  const kept = lines.filter((_, i) => !toRemove.has(i));
  // Removing a trailing block can leave the document without its final newline
  // (or with a run of blanks at EOF). Restore exactly the original convention.
  while (kept.length && kept[kept.length - 1].trim() === '') {
    kept.pop();
  }
  let cleaned = kept.join('\n');
  // Restore the original convention only. A file that did not end with a
  // newline must not gain one: the header promises that anything not provably
  // part of a footer block is left byte-for-byte alone, and a trailing newline
  // is not part of a footer block. The cleaned output also has to be non-empty,
  // or an emptied document would become a bare newline.
  if (hadTrailingNewline && cleaned.length > 0) {
    cleaned += '\n';
  }

  return {
    cleaned,
    blocks: phraseIndices.length,
    removedBlocks,
    removedLines,
    changed: cleaned !== content,
    atEofRegions,
    strandedRegions,
    reason: exempt ? 'exempt-path' : atEofRegions > 0 ? 'duplicate-at-eof' : 'stranded-block',
  };
}

/**
 * List tracked Markdown files, using git so the result matches what CI and the
 * generator see (respects .gitignore, excludes untracked scratch files).
 * @param {string} cwd - Repository root
 * @returns {string[]} Repo-relative POSIX paths
 */
export function listMarkdownFiles(cwd) {
  const out = execFileSync('git', ['ls-files', '-z', '--', '*.md'], {
    cwd,
    encoding: 'utf8',
    maxBuffer: 1 << 28,
  });
  return out.split('\0').filter(Boolean);
}

/**
 * List Markdown files changed between two refs.
 * @param {string} cwd - Repository root
 * @param {string} base - Base ref
 * @param {string} head - Head ref
 * @returns {string[]} Repo-relative POSIX paths
 */
export function listChangedMarkdownFiles(cwd, base, head) {
  return diffChangedMarkdownFiles(cwd, base, head).files;
}

/**
 * Is this ref a tree object rather than a commit?
 *
 * A first push resolves to the empty tree, and a symmetric difference needs two
 * commits, so `base...head` errors with "is a tree, not a commit".
 *
 * @param {string} cwd - Repository directory.
 * @param {string} ref - Git ref to test.
 * @returns {boolean} True when the ref names a tree.
 */
function isTreeRef(cwd, ref) {
  return execFileSync('git', ['cat-file', '-t', ref], { cwd, encoding: 'utf8' }).trim() === 'tree';
}

/**
 * The ref a `base...head` diff is taken against.
 *
 * Three dots, not two: `base...head` diffs from the merge base, so the result is
 * the files this branch actually changed. `base head` also returns everything
 * that landed on the base branch after the branch point, which would fail a PR
 * over backlog the author never touched.
 *
 * The exception is a tree-object base, which is what a first push resolves to.
 * There is no merge base against a tree, so the ref is the tree itself and the
 * diff is the two-dot form, which is correct against an empty tree anyway.
 *
 * The caller needs this same ref to read a file's baseline, so it is resolved
 * once here and returned rather than recomputed per file. Using `base` for the
 * baseline instead would be inconsistent with the diff that selected the file.
 *
 * @param {string} cwd - Repository directory.
 * @param {string} base - Base ref supplied by the caller.
 * @param {string} head - Head ref.
 * @returns {string} The commit or tree the diff, and any baseline, is taken from.
 */
export function resolveDiffBase(cwd, base, head) {
  if (isTreeRef(cwd, base)) {
    return base;
  }
  return execFileSync('git', ['merge-base', base, head], {
    cwd,
    encoding: 'utf8',
    maxBuffer: 1 << 28,
  }).trim();
}

/**
 * List the Markdown files a `base...head` change touched.
 *
 * Returns the destination path for each, plus the source path when the change
 * was a rename. A renamed file has no content at its new path in the baseline,
 * so the baseline lookup has to ask for the old name or it finds nothing and the
 * file looks newly added.
 *
 * @param {string} cwd - Repository directory.
 * @param {string} base - Base ref.
 * @param {string} head - Head ref.
 * @returns {{ files: string[], renames: Map<string, string>, diffBase: string }} Changed files, rename map, resolved diff base.
 */
export function diffChangedMarkdownFiles(cwd, base, head) {
  const diffBase = resolveDiffBase(cwd, base, head);
  const isTreeBase = isTreeRef(cwd, diffBase);
  const rangeArgs = isTreeBase ? [diffBase, head] : [`${diffBase}...${head}`];

  // --name-status with rename detection, rather than --name-only: a rename would
  // otherwise be indistinguishable from a delete plus an add, and the baseline
  // lookup would silently fall back to "no baseline".
  const out = execFileSync(
    'git',
    ['diff', '--name-status', '--find-renames', '-z', ...rangeArgs, '--', '*.md'],
    { cwd, encoding: 'utf8', maxBuffer: 1 << 28 }
  );

  const files = [];
  const renames = new Map();
  const parts = out.split('\0').filter((part) => part !== '');

  for (let i = 0; i < parts.length; i += 1) {
    const status = parts[i];
    if (status.startsWith('R')) {
      // Rename records are status, source, destination.
      const source = parts[i + 1];
      const destination = parts[i + 2];
      i += 2;
      if (!destination.endsWith('.md')) continue;
      files.push(destination);
      renames.set(destination, source);
    } else {
      // Status, then path: consume both fields before the next iteration.
      const file = parts[i + 1];
      i += 1;
      if (!file || !file.endsWith('.md')) continue;
      files.push(file);
    }
  }

  return { files, renames, diffBase };
}

/**
 * Parse CLI arguments.
 * @param {string[]} argv - Raw argv
 * @returns {object} Parsed options
 */
export function parseArgs(argv) {
  const options = {
    fix: false,
    force: false,
    json: false,
    quiet: false,
    check: false,
    changedOnly: false,
    base: null,
    head: null,
    pathsFrom: null,
    shapeOnly: false,
    cwd: process.cwd(),
  };
  for (const arg of argv) {
    if (arg === '--fix') options.fix = true;
    else if (arg === '--force') options.force = true;
    else if (arg === '--check') options.check = true;
    else if (arg === '--shape') options.shapeOnly = true;
    else if (arg === '--json') options.json = true;
    else if (arg === '--quiet') options.quiet = true;
    else if (arg === '--changed-only') options.changedOnly = true;
    else if (arg.startsWith('--base=')) options.base = arg.slice('--base='.length);
    else if (arg.startsWith('--head=')) options.head = arg.slice('--head='.length);
    else if (arg.startsWith('--paths-from=')) options.pathsFrom = arg.slice('--paths-from='.length);
    else if (arg.startsWith('--cwd=')) options.cwd = arg.slice('--cwd='.length);
    else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  // `--shape` reports the signal and is documented never to fix anything. Let it
  // run alongside `--fix` and the tool would rewrite files while printing only
  // the advisory report, so a reader would have no way to tell that anything
  // changed. Reject the pair instead of silently picking one.
  if (options.shapeOnly && options.fix) {
    throw new Error('--shape reports the signal only and never fixes; use it without --fix');
  }
  return options;
}

/**
 * Run the tool.
 * @param {object} options - Parsed CLI options
 * @returns {object} Report
 */
/**
 * Is `target` the repository root itself, or inside it?
 *
 * Used to keep an operator-supplied path list from escaping the repository.
 * Compares resolved paths with a trailing separator so a sibling directory
 * sharing a name prefix (`/repo-backup` vs `/repo`) is not treated as inside.
 *
 * @param {string} root - Resolved repository root
 * @param {string} target - Resolved candidate path
 * @returns {boolean} True when target is root or beneath it
 */
function isInside(root, target) {
  if (target === root) {
    return true;
  }
  const prefix = root.endsWith(path.sep) ? root : root + path.sep;
  return target.startsWith(prefix);
}

/**
 * Resolve a path physically, following symlinks, so containment cannot be
 * defeated by a link that points outside the repository.
 *
 * A lexical path.resolve() check is not enough: a repository-local symlink to
 * an external Markdown file still resolves *inside* the root, while both
 * readFileSync and writeFileSync follow the link to the real target. Returns
 * null when the file does not exist, so callers can fall back to the lexical
 * result for a path that is yet to be created.
 */
function realPathOrNull(target) {
  try {
    return fs.realpathSync(target);
  } catch {
    return null;
  }
}

/**
 * Are there uncommitted changes in the working tree?
 *
 * @param {string} cwd - Directory to inspect
 * @returns {boolean} True when the tree is dirty
 */
export function isWorkingTreeDirty(cwd) {
  try {
    // --untracked-files=no: this tool only ever rewrites files it enumerates,
    // and both the default scan (git ls-files) and an explicit --paths-from list
    // cover tracked files only. Blocking on an untracked file would refuse a
    // rewrite that cannot possibly touch it, and would break the #3589 batch
    // workflow, which writes a scratch list of paths.
    const out = execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], {
      cwd,
      encoding: 'utf8',
      maxBuffer: 1 << 28,
    });
    return out.trim().length > 0;
  } catch {
    // Not a git repository (or git is unavailable): nothing to compare against,
    // so do not block the operator on a guess.
    return false;
  }
}

/**
 * How many blocks would the tool remove from a file's content at `ref`?
 *
 * Used to tell debt this change inherited from debt it created. Returns null when
 * the path has no readable content at that ref -- a file the change adds, or one
 * that cannot be read there -- and null is deliberately not "zero": a new file
 * carrying blocks must still be reported.
 *
 * @param {string} repo - Repository directory.
 * @param {string} ref - Git ref to read the file from.
 * @param {string} relPath - Repository-relative path.
 * @param {boolean} exempt - Whether the path is exempt from footers.
 * @returns {number|null} Removable block count at `ref`, or null if unavailable.
 */
function countBlocksAtRef(repo, ref, relPath, exempt) {
  let content;
  try {
    content = execFileSync('git', ['show', `${ref}:${relPath}`], {
      cwd: repo,
      encoding: 'utf8',
      maxBuffer: 1 << 28,
    });
  } catch {
    return null;
  }
  return analyseContent(content, { exempt }).removedBlocks;
}

export function run(options) {
  const cwd = options.cwd;
  const repoRoot = path.resolve(cwd);

  // --fix rewrites files in place with no undo, and the default scan covers
  // every Markdown file in the repository. Running it against a tree that
  // already has uncommitted work buries those changes among thousands of
  // footer edits, and a partial revert then discards real work along with the
  // noise. A dirty tree is refused unless the operator says so explicitly.
  // Dry runs (--check, the default) read only, so they are never blocked --
  // CI and repro work depend on running them on a dirty tree.
  if (options.fix && !options.force && isWorkingTreeDirty(cwd)) {
    throw new Error(
      'Refusing to rewrite files: the working tree has uncommitted changes.\n' +
        'Commit or stash first, or re-run with --force if the rewrite is intended.\n' +
        'A dry run (--check, the default) is always safe.'
    );
  }

  // Filled in by the --changed-only branch below. A null comparisonRef means there
  // is no baseline, so nothing is treated as inherited debt.
  let comparisonRef = null;
  /** @type {Map<string, string>} Destination path -> source path, for renames. */
  let renameSources = new Map();

  let files;
  if (options.pathsFrom) {
    files = fs
      .readFileSync(options.pathsFrom, 'utf8')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
  } else if (options.changedOnly) {
    if (!options.base || !options.head) {
      throw new Error('--changed-only requires both --base=<ref> and --head=<ref>');
    }
    const changed = diffChangedMarkdownFiles(cwd, options.base, options.head);
    files = changed.files;
    // The baseline is the same ref the file list was diffed against, not the
    // caller's base: `base...head` starts at the merge base, so comparing
    // against `base` would read a baseline the file list never used.
    comparisonRef = changed.diffBase;
    renameSources = changed.renames;
  } else {
    files = listMarkdownFiles(cwd);
  }

  const findings = [];
  let preExisting = 0;
  // Collected for every file scanned, including files the wording-based dedupe
  // passes cleanly. That is the point: a footer whose wording is unknown to
  // FOOTER_PATTERNS is invisible to the deduper, and those are exactly the
  // files that end up carrying two different footers.
  const shapeFindings = [];
  for (const relPath of files) {
    const abs = path.resolve(repoRoot, relPath);
    // An explicit --paths-from list is operator-supplied, so a malformed batch
    // file must not be able to name an arbitrary path: refuse anything that
    // resolves outside the repository, lexically or physically.
    if (options.pathsFrom && !isInside(repoRoot, abs)) {
      throw new Error(`Refusing path outside the repository: ${relPath} (resolved to ${abs})`);
    }

    // Containment is also checked physically, and for *every* path source.
    // `git ls-files` selects tracked symlinks, and path.resolve() keeps a
    // repo-local link lexically inside the repository while Node follows the
    // link for both the read and the in-place write. Without this the default
    // scan -- the one the CI guard runs -- would rewrite a target outside the
    // repository whenever `npm run validate:footers:fix` is used.
    const physical = realPathOrNull(abs);
    const physicalRoot = realPathOrNull(repoRoot) || repoRoot;
    if (physical && !isInside(physicalRoot, physical)) {
      throw new Error(
        `Refusing path that resolves outside the repository: ${relPath} ` +
          `(is a link to ${physical})`
      );
    }
    let content;
    try {
      content = fs.readFileSync(abs, 'utf8');
    } catch {
      continue; // Deleted or unreadable in the working tree; not a footer issue.
    }

    const exempt = isFooterExemptPath(relPath);
    const result = analyseContent(content, { exempt });

    const shape = findShapeMultiples(content);
    if (shape.count >= 2) {
      shapeFindings.push({
        path: relPath,
        blocks: shape.count,
        regions: shape.regions,
        // True only when the wording-based deduper recognises EVERY block here.
        // A file can carry a known footer and an unrecognised one at the same
        // time; a per-file flag would let the known one mask the unrecognised
        // one, which is the mixed case this signal most needs to surface.
        recognisedByDedupe: shape.regions.every((r) => r.recognised),
        // Block counts on each side of that split, so a reader can see how much
        // of the file the deduper understands.
        recognisedBlocks: shape.regions.filter((r) => r.recognised).length,
        unrecognisedBlocks: shape.regions.filter((r) => !r.recognised).length,
      });
    }

    // A file is reported exactly when the tool would rewrite it, so --check and
    // --fix can never disagree. Keying off removedBlocks (rather than, say,
    // blocks > 1) also catches a single footer stranded mid-document, which is
    // just as wrong as a compounded stack even though no count exceeds one.
    if (result.removedBlocks === 0) {
      continue;
    }

    // Over a base..head range, report only what this change made worse.
    //
    // The guard is meant to catch a change that *introduces* compounded,
    // stranded or misplaced footers. Reporting every touched file that already
    // carried them turned the ratchet into a wall: #3448 regenerates 9,423
    // Markdown files and changes no file's duplicate-footer count, yet 3,947 of
    // them were flagged purely for pre-existing debt. Measured against base,
    // that PR's count is 0 files worse; #3532 is 5 and #3434 is 20, and all
    // three keep failing for the right reason once this rule applies.
    //
    // Pre-existing debt is not abandoned here -- it is the whole of #3451, and
    // the whole-repo report below still prints it on every run. What changes is
    // that a PR is no longer blocked for backlog it did not create.
    // A renamed file has no content at its new path in the baseline, so the
    // lookup has to ask for the old name.
    const baselinePath = renameSources.get(relPath) || relPath;
    const baseBlocks = comparisonRef
      ? countBlocksAtRef(cwd, comparisonRef, baselinePath, exempt)
      : null;
    if (baseBlocks !== null && result.removedBlocks <= baseBlocks) {
      preExisting++;
      continue;
    }

    findings.push({
      path: relPath,
      exempt,
      blocks: result.blocks,
      removedBlocks: result.removedBlocks,
      removedLines: result.removedLines,
      reason: result.reason,
    });

    if (options.fix && result.changed) {
      fs.writeFileSync(abs, result.cleaned);
    }
  }

  const totalBlocks = findings.reduce((sum, f) => sum + f.blocks, 0);
  const totalRemoved = findings.reduce((sum, f) => sum + f.removedBlocks, 0);
  const totalRemovedLines = findings.reduce((sum, f) => sum + f.removedLines, 0);

  return {
    scanned: files.length,
    files: findings.length,
    exemptFiles: findings.filter((f) => f.exempt).length,
    blocks: totalBlocks,
    removedBlocks: totalRemoved,
    removedLines: totalRemovedLines,
    fixed: Boolean(options.fix),
    preExistingFiles: preExisting,
    findings,
    // Kept separate from `findings` on purpose. `findings` is what --fix
    // changes and what --check gates on. This never blocks and is never
    // auto-remediated: it asks for a human to look.
    shapeFiles: shapeFindings.length,
    shapeFindings,
  };
}

/**
 * Render a human-readable report.
 * @param {object} report - Report from run()
 * @returns {string} Report text
 */
/**
 * Render a human-readable report.
 *
 * @param {object} report - Report from run()
 * @param {object} [options] - Parsed options. `{shapeOnly: true}` reports the
 *   footer shape signal on its own, without the wording-based dedupe summary,
 *   which is what `npm run validate:footers:shape` is for.
 * @returns {string} Report text
 */
export function formatReport(report, options = {}) {
  const lines = [];
  if (options.shapeOnly) {
    // The signal on its own. The wording-based numbers are deliberately left out
    // so a reader cannot mistake this for the gating report.
    lines.push('footer shape signal (advisory, never gates, never auto-fixes):');
    lines.push(`  scanned ${report.scanned} file(s)`);
    const unrecognised = report.shapeFindings.filter((f) => !f.recognisedByDedupe);
    lines.push(
      `  possible unrecognised footers: ${unrecognised.length} file(s) of ${report.shapeFiles} flagged`
    );
    for (const f of unrecognised.slice(0, TOP_REPORT_ROWS)) {
      lines.push(
        `    ${f.path} — ${f.blocks} block(s): ${[...f.regions]
        .sort((a, b) => Number(a.recognised) - Number(b.recognised))
        .map((r) => r.texts.join(' '))
        .join(' | ')
        .slice(0, 120)}`
      );
    }
    if (unrecognised.length > TOP_REPORT_ROWS) {
      lines.push(`    … and ${unrecognised.length - TOP_REPORT_ROWS} more (use --json for the full list)`);
    }
    return lines.join('\n');
  }

  const mode = report.fixed ? 'FIX' : 'DRY-RUN';
  lines.push(`footer duplicate ${mode}: ${report.files}/${report.scanned} file(s) affected`);
  lines.push(
    `  blocks found ${report.blocks} · removed ${report.removedBlocks} · lines removed ${report.removedLines} · exempt-path files ${report.exemptFiles}` +
      // Never let the comparison hide that files were examined and passed. A
      // report that silently drops thousands of files is indistinguishable from
      // one that never looked at them.
      (report.preExistingFiles > 0
        ? ` · pre-existing duplicates unchanged: ${report.preExistingFiles}`
        : '')
  );
  if (report.shapeFiles > 0) {
    // A different shape of line to the duplicate count below: this asks for a
    // human, it is not a violation, and it is never auto-fixed.
    lines.push(
      `  possible unrecognised footers (needs a human look, NOT auto-fixed): ${report.shapeFiles} file(s)`
    );
    const unrecognised = report.shapeFindings.filter((f) => !f.recognisedByDedupe);
    if (unrecognised.length > 0) {
      lines.push(
        `    of which the wording-based deduper cannot see: ${unrecognised.length} file(s)`
      );
      for (const f of unrecognised.slice(0, TOP_REPORT_ROWS)) {
        lines.push(
          `    ${f.path} — ${f.blocks} block(s): ${[...f.regions]
            // Unrecognised first: in a mixed file the recognised footer would
            // otherwise take the character budget and the block a human needs to
            // read would be the part truncated away.
            .sort((a, b) => Number(a.recognised) - Number(b.recognised))
            .map((r) => r.texts.join(' '))
            .join(' | ')
            .slice(0, 120)}`
        );
      }
      if (unrecognised.length > TOP_REPORT_ROWS) {
        lines.push(
          `    … and ${unrecognised.length - TOP_REPORT_ROWS} more (use --json for the full list)`
        );
      }
    }
  }
  if (report.files > 0) {
    // Rank by how much each file loses so the report leads with the worst
    // offenders. Array.from() rather than a spread: it states the copy
    // explicitly instead of relying on the iteration protocol here.
    const ranked = Array.from(report.findings);
    ranked.sort((a, b) => b.removedBlocks - a.removedBlocks);
    const top = ranked.slice(0, TOP_REPORT_ROWS);
    for (const f of top) {
      lines.push(`  ${f.path} — ${f.blocks} block(s), ${f.reason}`);
    }
    if (report.files > top.length) {
      lines.push(`  … and ${report.files - top.length} more (use --json for the full list)`);
    }
  }
  return lines.join('\n');
}

// CLI entry
// Compare resolved filesystem paths rather than the raw URL: import.meta.url is
// percent-encoded and uses file:// form, while process.argv[1] is a native
// path. They differ for paths containing spaces or non-ASCII characters, and
// on Windows. A false mismatch would skip the scan entirely and exit 0, so
// validate:footers --check could pass without checking anything. realpathSync
// additionally makes an invocation through a symlink compare equal.
function isDirectInvocation() {
  if (!process.argv[1]) return false;
  try {
    const entry = fileURLToPath(import.meta.url);
    const invoked = path.resolve(process.argv[1]);
    return fs.realpathSync(entry) === fs.realpathSync(invoked) || path.resolve(entry) === invoked;
  } catch {
    return false;
  }
}

if (isDirectInvocation()) {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(`dedupe-footers: ${error.message}`);
    process.exit(2);
  }

  let report;
  try {
    report = run(options);
  } catch (error) {
    console.error(`dedupe-footers: ${error.message}`);
    process.exit(2);
  }

  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
  } else if (!options.quiet) {
    console.log(formatReport(report, options));
  }

  // Check mode (default) fails the build when violations are present so the
  // guard can gate a PR. --fix reports what it changed and exits 0.
  if (options.check && !options.shapeOnly && report.files > 0) {
    process.exit(1);
  }
  // The shape signal is never a gate, in any mode. Measured false-positive
  // rate is 30.1% (280 of 930 flagged files, across 11,474 tracked Markdown
  // files), which is far too high to fail a build on. It asks for a human.
  process.exit(0);
}
