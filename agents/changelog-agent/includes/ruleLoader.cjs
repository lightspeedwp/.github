const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const logger = require('./logger.cjs');
const { ConfigError, FileError } = require('./errors.cjs');

class RuleLoader {
  constructor() {
    this.rulesCache = null;
    this.cacheTimestamp = null;
    this.cacheTTL = 60000; // 1 minute cache for rules (immutable governance file)
  }

  /**
   * Load rules from .github/changelog-rules.yml
   * @param {string} rulesFilePath - Path to changelog-rules.yml
   * @param {boolean} useCache - Whether to use cached rules if available
   * @returns {Object} Parsed and validated rules object
   */
  loadRules(rulesFilePath, useCache = true) {
    try {
      // Check cache validity
      if (useCache && this.rulesCache && this.cacheTimestamp) {
        const cacheAge = Date.now() - this.cacheTimestamp;
        if (cacheAge < this.cacheTTL) {
          logger.debug(`Using cached rules (age: ${cacheAge}ms)`);
          return this.rulesCache;
        }
      }

      // Read and parse YAML file
      if (!fs.existsSync(rulesFilePath)) {
        throw new FileError(`Rules file not found: ${rulesFilePath}`);
      }

      const fileContent = fs.readFileSync(rulesFilePath, 'utf8');
      const parsed = yaml.load(fileContent);

      if (!parsed || typeof parsed !== 'object') {
        throw new ConfigError('Rules file is empty or invalid YAML');
      }

      // Validate schema
      const validated = this.validateRulesSchema(parsed);

      // Cache and return
      this.rulesCache = validated;
      this.cacheTimestamp = Date.now();

      logger.info(`Loaded ${validated.rules.length} rules from ${path.basename(rulesFilePath)}`);
      return validated;
    } catch (error) {
      if (error instanceof FileError || error instanceof ConfigError) {
        throw error;
      }
      if (error instanceof yaml.YAMLException) {
        throw new ConfigError(`YAML parsing error: ${error.message}`);
      }
      throw new FileError(`Failed to load rules: ${error.message}`);
    }
  }

  /**
   * Validate rules schema
   * @param {Object} rulesData - Parsed rules data
   * @returns {Object} Validated rules with defaults applied
   */
  validateRulesSchema(rulesData) {
    // Validate metadata
    if (!rulesData.metadata || typeof rulesData.metadata !== 'object') {
      throw new ConfigError('Missing or invalid "metadata" section in rules file');
    }

    const metadata = rulesData.metadata;
    if (!metadata.version || !metadata.total_rules) {
      throw new ConfigError('Metadata missing required fields: version, total_rules');
    }

    // Validate rules array
    if (!Array.isArray(rulesData.rules)) {
      throw new ConfigError('Rules must be an array');
    }

    // Validate each rule
    const validatedRules = rulesData.rules.map((rule, index) => {
      return this.validateRule(rule, index);
    });

    // Verify rule count matches metadata
    if (validatedRules.length !== metadata.total_rules) {
      logger.warn(
        `Rule count mismatch: metadata says ${metadata.total_rules}, ` +
        `but found ${validatedRules.length} rules`
      );
    }

    return {
      metadata: {
        version: metadata.version,
        total_rules: validatedRules.length,
        created_date: metadata.created_date,
        modified_date: metadata.modified_date,
        modified_by: metadata.modified_by,
        governance: metadata.governance
      },
      rules: validatedRules
    };
  }

  /**
   * Validate individual rule schema
   * @param {Object} rule - Rule object to validate
   * @param {number} index - Rule index (for error reporting)
   * @returns {Object} Validated rule
   */
  validateRule(rule, index) {
    const requiredFields = ['id', 'name', 'version', 'rule_type', 'severity', 'description'];
    const missingFields = requiredFields.filter(field => !rule[field]);

    if (missingFields.length > 0) {
      throw new ConfigError(
        `Rule at index ${index} missing required fields: ${missingFields.join(', ')}`
      );
    }

    // Validate rule_type
    const validTypes = ['format', 'content', 'reference', 'structure'];
    if (!validTypes.includes(rule.rule_type)) {
      throw new ConfigError(
        `Rule ${rule.id} has invalid rule_type: ${rule.rule_type}. ` +
        `Must be one of: ${validTypes.join(', ')}`
      );
    }

    // Validate severity
    const validSeverities = ['error', 'warning'];
    if (!validSeverities.includes(rule.severity)) {
      throw new ConfigError(
        `Rule ${rule.id} has invalid severity: ${rule.severity}. ` +
        `Must be one of: ${validSeverities.join(', ')}`
      );
    }

    // Set defaults
    return {
      id: rule.id,
      name: rule.name,
      version: rule.version,
      enabled: rule.enabled !== false, // Default to true
      rule_type: rule.rule_type,
      severity: rule.severity,
      priority: rule.priority || 50,
      description: rule.description,
      patterns: Array.isArray(rule.patterns) ? rule.patterns : [],
      remediation_guidance: rule.remediation_guidance || 'No remediation guidance provided'
    };
  }

  /**
   * Get a specific rule by ID
   * @param {string} ruleId - Rule ID (e.g., 'R001')
   * @param {string} rulesFilePath - Path to changelog-rules.yml
   * @returns {Object|null} Rule object or null if not found
   */
  getRuleById(ruleId, rulesFilePath) {
    const rulesData = this.loadRules(rulesFilePath);
    return rulesData.rules.find(rule => rule.id === ruleId) || null;
  }

  /**
   * Get all enabled rules, sorted by priority
   * @param {string} rulesFilePath - Path to changelog-rules.yml
   * @returns {Array} Sorted array of enabled rules
   */
  getEnabledRules(rulesFilePath) {
    const rulesData = this.loadRules(rulesFilePath);
    return rulesData.rules
      .filter(rule => rule.enabled)
      .sort((a, b) => (a.priority || 50) - (b.priority || 50));
  }

  /**
   * Get rules by type
   * @param {string} ruleType - Type to filter by (format, structure, content, reference)
   * @param {string} rulesFilePath - Path to changelog-rules.yml
   * @returns {Array} Rules matching the specified type
   */
  getRulesByType(ruleType, rulesFilePath) {
    const rulesData = this.loadRules(rulesFilePath);
    return rulesData.rules.filter(rule => rule.rule_type === ruleType);
  }

  /**
   * Clear cache (for testing)
   */
  clearCache() {
    this.rulesCache = null;
    this.cacheTimestamp = null;
  }
}

module.exports = new RuleLoader();
