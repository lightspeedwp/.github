/**
 * AuditViolation Builder (T006)
 * Creates and manages governance audit violations
 * Provides violation metadata, remediation guidance, and affected system tracking
 */

class AuditViolation {
	constructor(options = {}) {
		this.id = this._generateId(options);
		this.ruleId = options.ruleId || null;
		this.ruleName = options.ruleName || null;
		this.severity = options.severity || 'MEDIUM';
		this.file = options.file || null;
		this.line = options.line || null;
		this.column = options.column || null;
		this.message = options.message || null;
		this.remediation = options.remediation || null;
		this.affectedSystems = options.affectedSystems || [];
		this.context = options.context || null;
		this.timestamp = new Date().toISOString();
		this.metadata = options.metadata || {};
	}

	/**
	 * Generate unique violation ID
	 */
	_generateId(options) {
		const ruleId = options.ruleId || 'unknown';
		const file = (options.file || 'unknown').replace(/\//g, '-');
		const line = options.line || '0';
		const timestamp = Date.now();
		return `${ruleId}-${file}-${line}-${timestamp}`.substring(0, 64);
	}

	/**
	 * Set location information
	 */
	setLocation(file, line = null, column = null) {
		this.file = file;
		if (line !== null) this.line = line;
		if (column !== null) this.column = column;
		return this;
	}

	/**
	 * Set violation message
	 */
	setMessage(message) {
		this.message = message;
		return this;
	}

	/**
	 * Set remediation guidance
	 */
	setRemediation(remediation) {
		this.remediation = remediation;
		return this;
	}

	/**
	 * Add affected system
	 */
	addAffectedSystem(system) {
		if (!this.affectedSystems.includes(system)) {
			this.affectedSystems.push(system);
		}
		return this;
	}

	/**
	 * Add multiple affected systems
	 */
	addAffectedSystems(systems) {
		for (const system of systems) {
			this.addAffectedSystem(system);
		}
		return this;
	}

	/**
	 * Set context (additional details)
	 */
	setContext(context) {
		this.context = context;
		return this;
	}

	/**
	 * Add metadata
	 */
	addMetadata(key, value) {
		this.metadata[key] = value;
		return this;
	}

	/**
	 * Get location string
	 */
	getLocationString() {
		let location = this.file || 'unknown';
		if (this.line) {
			location += `:${this.line}`;
			if (this.column) {
				location += `:${this.column}`;
			}
		}
		return location;
	}

	/**
	 * Check if violation is critical
	 */
	isCritical() {
		return this.severity === 'CRITICAL';
	}

	/**
	 * Check if violation is high priority
	 */
	isHighPriority() {
		return ['CRITICAL', 'HIGH'].includes(this.severity);
	}

	/**
	 * Serialize to JSON
	 */
	toJSON() {
		return {
			id: this.id,
			ruleId: this.ruleId,
			ruleName: this.ruleName,
			severity: this.severity,
			location: this.getLocationString(),
			file: this.file,
			line: this.line,
			column: this.column,
			message: this.message,
			remediation: this.remediation,
			affectedSystems: this.affectedSystems,
			context: this.context,
			timestamp: this.timestamp,
			metadata: this.metadata,
		};
	}

	/**
	 * Serialize to Markdown
	 */
	toMarkdown() {
		let md = `### ${this.ruleName || 'Unnamed Rule'}\n\n`;
		md += `**Severity**: ${this.severity}\n\n`;
		md += `**Location**: ${this.getLocationString()}\n\n`;
		md += `**Message**: ${this.message || 'No message provided'}\n\n`;

		if (this.remediation) {
			md += `**Remediation**: ${this.remediation}\n\n`;
		}

		if (this.affectedSystems.length > 0) {
			md += `**Affected Systems**: ${this.affectedSystems.join(', ')}\n\n`;
		}

		if (this.context) {
			md += `**Context**: ${this.context}\n\n`;
		}

		return md;
	}
}

/**
 * Create a violation builder
 */
function createViolation(ruleId, ruleName, severity, options = {}) {
	return new AuditViolation({
		ruleId,
		ruleName,
		severity,
		...options,
	});
}

/**
 * Builder pattern for creating violations
 */
class ViolationBuilder {
	constructor() {
		this.violations = [];
	}

	/**
	 * Start building a new violation
	 */
	add(ruleId, ruleName, severity) {
		const violation = new AuditViolation({
			ruleId,
			ruleName,
			severity,
		});
		return new ViolationBuilderStep(violation, this);
	}

	/**
	 * Get all violations
	 */
	build() {
		return this.violations;
	}

	/**
	 * Clear all violations
	 */
	clear() {
		this.violations = [];
		return this;
	}

	/**
	 * Get violations by severity
	 */
	getByServerity(severity) {
		return this.violations.filter((v) => v.severity === severity);
	}

	/**
	 * Get violations by file
	 */
	getByFile(file) {
		return this.violations.filter((v) => v.file === file);
	}

	/**
	 * Get total violation count
	 */
	count() {
		return this.violations.length;
	}

	/**
	 * Get critical violation count
	 */
	criticalCount() {
		return this.violations.filter((v) => v.isCritical()).length;
	}

	/**
	 * Get high priority violation count
	 */
	highPriorityCount() {
		return this.violations.filter((v) => v.isHighPriority()).length;
	}
}

/**
 * Helper for fluent violation building
 */
class ViolationBuilderStep {
	constructor(violation, parent) {
		this.violation = violation;
		this.parent = parent;
	}

	location(file, line, column) {
		this.violation.setLocation(file, line, column);
		return this;
	}

	message(message) {
		this.violation.setMessage(message);
		return this;
	}

	remediation(remediation) {
		this.violation.setRemediation(remediation);
		return this;
	}

	affectedSystems(systems) {
		this.violation.addAffectedSystems(systems);
		return this;
	}

	context(context) {
		this.violation.setContext(context);
		return this;
	}

	metadata(key, value) {
		this.violation.addMetadata(key, value);
		return this;
	}

	end() {
		this.parent.violations.push(this.violation);
		return this.parent;
	}
}

module.exports = {
	AuditViolation,
	ViolationBuilder,
	createViolation,
};
