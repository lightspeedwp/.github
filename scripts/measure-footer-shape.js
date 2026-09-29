#!/usr/bin/env node

/**
 * measure-footer-shape.js — reproduce the accuracy figures quoted in
 * docs/FOOTER_REMEDIATION_GUIDE.md.
 *
 * ## Why this exists
 *
 * Those figures were originally produced by a throwaway script outside the
 * repository, so a reader had no way to re-run them and the numbers went stale
 * silently when the corpus changed. This puts the measurement in the repository
 * and prints the tree it ran on, so a claim in the guide can always be checked.
 *
 * ## What the numbers mean
 *
 * - **Flagged** is the signal itself: files whose trailing zone holds two or
 *   more footer-shaped blocks. This is exactly what
 *   `npm run validate:footers:shape` reports, and is the only figure here that
 *   does not depend on the phrase inventory below.
 * - **Two known** is how many flagged files also carry two or more *distinct
 *   known footer phrases* in the trailing eight lines. It is a cross-check
 *   against a phrase list, not a judgement that the file is wrong.
 * - **No known footer** is the remainder. It is deliberately *not* called a
 *   false-positive rate and is not a bound on one. A file carrying a genuine
 *   duplicate footer whose wording is absent from the inventory lands here, and
 *   a file holding known phrases is not independently confirmed to be a genuine
 *   duplicate either, so the two errors do not simply cancel and no rate follows
 *   from this ratio.
 *
 * ## Read the recall figure with care
 *
 * Ground truth is built from the same footer-phrase inventory the shape module
 * uses to decide whether a block is `recognised`. Recall against it therefore
 * measures agreement with a phrase list, not accuracy: a footer whose wording is
 * missing from that inventory is invisible to both sides at once. Treat it as a
 * consistency check on the detector, not as an independent measure of how well
 * it finds genuine duplicate footers.
 *
 * Usage: npm run measure:footers:shape
 */
import fs from 'node:fs';
import cp from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { findShapeMultiples } from './agents/includes/footer-shape.js';
import { isFooterPhraseLine } from './agents/includes/footer-policy.js';
import { DEFAULT_FOOTERS } from './agents/includes/header-footer.js';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Trailing lines the signal and the ground truth both look at.
 *
 * The signal drops the empty element a trailing newline leaves behind before it
 * slices, so anything comparing against it has to do the same or it reads a
 * seven-line window where the signal reads eight.
 */
const ZONE_LINES = 8;

/** Strip emphasis and case so a phrase matches however it is written. */
const normalise = (s) =>
  String(s)
    .replace(/^\*+|\*+$/g, '')
    .replace(/^_+|_+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

/**
 * Footer wordings that are present in the repository but absent from every
 * configuration file above, so no amount of parsing finds them.
 *
 * These were added by hand when the figures were first measured, and they are
 * not a small correction: `Maintained by the 🤖 LightSpeedWP Automation Team`
 * alone accounts for most of the ground truth. Each is a footer this repository
 * actually writes but that `footer-policy.js` cannot recognise, which is the
 * defect #3451 describes — so leaving them out would define the problem away.
 *
 * They are kept here, named and counted, rather than inlined: `measure()` prints
 * what each one contributes so a reader can see that the recall figure rests
 * heavily on this list and is not an independent accuracy measure.
 */
export const CURATED_PHRASES = [
  'Made with ❤️ by the LightSpeed team.',
  'Need help? Say hi—work with us.',
  'Maintained by the 🤖 LightSpeedWP Automation Team',
  'This agent is orchestrated with precision and care — carefully choreographed automation',
  'Maintained by the LightSpeedWP automation and governance maintainers.',
];

/**
 * Build the inventory of known footer phrases.
 *
 * A phrase counts only when it is long enough to be a sentence and contains a
 * letter, which keeps stray words and bare emoji out.
 *
 * @param {boolean} [includeCurated] - Include {@link CURATED_PHRASES}
 * @returns {Set<string>} Normalised known footer phrases
 */
export function buildPhraseInventory(includeCurated = true, repo = REPO) {
  const inventory = new Set();
  const add = (s) => {
    const t = normalise(s);
    if (t.length >= 15 && /[a-z]/.test(t)) inventory.add(t);
  };

  // The configured quirky footers: the emphasised line inside each `template: |`.
  const yaml = fs
    .readFileSync(path.join(repo, '.github/config/quirky-footers.yaml'), 'utf8')
    .split('\n');
  for (let i = 0; i < yaml.length; i++) {
    if (!/^\s*template:\s*\|\s*$/.test(yaml[i])) continue;
    for (let j = i + 1; j < yaml.length; j++) {
      if (/^\s{0,6}\S/.test(yaml[j]) && yaml[j].trim()) break;
      const m = /^\s*([*_][^*_].+?[*_])\s*$/.exec(yaml[j]);
      if (m) add(m[1]);
    }
  }

  // The phrase lists in .github/footers.yml.
  let inPhrases = false;
  for (const l of fs.readFileSync(path.join(repo, '.github/footers.yml'), 'utf8').split('\n')) {
    if (/^\s*phrases:\s*$/.test(l)) {
      inPhrases = true;
      continue;
    }
    if (!inPhrases) continue;
    const m = /^\s*-\s*["']?(.+?)["']?\s*$/.exec(l);
    if (m) add(m[1]);
    else if (l.trim() && !/^\s*-\s/.test(l)) inPhrases = false;
  }

  // The generators' own fallbacks: the phrase line only, never the link line.
  for (const f of DEFAULT_FOOTERS) add(f.split('\n')[0]);

  if (includeCurated) for (const p of CURATED_PHRASES) add(p);

  return inventory;
}

/**
 * The known phrase a trailing line contains, if any.
 *
 * Matching is by containment rather than equality because a footer line is often
 * a known phrase with a decorative suffix, and a generator may reword it
 * slightly between runs.
 *
 * @param {string} line - A single line
 * @param {Set<string>} inventory - From {@link buildPhraseInventory}
 * @returns {string|null} The phrase matched, or null
 */
export function knownPhraseIn(line, inventory) {
  const n = normalise(line);
  if (n.length < 15) return null;
  for (const k of inventory) if (k.length >= 15 && n.includes(k)) return k;
  // The wording recogniser's closed list catches configured footers the
  // inventory above does not carry. This is the one place the ground truth and
  // the signal share a source, and it is why recall is a consistency check
  // rather than an independent accuracy measure.
  if (isFooterPhraseLine(line)) return '(wording recogniser)';
  return null;
}

/**
 * Measure the signal over every tracked Markdown file.
 *
 * @param {string} [repo] - Repository root; defaults to this checkout
 * @returns {{revision: string, scanned: number, flagged: number, twoKnown: number,
 *   noKnownFooter: number, falsePositiveRate: string, groundTruth: number,
 *   caught: number, missed: number, recall: string, missedPaths: string[]}}
 */
export function measure(repo = REPO) {
  // The inventory must come from the same tree as the file list, or a caller
  // measuring another checkout would score it against this one's footers.
  const inventory = buildPhraseInventory(true, repo);
  const curated = CURATED_PHRASES.map(normalise).filter((p) => inventory.has(p));
  const files = cp
    .execFileSync('git', ['ls-files', '*.md'], { cwd: repo, encoding: 'utf8', maxBuffer: 1 << 28 })
    .split('\n')
    .filter(Boolean);

  let flagged = 0;
  let twoKnown = 0;
  let groundTruth = 0;
  let caught = 0;
  const missedPaths = [];
  const groundTruthFiles = [];
  // Per file, the distinct phrases it carries, so the curated phrases can be
  // ablated afterwards without re-reading the corpus.
  const perFile = [];

  for (const rel of files) {
    let content;
    try {
      content = fs.readFileSync(path.join(repo, rel), 'utf8');
    } catch {
      continue;
    }
    // Take the same window the signal takes. findTrailingFooterShapedBlocks drops
    // the empty element a trailing newline leaves behind before slicing, so
    // without this the ground truth would see seven real lines where the signal
    // sees eight, and the two sides of the recall figure would not be comparable.
    const all = content.split('\n');
    if (all.length > 1 && all[all.length - 1] === '') all.pop();
    const tail = all.slice(-ZONE_LINES);
    const matched = new Set(tail.map((l) => knownPhraseIn(l, inventory)).filter(Boolean));
    const carriesTwoKnown = matched.size >= 2;
    const isFlagged = findShapeMultiples(content).count >= 2;
    perFile.push({ matched, isFlagged });

    if (carriesTwoKnown) {
      groundTruth += 1;
      groundTruthFiles.push(rel);
      if (isFlagged) caught += 1;
      else missedPaths.push(rel);
    }
    if (isFlagged) {
      flagged += 1;
      if (carriesTwoKnown) twoKnown += 1;
    }
  }

  // How much of the ground truth each curated phrase is responsible for. Without
  // this the recall figure looks like a property of the detector rather than of
  // a list that one phrase dominates.
  const curatedContribution = curated.map((phrase) => ({
    phrase,
    // Ground truth that disappears if this one phrase is removed from the list:
    // a file counts only if dropping it leaves fewer than two distinct phrases.
    filesLost: perFile.filter(
      (f) => f.matched.size >= 2 && [...f.matched].filter((p) => p !== phrase).length < 2
    ).length,
  }));

  const noKnownFooter = flagged - twoKnown;
  const pct = (n, d) => (d ? ((n / d) * 100).toFixed(1) : '0.0');
  const revision = cp
    .execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: repo, encoding: 'utf8' })
    .trim();

  return {
    revision,
    scanned: files.length,
    inventorySize: inventory.size,
    flagged,
    twoKnown,
    noKnownFooter,
    falsePositiveRate: pct(noKnownFooter, flagged),
    groundTruth,
    caught,
    missed: groundTruth - caught,
    recall: pct(caught, groundTruth),
    missedPaths,
    groundTruthFiles,
    curatedContribution,
  };
}

// Only print when run directly, so tests can import the functions above.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const r = measure();
  console.log(`tree                    : ${r.revision}`);
  console.log(`tracked Markdown files  : ${r.scanned}`);
  console.log(`known-phrase inventory  : ${r.inventorySize}`);
  console.log('');
  console.log('GROUND TRUTH — two or more distinct known footer phrases in the trailing 8 lines:');
  console.log(`  such files            : ${r.groundTruth}`);
  console.log(`  caught by the signal  : ${r.caught}  (${r.recall}% recall)`);
  console.log(`  missed                : ${r.missed}`);
  r.missedPaths.slice(0, 5).forEach((p) => console.log(`    ${p}`));
  console.log('');
  console.log('THE SIGNAL — two or more footer-shaped blocks in the trailing zone:');
  console.log(`  files flagged         : ${r.flagged}`);
  console.log(`  of which two known    : ${r.twoKnown}`);
  console.log(`  of which none known   : ${r.noKnownFooter}`);
  console.log('');
  console.log(
    `NO-KNOWN-FOOTER SHARE (of flagged) : ${r.falsePositiveRate}%  (${r.noKnownFooter}/${r.flagged})`
  );
  console.log('');
  console.log('Ground-truth files lost if one hand-curated phrase is removed:');
  r.curatedContribution
    .sort((a, b) => b.filesLost - a.filesLost)
    .forEach((c) => console.log(`  ${String(c.filesLost).padStart(4)}  ${c.phrase}`));
  console.log('');
  console.log("That is the recall figure's real weight: it is agreement with this list, not an");
  console.log('independent accuracy measure, and a footer missing from the list is invisible to');
  console.log('both the ground truth and the signal at once.');
}
