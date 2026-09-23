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
        id: 'agent:test-agent/test-skill',
        name: 'test-skill',
        path: path.join(skillPath, 'SKILL.md'),
      })
    );
    expect(skills[0].agentskills_io_compliant.compliant).toBe(true);
  });
});
