/**
 * Skills Catalog Scanner (T045)
 * Phase 5: Consolidate & Deduplicate Agent Skills
 * Enumerates all skills in agents/[*]/skills/ and skills/ directories
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { collectSkillDirectories, findSkillDefinition } from './skill-directories.js';

class SkillsCatalog {
  constructor(options = {}) {
    this.rootDir = options.rootDir || process.cwd();
    this.agentsDir = path.join(this.rootDir, 'agents');
    this.skillsDir = path.join(this.rootDir, 'skills');
    this.skills = [];
  }

  /**
   * Calculate SHA-256 hash of a file
   */
  calculateFileHash(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return crypto.createHash('sha256').update(content).digest('hex');
    } catch (error) {
      return null;
    }
  }

  /**
   * Scan a single skill file.
   * @param {string} skillPath - The skill's file
   * @param {string} category - Catalogue category
   * @param {string | null} [logicalName] - The skill's name when it is not the
   *   file's own, which is the case for a directory-based skill whose entry
   *   file is `SKILL.md` and whose name is the directory
   */
  scanSkill(skillPath, category, logicalName = null) {
    const skillName = logicalName || path.basename(skillPath, path.extname(skillPath));
    const ext = path.extname(skillPath);

    const skill = {
      name: skillName,
      path: skillPath,
      category,
      filename: path.basename(skillPath),
      extension: ext,
      hash: null,
      size: 0,
      type: this.detectSkillType(skillPath),
      metadata: null,
    };

    try {
      const stats = fs.statSync(skillPath);
      skill.size = stats.size;
      skill.hash = this.calculateFileHash(skillPath);

      // Try to extract metadata if it's a JavaScript file
      if (['.js', '.cjs', '.mjs'].includes(ext)) {
        skill.metadata = this.extractJsMetadata(skillPath);
      }
    } catch (_error) {
      skill.error = _error.message;
    }

    return skill;
  }

  /**
   * Detect skill type from extension and content
   */
  detectSkillType(filePath) {
    const ext = path.extname(filePath).toLowerCase();

    if (['.js', '.cjs', '.mjs'].includes(ext)) return 'javascript';
    if (['.sh', '.bash'].includes(ext)) return 'shell';
    if (['.py'].includes(ext)) return 'python';
    if (['.yml', '.yaml'].includes(ext)) return 'yaml';
    if (['.json'].includes(ext)) return 'json';
    if (['.md'].includes(ext)) return 'markdown';

    return 'unknown';
  }

  /**
   * Extract metadata from JavaScript skill files
   */
  extractJsMetadata(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const metadata = {};

      // Extract export name
      const exportMatch = content.match(/export\s+(?:default\s+)?(?:class|function)\s+(\w+)/);
      if (exportMatch) {
        metadata.exportName = exportMatch[1];
      }

      // Extract JSDoc comment
      const jsdocMatch = content.match(/\/\*\*[\s\S]*?\*\//);
      if (jsdocMatch) {
        metadata.hasJsdoc = true;
        const descMatch = jsdocMatch[0].match(/@description\s+(.*?)(?:\n|$)/);
        if (descMatch) {
          metadata.description = descMatch[1];
        }
      }

      // Extract class/function signature
      const funcMatch = content.match(/(?:class|function)\s+\w+\s*(?:\{|[({][\s\S]*?\))/);
      if (funcMatch) {
        metadata.signature = funcMatch[0].substring(0, 100);
      }

      return Object.keys(metadata).length > 0 ? metadata : null;
    } catch (_error) {
      return null;
    }
  }

  /**
   * Scan skills in agents/[*]/skills/ directories
   */
  scanAgentSkills() {
    const agentSkills = [];

    if (!fs.existsSync(this.agentsDir)) {
      return agentSkills;
    }

    const entries = fs.readdirSync(this.agentsDir, { withFileTypes: true });
    const agentDirs = entries
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
      .map((entry) => path.join(this.agentsDir, entry.name));

    for (const agentDir of agentDirs) {
      const skillsPath = path.join(agentDir, 'skills');

      if (!fs.existsSync(skillsPath)) {
        continue;
      }

      const skillEntries = fs.readdirSync(skillsPath, { withFileTypes: true });

      for (const skillEntry of skillEntries) {
        const skillPath = path.join(skillsPath, skillEntry.name);

        if (skillEntry.isFile()) {
          const skill = this.scanSkill(skillPath, `agent:${path.basename(agentDir)}`);
          agentSkills.push(skill);
        } else if (skillEntry.isDirectory() && !skillEntry.name.startsWith('.')) {
          // Skill subdirectories (agents/{agent}/skills/{skill}/), possibly
          // nested by grouping or provider: catalog each skill directory's
          // definition file under the directory's own name.
          for (const found of collectSkillDirectories(skillPath, [])) {
            const definition = findSkillDefinition(found.directory);
            if (!definition) continue;
            agentSkills.push(
              this.scanSkill(definition, `agent:${path.basename(agentDir)}`, found.name)
            );
          }
        }
      }
    }

    return agentSkills;
  }

  /**
   * Scan skills in root skills/ directory
   */
  scanRootSkills() {
    const rootSkills = [];

    if (!fs.existsSync(this.skillsDir)) {
      return rootSkills;
    }

    // Scan for subdirectories (categories)
    const entries = fs.readdirSync(this.skillsDir, { withFileTypes: true });

    for (const entry of entries) {
      // 'by-category' is SkillsRegistryGenerator's own generated output
      // directory (see phase-6-skills-registry.js) - scanning it here would
      // catalog Phase 6's generated registry files as if they were skills.
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'by-category') {
        // `skills/<skill>/SKILL.md` is the repository's layout: the skill's
        // name is its directory, not the entry file. A grouping directory
        // holding skills is descended until skill directories are found.
        for (const found of collectSkillDirectories(path.join(this.skillsDir, entry.name), [])) {
          const definition = findSkillDefinition(found.directory);
          if (!definition) continue;
          rootSkills.push(this.scanSkill(definition, found.category, found.name));
        }
      }
    }

    return rootSkills;
  }

  /**
   * Scan all skills
   */
  scanAllSkills() {
    console.log('Scanning agent skills...');
    const agentSkills = this.scanAgentSkills();
    console.log(`Found ${agentSkills.length} agent skills`);

    console.log('Scanning root skills...');
    const rootSkills = this.scanRootSkills();
    console.log(`Found ${rootSkills.length} root skills`);

    this.skills = [...agentSkills, ...rootSkills];
    return this.skills;
  }

  /**
   * Group skills by name (for deduplication detection)
   */
  groupByName() {
    const groups = {};

    for (const skill of this.skills) {
      if (!groups[skill.name]) {
        groups[skill.name] = [];
      }
      groups[skill.name].push(skill);
    }

    return groups;
  }

  /**
   * Group skills by hash (for exact duplicates)
   */
  groupByHash() {
    const groups = {};

    for (const skill of this.skills) {
      if (!skill.hash) continue;

      if (!groups[skill.hash]) {
        groups[skill.hash] = [];
      }
      groups[skill.hash].push(skill);
    }

    return groups;
  }

  /**
   * Find exact duplicates
   */
  findExactDuplicates() {
    const duplicates = [];
    const hashGroups = this.groupByHash();

    for (const [hash, skills] of Object.entries(hashGroups)) {
      if (skills.length > 1) {
        duplicates.push({
          hash,
          count: skills.length,
          skills: skills.map((s) => ({
            name: s.name,
            path: s.path,
            category: s.category,
            size: s.size,
          })),
        });
      }
    }

    return duplicates.sort((a, b) => b.count - a.count);
  }

  /**
   * Generate catalog report
   */
  generateCatalog() {
    return {
      timestamp: new Date().toISOString(),
      summary: {
        totalSkills: this.skills.length,
        agentSkills: this.skills.filter((s) => s.category.startsWith('agent:')).length,
        rootSkills: this.skills.filter((s) => !s.category.startsWith('agent:')).length,
        skillsByType: this.groupByType(),
        skillsByCategory: this.groupByCategory(),
      },
      skills: this.skills,
      exactDuplicates: this.findExactDuplicates(),
    };
  }

  /**
   * Group skills by type
   */
  groupByType() {
    const groups = {};

    for (const skill of this.skills) {
      if (!groups[skill.type]) {
        groups[skill.type] = 0;
      }
      groups[skill.type]++;
    }

    return groups;
  }

  /**
   * Group skills by category
   */
  groupByCategory() {
    const groups = {};

    for (const skill of this.skills) {
      if (!groups[skill.category]) {
        groups[skill.category] = 0;
      }
      groups[skill.category]++;
    }

    return groups;
  }
}

export default SkillsCatalog;
