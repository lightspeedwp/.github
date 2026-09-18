import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RULES_PATH = path.join(__dirname, '..', 'rules.json');

class RuleEngine {
  constructor() {
    this.rules = this.loadRules();
    this.ruleImplementations = new Map();
  }

  loadRules() {
    try {
      const rulesContent = fs.readFileSync(RULES_PATH, 'utf-8');
      const rulesData = JSON.parse(rulesContent);
      return rulesData.rules || [];
    } catch (error) {
      console.error(`Failed to load rules from ${RULES_PATH}:`, error.message);
      return [];
    }
  }

  registerRuleImplementation(ruleId, implementation) {
    this.ruleImplementations.set(ruleId, implementation);
  }

  async validateEntry(entry, context = {}) {
    const violations = [];
    const results = [];

    for (const rule of this.rules) {
      const { rule_id, severity, error_message } = rule;

      try {
        const implementation = this.ruleImplementations.get(rule_id);

        if (!implementation) {
          console.warn(`Warning: No implementation for rule ${rule_id}`);
          continue;
        }

        const result = await implementation(entry, context);

        if (!result.passed) {
          violations.push({
            rule_id,
            severity,
            message: error_message || result.message || `Failed: ${rule_id}`,
            details: result.details || null,
          });
        }

        results.push({
          rule_id,
          passed: result.passed,
          severity,
        });
      } catch (error) {
        console.error(`Error executing rule ${rule_id}:`, error.message);
        violations.push({
          rule_id,
          severity: 'critical',
          message: `Error executing rule: ${error.message}`,
        });
      }
    }

    return {
      entry_id: entry.id,
      violations,
      results,
      passed: violations.length === 0,
      failed_count: violations.filter((v) => v.severity === 'critical').length,
      warning_count: violations.filter((v) => v.severity !== 'critical').length,
    };
  }

  async validateEntries(entries, context = {}) {
    const validations = [];
    let totalPassed = 0;
    let totalFailed = 0;

    for (const entry of entries) {
      const validation = await this.validateEntry(entry, context);
      validations.push(validation);

      if (validation.passed) {
        totalPassed++;
      } else {
        totalFailed++;
      }
    }

    return {
      total_entries: entries.length,
      passed: totalPassed,
      failed: totalFailed,
      pass_rate: entries.length > 0 ? ((totalPassed / entries.length) * 100).toFixed(1) : 0,
      validations,
    };
  }

  getRuleById(ruleId) {
    return this.rules.find((r) => r.rule_id === ruleId);
  }

  getRulesByDimension(dimension) {
    return this.rules.filter((r) => r.dimension === dimension);
  }

  getRulesBySeverity(severity) {
    return this.rules.filter((r) => r.severity === severity);
  }

  getAllRules() {
    return this.rules;
  }
}

export default RuleEngine;
