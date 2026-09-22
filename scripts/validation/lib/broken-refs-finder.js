/**
 * Broken Reference Identification (T012)
 * Compares detected references against actual agent/skill paths
 * Generates severity levels for each broken reference
 */

import fs from 'fs';
import path from 'path';

export class BrokenRefsFinder {
  constructor(options = {}) {
    this.rootDir = options.rootDir || process.cwd();
    this.agentPaths = options.agentPaths || ['agents'];
    this.skillPaths = options.skillPaths || ['agents/*/skills', 'skills'];
  }

  /**
   * Build index of valid agent paths
   */
  buildAgentIndex() {
    const agents = new Set();

    for (const agentPath of this.agentPaths) {
      const fullPath = path.join(this.rootDir, agentPath);
      if (fs.existsSync(fullPath)) {
        const entries = fs.readdirSync(fullPath, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory() && !entry.name.startsWith('.')) {
            agents.add(entry.name);
          }
        }
      }
    }

    return agents;
  }

  /**
   * Build index of valid skill paths
   */
  buildSkillIndex() {
    const skills = new Set();

    for (const skillPathPattern of this.skillPaths) {
      // Simple glob pattern expansion
      if (skillPathPattern.includes('*')) {
        const agentPath = skillPathPattern.replace('/skills', '');
        const agentsDir = path.join(this.rootDir, agentPath.replace('*', ''));
        if (fs.existsSync(agentsDir)) {
          const entries = fs.readdirSync(agentsDir, { withFileTypes: true });
          for (const entry of entries) {
            if (entry.isDirectory()) {
              const skillsDir = path.join(agentsDir, entry.name, 'skills');
              if (fs.existsSync(skillsDir)) {
                const skillFiles = fs.readdirSync(skillsDir);
                skillFiles.forEach((file) => skills.add(file.replace(/\.js$/, '')));
              }
            }
          }
        }
      } else {
        // Direct path
        const fullPath = path.join(this.rootDir, skillPathPattern);
        if (fs.existsSync(fullPath)) {
          const entries = fs.readdirSync(fullPath);
          entries.forEach((file) => skills.add(file.replace(/\.js$/, '')));
        }
      }
    }

    return skills;
  }

  /**
   * Determine severity level for broken reference
   */
  determineSeverity(refType, targetType) {
    const severities = {
      'js-import-agent': 'CRITICAL', // Agent not found in import
      'js-import-skill': 'HIGH', // Skill import missing
      'shell-path-agent': 'HIGH', // Shell script references missing agent
      'shell-path-skill': 'MEDIUM', // Shell script references missing skill
      'workflow-uses-agent': 'CRITICAL', // Workflow cannot find agent
      'workflow-run-agent': 'HIGH', // Workflow npm run command missing
    };

    const key = `${refType}-${targetType}`;
    return severities[key] || 'INFO';
  }

  /**
   * Check if a reference is broken
   */
  isBrokenReference(reference, agentIndex, skillIndex) {
    const { value, type } = reference;

    // Normalize value (remove leading ./ and extensions)
    const normalizedValue = value.replace(/^\.\//, '').replace(/\.\w+$/, '');

    // Check if reference exists
    const isAgent = agentIndex.has(normalizedValue);
    const isSkill = skillIndex.has(normalizedValue);

    if (isAgent || isSkill) {
      return {
        isBroken: false,
        severity: 'OK',
      };
    }

    // Determine what type of target was referenced
    const targetType = normalizedValue.includes('skill') ? 'skill' : 'agent';
    const severity = this.determineSeverity(type, targetType);

    return {
      isBroken: true,
      severity,
      suggestedValue: this.suggestCorrection(normalizedValue, agentIndex, skillIndex),
    };
  }

  /**
   * Suggest correction for broken reference (future: fuzzy matching)
   */
  suggestCorrection(_value, _agentIndex, _skillIndex) {
    // Placeholder: full fuzzy matching will be implemented in Phase 3
    return null;
  }

  /**
   * Analyze all references for broken links
   */
  analyzeReferences(references, fileInfo) {
    const agentIndex = this.buildAgentIndex();
    const skillIndex = this.buildSkillIndex();

    const results = [];

    for (const [refType, refList] of Object.entries(references)) {
      if (!Array.isArray(refList)) continue;

      for (const ref of refList) {
        const analysis = this.isBrokenReference(ref, agentIndex, skillIndex);

        results.push({
          file: fileInfo.path,
          referenceType: refType,
          reference: ref.value,
          severity: analysis.severity,
          isBroken: analysis.isBroken,
          suggestedFix: analysis.suggestedValue,
          context: {
            line: ref.line || ref.position,
          },
        });
      }
    }

    return results;
  }
}

export default BrokenRefsFinder;
