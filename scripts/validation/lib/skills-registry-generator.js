/**
 * Skills Registry Generator (T058-T063)
 * Phase 6: Create Skills Registry
 * Generates machine-readable skills registry with agentskills.io compliance
 */

import fs from 'fs';
import path from 'path';

class SkillsRegistryGenerator {
  constructor(options = {}) {
    this.rootDir = options.rootDir || process.cwd();
    this.skillsDir = path.join(this.rootDir, 'skills');
    this.agentsDir = path.join(this.rootDir, 'agents');
  }

  /**
   * T061: Extract skill metadata
   */
  extractSkillMetadata(skillPath, category) {
    try {
      const content = fs.readFileSync(skillPath, 'utf-8');
      const skillName = path.basename(skillPath, path.extname(skillPath));

      const metadata = {
        id: this.generateSkillId(category, skillName),
        name: skillName,
        category,
        path: skillPath,
        description: this.extractDescription(content),
        type: this.detectSkillType(skillPath),
        version: '1.0.0',
        agentskills_io_compliant: this.checkCompliance(content),
      };

      return metadata;
    } catch (error) {
      return null;
    }
  }

  /**
   * Generate skill ID
   */
  generateSkillId(category, skillName) {
    return `${category}/${skillName}`;
  }

  /**
   * T060: Check agentskills.io compliance
   */
  checkCompliance(content) {
    const checks = {
      hasDescription: content.includes('description') || content.includes('Description'),
      hasInputs: content.includes('inputs') || content.includes('input'),
      hasOutputs: content.includes('outputs') || content.includes('output'),
      hasExamples: content.includes('example') || content.includes('Example'),
    };

    const compliant = Object.values(checks).filter(Boolean).length >= 2;

    return {
      compliant,
      checks,
    };
  }

  /**
   * Extract description from content
   */
  extractDescription(content) {
    // Try to extract from JSDoc
    const jsdocMatch = content.match(/\/\*\*[\s\S]*?\*\//);
    if (jsdocMatch) {
      const lines = jsdocMatch[0].split('\n');
      for (const line of lines) {
        const cleanLine = line.replace(/\/\*\*|\*\/|\*|\s+/g, '').trim();
        if (cleanLine && !cleanLine.startsWith('@')) {
          return cleanLine;
        }
      }
    }

    // Try to extract from first comment
    const commentMatch = content.match(/#.*|\/\/.*|<!--.*-->/);
    if (commentMatch) {
      return commentMatch[0].replace(/^[#/\\-\s]+/, '').trim();
    }

    return 'No description available';
  }

  /**
   * Detect skill type
   */
  detectSkillType(filePath) {
    const ext = path.extname(filePath).toLowerCase();

    if (['.js', '.cjs', '.mjs'].includes(ext)) return 'javascript';
    if (['.sh', '.bash'].includes(ext)) return 'shell';
    if (['.py'].includes(ext)) return 'python';
    if (['.yml', '.yaml'].includes(ext)) return 'yaml';
    if (['.json'].includes(ext)) return 'json';

    return 'unknown';
  }

  /**
   * T059: Scan all skills
   */
  scanAllSkills() {
    const skills = [];

    // Scan root skills/
    if (fs.existsSync(this.skillsDir)) {
      const entries = fs.readdirSync(this.skillsDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          const categoryPath = path.join(this.skillsDir, entry.name);
          const files = fs.readdirSync(categoryPath);

          for (const file of files) {
            if (fs.statSync(path.join(categoryPath, file)).isFile()) {
              const skillPath = path.join(categoryPath, file);
              const metadata = this.extractSkillMetadata(skillPath, entry.name);
              if (metadata) skills.push(metadata);
            }
          }
        }
      }
    }

    // Scan agent skills
    if (fs.existsSync(this.agentsDir)) {
      const agents = fs.readdirSync(this.agentsDir, { withFileTypes: true });

      for (const agent of agents) {
        if (agent.isDirectory() && !agent.name.startsWith('.')) {
          const skillsPath = path.join(this.agentsDir, agent.name, 'skills');

          if (fs.existsSync(skillsPath)) {
            const files = fs.readdirSync(skillsPath);

            for (const file of files) {
              if (fs.statSync(path.join(skillsPath, file)).isFile()) {
                const skillPath = path.join(skillsPath, file);
                const category = `agent:${agent.name}`;
                const metadata = this.extractSkillMetadata(skillPath, category);
                if (metadata) skills.push(metadata);
              }
            }
          }
        }
      }
    }

    return skills;
  }

  /**
   * T062: Generate consolidated skills registry
   */
  generateRegistry(skills) {
    return {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      schema: 'https://agentskills.io/schema/v1',
      summary: {
        total: skills.length,
        byCategory: this.groupByCategory(skills),
        compliant: skills.filter((s) => s.agentskills_io_compliant.compliant).length,
        compliancePercentage:
          skills.length === 0
            ? 0
            : Math.round(
                (skills.filter((s) => s.agentskills_io_compliant.compliant).length / skills.length) * 100
              ),
      },
      skills,
    };
  }

  /**
   * T063: Generate per-category registries
   */
  generateCategoryRegistries(skills) {
    const registries = {};

    // Group by category
    const byCategory = this.groupSkillsByCategory(skills);

    for (const [category, categorySkills] of Object.entries(byCategory)) {
      registries[category] = {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        category,
        skills: categorySkills,
        summary: {
          total: categorySkills.length,
          compliant: categorySkills.filter((s) => s.agentskills_io_compliant.compliant).length,
          compliancePercentage:
            categorySkills.length === 0
              ? 0
              : Math.round(
                  (categorySkills.filter((s) => s.agentskills_io_compliant.compliant).length /
                    categorySkills.length) *
                    100
                ),
        },
      };
    }

    return registries;
  }

  /**
   * Group skills by category
   */
  groupByCategory(skills) {
    const groups = {};

    for (const skill of skills) {
      if (!groups[skill.category]) {
        groups[skill.category] = 0;
      }
      groups[skill.category]++;
    }

    return groups;
  }

  /**
   * Group skills by category (with full objects)
   */
  groupSkillsByCategory(skills) {
    const groups = {};

    for (const skill of skills) {
      if (!groups[skill.category]) {
        groups[skill.category] = [];
      }
      groups[skill.category].push(skill);
    }

    return groups;
  }
}

export default SkillsRegistryGenerator;
