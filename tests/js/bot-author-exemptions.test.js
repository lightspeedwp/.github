/**
 * Contract test for the bot-author exemptions in the pull request workflows.
 *
 * The defect these guard against is subtle: a GitHub App's identity arrives in
 * two shapes. The webhook payload's `pull_request.user.login` is
 * "app-slug[bot]"; GraphQL's `author.login` is "app/app-slug". A literal
 * comparison written against the wrong shape never matches, and the exemption
 * it guards becomes dead code that still reads as if it works.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import YAML from 'yaml';

const repoRoot = path.resolve(__dirname, '../..');
const changelogWorkflow = '.github/workflows/changelog-unified.yml';

/**
 * The two shapes GitHub uses for a GitHub App's login, taken from the live API
 * rather than assumed. REST/webhook form first, then the GraphQL form.
 */
const REST_FORM = {
  dependabot: 'dependabot[bot]',
  docsBot: 'lightspeed-docs-bot[bot]',
};
const GRAPHQL_FORM = {
  dependabot: 'app/dependabot',
  docsBot: 'app/lightspeed-docs-bot',
};

function workflow(relativePath) {
  return YAML.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

/**
 * Pull the inline github-script body out of a named step.
 * @param {object} doc - Parsed workflow.
 * @param {string} job - Job name.
 * @param {string} stepName - Step name.
 * @returns {string} The step's script source.
 */
function stepScript(doc, job, stepName) {
  const step = (doc.jobs[job]?.steps || []).find((candidate) => candidate.name === stepName);
  expect(step).toBeDefined();
  return step.with.script;
}

const changelog = workflow(changelogWorkflow);
const gateScript = stepScript(changelog, 'require-gate', 'Require changelog update or skip label');

/**
 * Extract the `slug` arrow function the gate declares, so its behaviour can be
 * executed rather than pattern-matched.
 * @returns {Function} The declared normaliser.
 */
function extractSlug() {
  const declaration = gateScript.match(/const slug = \(login\) => ([^\n;]+);/);
  expect(declaration).not.toBeNull();
  return vm.runInNewContext(`(login) => (${declaration[1]})`);
}

describe('changelog gate bot exemptions', () => {
  it('declares a slug normaliser so the exemption is shape-independent', () => {
    const slug = extractSlug();
    for (const form of [REST_FORM, GRAPHQL_FORM]) {
      expect(slug(form.dependabot)).toBe('dependabot');
      expect(slug(form.docsBot)).toBe('lightspeed-docs-bot');
    }
  });

  it('matches both exempted bots in either shape', () => {
    const slug = extractSlug();
    const exempted = new Set(
      [...gateScript.matchAll(/slug\(author\) === "([^"]+)"/g)].map((match) => match[1])
    );
    expect(exempted).toStrictEqual(new Set(['dependabot', 'lightspeed-docs-bot']));

    for (const [form, label] of [
      [REST_FORM, 'REST/webhook'],
      [GRAPHQL_FORM, 'GraphQL'],
    ]) {
      expect([label, exempted.has(slug(form.dependabot))]).toStrictEqual([label, true]);
      expect([label, exempted.has(slug(form.docsBot))]).toStrictEqual([label, true]);
    }
  });

  it('does not exempt a human author', () => {
    const slug = extractSlug();
    const exempted = new Set(
      [...gateScript.matchAll(/slug\(author\) === "([^"]+)"/g)].map((match) => match[1])
    );
    // Near-miss slugs and ordinary accounts must not be swept in. The bare
    // "dependabot" and "lightspeed-docs-bot" are deliberately absent from this
    // list: the bare slug is the canonical form both shapes reduce to, and
    // both names are reserved so a human account cannot hold them.
    for (const login of [
      'some-human',
      'app/renovate',
      'dependabot-preview',
      'lightspeed-docs-bot-fork',
      'dependabot[bot]-extra',
    ]) {
      expect([login, exempted.has(slug(login))]).toStrictEqual([login, false]);
    }
  });

  it('no longer compares against the GraphQL-only app/ form', () => {
    // The literal that caused the dead exemption. Its presence would mean the
    // normaliser is defined but bypassed.
    expect(gateScript).not.toContain('"app/lightspeed-docs-bot"');
    expect(gateScript).not.toContain('"app/dependabot"');
    expect(gateScript).not.toContain('author === "app/');
  });

  it('still fails closed for contradictory labels and restricted types', () => {
    expect(gateScript).toContain(
      'PR cannot include both meta:needs-changelog and meta:no-changelog.'
    );
    expect(gateScript).toContain(
      'meta:no-changelog is not allowed for high-impact release-related change types.'
    );
  });
});

describe('bot-author handling across the pull request workflows', () => {
  /**
   * These two were already correct; the assertions stop a future edit from
   * silently reintroducing a shape mismatch while fixing a third workflow.
   */
  const alreadyCorrect = [
    {
      workflow: '.github/workflows/pr-template-routing.yml',
      // This one deliberately uses the array form rather than a normaliser.
      assert: (source) => {
        expect(source).toContain("'dependabot[bot]'");
        expect(source).toContain("'lightspeed-docs-bot[bot]'");
        expect(source).not.toContain("'app/lightspeed-docs-bot'");
      },
    },
    {
      workflow: '.github/workflows/ai-feedback-validation.yml',
      assert: (source) => {
        expect(source).toContain("'dependabot[bot]'");
        expect(source).toContain("'lightspeed-docs-bot[bot]'");
        expect(source).not.toContain("'app/lightspeed-docs-bot'");
      },
    },
  ];

  it.each(alreadyCorrect)('$workflow uses the webhook login form', ({ workflow: file, assert }) => {
    assert(fs.readFileSync(path.join(repoRoot, file), 'utf8'));
  });
});
