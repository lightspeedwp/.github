const { describe, it } = require('node:test');
const { strict: assert } = require('node:assert');
const validator = require('../changelogValidator.cjs');
const patternEngine = require('../patternEngine.cjs');

// The validator is a rule engine: validateEntry(entry) loads .github/changelog-rules.yml and
// returns { metadata, validation: { ruleResults: [{ ruleId, status, ... }] } }. These tests use
// the real rules file, so they also catch a rule that cannot compile.

const validEntry = {
  id: 'entry-1',
  category: 'feature',
  title: 'Pull Request Preflight',
  description: 'Checks a pull request before it is opened.',
  prNumber: 123,
  prLink: 'https://github.com/lightspeedwp/.github/pull/123',
};

/**
 * Validate an entry and index the rule results by rule id.
 * @param {object} entry - Changelog entry to validate
 * @returns {{ result: object, status: Record<string, string> }} Full result and status per rule id
 */
function run(entry) {
  const result = validator.validateEntry(entry);
  const status = Object.fromEntries(
    result.validation.ruleResults.map((rule) => [rule.ruleId, rule.status])
  );
  return { result, status };
}

describe('patternEngine.compilePatterns()', () => {
  it('compiles an emoji range written with astral characters in unicode mode', () => {
    const [compiled] = patternEngine.compilePatterns([{ regex: '[🀀-🿿]' }]);

    assert.ok(compiled.regex.flags.includes('u'));
    assert.equal(compiled.regex.test('ship it 🚀'), true);
  });

  it('uses unicode mode for an astral pattern that compiles both ways, so it matches whole characters', () => {
    // Without `u` the quantifier binds to the low surrogate only, so '🚀🚀' would not match.
    const [quantified] = patternEngine.compilePatterns([{ regex: '^🚀+$' }]);
    const [anchored] = patternEngine.compilePatterns([{ regex: '^[🚀]$' }]);

    assert.equal(quantified.regex.test('🚀🚀'), true);
    assert.equal(anchored.regex.test('🚀'), true);
  });

  it('falls back to the flags as written when unicode mode rejects the pattern', () => {
    // Literal braces are valid without `u` and a syntax error with it.
    const [compiled] = patternEngine.compilePatterns([{ regex: '🚀|{emoji}' }]);

    assert.equal(compiled.regex.flags, '');
    assert.equal(compiled.regex.test('ship it 🚀'), true);
  });

  it('leaves a pattern with no astral characters alone', () => {
    const [compiled] = patternEngine.compilePatterns([{ regex: 'abc', flags: 'i' }]);

    assert.equal(compiled.regex.flags, 'i');
  });

  it('still rejects a pattern that is invalid in every mode', () => {
    assert.throws(() => patternEngine.compilePatterns([{ regex: '(' }]), /Invalid regex pattern/);
    assert.throws(
      () => patternEngine.compilePatterns([{ regex: '[🀀-🿿]|{x}' }]),
      /Invalid regex pattern/
    );
  });
});

describe('changelogValidator', () => {
  describe('validateEntry()', () => {
    it('returns metadata and one result per executed rule', () => {
      const { result } = run(validEntry);

      assert.equal(typeof result.metadata.timestamp, 'string');
      assert.ok(result.validation.ruleResults.length > 0);
      for (const rule of result.validation.ruleResults) {
        assert.ok(['passed', 'failed'].includes(rule.status), `${rule.ruleId}: ${rule.status}`);
      }
    });

    it('runs every rule, including the emoji rule R013', () => {
      const { status } = run(validEntry);

      assert.equal(status.R013, 'passed');
    });

    it('fails R003 when the title is empty', () => {
      const { status } = run({ ...validEntry, title: '' });

      assert.equal(status.R003, 'failed');
      assert.equal(status.R004, 'passed');
    });

    it('fails R013 when the title contains an emoji', () => {
      const { status } = run({ ...validEntry, title: 'Pull Request Preflight 🚀' });

      assert.equal(status.R013, 'failed');
    });

    it('fails R013 when the description contains an emoji', () => {
      const { status } = run({
        ...validEntry,
        description: 'Checks a pull request before it is opened 🎉',
      });

      assert.equal(status.R013, 'failed');
    });
  });
});
