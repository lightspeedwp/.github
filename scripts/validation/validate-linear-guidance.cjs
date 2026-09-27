#!/usr/bin/env node
/**
 * Validate the canonical Linear Agent guidance and fingerprint it.
 *
 * Code Intelligence reads the guidance configured inside Linear, not the copy in
 * this repository. That configured copy cannot be read back through the API, so
 * two things can go wrong silently:
 *
 * 1. The guidance drifts out of date here and nobody notices, because Linear
 *    keeps answering from the old text. A fingerprint gives a comparable value
 *    to record alongside the pasted block.
 * 2. The guidance references a setting the workspace cannot reach. This
 *    workspace is on the Business plan, where the top role is Admin; the
 *    workspace *owner* role is Enterprise-only, as are SCIM, audit logs,
 *    workspace exports, OAuth application approvals, and private-team issue
 *    sharing. Guidance that sends someone after those is worse than no guidance,
 *    so those references are rejected here rather than shipped.
 *
 * The payload is the single ```text fence in the guidance file. Exactly one is
 * required, so the extraction has one unambiguous answer.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const GUIDANCE_PATH = 'docs/LINEAR_AGENT_GUIDANCE.md';
/**
 * Enterprise-only concepts that must not appear in Business-plan guidance.
 *
 * Each concept lists the phrasings it can appear as, because a single literal
 * misses the wording Linear and its own documentation actually use. Two that a
 * single term got wrong: "OAuth app approval" does not match "OAuth application
 * approvals", and a hyphenated "private-team issue sharing" does not match
 * "private team issue sharing".
 *
 * Matching is case-insensitive and substring-based, so plurals are covered by
 * the singular form. Guidance that sends someone after a setting this workspace
 * cannot reach is worse than no guidance, because it looks authoritative.
 */
const ENTERPRISE_ONLY = [
  {
    id: 'workspace-owner',
    variants: ['workspace owner'],
    guidance:
      'the workspace owner role is Enterprise-only; on Business the top role is Admin, so say "workspace Admin"',
  },
  { id: 'scim', variants: ['scim'], guidance: 'SCIM is Enterprise-only' },
  { id: 'audit-log', variants: ['audit log'], guidance: 'audit logs are Enterprise-only' },
  {
    id: 'workspace-export',
    variants: ['workspace export'],
    guidance: 'workspace exports are Enterprise-only',
  },
  {
    id: 'oauth-app-approval',
    variants: ['oauth app approval', 'oauth application approval'],
    guidance: 'OAuth application approvals are Enterprise-only',
  },
  {
    id: 'private-team-issue-sharing',
    variants: [
      'private-team issue sharing',
      'private team issue sharing',
      'issue sharing from a private team',
      'share an issue from a private team',
    ],
    guidance: 'issue sharing from a private team is Enterprise-only',
  },
];

/**
 * Things the guidance must cover, so a rewrite cannot quietly drop the parts
 * that make Code Intelligence useful on a repository this large.
 */
// The guidance is configured on Linear for the whole organisation, so it must
// both orient Linear across the repository families and keep the detail that
// .github needs. Organisation-level topics are listed first because they are the
// ones a future edit is most likely to drop by accident when trimming length.
const REQUIRED_TOPICS = [
  {
    pattern: /do not share one stack|do not assume/i,
    topic: 'warn against assuming one shared stack across repositories',
  },
  {
    // Tolerates a straight or typographic apostrophe, since the payload is
    // prose written for humans and either reads correctly.
    pattern: /read (that|the target) repository[’']s own|its own (AGENTS|documentation)/i,
    topic: "instruct reading the target repository's own documentation first",
  },
  { pattern: /REPOSITORY FAMILIES/i, topic: 'name the repository families' },
  { pattern: /\.github\b/, topic: 'identify the .github governance repository' },
  {
    pattern: /lightspeed-hosting-infra/,
    topic: 'name the hosting infrastructure repository',
  },
  { pattern: /nexus/i, topic: 'name the nexus product family' },
  { pattern: /WordPress/i, topic: 'state the WordPress majority' },
  { pattern: /PHP/i, topic: 'state the predominant language' },
  { pattern: /UK English/i, topic: 'state the UK English requirement' },
  { pattern: /AGENTS\.md/, topic: 'point at AGENTS.md as the canonical rules' },
  { pattern: /docs\/AGENT-INDEX\.md/, topic: 'point at the agent index' },
  { pattern: /\.github\/workflows\//, topic: 'say where workflows live' },
  { pattern: /scripts\//, topic: 'say where scripts live' },
  { pattern: /__tests__/, topic: 'state the test location requirement' },
  { pattern: /labels\.yml/, topic: 'name the locked label configuration' },
  { pattern: /\.gitattributes/, topic: 'mention the review categories' },
];

/**
 * Extract the single guidance payload from a file's contents.
 * Recognizes unindented ```text openers and bare ``` closers, with optional
 * trailing spaces or tabs. Ignores text openers inside other backtick fences.
 * @param {string} contents - Full file contents.
 * @returns {{ payload: string, count: number, unterminated: number }} The trimmed
 * payload, or an empty string unless exactly one text fence opens and closes;
 * count includes unclosed text fences, and unterminated is 1 if one remains open,
 * otherwise 0.
 */
function extractPayload(contents) {
  const lines = contents.split('\n');
  const payloads = [];
  let openers = 0;
  let unterminated = 0;
  let fence = null;

  for (const line of lines) {
    if (fence === null) {
      if (/^```text[ \t]*$/.test(line)) {
        fence = { language: 'text', body: [] };
        openers += 1;
      } else if (/^```/.test(line)) {
        // Some other language. Tracked so a heading inside it is not counted.
        fence = { language: 'other', body: [] };
      }
      continue;
    }

    if (/^```[ \t]*$/.test(line)) {
      if (fence.language === 'text') {
        payloads.push(fence.body.join('\n'));
      }
      fence = null;
      continue;
    }

    fence.body.push(line);
  }

  // An opener with no closer leaves the document malformed and the payload
  // ambiguous, so it is reported rather than quietly ignored. Counting only
  // closed blocks would accept a valid block followed by an unfinished one.
  if (fence !== null && fence.language === 'text') {
    unterminated = 1;
  }

  const payload = openers === 1 && unterminated === 0 ? payloads[0].trim() : '';
  return { payload, count: openers, unterminated };
}

/**
 * Collect level-two headings that are real headings rather than text inside a
 * fenced code block. A `## ` line in an example would otherwise satisfy a
 * required-section check it has no business satisfying.
 * Only unindented `## ` headings and fences starting with ``` are recognized.
 *
 * @param {string} contents - Full file contents.
 * @returns {string[]} The heading titles outside fences.
 */
function headingsOutsideFences(contents) {
  const headings = [];
  let inFence = false;

  for (const line of contents.split('\n')) {
    if (/^```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (!inFence && line.startsWith('## ')) {
      headings.push(line.slice(3).trim());
    }
  }

  return headings;
}

/**
 * Escape a string for literal use inside a regular expression.
 * @param {string} value - Literal text.
 * @returns {string} The text with regex metacharacters escaped.
 */
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * A short, stable digest of the payload, safe to record in Linear.
 * @param {string} payload - The guidance text.
 * @returns {string} A 12-character hex fingerprint.
 */
function fingerprint(payload) {
  return crypto.createHash('sha256').update(payload, 'utf8').digest('hex').slice(0, 12);
}

/**
 * Check the payload against the Business-plan and coverage rules.
 * Enterprise-only references and missing topics are errors. A nonempty payload
 * shorter than 400 or longer than 8000 UTF-16 code units, or containing a
 * placeholder, produces warnings. An empty payload returns only a missing-payload
 * error. Validation problems are returned rather than thrown.
 * @param {string} payload - The guidance text.
 * @returns {{ errors: string[], warnings: string[] }} Problems found.
 */
function validatePayload(payload) {
  const errors = [];
  const warnings = [];

  if (!payload) {
    errors.push(
      `No guidance payload found. ${GUIDANCE_PATH} must contain exactly one \`\`\`text fence.`
    );
    return { errors, warnings };
  }

  for (const { id, variants, guidance } of ENTERPRISE_ONLY) {
    // Match case-insensitively but report the text as the author wrote it, so
    // the error points at something findable in the file. Matching against the
    // lowercased copy would echo a lowercased variant instead.
    const found = variants
      .map((variant) => payload.match(new RegExp(escapeRegExp(variant), 'i')))
      .find(Boolean);
    if (found) {
      errors.push(
        `References "${found[0]}" (${id}), which this workspace cannot act on: ${guidance}.`
      );
    }
  }

  for (const { pattern, topic } of REQUIRED_TOPICS) {
    if (!pattern.test(payload)) {
      errors.push(`Does not ${topic}.`);
    }
  }

  if (payload.length < 400) {
    warnings.push(
      `Payload is only ${payload.length} characters; it is unlikely to cover this repository.`
    );
  }
  if (payload.length > 8000) {
    warnings.push(
      `Payload is ${payload.length} characters; long guidance tends to be followed inconsistently.`
    );
  }
  if (/\bTODO\b|\bTBD\b|placeholder/i.test(payload)) {
    warnings.push(
      'Payload contains a placeholder that should be resolved before pasting into Linear.'
    );
  }

  return { errors, warnings };
}

/**
 * Read and validate the canonical guidance file under the repository root.
 * A missing file returns a failed report. Warnings do not make ok false.
 * The fingerprint is null for an empty payload, but is still included for a
 * nonempty payload that fails validation. characters counts UTF-16 code units.
 * @param {string} [root] - Repository root. Defaults to the current directory.
 * @returns {object} The report, including the payload, fingerprint, and problems.
 * @throws {Error} Propagates file-read errors after the existence check.
 */
function validateLinearGuidance(root = process.cwd()) {
  const file = path.join(root, GUIDANCE_PATH);

  if (!fs.existsSync(file)) {
    return {
      ok: false,
      file: GUIDANCE_PATH,
      payload: '',
      fingerprint: null,
      characters: 0,
      errors: [`Missing ${GUIDANCE_PATH}.`],
      warnings: [],
    };
  }

  const contents = fs.readFileSync(file, 'utf8');
  const { payload, count, unterminated } = extractPayload(contents);
  const { errors, warnings } = validatePayload(payload);

  if (unterminated > 0) {
    errors.unshift(
      'A ```text fence is never closed, so the payload is ambiguous. Close it or remove the opener.'
    );
  }
  if (count !== 1) {
    errors.unshift(
      `Found ${count} \`\`\`text fence(s); exactly one is required so the payload is unambiguous.`
    );
  }

  return {
    ok: errors.length === 0,
    file: GUIDANCE_PATH,
    payload,
    fingerprint: payload ? fingerprint(payload) : null,
    characters: payload.length,
    errors,
    warnings,
  };
}

/**
 * Sections the integration guide must keep. Enforced because a section can be
 * dropped without any tool noticing: a careless range-based edit removed the
 * whole Triage Intelligence section, which carries a production warning about
 * auto-applying labels to a locked label set. The markdown link-fragment check
 * is what caught it, and only because another section still linked to it.
 */
const GUIDE_PATH = 'docs/LINEAR_INTEGRATION.md';
const REQUIRED_GUIDE_SECTIONS = [
  'Scope and plan',
  'Setup',
  'Review Platform',
  '.gitattributes review categories',
  'Code Intelligence',
  'Triage Intelligence',
  'Issue status on merge',
  'What is deliberately not wired',
  'Troubleshooting',
];

/**
 * Check that the integration guide still carries every required section.
 * Required titles must match level-two headings outside backtick fences exactly.
 * @param {string} [root] - Repository root. Defaults to the current directory.
 * @returns {{ ok: boolean, missing: string[] }} Whether the guide is complete,
 * with missing section titles or a missing-file message if the guide is absent.
 * @throws {Error} Propagates file-read errors after the existence check.
 */
function validateGuideSections(root = process.cwd()) {
  const file = path.join(root, GUIDE_PATH);

  if (!fs.existsSync(file)) {
    return {
      ok: false,
      missing: [`Missing ${GUIDANCE_PATH === GUIDE_PATH ? GUIDE_PATH : GUIDE_PATH}.`],
    };
  }

  const headings = new Set(headingsOutsideFences(fs.readFileSync(file, 'utf8')));

  const missing = REQUIRED_GUIDE_SECTIONS.filter((section) => !headings.has(section));
  return { ok: missing.length === 0, missing };
}

module.exports = {
  GUIDANCE_PATH,
  GUIDE_PATH,
  REQUIRED_GUIDE_SECTIONS,
  validateGuideSections,
  ENTERPRISE_ONLY,
  REQUIRED_TOPICS,
  escapeRegExp,
  extractPayload,
  fingerprint,
  headingsOutsideFences,
  validatePayload,
  validateLinearGuidance,
};

if (require.main === module) {
  const asJson = process.argv.includes('--json');
  const report = validateLinearGuidance();

  // The guide-section guard is only worth having if the script that runs in CI
  // enforces it. A test alone would leave npm run validate:all green while the
  // guide had silently lost a section.
  const guide = validateGuideSections();
  if (!guide.ok) {
    report.ok = false;
    report.errors.push(`${GUIDE_PATH} is missing section(s): ${guide.missing.join(', ')}.`);
  }

  if (asJson) {
    process.stdout.write(`${JSON.stringify({ ...report, payload: undefined }, null, 2)}\n`);
  } else {
    for (const error of report.errors) {
      process.stderr.write(`  ERROR  ${error}\n`);
    }
    for (const warning of report.warnings) {
      process.stderr.write(`  WARN   ${warning}\n`);
    }
    if (report.ok) {
      process.stdout.write(
        `Linear agent guidance is valid. ${report.characters} characters.\n` +
          `Fingerprint: ${report.fingerprint}\n` +
          'Record this next to the pasted block in Linear so drift is detectable.\n'
      );
    }
  }

  process.exitCode = report.ok ? 0 : 1;
}
