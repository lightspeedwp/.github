/**
 * Tests for the Agent Skills specification rules and the validate-skills.js
 * script that applies them.
 *
 * Rule sources (read 2026-10-01):
 * - https://agentskills.io/specification
 * - https://github.com/agentskills/agentskills/blob/main/skills-ref/src/skills_ref/validator.py
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const spec = require('../lib/skills-spec.js');

const SCRIPT = path.join(__dirname, '..', 'validate-skills.js');

/** Run the validator against a temporary repository tree. */
function runValidator(tree) {
  try {
    const stdout = execFileSync(process.execPath, [SCRIPT], {
      cwd: tree,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { status: 0, stdout };
  } catch (error) {
    return { status: error.status ?? 1, stdout: error.stdout ?? '', stderr: error.stderr ?? '' };
  }
}

/** Build a temporary tree containing a skills/ directory. */
function makeTree(skills) {
  const tree = fs.mkdtempSync(path.join(os.tmpdir(), 'validate-skills-'));
  fs.mkdirSync(path.join(tree, 'skills'), { recursive: true });
  for (const [dir, content] of Object.entries(skills)) {
    const target = path.join(tree, 'skills', dir);
    fs.mkdirSync(target, { recursive: true });
    fs.writeFileSync(path.join(target, 'SKILL.md'), content);
  }
  return tree;
}

/** A minimal conforming SKILL.md. */
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

  it('rejects several unknown fields and names each fix', () => {
    const failures = spec.validateFieldSet({
      name: 'example-skill',
      version: '1',
      category: 'x',
      maintainer: 'y',
    });
    expect(failures[0]).toContain('version');
    expect(failures[0]).toContain('category');
    expect(failures[0]).toContain('maintainer');
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

describe('validate-skills.js: valid tree', () => {
  let tree;

  beforeAll(() => {
    tree = makeTree({ 'example-skill': VALID });
  });

  afterAll(() => {
    fs.rmSync(tree, { recursive: true, force: true });
  });

  it('passes and exits zero', () => {
    const result = runValidator(tree);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Skill validation passed.');
  });
});

describe('validate-skills.js: failure modes', () => {
  /** Run the validator on a one-skill tree and return its output. */
  function check(content, directoryName = 'example-skill') {
    const tree = makeTree({ [directoryName]: content });
    try {
      const result = runValidator(tree);
      return { status: result.status, output: result.stdout + (result.stderr ?? '') };
    } finally {
      fs.rmSync(tree, { recursive: true, force: true });
    }
  }

  it('accepts a documented Claude Code extension field', () => {
    // disable-model-invocation is Claude Code's own extension; it is valid in a
    // Claude Code skill and only blocks packaging outside Claude Code.
    const result = check(
      '---\nname: example-skill\ndescription: Does a thing.\ndisable-model-invocation: true\n---\n\nDo the thing.\n'
    );
    expect(result.status).toBe(0);
  });

  it('fails an undocumented field', () => {
    const result = check(
      '---\nname: example-skill\ndescription: Does a thing.\nfile_type: documentation\n---\n\nDo the thing.\n'
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('[closed-field-set]');
  });

  it('fails a frontmatter-only SKILL.md (#3707)', () => {
    const result = check('---\nname: example-skill\ndescription: Does a thing.\n---\n');
    expect(result.status).toBe(1);
    expect(result.output).toContain('[body]');
  });

  it('fails a body of only a heading and a footer', () => {
    const result = check(
      '---\nname: example-skill\ndescription: Does a thing.\n---\n\n# Example Skill\n\n_Built by LightSpeedWP_\n'
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('[body]');
  });

  it('fails a top-level version', () => {
    const result = check(
      '---\nname: example-skill\ndescription: Does a thing.\nversion: 1.0.0\n---\n\nDo the thing.\n'
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('[closed-field-set]');
    expect(result.output).toContain('metadata.version');
  });

  it('fails a name that does not match its directory', () => {
    const result = check(VALID, 'other-directory');
    expect(result.status).toBe(1);
    expect(result.output).toContain('[name]');
    expect(result.output).toContain('does not match its directory');
  });

  it('fails a name with uppercase characters', () => {
    const result = check(
      '---\nname: Presentations\ndescription: Does a thing.\n---\n\nDo the thing.\n',
      'Presentations'
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('not lowercase');
  });

  it('fails a missing name', () => {
    const result = check('---\ndescription: Does a thing.\n---\n\nDo the thing.\n');
    expect(result.status).toBe(1);
    expect(result.output).toContain('[required-fields]');
  });

  it('fails a missing description', () => {
    const result = check('---\nname: example-skill\n---\n\nDo the thing.\n');
    expect(result.status).toBe(1);
    expect(result.output).toContain('[required-fields]');
  });

  it('fails an over-long description', () => {
    const result = check(
      `---\nname: example-skill\ndescription: ${'a'.repeat(1025)}\n---\n\nDo the thing.\n`
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('maximum is 1024');
  });

  it('fails a non-string metadata value', () => {
    const result = check(
      '---\nname: example-skill\ndescription: Does a thing.\nmetadata:\n  tags:\n    - a\n    - b\n---\n\nDo the thing.\n'
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('[metadata]');
  });

  it('fails a SKILL.md with no frontmatter at all', () => {
    const result = check('# Example Skill\n\nDo the thing.\n');
    expect(result.status).toBe(1);
    expect(result.output).toContain('[frontmatter]');
  });

  it('fails malformed YAML and says so', () => {
    const result = check('---\nname: [unclosed\n---\n\nDo the thing.\n');
    expect(result.status).toBe(1);
    expect(result.output).toContain('[frontmatter]');
  });

  it('fails a directory with no SKILL.md', () => {
    const tree = fs.mkdtempSync(path.join(os.tmpdir(), 'validate-skills-empty-'));
    fs.mkdirSync(path.join(tree, 'skills', 'not-a-skill'), { recursive: true });
    fs.writeFileSync(path.join(tree, 'skills', 'not-a-skill', 'README.md'), '# Notes\n');
    try {
      const result = runValidator(tree);
      expect(result.status).toBe(1);
      expect(result.stdout + result.stderr).toContain('[structure]');
    } finally {
      fs.rmSync(tree, { recursive: true, force: true });
    }
  });

  it('fails an invalid folder name', () => {
    const tree = fs.mkdtempSync(path.join(os.tmpdir(), 'validate-skills-folder-'));
    fs.mkdirSync(path.join(tree, 'skills'), { recursive: true });
    fs.mkdirSync(path.join(tree, 'skills', 'Bad Name'), { recursive: true });
    fs.writeFileSync(
      path.join(tree, 'skills', 'Bad Name', 'SKILL.md'),
      '---\nname: bad-name\ndescription: Does a thing.\n---\n\nDo the thing.\n'
    );
    try {
      const result = runValidator(tree);
      expect(result.status).toBe(1);
      expect(result.stdout + result.stderr).toContain('[folder-name]');
    } finally {
      fs.rmSync(tree, { recursive: true, force: true });
    }
  });

  it('skips the _template-skill scaffold entirely', () => {
    // A scaffold, not a skill: exempt from the folder-name and content rules.
    const tree = makeTree({
      '_template-skill':
        '---\nname: template-skill\ndescription: Replace me.\n---\n\n# Insert instructions below\n',
    });
    try {
      const result = runValidator(tree);
      expect(result.status).toBe(0);
    } finally {
      fs.rmSync(tree, { recursive: true, force: true });
    }
  });

  it('validates a listed non-skill directory once it grows a SKILL.md', () => {
    // The pack list is an exemption from the pack-versus-skill boundary, not a
    // blanket skip: a pack that becomes a skill is checked like any other.
    const tree = makeTree({
      'accessibility-auditor':
        '---\nname: lightspeed-wrong\ndescription: Does a thing.\n---\n\nDo the thing.\n',
    });
    try {
      const result = runValidator(tree);
      expect(result.status).toBe(1);
      expect(result.stdout + result.stderr).toContain('skills/accessibility-auditor/SKILL.md');
    } finally {
      fs.rmSync(tree, { recursive: true, force: true });
    }
  });

  it('validates a listed non-skill directory that grows a nested SKILL.md', () => {
    const tree = fs.mkdtempSync(path.join(os.tmpdir(), 'validate-skills-pack-nested-'));
    const child = path.join(tree, 'skills', 'accessibility-auditor', 'nested-skill');
    fs.mkdirSync(child, { recursive: true });
    fs.writeFileSync(
      path.join(child, 'SKILL.md'),
      '---\nname: nested-skill\ndescription: Does a thing.\nversion: 1.0.0\n---\n\nDo it.\n'
    );
    try {
      const result = runValidator(tree);
      expect(result.status).toBe(1);
      expect(result.stdout + result.stderr).toContain(
        'skills/accessibility-auditor/nested-skill/SKILL.md'
      );
    } finally {
      fs.rmSync(tree, { recursive: true, force: true });
    }
  });

  it('validates the skills inside a container directory', () => {
    // skills/design-md-agent/ and similar hold skills as immediate children.
    const tree = fs.mkdtempSync(path.join(os.tmpdir(), 'validate-skills-container-'));
    const child = path.join(tree, 'skills', 'container', 'child-skill');
    fs.mkdirSync(child, { recursive: true });
    fs.writeFileSync(
      path.join(child, 'SKILL.md'),
      '---\nname: lightspeed-child\ndescription: Does a thing.\n---\n\nDo the thing.\n'
    );
    try {
      const result = runValidator(tree);
      expect(result.status).toBe(1);
      expect(result.stdout + result.stderr).toContain('skills/container/child-skill/SKILL.md');
      expect(result.stdout + result.stderr).toContain('[name]');
    } finally {
      fs.rmSync(tree, { recursive: true, force: true });
    }
  });

  it('accepts a container directory whose children all conform', () => {
    const tree = fs.mkdtempSync(path.join(os.tmpdir(), 'validate-skills-container-ok-'));
    const child = path.join(tree, 'skills', 'container', 'child-skill');
    fs.mkdirSync(child, { recursive: true });
    fs.writeFileSync(path.join(child, 'SKILL.md'), VALID.replace('example-skill', 'child-skill'));
    try {
      expect(runValidator(tree).status).toBe(0);
    } finally {
      fs.rmSync(tree, { recursive: true, force: true });
    }
  });

  it('reports a failing skill with its path, rule and fix', () => {
    const result = check(
      '---\nname: lightspeed-example\ndescription: Does a thing.\nversion: 1.0.0\n---\n\nDo the thing.\n'
    );
    expect(result.output).toContain('skills/example-skill/SKILL.md');
    expect(result.output).toContain('[closed-field-set]');
    expect(result.output).toContain('Fix:');
  });
});

describe('validate-skills.js: plugin skills', () => {
  it('validates plugins/<plugin>/skills/<name>/SKILL.md', () => {
    const tree = fs.mkdtempSync(path.join(os.tmpdir(), 'validate-skills-plugin-'));
    const dir = path.join(tree, 'plugins', 'example-plugin', 'skills', 'example-skill');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'SKILL.md'), VALID);
    try {
      expect(runValidator(tree).status).toBe(0);
    } finally {
      fs.rmSync(tree, { recursive: true, force: true });
    }
  });

  it('fails a plugin skill with a non-spec field', () => {
    const tree = fs.mkdtempSync(path.join(os.tmpdir(), 'validate-skills-plugin-bad-'));
    const dir = path.join(tree, 'plugins', 'example-plugin', 'skills', 'example-skill');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, 'SKILL.md'),
      '---\nname: example-skill\ndescription: Does a thing.\nversion: 0.1.0\n---\n\nDo the thing.\n'
    );
    try {
      const result = runValidator(tree);
      expect(result.status).toBe(1);
      expect(result.stdout + result.stderr).toContain(
        'plugins/example-plugin/skills/example-skill'
      );
    } finally {
      fs.rmSync(tree, { recursive: true, force: true });
    }
  });
});
