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

  describe('what counts as a skill', () => {
    it('records the declared frontmatter description, not the first heading', () => {
      const skills = new SkillsRegistryGenerator({ rootDir }).scanAllSkills();

      expect(skills.find((skill) => skill.id === 'test-skill').description).toBe(
        'Exercises directory-based skill discovery.'
      );
    });

    it.each([
      ['a quoted value', 'description: "Quoted: value."', 'Quoted: value.'],
      ['a folded block', 'description: >\n  First line\n  second line.', 'First line second line.'],
      [
        'a literal block, on one line',
        'description: |\n  Line one\n  Line two',
        'Line one Line two',
      ],
    ])('reads %s', (_label, line, expected) => {
      const content = `---\nname: x\n${line}\nlicense: MIT\n---\n\n# Heading\n`;

      expect(new SkillsRegistryGenerator({ rootDir }).extractDescription(content)).toBe(expected);
    });

    it('does not treat an arbitrary Markdown file as a skill definition', () => {
      const pack = path.join(rootDir, 'skills', 'content-pack');
      fs.mkdirSync(pack, { recursive: true });
      fs.writeFileSync(path.join(pack, 'questionnaire.md'), '# Questionnaire\n');

      const registry = new SkillsRegistryGenerator({ rootDir }).scanAllSkills();
      const catalog = new SkillsCatalog({ rootDir });
      catalog.scanAllSkills();

      expect(registry.some((skill) => skill.id === 'questionnaire')).toBe(false);
      expect(registry.some((skill) => skill.id === 'content-pack')).toBe(false);
      expect(catalog.skills.some((skill) => skill.path.includes('content-pack'))).toBe(false);
    });

    it('does not register the _template-skill scaffold', () => {
      const scaffold = path.join(rootDir, 'skills', '_template-skill');
      fs.mkdirSync(scaffold, { recursive: true });
      fs.writeFileSync(
        path.join(scaffold, 'SKILL.md'),
        '---\nname: template\ndescription: A scaffold.\n---\n'
      );

      const registry = new SkillsRegistryGenerator({ rootDir }).scanAllSkills();
      const catalog = new SkillsCatalog({ rootDir });
      catalog.scanAllSkills();

      expect(registry.some((skill) => skill.id.includes('template'))).toBe(false);
      expect(catalog.skills.some((skill) => skill.path.includes('_template-skill'))).toBe(false);
    });
  });

  it('writes audit output under .github/reports/agents, not into the agents source tree', () => {
    const repoRoot = process.cwd();
    for (const script of [
      'phase-4-structure-audit.js',
      'phase-5-skills-audit.js',
      'phase-6-skills-registry.js',
    ]) {
      const source = fs.readFileSync(path.join(repoRoot, 'scripts', 'validation', script), 'utf-8');
      expect(source).toContain("path.join(ROOT_DIR, '.github', 'reports', 'agents')");
      expect(source).not.toContain('agents/reports');
    }
    const config = JSON.parse(
      fs.readFileSync(path.join(repoRoot, 'scripts', 'validation', 'config.json'), 'utf-8')
    );
    expect(config.reportOutputDir).toBe('.github/reports/agents');
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
