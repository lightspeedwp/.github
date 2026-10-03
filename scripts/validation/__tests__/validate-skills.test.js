/**
 * Tests for the whole-repository skill and agent validator.
 *
 * Each rule is proved twice: a good document passes, a bad one fails with the
 * rule named. The fixture trees are temporary, so the repository's own fixtures
 * are left alone.
 *
 * Rule sources (read 2026-10-01):
 * - https://agentskills.io/specification
 * - https://github.com/agentskills/agentskills/blob/main/skills-ref/src/skills_ref/validator.py
 * - https://code.claude.com/docs/en/skills
 * - https://code.claude.com/docs/en/sub-agents
 * - https://agents.md
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const yaml = require('js-yaml');

const SCRIPT = path.join(__dirname, '..', 'validate-skills.js');
const spec = require('../lib/skills-spec.js');

/** Build a temporary repository tree from a path-to-content map. */
function makeTree(files) {
  const tree = fs.mkdtempSync(path.join(os.tmpdir(), 'validate-skills-'));
  for (const [relative, content] of Object.entries(files)) {
    const target = path.join(tree, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
  return tree;
}

/** Run the validator against a tree. */
function run(tree, ...argv) {
  try {
    const stdout = execFileSync(process.execPath, [SCRIPT, ...argv], {
      cwd: tree,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { status: 0, stdout };
  } catch (error) {
    return {
      status: error.status ?? 1,
      stdout: error.stdout ?? '',
      stderr: error.stderr ?? '',
    };
  }
}

/** Run the validator on one document and return its combined output. */
function check(relative, content, ...argv) {
  const tree = makeTree({ [relative]: content });
  try {
    const result = run(tree, ...argv);
    return { status: result.status, output: result.stdout + result.stderr };
  } finally {
    fs.rmSync(tree, { recursive: true, force: true });
  }
}

/** A conforming open-specification skill. */
const GOOD_SKILL = `---
name: example-skill
description: Does a thing. Use when you need the thing done.
---

# Example Skill

Follow these steps to do the thing.
`;

describe('per-class field sets', () => {
  it('accepts the six specification fields on an open-spec skill', () => {
    const result = check('skills/example-skill/SKILL.md', GOOD_SKILL);
    expect(result.status).toBe(0);
  });

  it('rejects a top-level version on an open-spec skill', () => {
    const result = check(
      'skills/example-skill/SKILL.md',
      '---\nname: example-skill\ndescription: Does a thing.\nversion: 1.0.0\n---\n\nDo it.\n'
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('[closed-field-set]');
    expect(result.output).toContain('metadata.version');
  });

  it('accepts Claude Code platform fields on a Claude Code skill', () => {
    const result = check(
      '.claude/skills/example-skill/SKILL.md',
      '---\nname: example-skill\ndescription: Does a thing.\nargument-hint: "[x]"\n' +
        'disable-model-invocation: true\nuser-invocable: true\n---\n\nDo the thing.\n'
    );
    expect(result.status).toBe(0);
  });

  it('rejects the same fields on an open-spec skill, so the exception is per class', () => {
    const result = check(
      'skills/example-skill/SKILL.md',
      '---\nname: example-skill\ndescription: Does a thing.\ndisable-model-invocation: true\n---\n\nDo it.\n'
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('[closed-field-set]');
  });

  it('accepts the subagent fields on a subagent definition', () => {
    const result = check(
      'agents/example.agent.md',
      '---\nname: example\ndescription: Reviews things\ntools: Read, Grep\nmodel: sonnet\n' +
        'file_type: agent\ntitle: Example Agent\nlast_updated: 2026-10-01\n---\n\nDo the thing.\n'
    );
    expect(result.status).toBe(0);
  });

  it('rejects a skill-only field on a subagent definition', () => {
    const result = check(
      'agents/example.agent.md',
      '---\nname: example\ndescription: Reviews things\nargument-hint: "[x]"\n---\n\nDo it.\n'
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('[closed-field-set]');
  });

  it('does not apply the skill character rules to a subagent name', () => {
    // Upstream imposes no character set on a subagent identifier. The
    // frontmatter is complete so the assertion is about character rules alone.
    const result = check(
      'agents/example.agent.md',
      '---\nname: Example Reviewer\ndescription: Reviews things\nfile_type: agent\n' +
        'title: Example\nlast_updated: "2026-10-02"\n---\n\nDo it.\n'
    );
    expect(result.status).toBe(0);
  });

  it('rejects a colon in a subagent name, which Claude Code reserves', () => {
    const result = check(
      'agents/example.agent.md',
      '---\nname: plugin:reviewer\ndescription: Reviews things\n---\n\nDo it.\n'
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('[name]');
  });

  it('accepts an AGENTS.md with no frontmatter', () => {
    const result = check('agents/example/AGENTS.md', '# Guide\n\n## Build\n\nRun it.\n');
    expect(result.status).toBe(0);
  });

  it('accepts the repository document frontmatter on an AGENTS.md', () => {
    const result = check(
      'agents/example/AGENTS.md',
      '---\ntitle: Example\nversion: "v1.0"\nlast_updated: "2026-10-01"\nfile_type: agents-index\n' +
        'maintainer: LightSpeed Team\n---\n\n# Guide\n\n## Build\n\nRun it.\n'
    );
    expect(result.status).toBe(0);
  });

  it('does not apply the skill directory-name rule to an AGENTS.md', () => {
    const result = check(
      'AGENTS.md',
      '---\ntitle: Root\nfile_type: documentation\nlast_updated: "2026-10-02"\n' +
        '---\n\n# Guide\n\n## Build\n\nRun it.\n'
    );
    expect(result.status).toBe(0);
  });
});

describe('skill rules', () => {
  it('fails a frontmatter-only skill (#3707)', () => {
    const result = check(
      'skills/example-skill/SKILL.md',
      '---\nname: example-skill\ndescription: Does a thing.\n---\n'
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('[body]');
  });

  it('fails a body of only a heading and the generated footer', () => {
    const result = check(
      'skills/example-skill/SKILL.md',
      '---\nname: example-skill\ndescription: Does a thing.\n---\n\n# Title\n\n_Built by LightSpeedWP_\n'
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('[body]');
  });

  it('fails a name that does not match its directory', () => {
    const result = check('skills/other-directory/SKILL.md', GOOD_SKILL);
    expect(result.status).toBe(1);
    expect(result.output).toContain('[name]');
    expect(result.output).toContain('does not match its directory');
  });

  it('fails a missing description', () => {
    const result = check(
      'skills/example-skill/SKILL.md',
      '---\nname: example-skill\n---\n\nDo it.\n'
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('[required-fields]');
    expect(result.output).toContain('`description`');
  });

  it('fails an over-long description', () => {
    const result = check(
      'skills/example-skill/SKILL.md',
      `---\nname: example-skill\ndescription: ${'a'.repeat(1025)}\n---\n\nDo it.\n`
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('maximum is 1024');
  });

  it('fails a non-string metadata value', () => {
    const result = check(
      'skills/example-skill/SKILL.md',
      '---\nname: example-skill\ndescription: Does a thing.\nmetadata:\n  tags:\n    - a\n    - b\n---\n\nDo it.\n'
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('[metadata]');
  });

  it('fails a SKILL.md with no frontmatter at all', () => {
    const result = check('skills/example-skill/SKILL.md', '# Example Skill\n\nDo the thing.\n');
    expect(result.status).toBe(1);
    expect(result.output).toContain('[frontmatter]');
  });

  it('fails malformed YAML and says so', () => {
    const result = check('skills/example-skill/SKILL.md', '---\nname: [unclosed\n---\n\nDo it.\n');
    expect(result.status).toBe(1);
    expect(result.output).toContain('[frontmatter]');
  });

  it('validates the skills nested inside a container directory', () => {
    const result = check(
      'skills/container/child-skill/SKILL.md',
      '---\nname: lightspeed-child\ndescription: Does a thing.\n---\n\nDo it.\n'
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('skills/container/child-skill/SKILL.md');
  });

  it('validates a plugin skill', () => {
    const result = check(
      'plugins/lightspeed-ops/skills/lightspeed-example/SKILL.md',
      '---\nname: lightspeed-example\ndescription: Does a thing.\n---\n\nDo it.\n'
    );
    expect(result.status).toBe(0);
  });

  it('fails a plugin skill whose version is not under metadata', () => {
    const result = check(
      'plugins/lightspeed-ops/skills/lightspeed-example/SKILL.md',
      '---\nname: lightspeed-example\ndescription: Does a thing.\nversion: 0.1.0\n---\n\nDo it.\n'
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('[closed-field-set]');
  });
});

describe('skills tree structure', () => {
  it('fails a directory with no SKILL.md', () => {
    const tree = makeTree({ 'skills/not-a-skill/README.md': '# Notes\n' });
    try {
      const result = run(tree);
      expect(result.status).toBe(1);
      expect(result.stdout + result.stderr).toContain('[structure]');
    } finally {
      fs.rmSync(tree, { recursive: true, force: true });
    }
  });

  it('fails a skills directory whose name breaks the pattern', () => {
    const tree = makeTree({
      'skills/Bad Name/SKILL.md':
        '---\nname: bad-name\ndescription: Does a thing.\n---\n\nDo it.\n',
    });
    try {
      const result = run(tree);
      expect(result.status).toBe(1);
      expect(result.stdout + result.stderr).toContain('[folder-name]');
    } finally {
      fs.rmSync(tree, { recursive: true, force: true });
    }
  });

  it('skips the _template-skill scaffold', () => {
    const result = check(
      'skills/_template-skill/SKILL.md',
      '---\nname: template-skill\ndescription: Replace me.\n---\n\n# Insert instructions below\n'
    );
    expect(result.status).toBe(0);
  });

  it('reports a vendored third-party plugin directory', () => {
    const tree = makeTree({
      'plugins/slack__slack/SKILL.md':
        '---\nname: slack\ndescription: Does a thing.\n---\n\nDo it.\n',
    });
    try {
      // The finding is recorded, so inspect the report rather than the gate.
      const result = run(tree, '--report');
      expect(result.status).toBe(0);
      const failing = run(tree);
      expect(failing.status).toBe(1);
      expect(failing.stdout + failing.stderr).toContain('[vendored-plugin]');
      expect(failing.stdout + failing.stderr).toContain('NEEDS-CHRIS');
    } finally {
      fs.rmSync(tree, { recursive: true, force: true });
    }
  });
});

describe('repository walk', () => {
  it('ignores test fixtures, which are non-conformant on purpose', () => {
    const result = check(
      'agents/__tests__/fixtures/bad.agent.md',
      '---\nname: Bad Name\ndescription: Has spaces\nargument-hint: "[x]"\n---\n\nDo it.\n'
    );
    expect(result.status).toBe(0);
  });

  it('checks AGENTS.md files', () => {
    const result = check('agents/example/AGENTS.md', '# Guide\n');
    expect(result.status).toBe(0);
  });

  it('reports the repository baseline', () => {
    const tree = makeTree({ 'skills/example-skill/SKILL.md': GOOD_SKILL });
    try {
      const result = run(tree, '--report');
      expect(result.status).toBe(0);
      expect(result.stdout).toContain('Per-class file counts');
      expect(result.stdout).toContain('open-spec-skill');
    } finally {
      fs.rmSync(tree, { recursive: true, force: true });
    }
  });

  it('fails a finding that is not in the baseline, and passes one that is', () => {
    const tree = makeTree({ 'skills/example-skill/SKILL.md': GOOD_SKILL });
    try {
      expect(run(tree).status).toBe(0);

      fs.writeFileSync(
        path.join(tree, 'skills/example-skill/SKILL.md'),
        '---\nname: example-skill\ndescription: Does a thing.\nversion: 1.0.0\n---\n\nDo it.\n'
      );
      const result = run(tree);
      expect(result.status).toBe(1);
      expect(result.stdout + result.stderr).toContain('not in the baseline');
    } finally {
      fs.rmSync(tree, { recursive: true, force: true });
    }
  });

  it('passes when a finding is recorded in the baseline', () => {
    const tree = makeTree({
      'skills/example-skill/SKILL.md':
        '---\nname: example-skill\ndescription: Does a thing.\nversion: 1.0.0\n---\n\nDo it.\n',
    });
    try {
      const failing = run(tree);
      expect(failing.status).toBe(1);

      // Record the finding in the tree's own baseline and the run passes.
      const baselineDirectory = path.join(tree, 'scripts', 'validation');
      fs.mkdirSync(baselineDirectory, { recursive: true });
      fs.copyFileSync(SCRIPT, path.join(baselineDirectory, 'validate-skills.js'));
      fs.mkdirSync(path.join(baselineDirectory, 'lib'), { recursive: true });
      fs.copyFileSync(
        path.join(__dirname, '..', 'lib', 'skills-spec.js'),
        path.join(baselineDirectory, 'lib', 'skills-spec.js')
      );
      fs.writeFileSync(
        path.join(baselineDirectory, 'skills-baseline.json'),
        // The key carries the offending field, so a second problem with a different
        // field in the same file is not covered by this entry.
        JSON.stringify({ findings: ['skills/example-skill/SKILL.md#closed-field-set#version'] })
      );
      const baselined = run(tree);
      expect(baselined.status).toBe(0);
      expect(baselined.stdout).toContain('match the checked-in baseline');
    } finally {
      fs.rmSync(tree, { recursive: true, force: true });
    }
  });

  it('counts a fixed baseline entry as progress rather than a failure', () => {
    const tree = makeTree({ 'skills/example-skill/SKILL.md': GOOD_SKILL });
    try {
      const baselineDirectory = path.join(tree, 'scripts', 'validation');
      fs.mkdirSync(path.join(baselineDirectory, 'lib'), { recursive: true });
      fs.copyFileSync(SCRIPT, path.join(baselineDirectory, 'validate-skills.js'));
      fs.copyFileSync(
        path.join(__dirname, '..', 'lib', 'skills-spec.js'),
        path.join(baselineDirectory, 'lib', 'skills-spec.js')
      );
      fs.writeFileSync(
        path.join(baselineDirectory, 'skills-baseline.json'),
        JSON.stringify({ findings: ['skills/gone/SKILL.md#name'] })
      );
      const result = run(tree);
      expect(result.status).toBe(0);
      expect(result.stdout).toContain('1 baseline entries now fixed');
    } finally {
      fs.rmSync(tree, { recursive: true, force: true });
    }
  });
});

describe('freshness metadata', () => {
  it('is off by default, so this pull request does not add 1,050 findings', () => {
    const result = check('skills/example-skill/SKILL.md', GOOD_SKILL);
    expect(result.status).toBe(0);
  });

  it('fails an absent last_reviewed when freshness is enforced', () => {
    const result = check('skills/example-skill/SKILL.md', GOOD_SKILL, '--freshness');
    expect(result.status).toBe(1);
    expect(result.output).toContain('[freshness]');
    expect(result.output).toContain('metadata.last_reviewed is absent');
  });

  it('fails a malformed last_reviewed', () => {
    const result = check(
      'skills/example-skill/SKILL.md',
      '---\nname: example-skill\ndescription: Does a thing.\nmetadata:\n  last_reviewed: "last Tuesday"\n---\n\nDo it.\n',
      '--freshness'
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('must be an ISO date');
  });

  it('accepts a recorded ISO date, and never treats an old one as a failure here', () => {
    const result = check(
      'skills/example-skill/SKILL.md',
      '---\nname: example-skill\ndescription: Does a thing.\nmetadata:\n  last_reviewed: "2019-01-01"\n---\n\nDo it.\n',
      '--freshness'
    );
    expect(result.status).toBe(0);
  });
});

describe('error output', () => {
  it('names the file, the rule, the class and the specification', () => {
    const result = check(
      'skills/example-skill/SKILL.md',
      '---\nname: example-skill\ndescription: Does a thing.\nversion: 1.0.0\n---\n\nDo it.\n'
    );
    expect(result.output).toContain('skills/example-skill/SKILL.md');
    expect(result.output).toContain('(open-spec-skill)');
    expect(result.output).toContain('https://agentskills.io/specification');
    expect(result.output).toContain('Fix:');
  });
});

/**
 * One test per finding raised in review on this branch.
 *
 * Each asserts the rule, not the message, and each is mutation-checked: the
 * mutation is applied to the implementation and the test must fail.
 */
describe('review findings on this branch', () => {
  // Every canonical footer in scripts/agents/includes/header-footer.js, so a
  // file carrying only a heading and a footer is caught whichever variant it has.
  const CANONICAL_FOOTERS = [
    '*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*\n[Contributors](https://github.com/lightspeedwp/.github)',
    '*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*',
    '*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*\n[Org Profile](https://github.com/orgs/lightspeedwp)',
    '*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*\n[Automation Docs](https://github.com/lightspeedwp/.github)',
    '*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*',
  ];

  it.each(CANONICAL_FOOTERS)('treats a heading plus this footer as an empty body: %s', (footer) => {
    const body = `# Heading only\n\n${footer}\n`;
    const result = check(
      'skills/example-skill/SKILL.md',
      `---\nname: example-skill\ndescription: Does a thing.\n---\n${body}`
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('[body]');
  });

  it('still accepts a body whose only content is real instructions above a footer', () => {
    const body = `Follow these steps.\n\n${CANONICAL_FOOTERS[0]}\n`;
    const result = check(
      'skills/example-skill/SKILL.md',
      `---\nname: example-skill\ndescription: Does a thing.\n---\n${body}`
    );
    expect(result.status).toBe(0);
  });

  it('does not excuse a footer phrase quoted mid-instructions', () => {
    // stripFooter scans backwards, so a phrase named inside the instructions is
    // still content rather than a footer to discard.
    const body = `If a change says "Docs signed by" then review it.\n\n${CANONICAL_FOOTERS[4]}\n`;
    const result = check(
      'skills/example-skill/SKILL.md',
      `---\nname: example-skill\ndescription: Does a thing.\n---\n${body}`
    );
    expect(result.status).toBe(0);
  });

  it('does not let one baseline entry cover a second problem with a different field', () => {
    // The finding key carries the offending field. Without it, baselining the
    // missing `title` also excused a `file_type` missing later.
    const complete =
      '---\nname: example\ndescription: Does a thing.\nfile_type: agent\ntitle: T\n' +
      'last_updated: "2026-10-02"\n---\n\nDo it.\n';
    const tree = makeTree({ 'agents/example.agent.md': complete });
    try {
      const dir = path.join(tree, 'scripts', 'validation');
      fs.mkdirSync(path.join(dir, 'lib'), { recursive: true });
      fs.copyFileSync(SCRIPT, path.join(dir, 'validate-skills.js'));
      fs.copyFileSync(
        path.join(__dirname, '..', 'lib', 'skills-spec.js'),
        path.join(dir, 'lib', 'skills-spec.js')
      );

      // Drop `title` only. One finding, and the baseline covers it.
      fs.writeFileSync(
        path.join(tree, 'agents', 'example.agent.md'),
        complete.replace('title: T\n', '')
      );
      fs.writeFileSync(
        path.join(dir, 'skills-baseline.json'),
        JSON.stringify({ findings: ['agents/example.agent.md#required-fields#title'] })
      );
      expect(run(tree).status).toBe(0);

      // Drop `file_type` as well. A different field, so the entry above must not
      // cover it: the file has regressed further and the gate must fail.
      fs.writeFileSync(
        path.join(tree, 'agents', 'example.agent.md'),
        complete.replace('title: T\n', '').replace('file_type: agent\n', '')
      );
      const worse = run(tree);
      expect(worse.status).toBe(1);
      expect(worse.stdout + worse.stderr).toContain('required field `file_type`');
    } finally {
      fs.rmSync(tree, { recursive: true, force: true });
    }
  });

  it('separates two name problems in one file, so baselining one does not excuse the other', () => {
    // `Bad-Name` breaks two independent rules: it is not lowercase, and it does
    // not match its directory. Both collapse to `<path>#name` without the
    // discriminator, so baselining one would silently excuse the other.
    const tree = makeTree({
      'skills/other-directory/SKILL.md':
        '---\nname: Bad-Name\ndescription: Does a thing.\n---\n\nDo it.\n',
    });
    try {
      const dir = path.join(tree, 'scripts', 'validation');
      fs.mkdirSync(path.join(dir, 'lib'), { recursive: true });
      fs.copyFileSync(SCRIPT, path.join(dir, 'validate-skills.js'));
      fs.copyFileSync(
        path.join(__dirname, '..', 'lib', 'skills-spec.js'),
        path.join(dir, 'lib', 'skills-spec.js')
      );

      const both = run(tree);
      expect(both.status).toBe(1);
      expect(both.stdout + both.stderr).toContain('is not lowercase');
      expect(both.stdout + both.stderr).toContain('does not match its directory');
      // It breaks a third rule too, so the point is sharper: three findings, one key.
      expect(both.stdout + both.stderr).toContain('contains characters outside');

      // Baseline the lowercase problem only.
      fs.writeFileSync(
        path.join(dir, 'skills-baseline.json'),
        JSON.stringify({ findings: ['skills/other-directory/SKILL.md#name#lowercase'] })
      );
      const one = run(tree);
      expect(one.status).toBe(1);
      expect(one.stdout + one.stderr).not.toContain('is not lowercase');
      expect(one.stdout + one.stderr).toContain('does not match its directory');

      // All three baselined: the file is now fully accounted for.
      fs.writeFileSync(
        path.join(dir, 'skills-baseline.json'),
        JSON.stringify({
          findings: [
            'skills/other-directory/SKILL.md#name#lowercase',
            'skills/other-directory/SKILL.md#name#directory-match',
            'skills/other-directory/SKILL.md#name#invalid-characters',
          ],
        })
      );
      expect(run(tree).status).toBe(0);
    } finally {
      fs.rmSync(tree, { recursive: true, force: true });
    }
  });

  it('separates two invalid metadata keys, so baselining one does not hide the other', () => {
    // validateMetadataValues emits one finding per invalid key. Without a metadata
    // subject in the key, both collapsed into `<path>#metadata` and a file baselined
    // for one bad key silently accepted another.
    const tree = makeTree({
      // Both invalid keys are lists: under the FAILSAFE_SCHEMA the validator
      // parses with, lists and mappings are the only non-string values a mapping
      // can actually hold.
      'skills/example-skill/SKILL.md':
        '---\nname: example-skill\ndescription: Does a thing.\n' +
        'metadata:\n  keep: "fine"\n  drop: ["gone"]\n  lose: ["also gone"]\n---\n\nDo it.\n',
    });
    try {
      const dir = path.join(tree, 'scripts', 'validation');
      fs.mkdirSync(path.join(dir, 'lib'), { recursive: true });
      fs.copyFileSync(SCRIPT, path.join(dir, 'validate-skills.js'));
      fs.copyFileSync(
        path.join(__dirname, '..', 'lib', 'skills-spec.js'),
        path.join(dir, 'lib', 'skills-spec.js')
      );

      const both = run(tree);
      expect(both.status).toBe(1);
      expect(both.stdout + both.stderr).toContain('metadata.drop is a list');
      expect(both.stdout + both.stderr).toContain('metadata.lose is a list');

      // Baseline one key only: the other must still fail.
      fs.writeFileSync(
        path.join(dir, 'skills-baseline.json'),
        JSON.stringify({ findings: ['skills/example-skill/SKILL.md#metadata#drop'] })
      );
      const one = run(tree);
      expect(one.status).toBe(1);
      expect(one.stdout + one.stderr).toContain('metadata.lose is a list');
      expect(one.stdout + one.stderr).not.toContain('metadata.drop is a list');

      // Both baselined: the file is accounted for.
      fs.writeFileSync(
        path.join(dir, 'skills-baseline.json'),
        JSON.stringify({
          findings: [
            'skills/example-skill/SKILL.md#metadata#drop',
            'skills/example-skill/SKILL.md#metadata#lose',
          ],
        })
      );
      expect(run(tree).status).toBe(0);
    } finally {
      fs.rmSync(tree, { recursive: true, force: true });
    }
  });

  it('states directory-based classification in the standards table, not field-based', () => {
    // The validator assigns `claude-code-skill` by directory prefix alone, so a
    // row claiming any skill using those fields is classified that way sends
    // authors into failures the code cannot avoid.
    const doc = fs.readFileSync(
      path.join(__dirname, '..', '..', '..', 'docs', 'SKILLS_STANDARDS.md'),
      'utf8'
    );
    const row = doc.split('\n').find((line) => line.startsWith('| `claude-code-skill`'));
    expect(row).toBeDefined();
    expect(row).toContain('CLAUDE_CODE_SKILL_ROOTS');
    expect(row).not.toMatch(/and any skill using/);
  });

  it('skips worktree checkouts but still validates skills under .claude', () => {
    // A worktree checkout holds a second copy of the repository, so a skill
    // inside `.claude/worktrees` would be reported twice. The skip is on the
    // root-relative path, so `.claude/skills` is still descended into.
    const bad = '---\nname: Bad Name\ndescription: Does a thing.\n---\n\nDo it.\n';
    const good = '---\nname: good-skill\ndescription: Does a thing.\n---\n\nDo it.\n';
    const tree = makeTree({
      '.claude/worktrees/evil/SKILL.md': bad,
      '.claude/skills/good-skill/SKILL.md': good,
    });
    try {
      const badDir = path.join(tree, 'scripts', 'validation');
      fs.mkdirSync(path.join(badDir, 'lib'), { recursive: true });
      fs.copyFileSync(SCRIPT, path.join(badDir, 'validate-skills.js'));
      fs.copyFileSync(
        path.join(__dirname, '..', 'lib', 'skills-spec.js'),
        path.join(badDir, 'lib', 'skills-spec.js')
      );
      // Baseline the one skill that must be reported.
      fs.writeFileSync(
        path.join(badDir, 'skills-baseline.json'),
        JSON.stringify({ findings: ['.claude/skills/good-skill/SKILL.md#name#invalid-characters'] })
      );
      // Passes only if the worktree copy is never walked: its `name` finding is
      // deliberately not baselined.
      expect(run(tree).status).toBe(0);
    } finally {
      fs.rmSync(tree, { recursive: true, force: true });
    }
  });

  it('allows the schema-defined top-level permissions, status and author on an agent', () => {
    const agent = (extra) =>
      [
        '---',
        'name: Test Agent',
        'description: Does a thing.',
        'title: Test Agent',
        'file_type: agent',
        'last_updated: "2026-09-22"',
        extra,
        '---',
        '',
        'Body.',
        '',
      ].join('\n');
    const statusFor = (extra) => {
      const tree = makeTree({ 'agents/test.agent.md': agent(extra) });
      try {
        const validationDir = path.join(tree, 'scripts', 'validation');
        fs.mkdirSync(path.join(validationDir, 'lib'), { recursive: true });
        fs.copyFileSync(SCRIPT, path.join(validationDir, 'validate-skills.js'));
        fs.copyFileSync(
          path.join(__dirname, '..', 'lib', 'skills-spec.js'),
          path.join(validationDir, 'lib', 'skills-spec.js')
        );
        fs.writeFileSync(
          path.join(validationDir, 'skills-baseline.json'),
          JSON.stringify({ findings: [] })
        );
        return run(tree).status;
      } finally {
        fs.rmSync(tree, { recursive: true, force: true });
      }
    };

    expect(statusFor('permissions:\n  - read\n  - write\nstatus: active\nauthor: Someone')).toBe(0);
    // The closed set still rejects a field that is in no schema.
    expect(statusFor('invented-field: x')).not.toBe(0);
  });

  it('skips generated output at the root only, not any directory named graft', () => {
    const bad = '---\nname: Bad Name\ndescription: Does a thing.\n---\n\nDo it.\n';
    const statusFor = (files) => {
      const tree = makeTree(files);
      try {
        const validationDir = path.join(tree, 'scripts', 'validation');
        fs.mkdirSync(path.join(validationDir, 'lib'), { recursive: true });
        fs.copyFileSync(SCRIPT, path.join(validationDir, 'validate-skills.js'));
        fs.copyFileSync(
          path.join(__dirname, '..', 'lib', 'skills-spec.js'),
          path.join(validationDir, 'lib', 'skills-spec.js')
        );
        fs.writeFileSync(
          path.join(validationDir, 'skills-baseline.json'),
          JSON.stringify({ findings: [] })
        );
        return run(tree).status;
      } finally {
        fs.rmSync(tree, { recursive: true, force: true });
      }
    };

    expect(statusFor({ 'graft/evil/SKILL.md': bad })).toBe(0);
    expect(statusFor({ 'graphify-out/evil/SKILL.md': bad })).toBe(0);
    expect(statusFor({ 'docs/graft/evil/SKILL.md': bad })).not.toBe(0);
  });

  it('keeps an over-long name distinct from one with invalid characters', () => {
    // The length message also contains the word "characters", so a classifier that
    // tested for that word first would fold both problems into one key.
    const long = 'Bad'.repeat(22); // 66 characters, with an uppercase B
    const tree = makeTree({
      [`skills/${long}/SKILL.md`]: `---\nname: ${long}\ndescription: Does a thing.\n---\n\nDo it.\n`,
    });
    try {
      const dir = path.join(tree, 'scripts', 'validation');
      fs.mkdirSync(path.join(dir, 'lib'), { recursive: true });
      fs.copyFileSync(SCRIPT, path.join(dir, 'validate-skills.js'));
      fs.copyFileSync(
        path.join(__dirname, '..', 'lib', 'skills-spec.js'),
        path.join(dir, 'lib', 'skills-spec.js')
      );

      const both = run(tree);
      expect(both.status).toBe(1);
      expect(both.stdout + both.stderr).toContain('the maximum is 64');
      expect(both.stdout + both.stderr).toContain('outside a-z, 0-9 and hyphen');

      // Baselining the invalid character alone must not cover the length problem.
      fs.writeFileSync(
        path.join(dir, 'skills-baseline.json'),
        JSON.stringify({ findings: [`skills/${long}/SKILL.md#name#invalid-characters`] })
      );
      const one = run(tree);
      expect(one.status).toBe(1);
      expect(one.stdout + one.stderr).toContain('the maximum is 64');
      expect(one.stdout + one.stderr).not.toContain('outside a-z, 0-9 and hyphen');

      // All three problems baselined by name: the file is accounted for. This is
      // the assertion that distinguishes the states — a classifier that folded
      // length into the invalid-characters subject would key the length finding
      // differently, so this baseline would no longer match and the run would fail.
      fs.writeFileSync(
        path.join(dir, 'skills-baseline.json'),
        JSON.stringify({
          findings: [
            `skills/${long}/SKILL.md#name#invalid-characters`,
            `skills/${long}/SKILL.md#name#length`,
            `skills/${long}/SKILL.md#name#lowercase`,
            `skills/${long}#folder-name`,
          ],
        })
      );
      const all = run(tree);
      expect({ status: all.status, output: (all.stdout + all.stderr).slice(0, 200) }).toStrictEqual(
        {
          status: 0,
          output: expect.stringContaining('match the checked-in baseline'),
        }
      );
    } finally {
      fs.rmSync(tree, { recursive: true, force: true });
    }
  });

  it('keys a consecutive-hyphen name separately from an invalid-character name', () => {
    const tree = makeTree({
      'skills/pdf--processing/SKILL.md':
        '---\nname: pdf--processing\ndescription: Does a thing.\n---\n\nDo it.\n',
    });
    try {
      const dir = path.join(tree, 'scripts', 'validation');
      fs.mkdirSync(path.join(dir, 'lib'), { recursive: true });
      fs.copyFileSync(SCRIPT, path.join(dir, 'validate-skills.js'));
      fs.copyFileSync(
        path.join(__dirname, '..', 'lib', 'skills-spec.js'),
        path.join(dir, 'lib', 'skills-spec.js')
      );

      fs.writeFileSync(
        path.join(dir, 'skills-baseline.json'),
        JSON.stringify({
          findings: [
            'skills/pdf--processing/SKILL.md#name#consecutive-hyphens',
            'skills/pdf--processing#folder-name',
          ],
        })
      );
      expect(run(tree).status).toBe(0);
    } finally {
      fs.rmSync(tree, { recursive: true, force: true });
    }
  });

  it('enforces the subagent required fields, not only the skill ones', () => {
    // A subagent with nothing but a name previously passed.
    const result = check('agents/example.agent.md', '---\nname: example\n---\n\nDo it.\n');
    expect(result.status).toBe(1);
    for (const field of ['description', 'file_type', 'title', 'last_updated']) {
      expect(result.output).toContain(`required field \`${field}\``);
    }
  });

  it('applies the description length cap to skills only', () => {
    const long = 'x'.repeat(1100);
    const skill = check(
      'skills/example-skill/SKILL.md',
      `---\nname: example-skill\ndescription: ${long}\n---\n\nDo it.\n`
    );
    expect(skill.status).toBe(1);
    expect(skill.output).toContain('[description]');

    // Neither the subagent reference nor the local schema imposes that cap, so a
    // long description on a subagent is not a finding.
    const subagent = check(
      'agents/example.agent.md',
      `---\nname: example\ndescription: ${long}\nfile_type: agent\ntitle: T\nlast_updated: "2026-10-02"\n---\n\nDo it.\n`
    );
    expect(subagent.status).toBe(0);
  });

  it('still rejects an empty description on a subagent', () => {
    // Length is skills-only; emptiness is not.
    const result = check(
      'agents/example.agent.md',
      '---\nname: example\ndescription: "  "\nfile_type: agent\ntitle: T\nlast_updated: "2026-10-02"\n---\n\nDo it.\n'
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('[description]');
  });

  it('checks the value shape of optional fields, with the tool format per class', () => {
    const bad = check(
      'skills/example-skill/SKILL.md',
      '---\nname: example-skill\ndescription: Does a thing.\nlicense:\n  - one\n  - two\n---\n\nDo it.\n'
    );
    expect(bad.status).toBe(1);
    expect(bad.output).toContain('[optional-field-shape]');

    // open-spec documents a comma-separated string; Claude Code a list. One rule
    // must not impose either representation on the other.
    const openSpec = check(
      'skills/example-skill/SKILL.md',
      '---\nname: example-skill\ndescription: Does a thing.\nallowed-tools:\n  - Read\n---\n\nDo it.\n'
    );
    expect(openSpec.status).toBe(1);
    expect(openSpec.output).toContain('[optional-field-shape]');
  });

  it('permits metadata on a subagent and sanctions it in the schema', () => {
    const result = check(
      'agents/example.agent.md',
      '---\nname: example\ndescription: Does a thing.\nfile_type: agent\ntitle: T\nlast_updated: "2026-10-02"\nmetadata:\n  tier: fast\n---\n\nDo it.\n'
    );
    expect(result.status).toBe(0);

    const schema = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '..', '..', '..', 'schemas', 'agent-config.schema.json'),
        'utf8'
      )
    );
    expect(Object.keys(schema.definitions.optionalFrontmatterFields.properties)).toContain(
      'metadata'
    );
  });

  it('rejects references on an AGENTS.md and says where the field belongs', () => {
    const result = check(
      'AGENTS.md',
      '---\ntitle: Root\nfile_type: documentation\nlast_updated: "2026-10-02"\nreferences:\n  - a.md\n---\n\n# Guide\n\nRun it.\n'
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('[closed-field-set]');
    // The advice must be class-specific: moving it into `metadata` is not the fix
    // for a field the Markdown standard prohibits outright.
    expect(result.output).toContain('Cross-References');
    expect(result.output).not.toContain('metadata.references');
  });
});

/**
 * Unit tests for the rule library, ported from #3714.
 *
 * #3717 replaced these with end-to-end tests through the validator, which lost
 * coverage of the boundaries themselves: a rule that never fires end to end can
 * still have a broken boundary test, and the exact limits (64 characters,
 * exactly 1024, 500 metadata characters) are only asserted here.
 */
const VALID = `---
name: example-skill
description: Does a thing. Use when you need the thing done.
---

# Example Skill

Follow these steps to do the thing.
`;

describe('skills-spec: frontmatter splitting', () => {
  it('splits frontmatter from body', () => {
    const parts = spec.splitFrontmatter(VALID);
    expect(parts.frontmatter).toContain('name: example-skill');
    expect(parts.body).toContain('# Example Skill');
  });

  it('returns null when there is no frontmatter', () => {
    expect(spec.splitFrontmatter('# Just a heading\n')).toBeNull();
  });

  it('returns null for an unterminated frontmatter block', () => {
    expect(spec.splitFrontmatter('---\nname: x\n')).toBeNull();
  });
});

describe('skills-spec: body presence', () => {
  it('accepts a body with instructions', () => {
    expect(spec.hasBody('\n# Title\n\nDo the thing.\n')).toBe(true);
  });

  it('rejects an empty body (#3707)', () => {
    expect(spec.hasBody('\n')).toBe(false);
    expect(spec.hasBody('\n\n   \n')).toBe(false);
  });

  it('rejects a body holding only a heading', () => {
    expect(spec.hasBody('\n# Title Only\n')).toBe(false);
  });

  it('rejects a body holding only the generated footer', () => {
    const footer = '\n*Have questions? Ping us on GitHub! Made with Love by LightSpeedWP*';
    expect(spec.hasBody(footer)).toBe(false);
  });

  it('rejects a body holding only a Contributors link footer', () => {
    const footer =
      '\n_Built by LightSpeedWP_\n[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)';
    expect(spec.hasBody(footer)).toBe(false);
  });

  it('keeps content that precedes the footer', () => {
    expect(spec.hasBody('\nDo the thing.\n\n_Built by LightSpeedWP_\n')).toBe(true);
  });

  it('accepts a body of list items', () => {
    expect(spec.hasBody('\n- first step\n- second step\n')).toBe(true);
  });
});

describe('skills-spec: closed top-level field set', () => {
  it('accepts the six permitted fields', () => {
    const frontmatter = {
      name: 'example-skill',
      description: 'A description.',
      license: 'MIT',
      compatibility: 'Requires git.',
      metadata: { version: '1.0' },
      'allowed-tools': 'Bash(git:*)',
    };
    expect(spec.validateFieldSet(frontmatter)).toEqual([]);
  });

  it('rejects a top-level version and points at metadata.version', () => {
    const failures = spec.validateFieldSet({ name: 'example-skill', version: '1.0.0' });
    expect(failures).toHaveLength(1);
    expect(failures[0]).toContain('version');
    expect(failures[0]).toContain('metadata.version');
  });

  it('rejects agentskills_io_compliant', () => {
    const failures = spec.validateFieldSet({
      name: 'example-skill',
      agentskills_io_compliant: true,
    });
    expect(failures[0]).toContain('agentskills_io_compliant');
  });

  it('returns one finding per unknown field, so each can be baselined alone', () => {
    const failures = spec.validateFieldSet({
      name: 'example-skill',
      version: '1',
      category: 'x',
      maintainer: 'y',
    });
    expect(failures).toHaveLength(3);
    for (const [field, message] of [
      ['version', 'metadata.version'],
      ['category', 'metadata.category'],
      ['maintainer', 'metadata.maintainer'],
    ]) {
      const hit = failures.find((f) => f.startsWith(`\`${field}\` is not a field`));
      expect({ field, found: Boolean(hit), hint: hit && hit.includes(message) }).toStrictEqual({
        field,
        found: true,
        hint: true,
      });
    }
  });
});

describe('skills-spec: name', () => {
  it('accepts a conforming name equal to the directory', () => {
    expect(spec.validateName('example-skill', 'example-skill')).toEqual([]);
  });

  it('accepts digits and single hyphens', () => {
    expect(spec.validateName('wp-6-8-skill', 'wp-6-8-skill')).toEqual([]);
  });

  it('rejects a name that differs from the directory', () => {
    const failures = spec.validateName('lightspeed-example', 'example');
    expect(failures).toHaveLength(1);
    expect(failures[0]).toContain('does not match its directory');
    expect(failures[0]).toContain('name: example');
  });

  it('rejects uppercase', () => {
    expect(spec.validateName('Presentations', 'Presentations')[0]).toContain('not lowercase');
  });

  it('rejects a leading hyphen', () => {
    expect(spec.validateName('-pdf', '-pdf')[0]).toContain('hyphen');
  });

  it('rejects consecutive hyphens', () => {
    expect(spec.validateName('pdf--processing', 'pdf--processing')[0]).toContain(
      'consecutive hyphens'
    );
  });

  it('rejects characters outside a-z, 0-9 and hyphen', () => {
    expect(spec.validateName('example_skill', 'example_skill')[0]).toContain(
      'outside a-z, 0-9 and hyphen'
    );
  });

  it('rejects a name over 64 characters', () => {
    const long = 'a'.repeat(65);
    expect(spec.validateName(long, long)[0]).toContain('maximum is 64');
  });

  it('rejects an empty name', () => {
    expect(spec.validateName('', 'example')[0]).toContain('missing or empty');
  });
});

describe('skills-spec: description', () => {
  it('accepts a description within bounds', () => {
    expect(spec.validateDescription('Does a thing.')).toEqual([]);
  });

  it('rejects an empty description', () => {
    expect(spec.validateDescription('   ')[0]).toContain('missing or empty');
  });

  it('accepts exactly 1024 characters', () => {
    expect(spec.validateDescription('a'.repeat(1024))).toEqual([]);
  });

  it('rejects 1025 characters', () => {
    expect(spec.validateDescription('a'.repeat(1025))[0]).toContain('maximum is 1024');
  });
});

describe('skills-spec: compatibility length', () => {
  it('accepts 500 characters', () => {
    expect(spec.validateCompatibility('a'.repeat(500))).toEqual([]);
  });

  it('rejects 501 characters', () => {
    expect(spec.validateCompatibility('a'.repeat(501))[0]).toContain('maximum is 500');
  });
});

describe('skills-spec: metadata values must be strings', () => {
  it('accepts string values', () => {
    expect(spec.validateMetadataValues({ metadata: { version: '1.0', author: 'team' } })).toEqual(
      []
    );
  });

  it('rejects a list value', () => {
    const failures = spec.validateMetadataValues({ metadata: { tags: ['a', 'b'] } });
    expect(failures[0]).toContain('metadata.tags is a list');
  });

  it('rejects a nested mapping value', () => {
    const failures = spec.validateMetadataValues({ metadata: { requires: { node: '20' } } });
    expect(failures[0]).toContain('metadata.requires is object');
  });

  it('accepts an absent metadata field', () => {
    expect(spec.validateMetadataValues({})).toEqual([]);
  });

  it('rejects metadata that is not a mapping', () => {
    expect(spec.validateMetadataValues({ metadata: 'x' })[0]).toContain('must be a mapping');
  });
});

/**
 * The anti-drift guard for footer recognition.
 *
 * `stripFooter` used to know only the five `DEFAULT_FOOTERS` fallbacks, so a
 * skill holding a heading and any *configured* footer was counted as having a
 * body and passed the #3707 gate. That is the whole class of defect the finding
 * reports, not one variant of it.
 *
 * Two owners define what a footer looks like: `FOOTER_PATTERNS` in
 * `scripts/agents/includes/footer-policy.js`, and the phrases the generator
 * resolves from `.github/footers.yml`. Both are read here as the real files they
 * are, so adding a phrase to either without teaching `FOOTER_STEMS` about it
 * fails this suite instead of quietly reopening the hole.
 */
describe('footer recognition tracks the shared policy and the configured phrases', () => {
  const REPO_ROOT = path.join(__dirname, '..', '..', '..');

  /**
   * The literal words a `FOOTER_PATTERNS` entry must begin with.
   *
   * Regex metacharacters are dropped, because they are the pattern's own syntax
   * rather than the phrase's text — `Have questions\?` must reduce to
   * "Have questions", which the stem "Have questions?" covers. Emoji are dropped
   * for the same reason and because a stem is a word prefix, not a whole phrase.
   *
   * @param {string} pattern One entry of FOOTER_PATTERNS.
   * @returns {string} The literal opening, or '' when the entry has none.
   */
  function literalOpening(pattern) {
    const withoutLeadingClass = pattern.replace(/^\[[^\]]*\][?+]?/, '');
    const literal = withoutLeadingClass.split(/[\\^$.*+?()[\]{}|]/)[0];
    return literal.replace(/[^\x20-\x7E]/g, '').trim();
  }

  /** @returns {string[]} The real FOOTER_PATTERNS, read from the shared ESM policy. */
  function sharedFooterPatterns() {
    const source = fs.readFileSync(
      path.join(REPO_ROOT, 'scripts', 'agents', 'includes', 'footer-policy.js'),
      'utf8'
    );
    const block = source.match(/export const FOOTER_PATTERNS = \[([\s\S]*?)\n\];/);
    if (!block) {
      throw new Error('FOOTER_PATTERNS was not found in footer-policy.js');
    }
    return [...block[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((match) =>
      match[1].replace(/\\\\/g, '\\')
    );
  }

  it('reads every shared pattern, so the coverage test cannot pass vacuously', () => {
    expect(sharedFooterPatterns().length).toBeGreaterThan(0);
  });

  it('covers every shared FOOTER_PATTERNS entry with a stem', () => {
    const uncovered = sharedFooterPatterns()
      .map((pattern) => ({ pattern, opening: literalOpening(pattern) }))
      .filter(
        ({ opening }) =>
          opening.length > 0 && !spec.FOOTER_STEMS.some((stem) => stem.startsWith(opening))
      )
      .map(({ pattern, opening }) => `${pattern} (opening ${JSON.stringify(opening)})`);
    expect(uncovered).toEqual([]);
  });

  it('recognises a real-looking line built from each stem', () => {
    for (const stem of spec.FOOTER_STEMS) {
      expect(spec.isFooterLine(`*${stem} and the rest of the phrase*`)).toBe(true);
    }
  });

  /** @returns {[string, string][]} Every phrase the generator can emit, with its category. */
  function configuredPhrases() {
    const config = yaml.load(
      fs.readFileSync(path.join(REPO_ROOT, '.github', 'footers.yml'), 'utf8')
    );
    const phrases = [];
    for (const [category, value] of Object.entries(config.categories || {})) {
      for (const phrase of value.phrases || []) {
        phrases.push([`${category}: ${phrase}`, phrase]);
      }
    }
    for (const phrase of (config.default || {}).phrases || []) {
      phrases.push([`default: ${phrase}`, phrase]);
    }
    if (phrases.length === 0) {
      throw new Error('no configured footer phrases were read from .github/footers.yml');
    }
    return phrases;
  }

  it('reads every configured phrase, so the coverage test cannot pass vacuously', () => {
    expect(configuredPhrases().length).toBeGreaterThan(0);
  });

  it.each(configuredPhrases())(
    'treats a heading plus the configured footer %j as an empty body',
    (_label, phrase) => {
      expect(spec.hasBody(`# Heading only\n\n*${phrase}*\n`)).toBe(false);
    }
  );

  it('treats a heading plus a configured footer and link line as an empty body', () => {
    const body =
      '# Heading only\n\n*Prefer a guided setup? Book a consult.*\n[Org Profile](https://github.com/orgs/lightspeedwp)\n';
    expect(spec.hasBody(body)).toBe(false);
  });

  it('still counts real instructions that precede a configured footer', () => {
    expect(spec.hasBody('Follow these steps.\n\n*Prefer a guided setup? Book a consult.*\n')).toBe(
      true
    );
  });
});

/**
 * Regression cases for the review findings raised on the per-field commit.
 *
 * Each asserts the rule rather than the message, and the footer cases exist
 * because a flat stem list once stripped ordinary instructions: "Update when the
 * API version changes." was reported as an empty body, which fails correct work.
 */
describe('review findings on the per-field commit', () => {
  const REQUIRED_SHAPES = { file_type: 'agent', title: 'Reviewer', last_updated: '2026-10-02' };

  it('rejects a required field that is present but the wrong shape', () => {
    expect(spec.validateOptionalFieldShapes({ ...REQUIRED_SHAPES, title: [] })[0]).toContain(
      '`title` must be a string but is a list'
    );
    const lastUpdated = spec.validateOptionalFieldShapes({ ...REQUIRED_SHAPES, last_updated: [] });
    expect(lastUpdated[0]).toContain('`last_updated` must be a string but is a list');
  });

  it('rejects a boolean description, which FAILSAFE_SCHEMA used to turn into "true"', () => {
    const result = check(
      'skills/example-skill/SKILL.md',
      '---\nname: example-skill\ndescription: true\n---\n\nDo it.\n'
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('description must be a string but is boolean');
  });

  it('rejects a numeric license and a numeric metadata value', () => {
    const result = check(
      'skills/example-skill/SKILL.md',
      '---\nname: example-skill\ndescription: Does a thing.\nlicense: 42\n' +
        'metadata:\n  version: 1\n---\n\nDo it.\n'
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('`license` must be a string but is number');
    expect(result.output).toContain('metadata.version is number');
  });

  it('rejects an impossible date and accepts a real leap day', () => {
    for (const impossible of ['2026-99-99', '2026-02-30', '2026-13-01']) {
      const found = spec.validateFreshness({ metadata: { last_reviewed: impossible } }, true);
      expect(found[0]).toContain('not a real date');
    }
    expect(spec.validateFreshness({ metadata: { last_reviewed: '2024-02-29' } }, true)).toEqual([]);
    expect(spec.validateFreshness({ metadata: { last_reviewed: '2026-10-02' } }, true)).toEqual([]);
  });

  it('rejects a nested metadata object with a fix that can actually be written', () => {
    const failures = spec.validateMetadataValues({ metadata: { tier: { model: 'sonnet' } } });
    expect(failures[0]).toContain('metadata.tier is object');
    // The old advice rendered String({}) and told the author to write "[object Object]".
    expect(failures[0]).not.toContain('[object Object]');
    expect(failures[0]).toContain('flatten it');
  });

  it('constrains the schema metadata entry to string values, as the standard documents', () => {
    const schema = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '..', '..', '..', 'schemas', 'agent-config.schema.json'),
        'utf8'
      )
    );
    expect(
      schema.definitions.optionalFrontmatterFields.properties.metadata.additionalProperties
    ).toEqual({ type: 'string' });
  });

  it('names both metadata keys when two spaced keys are invalid', () => {
    // The subject regex used to exclude whitespace, so `build mode` and
    // `source notes` both produced no subject and shared one baseline entry.
    const result = check(
      'skills/example-skill/SKILL.md',
      '---\nname: example-skill\ndescription: Does a thing.\n' +
        'metadata:\n  build mode:\n    nested: 1\n  source notes:\n    - a\n---\n\nDo it.\n'
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('metadata.build mode');
    expect(result.output).toContain('metadata.source notes');
  });

  describe('footer recognition does not eat ordinary instructions', () => {
    const ORDINARY_PROSE = [
      'Update when the API version changes.',
      'Questions? Ask the team.',
      'Use responsibly when publishing.',
      'Link policies; avoid assumptions.',
      'Keep tone human, clear, and kind.',
    ];

    it.each(ORDINARY_PROSE)('keeps the prose %j as a body', (prose) => {
      expect(spec.hasBody(`${prose}\n`)).toBe(true);
    });

    it.each(ORDINARY_PROSE)('keeps the prose %j when a real footer follows it', (prose) => {
      expect(spec.hasBody(`${prose}\n\n*Built by 🧱 LightSpeedWP with spirit!*\n`)).toBe(true);
    });

    it('does not treat a bare generic opener as a footer', () => {
      expect(spec.isFooterLine('Update when the API version changes.')).toBe(false);
      expect(spec.isFooterLine('Questions? Ask the team.')).toBe(false);
    });

    it('treats an emphasised generic opener as a footer', () => {
      expect(spec.isFooterLine('*Questions? Open an issue; we are listening.*')).toBe(true);
      expect(spec.isFooterLine('_Update when guidance changes._')).toBe(true);
    });

    it('treats a high-confidence opener as a footer in bare text', () => {
      // Mirrors footer-policy.js: these openers are unmistakable on their own.
      expect(spec.isFooterLine('Built by 🧱 LightSpeedWP with spirit!')).toBe(true);
      expect(spec.isFooterLine('Docs signed by 🤖 Copilot — always fresh!')).toBe(true);
    });

    it('keeps the emoji-less emphasised Built by footer the repository uses', () => {
      expect(spec.hasBody('*Built by LightSpeedWP with open-source spirit!*\n')).toBe(false);
      expect(spec.hasBody('_Built by LightSpeedWP_\n')).toBe(false);
    });
  });
});
