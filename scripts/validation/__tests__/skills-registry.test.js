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

  // The real layout is agents/<agent>/skills/<category>/<provider>/<skill>/SKILL.md,
  // for example agents/ai-readiness-agent/skills/plugin-provided/figma/figma-use/SKILL.md.
  describe('provider-grouped skills', () => {
    beforeEach(() => {
      const providerSkillPath = path.join(
        rootDir,
        'agents',
        'test-agent',
        'skills',
        'plugin-provided',
        'github',
        'github-pr-review'
      );
      fs.mkdirSync(providerSkillPath, { recursive: true });
      fs.writeFileSync(
        path.join(providerSkillPath, 'SKILL.md'),
        ['---', 'name: github-pr-review', 'description: Provider skill.', '---'].join('\n')
      );
    });

    it('derives the category from the outermost grouping and the name from the skill directory', () => {
      const skills = new SkillsRegistryGenerator({ rootDir }).scanAllSkills();
      const providerSkill = skills.find((skill) => skill.id === 'github-pr-review');

      expect(providerSkill).toEqual(
        expect.objectContaining({
          id: 'github-pr-review',
          name: 'github-pr-review',
          category: 'plugin-provided',
          location: 'test-agent',
        })
      );
      expect(skills.find((skill) => skill.id === 'github')).toBeUndefined();
    });

    it('descends far enough for SkillsCatalog to catalogue the nested skill', () => {
      const names = new SkillsCatalog({ rootDir }).scanAgentSkills().map((skill) => skill.name);

      expect(names).toEqual(expect.arrayContaining(['test-skill', 'github-pr-review']));
    });
  });

  // The repository's root layout is skills/<skill>/SKILL.md, so the entry file's
  // name must never become the skill name.
  describe('root skills', () => {
    beforeEach(() => {
      for (const name of ['alpha-skill', 'beta-skill']) {
        const dir = path.join(rootDir, 'skills', name);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(
          path.join(dir, 'SKILL.md'),
          ['---', `name: ${name}`, `description: The ${name} skill.`, '---'].join('\n')
        );
      }
      const grouped = path.join(rootDir, 'skills', 'document-skills', 'pdf-skill');
      fs.mkdirSync(grouped, { recursive: true });
      fs.writeFileSync(
        path.join(grouped, 'SKILL.md'),
        ['---', 'name: pdf-skill', 'description: A grouped skill.', '---'].join('\n')
      );
    });

    it('names registry entries after their directories, including grouped ones', () => {
      const rootSkills = new SkillsRegistryGenerator({ rootDir })
        .scanAllSkills()
        .filter((skill) => skill.location === 'root');

      expect(rootSkills.map((skill) => skill.id).sort()).toEqual([
        'alpha-skill',
        'beta-skill',
        'pdf-skill',
      ]);
      expect(rootSkills.find((skill) => skill.id === 'pdf-skill').category).toBe('document-skills');
      expect(rootSkills.some((skill) => skill.id === 'skill')).toBe(false);
    });

    it('catalogues root skills under their directory names, so unrelated skills are not duplicates', () => {
      const catalog = new SkillsCatalog({ rootDir });
      catalog.scanAllSkills();
      const names = catalog.skills.map((skill) => skill.name);

      expect(names).toEqual(expect.arrayContaining(['alpha-skill', 'beta-skill', 'pdf-skill']));
      expect(names).not.toContain('SKILL');
      expect(Object.values(catalog.groupByName()).filter((group) => group.length > 1)).toHaveLength(
        0
      );
    });
  });

  it('normalises provider-namespaced names to schema-legal segments', () => {
    const generator = new SkillsRegistryGenerator({ rootDir });

    expect(generator.generateSkillId('github__github')).toBe('github-github');
    expect(generator.sanitiseSegment('Google Drive')).toBe('google-drive');
  });
});
