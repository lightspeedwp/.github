const { describe, it } = require('node:test');
const { strict: assert } = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
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

describe('patternEngine empty matches', () => {
  for (const flags of ['g', 'gu']) {
    it(`visits each code point boundary once with ${flags}`, ({ mock }) => {
      const patterns = patternEngine.compilePatterns([{ regex: '(?=)', flags }]);
      const { regex } = patterns[0];
      const exec = regex.exec;
      // Bound the number of exec calls so a stalled loop fails the test.
      const boundedExec = mock.method(regex, 'exec', (text) => {
        assert.ok(boundedExec.mock.callCount() < 4);
        return exec.call(regex, text);
      });

      assert.deepEqual(
        patternEngine.applyPatterns('a🚀', patterns).map((match) => match.index),
        [0, 1, 3]
      );
      boundedExec.mock.resetCalls();
      assert.equal(patternEngine.countMatches('a🚀', patterns), 3);
    });
  }
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

  describe('a rule that cannot run (GIT-3019)', () => {
    // A rules file with one rule whose pattern cannot compile and one rule id the validator
    // does not implement. Both are enabled, so both must run.
    const rulesYaml = [
      'metadata:',
      "  version: '1.0'",
      '  total_rules: 2',
      'rules:',
      '  - id: R013',
      '    name: no_emoji',
      "    version: '1.0'",
      '    enabled: true',
      '    rule_type: content',
      '    severity: warning',
      '    priority: 23',
      '    description: Avoid emoji',
      '    patterns:',
      "      - regex: '('",
      '        description: Cannot compile',
      '  - id: R099',
      '    name: not_implemented',
      "    version: '1.0'",
      '    enabled: true',
      '    rule_type: content',
      '    severity: warning',
      '    priority: 99',
      '    description: Enabled but never implemented',
      '',
    ].join('\n');

    /**
     * Validate an entry against the broken rules file, then remove the temporary file.
     * @returns {{ byId: Record<string, object>, validation: object }} Results by rule id
     */
    function runBroken() {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'changelog-rules-'));
      const rulesPath = path.join(dir, 'rules.yml');
      fs.writeFileSync(rulesPath, rulesYaml);
      try {
        const { validation } = validator.validate(validEntry, rulesPath);
        const byId = Object.fromEntries(validation.ruleResults.map((rule) => [rule.ruleId, rule]));
        return { byId, validation };
      } finally {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    }

    it('fails a rule whose pattern cannot compile, as an error naming the rule and the cause', () => {
      const { byId } = runBroken();

      assert.equal(byId.R013.status, 'failed');
      assert.equal(byId.R013.severity, 'error');
      assert.equal(byId.R013.details.ruleError, true);
      assert.match(byId.R013.message, /Rule R013 \(no_emoji\) could not run/);
      assert.match(byId.R013.message, /Invalid regex pattern/);
    });

    it('fails an enabled rule that has no implementation', () => {
      const { byId } = runBroken();

      assert.equal(byId.R099.status, 'failed');
      assert.equal(byId.R099.severity, 'error');
      assert.match(byId.R099.message, /enabled but has no implementation/);
    });

    it('counts both as errors, so the score drops and the entry is not passing', () => {
      const { validation } = runBroken();

      assert.equal(validation.summary.errors, 2);
      assert.equal(validation.summary.skipped, 0);
      assert.equal(validation.complianceScore, 50);
      assert.notEqual(validation.complianceStatus, 'passing');
    });

    it('keeps a not-applicable rule as skipped', () => {
      // R020 has nothing to check without a category; R002 already reports that.
      const { status } = run({ ...validEntry, category: undefined });

      assert.equal(status.R020, 'skipped');
      assert.equal(status.R002, 'failed');
    });

    it('runs every rule in the real rules file, none as a rule error', () => {
      const { result } = run(validEntry);
      const ruleErrors = result.validation.ruleResults.filter((rule) => rule.details?.ruleError);

      assert.deepEqual(ruleErrors, []);
      assert.equal(result.validation.summary.skipped, 0);
    });
  });

  describe('changelog-validator.js exit code (GIT-3019)', () => {
    const cli = path.join(__dirname, '..', '..', 'changelog-validator.js');

    /**
     * Run the command-line validator on an entry and return its exit status.
     * @param {string} [yaml] - YAML for the entry; omit to test a missing file
     * @returns {number} The process exit status
     */
    function exitCodeFor(yaml) {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'changelog-entry-'));
      const entryPath = path.join(dir, 'entry.yml');
      if (yaml !== undefined) {
        fs.writeFileSync(entryPath, yaml);
      }
      try {
        return spawnSync(process.execPath, [cli, 'validate', '--entry', entryPath], {
          encoding: 'utf8',
        }).status;
      } finally {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    }

    it('exits 0 for a passing entry', () => {
      const yaml = [
        'id: e1',
        'category: feature',
        'title: Pull Request Preflight',
        'description: Checks a pull request before it is opened.',
        'prNumber: 123',
        'prLink: https://github.com/lightspeedwp/.github/pull/123',
        '',
      ].join('\n');

      assert.equal(exitCodeFor(yaml), 0);
    });

    it('exits 1 for an entry that fails validation', () => {
      assert.equal(exitCodeFor('id: e2\ndescription: No title or category\n'), 1);
    });

    it('exits 1, not 2, for an entry file that is YAML null', () => {
      // `~` parses to null, a non-object that R006 reports, so it is a validation failure.
      assert.equal(exitCodeFor('~\n'), 1);
    });

    it('exits 2 for a missing file, an empty file or invalid YAML', () => {
      // js-yaml refuses an empty document ("expected a document"), so an empty file is invalid
      // YAML, an operational error, not a null entry.
      assert.equal(exitCodeFor(), 2);
      assert.equal(exitCodeFor(''), 2);
      assert.equal(exitCodeFor('title: [\n'), 2);
    });

    it('exits 0 when only a warning rule fails, as the rules file calls warnings non-blocking', () => {
      // No PR reference fails R009, a warning; no error rule fails.
      const yaml = [
        'id: e3',
        'category: feature',
        'title: Pull Request Preflight',
        'description: Checks a pull request before it is opened.',
        '',
      ].join('\n');

      assert.equal(exitCodeFor(yaml), 0);
    });

    it('keeps the executable bit the package bin entry needs', { skip: process.platform === 'win32' }, () => {
      assert.ok(fs.statSync(cli).mode & 0o111, 'changelog-validator.js must stay executable');
    });
  });

  describe('input the validator cannot trust (GIT-3019)', () => {
    for (const [id, ruleType, name] of [
      ['R003', 'structure', 'has_title'],
      ['R006', 'format', 'proper_formatting'],
    ]) {
      it(`rejects malformed entries when ${id} is the only enabled rule`, (t) => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'changelog-rules-'));
        t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
        const rulesPath = path.join(dir, 'rules.yml');
        fs.writeFileSync(rulesPath, JSON.stringify({
          metadata: { version: '1.0', total_rules: 1 },
          rules: [{
            id,
            name,
            version: '1.0',
            enabled: true,
            rule_type: ruleType,
            severity: 'error',
            description: name,
          }],
        }));

        for (const entry of [null, 'text']) {
          const { validation } = validator.validate(entry, rulesPath);
          assert.equal(validation.summary.errors, 1);
          assert.equal(validation.ruleResults[0].ruleId, id);
          assert.equal(validation.ruleResults[0].message, 'Entry is not a valid object');
        }
      });
    }

    it('reports a missing or non-object entry through R006 alone, not as one rule error per rule', () => {
      for (const bad of [null, undefined, 'text', 42]) {
        const { validation } = validator.validateEntry(bad);
        const byId = Object.fromEntries(validation.ruleResults.map((rule) => [rule.ruleId, rule]));

        assert.equal(byId.R006.status, 'failed', `R006 for ${JSON.stringify(bad)}`);
        assert.equal(validation.summary.errors, 1, `errors for ${JSON.stringify(bad)}`);
        assert.deepEqual(
          validation.ruleResults.filter((rule) => rule.details?.ruleError),
          []
        );
      }
    });

    it('lets the rules judge an array entry, which is an object with none of the fields', () => {
      const { validation } = validator.validateEntry([]);

      assert.ok(validation.summary.errors > 0);
      assert.deepEqual(
        validation.ruleResults.filter((rule) => rule.details?.ruleError),
        []
      );
    });

    it('fails a pattern rule whose patterns are missing, so it cannot pass every entry', () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'changelog-rules-'));
      const rulesPath = path.join(dir, 'rules.yml');
      fs.writeFileSync(
        rulesPath,
        [
          'metadata:',
          "  version: '1.0'",
          '  total_rules: 1',
          'rules:',
          '  - id: R013',
          '    name: no_emoji',
          "    version: '1.0'",
          '    enabled: true',
          '    rule_type: content',
          '    severity: warning',
          '    description: Avoid emoji',
          '',
        ].join('\n')
      );
      try {
        const { validation } = validator.validate(validEntry, rulesPath);
        const [rule] = validation.ruleResults;

        assert.equal(rule.status, 'failed');
        assert.equal(rule.severity, 'error');
        assert.match(rule.message, /has no patterns to check/);
      } finally {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    });
  });
});
