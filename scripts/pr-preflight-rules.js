/**
 * Pull request opening rules shared by CI and the local preflight.
 *
 * The "Route PR template and apply labels" check and the changelog gate fail
 * pull requests that were opened without the routed template's sections or
 * without a changelog entry. Both rules are fully decidable before the pull
 * request exists, so they live here and run in two places: the workflow
 * imports `checkPrBody`, and `scripts/pr-preflight.js` runs the same function
 * on a developer machine. Keeping one copy means the local result cannot drift
 * from the required check.
 *
 * `evaluateChangelogGate` is a mirror of the gate in
 * `.github/workflows/changelog-unified.yml`, not a shared copy: that required
 * check keeps its own logic. A differential test runs the workflow's own script
 * and this function over the same inputs and fails on any difference in outcome,
 * so the two cannot drift apart unnoticed.
 */

/** The exact line `renderSkeleton` writes; only this line counts as unfinished. */
export const SKELETON_MARKER = 'TODO: replace with content for this PR, or N/A.';

/** Change types for which the `meta:no-changelog` label is refused. */
export const RESTRICTED_TYPES = [
  'type:feature',
  'type:bug',
  'type:performance',
  'type:security',
  'type:release',
  'type:hotfix',
];

/** Level-2 headings of a template, in order. */
export function requiredSections(template) {
  return [...template.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
}

/** Map of lower-cased level-2 heading to the lines beneath it. */
export function splitSections(text) {
  const sections = {};
  let current = null;
  for (const line of text.split('\n')) {
    const match = line.match(/^## (.+)$/);
    if (match) {
      current = match[1].trim().toLowerCase();
      sections[current] = [];
    } else if (current) {
      sections[current].push(line);
    }
  }
  return sections;
}

/** Text with HTML comments and whitespace runs removed. */
export function normalize(text) {
  return text
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Compare a pull request body with the routed template.
 *
 * `missing` lists template headings absent from the body. `empty` lists
 * sections that are blank or an unchanged copy of the template text. `todo`
 * lists sections that still contain a TODO marker; the required check accepts
 * those, so only the local preflight reports them as failures.
 */
export function checkPrBody({ template, body }) {
  const required = requiredSections(template);
  const lower = body.toLowerCase();
  const missing = required.filter((h) => !lower.includes(`## ${h.toLowerCase()}`));
  if (missing.length > 0) {
    return { required, missing, empty: [], todo: [] };
  }
  const bodySections = splitSections(body);
  const templateSections = splitSections(template);
  const empty = required.filter((h) => {
    const key = h.toLowerCase();
    const submitted = normalize((bodySections[key] || []).join('\n'));
    const templateDefault = normalize((templateSections[key] || []).join('\n'));
    return submitted.length === 0 || submitted === templateDefault;
  });
  const todo = required.filter((h) =>
    (bodySections[h.toLowerCase()] || []).some((line) => line.trim() === SKELETON_MARKER)
  );
  return { required, missing, empty, todo };
}

/** The failure text the required check reports, or null when the body passes. */
export function bodyFailureMessage({ templateName, result }) {
  const templateFile = `.github/PULL_REQUEST_TEMPLATE/${templateName}.md`;
  if (result.missing.length > 0) {
    return (
      `PR body is missing ${result.missing.length} section(s) from ${templateName}.md: ` +
      result.missing.map((h) => `"## ${h}"`).join(', ') +
      `. Copy the template sections into the PR body (see ${templateFile}).`
    );
  }
  if (result.empty.length > 0) {
    return (
      `PR body has ${result.empty.length} empty or unmodified section(s) from ${templateName}.md: ` +
      result.empty.map((h) => `"## ${h}"`).join(', ') +
      '. Fill each section with PR-specific content (or write N/A); an unchanged copy of the template text does not count.'
    );
  }
  return null;
}

/** Whether a path is a Jest test file, by the patterns in `.jest.config.cjs`. */
export function isTestFile(file) {
  return /(^|\/)(tests|__tests__)\/.+\.test\.(js|ts|mjs|cjs)$/.test(file);
}

/** A starting body: every template heading with a marker line to replace. */
export function renderSkeleton(template) {
  return requiredSections(template)
    .map((h) => `## ${h}\n\n${SKELETON_MARKER}\n`)
    .join('\n');
}

const slug = (login) => login.replace(/^app\//, '').replace(/\[bot\]$/, '');

/**
 * Decide the changelog gate for a pull request, in the same order as
 * `.github/workflows/changelog-unified.yml`.
 *
 * `outcome` is `fail`, `validate` (the diff contains the root CHANGELOG.md, so
 * its entries are validated) or `skip` (no changelog requirement). `changed` is
 * the listed changed paths and `totalChanged` the pull request's own count;
 * when fewer paths were listed than changed, the docs-only exemption does not
 * apply, because an unlisted file might be code.
 */
export function evaluateChangelogGate({ changed, totalChanged, labels = [], author = '' }) {
  const has = (name) => labels.includes(name);
  if (['dependabot', 'renovate', 'lightspeed-docs-bot'].includes(slug(author))) {
    return { outcome: 'skip', reason: 'Automated author is exempt.' };
  }
  if (has('meta:needs-changelog') && has('meta:no-changelog')) {
    return {
      outcome: 'fail',
      reason: 'PR cannot include both meta:needs-changelog and meta:no-changelog.',
    };
  }
  if (has('meta:no-changelog') && labels.some((l) => RESTRICTED_TYPES.includes(l))) {
    return {
      outcome: 'fail',
      reason: 'meta:no-changelog is not allowed for high-impact release-related change types.',
    };
  }
  if (changed.includes('CHANGELOG.md')) {
    return {
      outcome: 'validate',
      reason: 'CHANGELOG.md is in the diff (its entries are then validated).',
    };
  }
  const listComplete = changed.length >= (totalChanged ?? changed.length);
  if (
    listComplete &&
    changed.length > 0 &&
    changed.every((f) => f.startsWith('docs/') || f.endsWith('.md'))
  ) {
    return { outcome: 'skip', reason: 'Docs-only diff; no changelog entry required.' };
  }
  if (has('meta:no-changelog')) {
    return { outcome: 'skip', reason: 'meta:no-changelog label present.' };
  }
  return {
    outcome: 'fail',
    reason: 'PR requires a CHANGELOG.md update or the meta:no-changelog label.',
  };
}

/** `evaluateChangelogGate` reduced to `pass` or `fail`, for the preflight. */
export function predictChangelogGate(input) {
  const { outcome, reason } = evaluateChangelogGate(input);
  return { outcome: outcome === 'fail' ? 'fail' : 'pass', reason };
}
