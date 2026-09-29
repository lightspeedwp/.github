import { isFooterPhraseLine } from './footer-policy.js';

/**
 * Mark lines that sit inside a fenced code block.
 *
 * Copied from dedupe-footers.js rather than imported, because that module
 * imports this one: an import here would close the cycle. The copy is why
 * computeFenceMask is exported and covered by its own tests in dedupe-footers.js
 * — a change to fence semantics has to be made in both places.
 *
 * @param {string[]} lines - Document split on '\n'
 * @returns {boolean[]} True where the line is inside (or is) a fence
 */
export function computeFenceMask(lines) {
  const mask = new Array(lines.length).fill(false);
  let openChar = null;
  let openLength = 0;

  for (let i = 0; i < lines.length; i += 1) {
    // Strip the carriage return a CRLF document leaves on every line, so the
    // fence opener is recognised on those files too.
    const line = lines[i].replace(/\r$/, '');
    // A fence opens or closes only after 0-3 spaces of indent, so an indented
    // code block must not be read as a delimiter.
    const match = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (!match) {
      // Everything between an opening and a closing fence is content.
      if (openChar !== null) mask[i] = true;
      continue;
    }
    const char = match[1][0];
    const length = match[1].length;
    const info = match[2];
    if (openChar === null) {
      // A backtick fence's info string may not contain a backtick, so ```a`b is
      // code, not a fence opener. It is left unmasked and opens nothing, which is
      // what dedupe-footers.js does for the same line; an earlier version of this
      // copy masked it instead, and the two disagreed.
      if (char === '`' && info.includes('`')) {
        continue;
      }
      openChar = char;
      openLength = length;
      mask[i] = true;
    } else if (char === openChar && length >= openLength && info.trim() === '') {
      openChar = null;
      mask[i] = true;
    } else {
      mask[i] = true; // Nested or annotated fence: content, not a delimiter.
    }
  }
  return mask;
}

/**
 * footer-shape.js
 * Shape-based detection of footer-shaped blocks in a file's trailing zone.
 *
 * ## Why this exists, and why it is separate from footer-policy.js
 *
 * `footer-policy.js` answers "is this line one of the footers we generate?" by
 * wording, from a closed pattern list. That list covers the branding footers and
 * little else, so it cannot see the configured taxonomy in
 * `.github/config/quirky-footers.yaml` — 41 footer definitions across 8
 * categories, of which the recogniser knows almost none.
 *
 * The consequence is not cosmetic. `ensureFooter()`'s end-anchored matcher
 * shares the same closed list, so a file whose footer it does not recognise
 * looks like a file with no footer, and the next automation run appends
 * another one. That is the compounding mechanism behind #3451, and it is still
 * live: roughly 650 files carry a second, different footer the wording-based
 * path cannot see.
 *
 * This module deliberately does not try to decide whether a block *is* a
 * footer. It recognises the shape — a short, emphasised, standalone line,
 * optionally followed by a link line, sitting in the trailing zone — and
 * reports every region where that shape occurs more than once. It is a signal
 * for a human, not a fix: nothing here deletes anything, and the wording-based
 * deduper in `dedupe-footers.js` is untouched by this file existing.
 *
 * ## Why the shape rules are deliberately minimal
 *
 * Rules that tried to exclude "provenance" lines, bold labels or date stamps
 * would be tuned to whichever examples happened to be found first, and the
 * measured false-positive rate would then describe the tuning set rather than
 * the corpus. So the rules below only encode what is true of Markdown itself
 * and of every footer in this repository's own taxonomy, and the false-positive
 * rate is reported as measured.
 */

/** How many trailing lines are examined. */
const ZONE_LINES = 8;

/** A footer block is a short run, never a section. */
const MAX_BLOCK_LINES = 3;

/** Lower bound keeps single words and "Done." out; footers are a short phrase. */
const MIN_PHRASE_CHARS = 10;

/** Upper bound keeps paragraphs out; footers are one line. */
const MAX_PHRASE_CHARS = 200;

const THEMATIC_BREAK_RE = /^\s{0,3}(?:-{3,}|\*{3,}|_{3,})\s*$/;
const ATX_HEADING_RE = /^ {0,3}#{1,6}\s/;
const LINK_LINE_RE = /^\s*\[.*?\]\(.*?\)\s*$/;
/** *text*, _text_ or **text**, wrapping a single line. */
const EMPHASISED_RE = /^(?:\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_)$/;
/** Structure that means the line is document content, not a footer phrase. */
const EXCLUDED_SHAPE_RE = /^\s*(?:>|[-*+]\s|\d+[.)]\s|\||<!--|```|~~~)/;

/**
 * Is this line a single-line emphasised phrase of footer-like length?
 *
 * @param {string} line
 * @returns {string|null} The inner text, or null if the line is not such a phrase
 */
export function emphasisedPhraseText(line) {
  if (typeof line !== 'string') return null;
  if (EXCLUDED_SHAPE_RE.test(line)) return null;
  if (THEMATIC_BREAK_RE.test(line)) return null;
  if (LINK_LINE_RE.test(line)) return null;
  const match = EMPHASISED_RE.exec(line.trim());
  if (!match) return null;
  const text = (match[1] ?? match[2] ?? match[3] ?? '').trim();
  if (text.length < MIN_PHRASE_CHARS || text.length > MAX_PHRASE_CHARS) return null;
  return text;
}

/**
 * Find footer-shaped blocks in a file's trailing zone.
 *
 * The zone starts after the last ATX heading in the tail, so a footer-shaped
 * line that is really the last line of a section several headings up is not
 * counted as part of the footer's zone. When the file has no heading in the
 * tail, the whole tail is the zone.
 *
 * Blocks are maximal runs of qualifying lines: an emphasised phrase line, with
 * at most a following bare link line, and never more than MAX_BLOCK_LINES.
 *
 * @param {string} content - Full file content
 * @returns {{blocks: Array<{lines: string[], text: string[], line: number}>, zoneStart: number}|null}
 *   The blocks and where the zone began, or null when the file has no tail
 */
export function findTrailingFooterShapedBlocks(content) {
  const text = String(content ?? '');
  if (text.trim() === '') return null;
  // A file that ends with a newline splits into a trailing empty element, which
  // would otherwise consume one of the eight slots and shrink the window to seven
  // real lines. Almost every file in the repository ends with a newline, so this
  // has to be handled before the window is measured, not after.
  const lines = text.split('\n');
  if (lines.length === 0) return null;
  if (lines.length > 1 && lines[lines.length - 1] === '') lines.pop();

  // A footer-shaped line inside a fenced code block is an example, not a footer.
  // The wording-based deduper already refuses to touch those, so a signal that
  // counted them would point a maintainer at documentation showing the shape
  // rather than at a file that needs reconciling.
  const fenceMask = computeFenceMask(lines);

  const zoneStart = Math.max(0, lines.length - ZONE_LINES);
  const zone = lines.slice(zoneStart);

  // Narrow the zone to the part after the last heading, when there is one.
  // A heading shown inside a fenced example is not a heading of the document: it
  // would set the boundary, and the candidate loop then discards everything
  // before it, which hides the real footer above the fence from the report
  // entirely. The mask is consulted for the same reason the candidate loop
  // consults it.
  let lastHeading = -1;
  zone.forEach((line, i) => {
    if (fenceMask[zoneStart + i]) return;
    if (ATX_HEADING_RE.test(line)) lastHeading = i;
  });
  // Track the document index of each candidate line explicitly rather than
  // re-deriving it from a slice offset, which is where an earlier version of
  // this filter looked up the wrong line once a heading was present.
  const candidates = [];
  zone.forEach((line, i) => {
    if (lastHeading !== -1 && i <= lastHeading) return;
    const docIndex = zoneStart + i;
    if (fenceMask[docIndex]) return;
    candidates.push({ l: line, i: docIndex });
  });
  const effective = candidates;

  const blocks = [];
  let i = 0;
  while (i < effective.length) {
    const phrase = emphasisedPhraseText(effective[i].l);
    if (phrase === null) {
      i++;
      continue;
    }
    const blockLines = [effective[i].l];
    const blockText = [phrase];
    // An optional bare link line directly beneath makes this one footer block.
    if (effective[i + 1] && LINK_LINE_RE.test(effective[i + 1].l)) {
      blockLines.push(effective[i + 1].l);
      blockText.push(effective[i + 1].l.trim());
      i++;
    }
    if (blockLines.length <= MAX_BLOCK_LINES) {
      // One-based, so the number matches an editor, `grep -n` and a GitHub
      // annotation. Reporting a zero-based offset makes a reader count twice.
      blocks.push({
        lines: blockLines,
        text: blockText,
        // effective[i] already carries the document index.
        line: effective[i - blockLines.length + 1].i + 1,
      });
    }
    i++;
  }

  return { blocks, zoneStart };
}

/**
 * Regions of a file's trailing zone that hold more than one footer-shaped block.
 *
 * This is the signal. A single block is a normal footer. Two or more may be a
 * genuine pair of footers left by an automation run that could not see the first
 * one — or may be an emphasised label near the end of a document. The module
 * does not distinguish those, and deliberately reports both.
 *
 * @param {string} content - Full file content
 * @returns {{count: number, regions: Array<{line: number, texts: string[]}>}}
 */
export function findShapeMultiples(content) {
  const found = findTrailingFooterShapedBlocks(content);
  if (!found || found.blocks.length < 2) return { count: 0, regions: [] };
  return {
    count: found.blocks.length,
    regions: found.blocks.map((b) => ({
      line: b.line,
      texts: b.text,
      // Whether the wording-based deduper can see this particular block. A file
      // can hold a known footer and an unrecognised one at the same time, so
      // recognition has to be judged per block: judged per file, a known footer
      // anywhere in the file hides the unrecognised footer this signal exists to
      // find, which is the mixed case worth surfacing most.
      recognised: b.text.some((line) => isFooterPhraseLine(line)),
    })),
  };
}

export const SHAPE_ZONE_LINES = ZONE_LINES;
