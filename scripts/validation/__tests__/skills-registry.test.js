import fs from 'fs';
import os from 'os';
import path from 'path';
import SkillsCatalog from '../lib/skills-catalog.js';
import SkillsRegistryGenerator from '../lib/skills-registry-generator.js';

describe('directory-based agent skill discovery', () => {
  let rootDir;
  let skillPath;

  beforeEach(() => {
    rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-registry-'));
    skillPath = path.join(rootDir, 'agents', 'test-agent', 'skills', 'test-skill');
    fs.mkdirSync(skillPath, { recursive: true });
    fs.writeFileSync(
      path.join(skillPath, 'SKILL.md'),
      [
        '---',
        'name: test-skill',
        'description: Exercises directory-based skill discovery.',
        '---',
        '',
        '# Test skill',
      ].join('\n')
    );
    fs.writeFileSync(path.join(skillPath, 'implementation.js'), 'export default {};');
  });

  afterEach(() => {
    fs.rmSync(rootDir, { recursive: true, force: true });
  });

  it('catalogues the preferred definition file through SkillsCatalog', () => {
    const catalog = new SkillsCatalog({ rootDir });

    const skills = catalog.scanAgentSkills();

    expect(skills).toHaveLength(1);
    expect(skills[0].path).toBe(path.join(skillPath, 'SKILL.md'));
  });

  it('uses the skill directory name when generating registry metadata', () => {
    const generator = new SkillsRegistryGenerator({ rootDir });

    const skills = generator.scanAllSkills();

    expect(skills).toHaveLength(1);
    expect(skills[0]).toEqual(
      expect.objectContaining({
        id: 'test-skill',
        name: 'test-skill',
        category: 'uncategorised',
        location: 'test-agent',
      })
    );
    expect(skills[0].agentskills_compliant).toBe(true);
    expect(skills[0].compliance_violations).toEqual(['hasInputs', 'hasOutputs', 'hasExamples']);
  });

  it('derives the category from a provider grouping directory', () => {
    const providerPath = path.join(
      rootDir,
      'agents',
      'test-agent',
      'skills',
      'plugin-provided',
      'github'
    );
    fs.mkdirSync(providerPath, { recursive: true });
    fs.writeFileSync(
      path.join(providerPath, 'SKILL.md'),
      ['---', 'name: github', 'description: Provider skill.', '---'].join('\n')
    );

    const generator = new SkillsRegistryGenerator({ rootDir });
    const skills = generator.scanAllSkills();
    const providerSkill = skills.find((skill) => skill.id === 'github');

    expect(providerSkill).toBeDefined();
    expect(providerSkill).toEqual(
      expect.objectContaining({
        id: 'github',
        name: 'github',
        category: 'plugin-provided',
        location: 'test-agent',
      })
    );
  });

  it('normalises provider-namespaced names to schema-legal segments', () => {
    const generator = new SkillsRegistryGenerator({ rootDir });

    expect(generator.generateSkillId('github__github')).toBe('github-github');
    expect(generator.sanitiseSegment('Google Drive')).toBe('google-drive');
  });
});
