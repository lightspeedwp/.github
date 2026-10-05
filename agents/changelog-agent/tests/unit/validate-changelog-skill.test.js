const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const SKILL_DIR = path.join(__dirname, '..', '..', 'skills', 'validate-changelog');
const SKILL_MD = path.join(SKILL_DIR, 'SKILL.md');

function frontmatter() {
  const content = fs.readFileSync(SKILL_MD, 'utf8');
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  expect(match).not.toBeNull();
  return { fields: yaml.load(match[1]), body: match[2] };
}

describe('validate-changelog SKILL.md (Agent Skills specification)', () => {
  test('name matches the parent directory name', () => {
    const { fields } = frontmatter();
    expect(fields.name).toBe('validate-changelog');
    expect(fields.name).toBe(path.basename(SKILL_DIR));
  });

  test('description is real: non-empty, under 1024 chars, states use', () => {
    const { fields } = frontmatter();
    expect(typeof fields.description).toBe('string');
    expect(fields.description.length).toBeGreaterThan(0);
    expect(fields.description.length).toBeLessThanOrEqual(1024);
    expect(fields.description).not.toMatch(/replace with/i);
    expect(fields.description).toMatch(/when/i);
  });

  test('body holds real instructions, not the template placeholder', () => {
    const { body } = frontmatter();
    expect(body).not.toMatch(/# Insert instructions below/);
    expect(body).toMatch(/## Procedure/);
    expect(body).toMatch(/changelog-validator\.js/);
    expect(body).toMatch(/validate-changelog\.cjs/);
  });

  test('no duplicate helper shadows the agent-root helper', () => {
    expect(fs.existsSync(path.join(SKILL_DIR, 'validate-changelog.js'))).toBe(false);
  });
});
