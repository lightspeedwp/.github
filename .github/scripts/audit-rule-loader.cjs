/**
 * AuditRule Loader (T005)
 * Loads and manages audit rules from governance-rules.json
 * Provides rule validation, filtering, and metadata retrieval
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

const ajv = new Ajv();

class AuditRuleLoader {
	constructor(configPath) {
		this.configPath = configPath;
		this.config = null;
		this.rules = [];
		this.severity = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
	}

	/**
	 * Load configuration from JSON file
	 */
	loadConfig() {
		try {
			const content = fs.readFileSync(this.configPath, 'utf8');
			this.config = JSON.parse(content);
			this._validateConfig();
			this.rules = this.config.auditRules || [];
			return this.config;
		} catch (error) {
			throw new Error(`Failed to load audit rules config: ${error.message}`);
		}
	}

	/**
	 * Validate configuration schema
	 */
	_validateConfig() {
		const schema = {
			type: 'object',
			required: ['version', 'auditRules'],
			properties: {
				version: { type: 'string' },
				description: { type: 'string' },
				auditRules: {
					type: 'array',
					items: {
						type: 'object',
						required: ['id', 'name', 'enabled', 'severity'],
						properties: {
							id: { type: 'string' },
							name: { type: 'string' },
							description: { type: 'string' },
							enabled: { type: 'boolean' },
							severity: { enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] },
							file: { type: 'string' },
							validation: { type: 'object' },
						},
					},
				},
				compliance: { type: 'object' },
				reporting: { type: 'object' },
				performance: { type: 'object' },
			},
		};

		const validate = ajv.compile(schema);
		if (!validate(this.config)) {
			const errors = validate.errors.map((e) => `${e.instancePath} ${e.message}`).join('; ');
			throw new Error(`Config validation failed: ${errors}`);
		}
	}

	/**
	 * Get all rules
	 */
	getAllRules() {
		return this.rules;
	}

	/**
	 * Get enabled rules only
	 */
	getEnabledRules() {
		return this.rules.filter((rule) => rule.enabled);
	}

	/**
	 * Get rules by severity
	 */
	getRulesBySeverity(severity) {
		return this.rules.filter((rule) => rule.severity === severity);
	}

	/**
	 * Get rules for a specific file type
	 */
	getRulesByFileType(fileType) {
		return this.rules.filter((rule) => {
			if (!rule.file) return false;
			if (rule.file.includes('/')) {
				// Handle directory paths like ".github/ISSUE_TEMPLATE/"
				return rule.file.includes(fileType);
			}
			return rule.file === fileType;
		});
	}

	/**
	 * Get rule by ID
	 */
	getRuleById(id) {
		return this.rules.find((rule) => rule.id === id);
	}

	/**
	 * Get compliance configuration
	 */
	getComplianceConfig() {
		return this.config.compliance || {};
	}

	/**
	 * Get reporting configuration
	 */
	getReportingConfig() {
		return this.config.reporting || {};
	}

	/**
	 * Get performance targets
	 */
	getPerformanceConfig() {
		return this.config.performance || {};
	}

	/**
	 * Get constitution configuration
	 */
	getConstitutionConfig() {
		return this.config.constitution || {};
	}

	/**
	 * Calculate compliance percentage formula
	 */
	getComplianceFormula() {
		const compliance = this.getComplianceConfig();
		return compliance.compliancePercentageFormula || '(rulesPassedCount / totalRulesCount) * 100';
	}

	/**
	 * Get compliance threshold
	 */
	getComplianceThreshold() {
		const compliance = this.getComplianceConfig();
		return compliance.thresholdPercent || 95;
	}

	/**
	 * Get severity weights for compliance calculation
	 */
	getSeverityWeights() {
		const compliance = this.getComplianceConfig();
		return compliance.severityWeights || { CRITICAL: 10, HIGH: 5, MEDIUM: 2, LOW: 1 };
	}

	/**
	 * Get all principles from constitution
	 */
	getConstitutionPrinciples() {
		const constitution = this.getConstitutionConfig();
		return constitution.principles || [];
	}

	/**
	 * Calculate rule count statistics
	 */
	getStatistics() {
		const allRules = this.getAllRules();
		const enabledRules = this.getEnabledRules();

		return {
			total: allRules.length,
			enabled: enabledRules.length,
			disabled: allRules.length - enabledRules.length,
			bySeverity: {
				CRITICAL: this.getRulesBySeverity('CRITICAL').length,
				HIGH: this.getRulesBySeverity('HIGH').length,
				MEDIUM: this.getRulesBySeverity('MEDIUM').length,
				LOW: this.getRulesBySeverity('LOW').length,
			},
		};
	}

	/**
	 * Validate rule configuration
	 */
	validateRule(rule) {
		const errors = [];

		if (!rule.id) errors.push('Rule missing id');
		if (!rule.name) errors.push('Rule missing name');
		if (!rule.severity || !['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes(rule.severity)) {
			errors.push('Rule missing or invalid severity');
		}
		if (typeof rule.enabled !== 'boolean') errors.push('Rule enabled must be boolean');

		return { valid: errors.length === 0, errors };
	}
}

/**
 * Create loader and load config
 */
function createAuditRuleLoader(configPath) {
	const loader = new AuditRuleLoader(configPath);
	loader.loadConfig();
	return loader;
}

module.exports = {
	AuditRuleLoader,
	createAuditRuleLoader,
};
