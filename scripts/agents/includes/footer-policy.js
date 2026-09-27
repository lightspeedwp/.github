/**
 * footer-policy.js
 * Footer recognition patterns and path policy — one source of truth shared by
 * the footer generator and the duplicate-block guard.
 *
 * Context (#3451). Two separate footer code paths existed, and neither the
 * patterns nor the "which files get footers" policy had a single owner:
 *
 *  - `header-footer.js` owns `FOOTER_PATTERNS` privately, so nothing else can
 *    ask "is this line a footer?" The duplicate blocks that #3451 tracks were
 *    therefore invisible to any other tool.
 *  - The exclusion policy was documented in `docs/QUIRKY_FOOTERS_GUIDE.md` and
 *    mirrored into `.github/config/quirky-footers.yaml` and
 *    `scripts/inject-footers.js`, but the live path (`meta.agent.js`) excluded
 *    nothing, and the two config carriers were unreachable. So the documented
 *    policy was never enforced anywhere.
 *
 * This module fixes the ownership problem: recognition (`isFooterPhraseLine`,
 * `isFooterLinkLine`, `buildFooterRegex`) and path policy
 * (`isFooterExemptPath`) live here, and both the generator and the guard import
 * from it. A pattern can no longer be widened for generation without the guard
 * seeing it, and the exemption list can no longer drift from the docs because
 * there is only one copy.
 */

/**
 * Line-level patterns that identify a footer phrase.
 *
 * Every pattern's body is deliberately bounded to a single line ([^\n]*,
 * not [\s\S]*?): footer phrases are always one line, optionally followed by
 * exactly one link line. An earlier version used [\s\S]*? here, which can match
 * across newlines -- combined with the outer buildFooterRegex() anchoring on
 * end-of-string, that let a footer phrase merely quoted or re-used
 * mid-document (matching only because it starts a line) expand all the way to
 * the true end of the file, and ensureFooter()'s replace path would then delete
 * every real line of content after it.
 *
 * The leading `[*_]?` on the first five is load-bearing: it is what makes the
 * generator recognise asterisk-wrapped footers. Before it was added (#3443) an
 * asterisk-wrapped footer did not match, so every automation run appended
 * another copy instead of replacing the existing one — the compounding that
 * produced the ~117K duplicate blocks tracked by #3451. Do not narrow these.
 *
 * @type {string[]}
 */
export const FOOTER_PATTERNS = [
  '[*_]?Maintained with ❤️[^\\n]*(?:\\n\\[.*?\\]\\(.*?\\))?',
  '[*_]?Built by 🧱[^\\n]*(?:\\n\\[.*?\\]\\(.*?\\))?',
  '[*_]?Have questions\\?[^\\n]*(?:\\n\\[.*?\\]\\(.*?\\))?',
  '[*_]?This page brought to you by[^\\n]*(?:\\n\\[.*?\\]\\(.*?\\))?',
  '[*_]?Docs signed by 🤖[^\\n]*',
  '[*_]?Made with ❤️[^\\n]*(?:\\n\\[.*?\\]\\(.*?\\))?',
  '[*_]?Questions\\?[^\\n]*',
  '[*_]?Prefer a guided[^\\n]*',
  '[*_]?Clarity first[^\\n]*',
  '[*_]?Improvements welcome[^\\n]*',
  '[*_]?Copy, adapt[^\\n]*',
  '[*_]?Tweak the variables[^\\n]*',
  '[*_]?Your feedback shapes[^\\n]*',
  '[*_]?Reuse beats[^\\n]*',
  '[*_]?Keep prompts[^\\n]*',
  '[*_]?Use responsibly[^\\n]*',
  '[*_]?Keep tone[^\\n]*',
  '[*_]?Update when[^\\n]*',
  '[*_]?Link policies[^\\n]*',
  '[*_]?Thanks for helping[^\\n]*',
  '[*_]?Need help\\?[^\\n]*',
];

/**
 * A deliberately narrow subset of {@link FOOTER_PATTERNS} that is safe to
 * match anywhere in a document, not just at end of file.
 *
 * Why this exists. `ensureFooter()` only ever tests the pattern list against
 * the very end of a file, so a phrase-shaped line in the middle of a document
 * is invisible to it. An auditing tool has no such luxury: it must look at
 * every line, and several patterns are generic enough to begin ordinary prose:
 * `Questions?`, `Update when`, `Use responsibly`, `Keep tone`, `Keep prompts`,
 * `Link policies`, `Reuse beats`, `Copy, adapt` and `Need help?` all accept any
 * trailing text via `[^\n]*`. A standalone line such as
 * "Update when the API version changes." would match, and a bulk cleanup would
 * delete it as a stranded footer.
 *
 * Every pattern below is anchored on wording no ordinary sentence begins with,
 * several carrying an emoji. That makes a mid-document match a footer with
 * essentially no false-positive risk, which is the property required before
 * deleting a line that is not at EOF.
 *
 * Deliberately start-anchored only: what makes these safe is that the line
 * *begins* with the phrase. Trailing text is common in real footers (they carry
 * links and punctuation), so anchoring the end too would reject legitimate
 * matches for no safety gain.
 *
 * @type {string[]}
 */
export const HIGH_CONFIDENCE_FOOTER_PATTERNS = [
  'Maintained with ❤️',
  'Built by 🧱',
  'Have questions\\? Ping us on GitHub',
  'This page brought to you by',
  'Docs signed by 🤖',
  'Made with ❤️',
];

// Start-anchored: the opener must begin the line. See the note above.
const HIGH_CONFIDENCE_PHRASE_RE = new RegExp(
  `^[*_]?(?:${HIGH_CONFIDENCE_FOOTER_PATTERNS.join('|')})`
);

/**
 * Build the footer regex from the patterns array.
 *
 * The result is anchored to the end of the whole file and required to *start*
 * its own line (right after "\n", or at the very start of the file). Both
 * anchors matter:
 *  - No "m" flag on the trailing $: a multiline end-of-file anchor would match
 *    end-of-line for every line, letting a footer phrase merely mentioned
 *    mid-body (as prose, not as a real footer) match all the way to EOF via the
 *    patterns' own permissive bodies and get "replaced" in place -- wiping it
 *    out instead of leaving it alone and appending a separate new footer.
 *  - The explicit (?:^|\n) start guard rules out a phrase embedded mid-sentence
 *    (e.g. "This note mentions Have questions? ..."), which doesn't begin its
 *    own line, from matching at all.
 *
 * A trailing "\n?" before the final anchor tolerates the single trailing
 * newline ensureFooter()'s own append path always writes (`nextFooter + "\n"`)
 * -- without it, a footer this function itself previously wrote could never be
 * found and replaced on a later call, so ensureFooter() was not idempotent.
 *
 * Note the deliberate asymmetry with {@link isFooterPhraseLine}: this regex is
 * end-anchored and therefore deliberately only ever sees the *last* block in a
 * file. That is correct for the generator (one footer, at EOF) but useless for
 * auditing, which needs to see every block. Use `isFooterPhraseLine` for that.
 *
 * @returns {RegExp} End-anchored footer matcher
 */
export function buildFooterRegex() {
  // A phrase-shaped line at EOF is not automatically a footer. The generic
  // openers ("Questions?", "Update when", "Use responsibly", ...) also begin
  // ordinary sentences, and ensureFooter() *replaces* whatever this matches, so
  // matching prose here deletes it -- the same data loss the dedupe tool exists
  // to prevent. A trailing block therefore has to look like a footer: either it
  // opens with an unmistakable phrase, or the phrase line is emphasised, which
  // is how the ~26,000 footers in this repo are actually written.
  //
  // The emphasis requirement is a lookahead for a marker at the end of the
  // phrase line rather than a trailing `[*_]` in the pattern, because a footer
  // block may continue with a link line ("*Built by ...*\n[Contributors](...)")
  // that the pattern consumes after the closing marker.
  const emphasised = '(?=[^\\n]*[*_]\\s*$)';
  const tail = '[^\\n]*(?:\\n\\[.*?\\]\\(.*?\\))?';
  const pattern =
    '(^|\\n)(?:' +
    `[*_]?(?:${HIGH_CONFIDENCE_FOOTER_PATTERNS.join('|')})${tail}` +
    '|' +
    `${emphasised}(?:${FOOTER_PATTERNS.join('|')})` +
    ')\\n?$';
  return new RegExp(pattern);
}

// Whole-line phrase matcher, for auditing. Built once; the pattern list is
// module-level and immutable in practice.
const PHRASE_LINE_RE = new RegExp(`^(?:${FOOTER_PATTERNS.join('|')})$`);

// A bare Markdown link, optionally emphasised: the optional second line of a
// footer block (e.g. "[Contributors](https://github.com/...)").
const LINK_LINE_RE = /^\s*\[.*?\]\(.*?\)\s*$/;

/**
 * Is this single line a footer phrase?
 *
 * Unlike the end-anchored {@link buildFooterRegex}, this is a whole-line
 * anchored test with no position requirement, so it finds every footer block in
 * a file rather than only the last one. That is what makes duplicate detection
 * possible at all.
 *
 * Callers MUST exclude fenced code blocks before calling this: real content
 * legitimately begins with these phrases (e.g. a SAVED_REPLIES draft whose
 * body line is "Thanks for helping us get this to the right place!").
 *
 * @param {string} line - A single line, with or without trailing newline
 * @returns {boolean} True when the line is a footer phrase
 */
export function isFooterPhraseLine(line) {
  if (isIndentedCodeLine(line)) {
    return false;
  }
  return PHRASE_LINE_RE.test(String(line).trim());
}

/**
 * Is this line indented as an indented code block?
 *
 * CommonMark treats a line as an indented code block once its content starts at
 * least four columns in. Columns, not characters: a tab advances to the next
 * multiple of four, so "  \t" (two spaces then a tab) is already four columns
 * and is code, while a bare "/^(?: {4,}|\t)/" test would miss it. Mixed
 * space-then-tab indentation is common in pasted shell output, which is exactly
 * where a footer-shaped example line appears.
 *
 * A footer phrase inside such a block is example content, not a footer. Every
 * phrase matcher trims before matching, so without this guard an indented line
 * would be classified as a footer and could be deleted. A real footer is never
 * indented: it is written flush to the left margin.
 *
 * @param {string} line - A single line
 * @returns {boolean} True when the line is indented as a code block
 */
export function isIndentedCodeLine(line) {
  const text = String(line);
  let columns = 0;
  for (const character of text) {
    if (character === ' ') {
      columns += 1;
    } else if (character === '\t') {
      columns += 4 - (columns % 4);
    } else {
      break;
    }
  }
  return columns >= 4;
}

/**
 * Is this line a footer phrase that is safe to recognise away from EOF?
 *
 * Use this for any mid-document ("stranded") footer detection. Use
 * {@link isFooterPhraseLine} only where position already guarantees the match
 * is a footer, i.e. the end-of-file region and the footer-exempt policy check.
 *
 * @param {string} line - A single line
 * @returns {boolean} True when the line is an unmistakable footer phrase
 */
export function isHighConfidenceFooterPhraseLine(line) {
  if (isIndentedCodeLine(line)) {
    return false;
  }
  return HIGH_CONFIDENCE_PHRASE_RE.test(String(line).trim());
}

/**
 * Is this line a bare Markdown link, i.e. the optional second line of a footer
 * block?
 * @param {string} line - A single line
 * @returns {boolean} True when the line is a standalone link
 */
export function isFooterLinkLine(line) {
  return LINK_LINE_RE.test(String(line));
}

/**
 * Is this line a horizontal rule / thematic break (`---`, `***`, `___`)?
 *
 * Used by the guard to recognise the separator that introduces a footer block.
 * It must never be used to decide on its own that a `---` is removable — a rule
 * with real content after it is document structure, not a footer delimiter.
 *
 * @param {string} line - A single line
 * @returns {boolean} True when the line is a thematic break
 */
export function isThematicBreakLine(line) {
  return /^\s{0,3}(?:-{3,}|\*{3,}|_{3,})\s*$/.test(String(line));
}

/**
 * Directory names that are exempt from footer requirements, per the "Exclusions"
 * section of `docs/QUIRKY_FOOTERS_GUIDE.md`. Matched as whole path segments so
 * a file merely *named* `examples.md` is not treated as living in an examples
 * directory, while `agents/x/skills/y/references/z.md` is.
 *
 * `sample`/`samples`, `fixture`/`fixtures` and `mock`/`mocks` are all listed in
 * the guide (and in `.github/config/quirky-footers.yaml`) under both singular
 * and plural spellings; the guide's prose uses `/samples/` and `/mocks/` where
 * the config uses `/fixtures/` and `/mock(s)?/`, so both are honoured.
 *
 * @type {Set<string>}
 */
export const FOOTER_EXEMPT_DIR_NAMES = new Set([
  'references',
  'examples',
  'templates',
  'template',
  'example',
  'samples',
  'sample',
  'fixtures',
  'fixture',
  'mocks',
  'mock',
  // Archives & historical content (guide: "Archives & Historical Content")
  '.archive',
  'completed',
  'deprecated',
  'legacy',
]);

/**
 * Path prefixes that are exempt regardless of their trailing segment, per the
 * guide's "Vendor/Embedded Materials" and "Templates & Scaffolds" sections.
 * Checked against the POSIX-normalised relative path.
 *
 * @type {string[]}
 */
export const FOOTER_EXEMPT_PATH_PREFIXES = [
  'plugin-provided/',
  'platform-managed/',
  'directory-installed/',
  '.github/ISSUE_TEMPLATE/',
  '.github/PULL_REQUEST_TEMPLATE/',
  '.github/DISCUSSION_TEMPLATE/',
];

/**
 * Should this file be exempt from footer requirements?
 *
 * Implements the policy documented in `docs/QUIRKY_FOOTERS_GUIDE.md` — the
 * same policy that used to exist only in unreachable config files. Enforced by
 * both the generator (`meta.agent.js`) and the guard
 * (`scripts/footer/dedupe-footers.js`) so that "exempt" means one thing.
 *
 * @param {string} filePath - Repo-relative file path (POSIX or native separators)
 * @returns {boolean} True when no footer should be present in the file
 */
export function isFooterExemptPath(filePath) {
  const normalised = String(filePath).replace(/\\/g, '/').replace(/^\.\//, '');
  if (FOOTER_EXEMPT_PATH_PREFIXES.some((prefix) => normalised.startsWith(prefix))) {
    return true;
  }
  const segments = normalised.split('/');
  segments.pop(); // Drop the filename: only directories can grant an exemption.
  return segments.some((segment) => FOOTER_EXEMPT_DIR_NAMES.has(segment));
}
