#!/usr/bin/env node
/**
 * Validate that a skill's SKILL.md does not contradict a status vocabulary that
 * the reference files shipped alongside it define.
 *
 * Issue #3702 collected twelve documentation defects. Two of them share a root
 * cause that is mechanically checkable, and this validator guards that cause:
 *
 * - `lightspeed-faq-and-chatbot-source-curator` told the agent to "mark the item
 *   as `Needs Review`, `Evidence Required`, `Legal Review` or `Not for
 *   Chatbot`", while `references/chatbot-safe-source-rules.md` defines
 *   `Chatbot Safe After Review` and `Legal Review Required`. An agent following
 *   the entry point emitted labels no register accepts.
 * - `lightspeed-launch-readiness-auditor` summarised `Go` as "no blockers",
 *   while `references/go-no-go-rules.md` also requires critical-page QA and a
 *   rollback plan, so following only the summary approved a launch missing two
 *   required gates.
 *
 * Both are the same shape: SKILL.md is what an agent reads first, the bundled
 * reference is the authority it is told to load, and nothing compared them.
 *
 * ## Scope, and why it is narrow
 *
 * A general "every backticked token must appear in a reference" rule is not
 * usable: most backticked tokens in these files are file names, command
 * fragments and block names, and treating those as vocabulary produces hundreds
 * of false positives. This validator therefore only fires on a shape that is
 * unambiguous in both directions:
 *
 * - a **reference** declares vocabulary as a bullet list of backticked labels
 *   under a recognised vocabulary heading, and
 * - a **SKILL.md** states its own enumeration of backticked labels on a line
 *   that offers them as permitted values (`mark as`, `state one of`, `use:`,
 *   `choose`).
 *
 * A skill that does neither is never reported, and a reference that defines no
 * backticked vocabulary is never used as an authority. Where a skill enumerates
 * labels and ships a vocabulary-defining reference, the enumeration must be a
 * subset of that vocabulary. Prose conditions, file lists and worked examples
 * are outside the comparison by construction.
 *
 * The other ten #3702 findings are factual drift against external sources
 * (an upstream CLI's rule list, a vendor's settings path, WordPress core's
 * pattern picker) or contract drift that no in-tree rule can adjudicate. Those
 * need review, not a linter, and are deliberately not attempted here.
 */

const fs = require('fs');
const path = require('path');

/**
 * Reference headings that introduce a controlled vocabulary.
 *
 * Matching is on the heading text with markdown syntax and trailing punctuation
 * removed, so `## Status labels` matches at any heading depth.
 */
const VOCABULARY_HEADINGS = new Set([
  'status labels',
  'review status',
  'chatbot-safe status',
  'chatbot-safe criteria',
  'status vocabulary',
]);

/**
 * Lines that offer backticked tokens as permitted values rather than mentioning
 * them in passing. Each pattern must be anchored on a verb of selection, so a
 * sentence that merely names a file is not treated as an enumeration.
 */
const ENUMERATION_PATTERNS = [
  /\bmark (?:the item|it|each|them) as\b/iu,
  /\bmark as\b/iu,
  /\bstate one of\b/iu,
  /\bchoose (?:one of|from)\b/iu,
  /\bselect (?:one of|from)\b/iu,
  /\buse (?:one of|either|any of)\b/iu,
];

/** A bullet list introduced by a bare lead-in such as "Use:" or "Status:". */
const LIST_LEAD_IN = /^(?:use|status|values?|labels?|options?|states?)\s*:?\s*$/iu;

/**
 * Longest non-bullet line treated as a list lead-in rather than as content that
 * ends a vocabulary section.
 */
const LIST_LEAD_IN_MAX_LENGTH = 40;

/**
 * A code span that names a file, path or bundled asset is never a status
 * label, however it is introduced.
 */
const NON_LABELS = /[/\\]|\.(?:md|json|ya?ml|php|txt|sh|cjs|ts|js)\b/u;

function stripMarkdown(line) {
  return line
    .replace(/^\s*[-*+]\s+/u, '')
    .replace(/^\s*\d+[.)]\s+/u, '')
    .replace(/[`*_]/gu, '')
    .trim();
}

function isBacktickedLabel(value) {
  const label = value.trim();
  return (
    label.length > 0 && label.length <= 60 && !/\s{2,}/u.test(label) && !NON_LABELS.test(label)
  );
}

function codeSpans(text) {
  return [...text.matchAll(/`([^`\n]+)`/gu)]
    .map((match) => match[1].trim())
    .filter(isBacktickedLabel);
}

/**
 * Labels a reference file defines as vocabulary.
 *
 * A heading opens a vocabulary section that runs until the next heading. Short
 * prose ("Use:") is treated as a list lead-in rather than as the end of the
 * section, because that is how the reference files are written. Fenced code is
 * skipped: a fenced block is an example, not a definition.
 */
function extractVocabulary(content) {
  const labels = new Set();
  const lines = content.split(/\r?\n/u);
  let inFence = false;
  let inVocabularySection = false;
  let sawLeadIn = false;
  let inFirstList = false;

  for (const rawLine of lines) {
    if (/^\s*(?:```|~~~)/u.test(rawLine)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      continue;
    }

    const heading = rawLine.match(/^#{1,6}\s+(.*?)\s*$/u);
    if (heading) {
      const text = stripMarkdown(heading[1])
        .toLowerCase()
        .replace(/[.:]+$/u, '');
      inVocabularySection = VOCABULARY_HEADINGS.has(text);
      sawLeadIn = false;
      inFirstList = inVocabularySection;
      continue;
    }

    if (!inVocabularySection) {
      continue;
    }

    if (rawLine.trim() === '') {
      continue;
    }

    const bullet = rawLine.match(/^\s*[-*+]\s+(.*)$/u);
    if (bullet) {
      // A recognised vocabulary heading is itself the authority for the list
      // beneath it, so the first list in the section counts whether or not it is
      // introduced by "Use:". A lead-in additionally admits later lists in the
      // same section.
      if (sawLeadIn || inFirstList) {
        const codeSpan = bullet[1].match(/^`([^`\n]+)`/u);
        const candidate = codeSpan ? codeSpan[1].trim() : bullet[1].split(/\s+[—–-]\s+/u)[0].trim();
        if (isBacktickedLabel(candidate)) {
          labels.add(candidate);
        }
      }
      continue;
    }

    if (LIST_LEAD_IN.test(rawLine.trim())) {
      sawLeadIn = true;
      continue;
    }

    if (!sawLeadIn && rawLine.trim().length <= LIST_LEAD_IN_MAX_LENGTH) {
      sawLeadIn = true;
      continue;
    }

    inVocabularySection = false;
    sawLeadIn = false;
    inFirstList = false;
  }

  return labels;
}

/**
 * Whether a line forbids its code spans rather than offering them as permitted
 * values.
 *
 * Only the negation that can precede a selection verb is treated as a
 * prohibition. Skill files legitimately write "Never promote an item to
 * `Chatbot Safe After Review`", and reading that as a permitted value would
 * report the line that closes the loophole.
 */
function isProhibition(line) {
  return /^\s*(?:[-*+]\s*)?(?:do\s+not|don't|never|no\s+other)\b/iu.test(line);
}

/**
 * Labels a SKILL.md offers as permitted values, keyed by label with the line
 * that offers it.
 *
 * Only a line matching an enumeration pattern counts, and only when it offers
 * its values rather than forbidding them. A bullet list is accepted only under a
 * bare list lead-in, so an ordinary bullet that happens to contain a code span is
 * not read as an enumeration.
 */
function extractEnumeratedLabels(content) {
  const labels = new Map();
  const lines = content.split(/\r?\n/u);
  let inFence = false;
  let pendingLeadIn = false;

  lines.forEach((rawLine, index) => {
    if (/^\s*(?:```|~~~)/u.test(rawLine)) {
      inFence = !inFence;
      pendingLeadIn = false;
      return;
    }
    if (inFence) {
      return;
    }

    const heading = rawLine.match(/^#{1,6}\s/u);
    if (heading) {
      pendingLeadIn = false;
      return;
    }

    if (ENUMERATION_PATTERNS.some((pattern) => pattern.test(rawLine))) {
      // A negated instruction forbids its values rather than permitting them,
      // so "Do not mark the item as `Unknown`" must not make `Unknown` a
      // permitted label. Without this, a skill that documents a status it
      // rejects — as project-memory-manager does for `Unknown` — is reported
      // for the very wording that fixes it.
      if (!isProhibition(rawLine)) {
        for (const label of codeSpans(rawLine)) {
          if (!labels.has(label)) {
            labels.set(label, index + 1);
          }
        }
      }
      // "State one of:" introduces a bullet list on the following lines rather
      // than enumerating inline, so arm the lead-in as well.
      if (LIST_LEAD_IN.test(rawLine.trim()) || /:$/u.test(rawLine.trim())) {
        pendingLeadIn = true;
      }
      return;
    }

    if (rawLine.trim() === '') {
      return;
    }

    if (pendingLeadIn) {
      const bullet = rawLine.match(/^\s*[-*+]\s+(.*)$/u);
      if (bullet) {
        for (const label of codeSpans(bullet[1])) {
          if (!labels.has(label)) {
            labels.set(label, index + 1);
          }
        }
        return;
      }
    }

    pendingLeadIn = LIST_LEAD_IN.test(rawLine.trim());
  });

  return labels;
}

function findSkillDirectories(root) {
  const directories = [];

  for (const top of ['skills', 'agents']) {
    const topPath = path.join(root, top);
    if (fs.existsSync(topPath)) {
      collectSkillDirectories(topPath, directories);
    }
  }

  return directories;
}

function collectSkillDirectories(searchRoot, found) {
  for (const entry of fs.readdirSync(searchRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }
    const entryPath = path.join(searchRoot, entry.name);
    if (fs.existsSync(path.join(entryPath, 'SKILL.md'))) {
      found.push(entryPath);
      continue;
    }
    collectSkillDirectories(entryPath, found);
  }
}

function listReferenceFiles(skillDirectory) {
  const referencesPath = path.join(skillDirectory, 'references');
  if (!fs.existsSync(referencesPath)) {
    return [];
  }
  return fs
    .readdirSync(referencesPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => path.join(referencesPath, entry.name));
}

/**
 * Findings for one skill directory.
 *
 * The union of every bundled reference's vocabulary is the authority. A skill
 * may load any of its references, so the caller cannot know which one supplied
 * a given label; accepting a label present in any of them avoids a false
 * report while still rejecting a label no reference defines.
 */
function validateSkillDirectory(skillDirectory) {
  const referenceFiles = listReferenceFiles(skillDirectory);
  if (referenceFiles.length === 0) {
    return [];
  }

  const vocabulary = new Set();
  for (const referenceFile of referenceFiles) {
    for (const label of extractVocabulary(fs.readFileSync(referenceFile, 'utf8'))) {
      vocabulary.add(label);
    }
  }
  if (vocabulary.size === 0) {
    return [];
  }

  const skillPath = path.join(skillDirectory, 'SKILL.md');
  const findings = [];
  for (const [label, lineNumber] of extractEnumeratedLabels(fs.readFileSync(skillPath, 'utf8'))) {
    if (!vocabulary.has(label)) {
      findings.push({
        filePath: skillPath,
        lineNumber,
        label,
        knownLabels: [...vocabulary].sort(),
      });
    }
  }

  return findings;
}

function formatFinding(root, finding) {
  const relativePath = path.relative(root, finding.filePath);
  const known = finding.knownLabels.map((label) => `\`${label}\``).join(', ');
  return (
    `${relativePath}:${finding.lineNumber} offers \`${finding.label}\` as a ` +
    `permitted value, but none of this skill's reference files define it. ` +
    `Use the reference vocabulary: ${known}.`
  );
}

function main() {
  const root = process.cwd();
  const findings = findSkillDirectories(root).flatMap((skillDirectory) =>
    validateSkillDirectory(skillDirectory)
  );

  if (findings.length > 0) {
    const summary = findings.map((finding) => formatFinding(root, finding)).join('\n');
    console.error(
      `[validate-skill-doc-contracts] A SKILL.md offers values its own reference files do not define (#3702):\n${summary}`
    );
    process.exit(1);
  }

  console.log('[validate-skill-doc-contracts] OK');
}

module.exports = {
  ENUMERATION_PATTERNS,
  LIST_LEAD_IN,
  VOCABULARY_HEADINGS,
  extractEnumeratedLabels,
  extractVocabulary,
  findSkillDirectories,
  isBacktickedLabel,
  isProhibition,
  listReferenceFiles,
  validateSkillDirectory,
};

if (require.main === module) {
  main();
}
