/**
 * Skills Registry Generator (T058-T063)
 * Phase 6: Create Skills Registry
 * Generates machine-readable skills registry with agentskills.io compliance
 */

import fs from 'fs';
import path from 'path';
import {
  collectSkillDirectories,
  findSkillDefinition,
  hasSkillDefinition,
} from './skill-directories.js';

class SkillsRegistryGenerator {
  constructor(options = {}) {
    this.rootDir = options.rootDir || process.cwd();
    this.skillsDir = path.join(this.rootDir, 'skills');
    this.agentsDir = path.join(this.rootDir, 'agents');
  }

  /**
   * T061: Extract skill metadata
   *
   * Emits the shape required by the 014 `generatedSkill` contract. Per the
   * Agent Skills specification the `name` must equal the skill's own directory
   * name, so `id` is the bare skill folder name (never `category/skill`) and
   * `category` is the functional grouping segment, not `agent:<name>`.
   */
  extractSkillMetadata(
    skillPath,
    category,
    skillName = null,
    location = 'root',
    skillDirectory = null
  ) {
    try {
      const content = fs.readFileSync(skillPath, 'utf-8');
      const resolvedSkillName = skillName || path.basename(skillPath, path.extname(skillPath));
      const compliance = this.checkCompliance(content);
      const metadata = {
        id: this.generateSkillId(resolvedSkillName),
        name: resolvedSkillName,
        category: this.sanitiseSegment(category),
        location: this.sanitiseSegment(location),
        description: this.extractDescription(content),
        type: this.detectSkillType(skillDirectory || path.dirname(skillPath)),
        version: '1.0.0',
        agentskills_compliant: compliance.compliant,
        compliance_violations: this.collectViolations(compliance),
        used_by: [],
      };

      return metadata;
    } catch {
      return null;
    }
  }

  /**
   * Generate skill ID.
   *
   * The Agent Skills specification requires `name` to match the parent
   * directory and permits only lowercase alphanumerics and hyphens, so the
   * skill folder name is used verbatim once normalised.
   */
  generateSkillId(skillName) {
    return this.sanitiseSegment(skillName);
  }

  /**
   * Reduce a path segment to the characters the schema allows.
   *
   * Provider-namespaced folders (`github__github`) are normalised to
   * `github-github`; the generator never emits characters outside
   * `^[a-z0-9-]+$`.
   */
  sanitiseSegment(segment) {
    const normalised = String(segment ?? '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/-{2,}/g, '-')
      .replace(/^-+|-+$/g, '');

    return normalised || 'unknown';
  }

  /**
   * List the compliance checks that failed, for the schema's
   * `compliance_violations` array.
   */
  collectViolations(compliance) {
    return Object.entries(compliance.checks)
      .filter(([, passed]) => !passed)
      .map(([check]) => check);
  }

  /**
   * T060: Check agentskills.io compliance
   *
   * Structural validation instead of substring matching: a skill is
   * compliant when its SKILL.md frontmatter carries a non-empty name and
   * description. Inputs/outputs/examples are structural signals only
   * (frontmatter keys or Markdown headings), reported for visibility.
   */
  checkCompliance(content) {
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    const frontmatter = frontmatterMatch ? frontmatterMatch[1] : '';
    const hasField = (name) => new RegExp(`^${name}:\\s*\\S`, 'm').test(frontmatter);
    const hasSection = (name) => new RegExp(`^#{1,3}\\s+${name}s?\\b`, 'mi').test(content);
    const checks = {
      hasName: hasField('name'),
      hasDescription: hasField('description'),
      hasInputs: hasField('inputs') || hasSection('input'),
      hasOutputs: hasField('outputs') || hasSection('output'),
      hasExamples: hasField('examples') || hasSection('example'),
    };

    const compliant = checks.hasName && checks.hasDescription;

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
   * Detect skill type.
   *
   * The 014 schema restricts `type` to a fixed vocabulary
   * (action|query|transform|utility), so file extensions cannot be reported
   * directly. Skills carrying executable scripts are `action`; skills that are
   * pure prose are `utility`.
   */
  detectSkillType(skillDirectory) {
    let entries;

    try {
      entries = fs.readdirSync(skillDirectory, { withFileTypes: true });
    } catch {
      return 'utility';
    }

    const hasScripts = entries.some((entry) => entry.isDirectory() && entry.name === 'scripts');

    return hasScripts ? 'action' : 'utility';
  }

  /**
   * Select the entrypoint or metadata file that defines a directory-based skill.
   */
  findSkillDefinition(skillDirectory) {
    return findSkillDefinition(skillDirectory);
  }

  /**
   * Whether a directory is itself a skill (i.e. carries a skill definition).
   */
  hasSkillDefinition(skillDirectory) {
    return hasSkillDefinition(skillDirectory);
  }

  /**
   * Recursively collect skill directories beneath a grouping directory (see
   * `skill-directories.js`, shared with the Phase 5 catalog).
   */
  collectSkillDirectories(directory, groupSegments, depth = 0) {
    return collectSkillDirectories(directory, groupSegments, depth);
  }

  /**
   * T059: Scan all skills
   */
  scanAllSkills() {
    const skills = [];

    // Scan root skills/. An entry is a bare skill directory
    // (skills/<skill>/SKILL.md) or a grouping directory holding skills, so the
    // directory-aware collector is used and the skill name is the directory's
    // name, never the entry file's.
    if (fs.existsSync(this.skillsDir)) {
      const entries = fs.readdirSync(this.skillsDir, { withFileTypes: true });

      for (const entry of entries) {
        // 'by-category' is this generator's own output directory (see
        // generateCategoryRegistries below) - scanning it as a skill category
        // would re-ingest the previous run's generated registry files.
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'by-category') {
          for (const found of this.collectSkillDirectories(
            path.join(this.skillsDir, entry.name),
            []
          )) {
            const definitionPath = this.findSkillDefinition(found.directory);
            if (!definitionPath) continue;
            const metadata = this.extractSkillMetadata(
              definitionPath,
              found.category,
              found.name,
              'root',
              found.directory
            );
            if (metadata) skills.push(metadata);
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
            const skillEntries = fs.readdirSync(skillsPath, { withFileTypes: true });

            for (const skillEntry of skillEntries) {
              const skillPath = path.join(skillsPath, skillEntry.name);

              if (skillEntry.isFile()) {
                const metadata = this.extractSkillMetadata(
                  skillPath,
                  'uncategorised',
                  path.basename(skillEntry.name, path.extname(skillEntry.name)),
                  agent.name,
                  skillsPath
                );
                if (metadata) skills.push(metadata);
              } else if (skillEntry.isDirectory() && !skillEntry.name.startsWith('.')) {
                // A skills/ entry may be a bare skill directory
                // (skills/<skill>/SKILL.md) or a grouping directory holding
                // skills, possibly nested by provider
                // (skills/<category>/<provider>/<skill>/SKILL.md). Descend
                // until skill directories are found, using the outermost
                // grouping segment as the category and the innermost as the
                // skill name.
                for (const entry of this.collectSkillDirectories(skillPath, [])) {
                  const definitionPath = this.findSkillDefinition(entry.directory);
                  if (!definitionPath) continue;

                  const metadata = this.extractSkillMetadata(
                    definitionPath,
                    entry.category,
                    entry.name,
                    agent.name,
                    entry.directory
                  );
                  if (metadata) skills.push(metadata);
                }
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
        compliant: skills.filter((s) => s.agentskills_compliant).length,
        compliancePercentage:
          skills.length === 0
            ? 0
            : Math.round(
                (skills.filter((s) => s.agentskills_compliant).length / skills.length) * 100
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
          compliant: categorySkills.filter((s) => s.agentskills_compliant).length,
          compliancePercentage:
            categorySkills.length === 0
              ? 0
              : Math.round(
                  (categorySkills.filter((s) => s.agentskills_compliant).length /
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
