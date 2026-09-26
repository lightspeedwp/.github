/**
 * Guards the two configuration invariants the Linear Review Platform
 * integration depends on. Both were broken once already, silently, which is why
 * they are asserted here rather than left to a code review to catch.
 *
 * 1. `.gitattributes` must give every file exactly ONE `review-*` category.
 *    Git resolves each attribute name independently and the last matching rule
 *    wins per name, so a file carrying two categories is still counted as
 *    implementation by Linear and the implementation/test/documentation split
 *    stops working. The first attempt here put the `* review-implementation`
 *    catch-all last, which tagged every document as both documentation and
 *    implementation.
 *
 * 2. The workflow must not default the `onBehalfOf` agent. On a
 *    `pull_request` trigger no agent is running and the comment is written by
 *    GitHub Actions; defaulting to `claude` showed a false author in Linear,
 *    which defeats the entire point of agent attribution. The first attempt
 *    here did exactly that.
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const CATEGORIES = [
  'review-implementation',
  'review-test',
  'review-documentation',
  'review-generated',
  'review-agent-guidance',
  'review-localization',
  'review-assets',
];

const WORKFLOW_PATH = '.github/workflows/linear-review-platform.yml';

/**
 * Read the resolved `review-*` attributes for a repository-relative path.
 *
 * `git check-attr` is resolved against the working tree, so a synthetic path
 * that does not exist on disk still exercises the pattern matching.
 *
 * @param {string} filePath - Repository-relative path.
 * @returns {string[]} The categories that resolve to `set`.
 */
function categoriesFor(filePath) {
  const output = execFileSync('git', ['check-attr', ...CATEGORIES, '--', filePath], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });

  return output
    .trim()
    .split('\n')
    .map((line) => {
      // `<path>: <attribute>: <value>` -- match from the right so a path
      // containing a colon cannot shift the attribute name.
      const match = line.match(/^.*:\s+(\S+):\s+(\S+)$/);
      return match && match[2] === 'set' ? match[1] : null;
    })
    .filter(Boolean);
}

describe('.gitattributes review categories', () => {
  const expected = [
    ['package.json', 'review-implementation'],
    ['scripts/automation/linear-review-extension.cjs', 'review-implementation'],
    ['.github/workflows/linear-review-platform.yml', 'review-implementation'],
    ['lib/hooks/install.js', 'review-implementation'],
    ['scripts/automation/__tests__/linear-review-extension.test.js', 'review-test'],
    ['__tests__/fixtures/sample.test.js', 'review-test'],
    ['skills/pr-review/scripts/__tests__/x.test.js', 'review-test'],
    ['docs/LINEAR_INTEGRATION.md', 'review-documentation'],
    ['CHANGELOG.md', 'review-documentation'],
    ['website/README.md', 'review-documentation'],
    ['AGENTS.md', 'review-agent-guidance'],
    ['CLAUDE.md', 'review-agent-guidance'],
    ['skills/linear-review-attribution/SKILL.md', 'review-agent-guidance'],
    ['skills/security-review/references/x.md', 'review-agent-guidance'],
    ['instructions/languages.instructions.md', 'review-agent-guidance'],
    ['agents/reviewer-agent/agent.md', 'review-agent-guidance'],
    ['prompts/prompts.md', 'review-agent-guidance'],
    ['coverage/lcov.info', 'review-generated'],
    ['package-lock.json', 'review-generated'],
    ['.github/reports/metrics/x.json', 'review-generated'],
    ['assets/logo.png', 'review-assets'],
    ['plugins/foo/locales/en.json', 'review-localization'],
    ['plugins/foo/languages/fr.md', 'review-localization'],
    ['plugins/foo/i18n/messages.po', 'review-localization'],
  ];

  test.each(expected)('%s resolves to exactly %s', (filePath, category) => {
    // Exclusivity is the actual invariant: one category set, all others unset.
    expect(categoriesFor(filePath)).toEqual([category]);
  });

  test('the text=auto baseline is not displaced by the review block', () => {
    const contents = fs.readFileSync(path.join(REPO_ROOT, '.gitattributes'), 'utf8');
    const [firstRule] = contents.split('\n').filter((line) => line.trim() && !line.startsWith('#'));

    expect(firstRule).toBe('* text=auto');
  });

  test('every category Linear documents is recognised somewhere in the file', () => {
    const contents = fs.readFileSync(path.join(REPO_ROOT, '.gitattributes'), 'utf8');

    for (const category of CATEGORIES) {
      expect(contents).toMatch(new RegExp(`${category}\\b`));
    }
  });
});

describe(`${WORKFLOW_PATH} attribution honesty`, () => {
  const workflow = fs.readFileSync(path.join(REPO_ROOT, WORKFLOW_PATH), 'utf8');

  test('does not hardcode a default onBehalfOf agent', () => {
    // Any `|| 'claude'`-style fallback would misattribute the workflow's own
    // comment to Claude on a pull_request trigger.
    expect(workflow).not.toMatch(/\|\|\s*'(claude|codex|opencode|pi|linear)'/);
  });

  test('resolves an unset agent input to undefined rather than a named agent', () => {
    expect(workflow).toContain('const agent = process.env.AGENT || undefined;');
  });

  test('pins every action to a full commit SHA', () => {
    // Only real `uses:` steps count. The usage example in the header comment
    // deliberately contains an `@<commit-sha>` placeholder.
    const steps = workflow
      .split('\n')
      .filter((line) => !line.trim().startsWith('#'))
      .join('\n');
    const uses = [...steps.matchAll(/uses:\s*(\S+)/g)].map((match) => match[1]);

    expect(uses.length).toBeGreaterThan(0);
    for (const use of uses) {
      if (use.startsWith('./')) {
        continue;
      }
      expect(use).toMatch(/@[0-9a-f]{40}$/);
    }
  });
});
