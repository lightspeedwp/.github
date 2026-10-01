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

const SCRIPT = path.join(__dirname, '..', 'validate-skills.js');

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
    // Upstream imposes no character set on a subagent identifier.
    const result = check(
      'agents/example.agent.md',
      '---\nname: Example Reviewer\ndescription: Reviews things\n---\n\nDo it.\n'
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
    const result = check('AGENTS.md', '---\ntitle: Root\n---\n\n# Guide\n\n## Build\n\nRun it.\n');
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
        JSON.stringify({ findings: ['skills/example-skill/SKILL.md#closed-field-set'] })
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
