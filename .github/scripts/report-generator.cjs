/**
 * Report Generator (T007)
 * Generates compliance reports in JSON and Markdown formats
 * Handles compliance metrics, violation summaries, and trend analysis
 */

const fs = require('fs');
const path = require('path');

/**
 * Canonical severity buckets, in descending order of weight.
 *
 * The contract (audit-report.contract.md) defines severity values as
 * lowercase, while AuditViolation and governance-rules.json use uppercase.
 * Buckets are keyed uppercase here and lowercased on serialisation, so both
 * spellings are accepted from callers without either source being rewritten.
 */
const SEVERITIES = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'UNKNOWN'];

const DEFAULT_SEVERITY = 'MEDIUM';

/**
 * The contract's violation id pattern (^violation-\d{8}-\d{3}$) has a
 * three-digit sequence, capping a single report at 999 violations.
 */
const MAX_CONTRACT_VIOLATIONS = 999;

/**
 * Format a date as the YYYYMMDD stamp the contract's id patterns use.
 *
 * @param {Date} date - Date to format.
 * @returns {string} Eight-digit date stamp.
 */
function dateStamp(date) {
	return date.toISOString().split('T')[0].replace(/-/g, '');
}

/**
 * Format a date as the HHMMSS stamp the contract's id patterns use.
 *
 * @param {Date} date - Date to format.
 * @returns {string} Six-digit time-of-day stamp.
 */
function timeStamp(date) {
	return date.toISOString().split('T')[1].split('.')[0].replace(/:/g, '');
}

/**
 * Build the report id required by the contract pattern ^audit-\d{8}-\d{6}$.
 *
 * @param {Date} date - Date the audit ran.
 * @returns {string} Report identifier.
 */
function generateReportId(date) {
	return `audit-${dateStamp(date)}-${timeStamp(date)}`;
}

/**
 * Coerce a value to a string, falling back when it is not a usable string.
 *
 * @param {*} value - Value to coerce.
 * @param {string} fallback - Value used when the input is not a string.
 * @returns {string} A non-empty string.
 */
function text(value, fallback) {
	return typeof value === 'string' && value !== '' ? value : fallback;
}

/**
 * Return a violation id matching the contract pattern ^violation-\d{8}-\d{3}$.
 *
 * AuditViolation builds ids as `<ruleId>-<uuid>`, which the contract does not
 * accept, so a conformant id is derived from the report date and the
 * violation's position instead.
 *
 * @param {*} id - Id supplied by the caller, used when already conformant.
 * @param {number} index - Zero-based position within the report.
 * @param {string} timestamp - Report timestamp, ISO 8601.
 * @param {Set<string>} used - Ids already allocated in this report.
 * @returns {string} Contract-conformant violation identifier unique within the report.
 */
function contractViolationId(id, index, timestamp, used) {
	const stamp = dateStamp(new Date(timestamp));
	const isTaken = (candidate) =>
		used instanceof Set && used.has(candidate);

	// Keep a conformant id only when nothing else in the report claims it.
	// A passed-through id can otherwise collide with the positional id a later
	// violation would be given, or with another passed-through id.
	if (
		typeof id === 'string' &&
		/^violation-\d{8}-\d{3}$/.test(id) &&
		!isTaken(id)
	) {
		return id;
	}

	// The contract's id pattern has a three-digit sequence, so a single report
	// can carry at most 999 violations. Search the whole range rather than
	// deriving from the index, which can land on a taken sequence.
	for (let sequence = 1; sequence <= MAX_CONTRACT_VIOLATIONS; sequence += 1) {
		const candidate = `violation-${stamp}-${String(sequence).padStart(3, '0')}`;
		if (!isTaken(candidate)) {
			return candidate;
		}
	}

	throw new RangeError(
		`Report carries more than ${MAX_CONTRACT_VIOLATIONS} violations; ` +
			"the audit-report contract's violation id pattern " +
			"(^violation-\\d{8}-\\d{3}$) cannot express a unique id beyond that.",
	);
}

/**
 * Map any casing of a known severity onto its canonical bucket.
 *
 * @param {string} severity - Severity as supplied by the caller.
 * @returns {string} One of SEVERITIES; UNKNOWN when unrecognised.
 */
function normaliseSeverity(severity) {
	if (severity === undefined || severity === null || severity === '') {
		return DEFAULT_SEVERITY;
	}
	if (typeof severity !== 'string') {
		return 'UNKNOWN';
	}
	const upper = severity.trim().toUpperCase();
	if (upper === '') {
		return DEFAULT_SEVERITY;
	}
	return SEVERITIES.includes(upper) ? upper : 'UNKNOWN';
}

/**
 * Display order for the severity buckets, most severe first.
 *
 * UNKNOWN ranks last: an unrecognised severity is not treated as more urgent
 * than a recognised one.
 */
const SEVERITY_RANK = {
	CRITICAL: 0,
	HIGH: 1,
	MEDIUM: 2,
	LOW: 3,
	UNKNOWN: 4,
};

/**
 * Read a violation's line number from either location shape.
 *
 * AuditViolation exposes `line`; a plain object may carry `location.line`.
 *
 * @param {Object} violation - Violation to inspect.
 * @returns {number|null} The line, or null when absent or not a number.
 */
function violationLine(violation) {
	const raw =
		violation && violation.location && violation.location.line !== undefined
			? violation.location.line
			: violation && violation.line;
	// Number(null) is 0 and Number("") is 0, so an absent line has to be
	// rejected before coercion or it would sort as line 0.
	if (raw === undefined || raw === null || raw === '') {
		return null;
	}
	const parsed = Number(raw);
	return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Order violations for rendering, per clarification A1: grouped by severity,
 * then ascending by line number within each file.
 *
 * The id is a final tiebreak so the order is total: two violations with the
 * same severity and line would otherwise be ordered by input, which would make
 * the rendered report depend on the order the violations happened to arrive in.
 *
 * @param {Object} a - First violation.
 * @param {Object} b - Second violation.
 * @returns {number} Negative, zero or positive, for Array.sort.
 */
function compareViolations(a, b) {
	const rank =
		(SEVERITY_RANK[normaliseSeverity(a && a.severity)] ??
			SEVERITY_RANK.UNKNOWN) -
		(SEVERITY_RANK[normaliseSeverity(b && b.severity)] ??
			SEVERITY_RANK.UNKNOWN);
	if (rank !== 0) {
		return rank;
	}

	const lineA = violationLine(a);
	const lineB = violationLine(b);
	// A violation with no line sorts after those that have one.
	const lineRank = (lineA === null ? Number.MAX_SAFE_INTEGER : lineA) -
		(lineB === null ? Number.MAX_SAFE_INTEGER : lineB);
	if (lineRank !== 0) {
		return lineRank;
	}

	return String(text(a && a.id, '')).localeCompare(String(text(b && b.id, '')));
}

class ComplianceReport {
	constructor(options = {}) {
		// Read the clock once so reportId and timestamp cannot disagree.
		const now = new Date();
		this.reportId = generateReportId(now);
		this.timestamp = now.toISOString();
		this.auditDuration = options.auditDuration || 0;
		// The contract types filesScanned as an array of file descriptors.
		// A caller may pass only a count, so keep the count for the summary
		// and default the descriptor list to empty.
		this.filesScanned = Array.isArray(options.filesScanned)
			? options.filesScanned
			: [];
		this.filesScannedCount = Array.isArray(options.filesScanned)
			? options.filesScanned.length
			: Math.max(0, Math.trunc(Number(options.filesScanned)) || 0);
		this.rulesApplied = Array.isArray(options.rulesApplied)
			? options.rulesApplied.map(String)
			: [];
		this.rulesChecked =
			options.rulesChecked === undefined
				? this.rulesApplied.length
				: options.rulesChecked;
		// Default to a clean audit so a caller that omits rulesPassed is not
		// reported as 0% compliant.
		this.rulesPassed =
			options.rulesPassed === undefined
				? this.rulesChecked
				: options.rulesPassed;
		this.violations = options.violations || [];
		this.trends = options.trends || null;
		this.recommendations = options.recommendations || [];
		this.generatedBy = text(options.generatedBy, 'governance-audit-v1.0.0');
		this.metadata = options.metadata || {};
	}

	/**
	 * Calculate compliance percentage
	 */
	getCompliancePercentage() {
		if (this.rulesChecked === 0) return 100;
		const percentage = Math.round((this.rulesPassed / this.rulesChecked) * 100);
		return Math.min(100, Math.max(0, percentage));
	}

	/**
	 * Check if audit passed (no violations found)
	 */
	hasPassed() {
		return this.violations.length === 0;
	}

	/**
	 * Check if compliance percentage meets threshold (progress target, not pass/fail)
	 */
	meetsComplianceTarget(threshold = 95) {
		return this.getCompliancePercentage() >= threshold;
	}

	/**
	 * Get violations by severity
	 *
	 * Every violation lands in exactly one bucket. Unrecognised severities
	 * are kept under UNKNOWN rather than dropped, so the buckets always sum
	 * to violations.length.
	 */
	getViolationsBySeverity() {
		const bySeverity = {};
		for (const severity of SEVERITIES) {
			bySeverity[severity] = [];
		}

		for (const violation of this.violations) {
			bySeverity[normaliseSeverity(violation && violation.severity)].push(
				violation,
			);
		}

		return bySeverity;
	}

	/**
	 * Get violations by file
	 */
	getViolationsByFile() {
		const grouped = new Map();

		for (const violation of this.violations) {
			const file = violation.file || 'unknown';
			if (!grouped.has(file)) {
				grouped.set(file, []);
			}
			grouped.get(file).push(violation);
		}

		// Both levels are sorted so the rendered report does not depend on the
		// order the violations were supplied in: files by path, then violations
		// within each file per compareViolations (A1).
		const byFile = {};
		for (const file of [...grouped.keys()].sort((a, b) => a.localeCompare(b))) {
			byFile[file] = grouped.get(file).sort(compareViolations);
		}

		return byFile;
	}

	/**
	 * Get violation count statistics
	 */
	getViolationStats() {
		const bySeverity = this.getViolationsBySeverity();
		return {
			total: this.violations.length,
			critical: bySeverity.CRITICAL.length,
			high: bySeverity.HIGH.length,
			medium: bySeverity.MEDIUM.length,
			low: bySeverity.LOW.length,
			unknown: bySeverity.UNKNOWN.length,
		};
	}

	/**
	 * Overall audit status per the contract summary.status enum
	 */
	getStatus() {
		const stats = this.getViolationStats();
		if (stats.total === 0) {
			return 'compliant';
		}
		if (stats.critical > 0 || stats.high > 0) {
			return 'violations';
		}
		return 'warnings';
	}

	/**
	 * Describe a violation in the contract's violation shape.
	 *
	 * The contract requires id (^violation-\d{8}-\d{3}$), ruleId, severity
	 * (lowercase enum) and message as strings, so values that arrive null or
	 * out of range are coerced rather than passed through.
	 *
	 * @param {Object} violation - AuditViolation instance or plain object.
	 * @param {string} contractId - Contract-conformant id allocated by the
	 *   caller, unique within the report.
	 * @returns {Object} Violation in the contract shape.
	 */
	_violationToContract(violation, contractId) {
		const source =
			violation && typeof violation.toJSON === 'function'
				? violation.toJSON()
				: violation || {};
		const bucket = normaliseSeverity(source.severity);
		const described = {
			// Allocated by the caller, which holds the set of ids already claimed
			// in this report.
			id: contractId,
			ruleId: text(source.ruleId, 'unknown-rule'),
			// UNKNOWN is not in the contract enum, so an unrecognised severity
			// serialises as the default and is counted in the summary instead.
			// UNKNOWN is not a contract value, so an unrecognised severity
			// serialises as the lowest contract severity rather than inflating
			// a real bucket. The count is reported separately as
			// summary.unknownSeverities.
			severity: (bucket === 'UNKNOWN' ? 'LOW' : bucket).toLowerCase(),
			message: text(source.message, 'No message provided'),
			location: this._locationToContract(source),
		};

		for (const [key, fallback] of [
			['fileId', 'unknown-file'],
			['currentValue', ''],
			['expectedValue', ''],
			['remediation', ''],
		]) {
			if (source[key] !== undefined && source[key] !== null) {
				described[key] = String(source[key]);
			} else if (key === 'fileId') {
				described.fileId = fallback;
			}
		}

		if (Array.isArray(source.affectedSystems)) {
			described.affectedSystems = source.affectedSystems.map(String);
		}

		return described;
	}

	/**
	 * Rewrite recommendation references to the contract violation ids.
	 *
	 * Recommendations are supplied against the source violation ids, which are
	 * replaced during serialisation, so a reference left as-is would not
	 * resolve against the emitted violations. References that match no
	 * violation are left untouched.
	 *
	 * @param {Map<string, string>} idMap - Source id to contract id.
	 * @returns {Array<Object>} Recommendations in the contract shape.
	 */
	_translateRecommendations(idMap) {
		return this.recommendations.map((recommendation) => {
			if (
				!recommendation ||
				!Array.isArray(recommendation.affectedViolations)
			) {
				return recommendation;
			}
			return {
				...recommendation,
				affectedViolations: recommendation.affectedViolations.map(
					(reference) => idMap.get(reference) || reference,
				),
			};
		});
	}

	/**
	 * Build the contract's location object, preferring an explicit location
	 * path over the legacy file property.
	 *
	 * @param {Object} source - Serialised violation.
	 * @returns {Object} Location with at least a path.
	 */
	_locationToContract(source) {
		const location = {
			path: text(
				source.location && source.location.path
					? source.location.path
					: source.file,
				'unknown',
			),
		};

		for (const axis of ['line', 'column']) {
			const value =
				source.location && source.location[axis] !== undefined
					? source.location[axis]
					: source[axis];
			const parsed = Number(value);
			if (Number.isInteger(parsed) && parsed > 0) {
				location[axis] = parsed;
			}
		}

		return location;
	}

	/**
	 * Add trend data
	 */
	/**
	 * Attach trend data.
	 *
	 * @param {Object} trends - Trend object per the contract's trends shape.
	 * @returns {ComplianceReport} This report, for chaining.
	 * @throws {TypeError} When trends is not a plain object.
	 */
	setTrends(trends) {
		if (trends !== null && trends !== undefined && typeof trends !== 'object') {
			throw new TypeError(
				`trends must be an object per the contract, received ${typeof trends}`,
			);
		}
		this.trends = trends;
		return this;
	}

	/**
	 * Serialize to JSON
	 *
	 * The shape is defined by
	 * .github/specs/006-governance-audit/contracts/audit-report.contract.md
	 * (task T007). Required top-level keys are id, timestamp, filesScanned,
	 * rulesApplied, summary, violations and generatedBy.
	 */
	toJSON() {
		const stats = this.getViolationStats();
		// Allocate ids in one pass so each can be checked against the ones
		// already claimed, and record the source-to-contract mapping so
		// recommendation references can be translated.
		const usedIds = new Set();
		const idMap = new Map();
		const serialised = this.violations.map((violation, index) => {
			const source =
				violation && typeof violation.toJSON === 'function'
					? violation.toJSON()
					: violation || {};
			const contractId = contractViolationId(
				source.id,
				index,
				this.timestamp,
				usedIds,
			);
			usedIds.add(contractId);
			idMap.set(source.id, contractId);
			return this._violationToContract(violation, contractId);
		});
		// Tallied from the serialised severities, so the four contract buckets
		// always describe violations[] exactly.
		const bySeverity = { critical: 0, high: 0, medium: 0, low: 0 };
		let unknownSeverities = 0;
		for (const violation of serialised) {
			bySeverity[violation.severity] += 1;
		}
		for (const violation of this.violations) {
			if (normaliseSeverity(violation && violation.severity) === 'UNKNOWN') {
				unknownSeverities += 1;
			}
		}

		return {
			id: this.reportId,
			timestamp: this.timestamp,
			filesScanned: this.filesScanned
				.filter((file) => file && typeof file === 'object')
				.map((file) => ({ status: 'scanned', ...file })),
			rulesApplied: this.rulesApplied,
			summary: {
				totalFiles: this.filesScannedCount,
				totalRules: this.rulesChecked,
				totalViolations: stats.total,
				criticalViolations: stats.critical,
				// A true partition of violations[], so the four buckets always sum
				// to totalViolations. Unrecognised severities are counted
				// separately below.
				violationsBySeverity: bySeverity,
				// Violations whose severity was not recognised, so the anomaly is
				// visible without distorting the severity partition.
				unknownSeverities,
				compliancePercentage: this.getCompliancePercentage(),
				status: this.getStatus(),
			},
			violations: serialised,
			// The contract types trends as an object and does not require it, so
			// an absent trend is omitted rather than emitted as null.
			...(this.trends ? { trends: this.trends } : {}),
			recommendations: this._translateRecommendations(idMap),
			generatedBy: this.generatedBy,
			metadata: this.metadata,
		};
	}

	/**
	 * Serialize to Markdown
	 */
	toMarkdown() {
		const compliance = this.getCompliancePercentage();
		const stats = this.getViolationStats();
		const byFile = this.getViolationsByFile();
		const totalFiles = this.filesScannedCount;
		const auditPassed = this.hasPassed() ? '✅' : '❌';
		const meetsTarget = this.meetsComplianceTarget() ? '✅' : '⚠️';

		let md = `# Governance Audit Report\n\n`;
		md += `**Report ID**: ${this.reportId}\n`;
		md += `**Generated**: ${new Date(this.timestamp).toISOString()}\n\n`;

		md += `## Summary\n\n`;
		md += `| Metric | Value |\n`;
		md += `|--------|-------|\n`;
		md += `| **Audit Status** | ${this.getStatus()} ${auditPassed} |\n`;
		md += `| **Compliance Target** | ${compliance}% ${meetsTarget} |\n`;
		md += `| **Files Scanned** | ${totalFiles} |\n`;
		md += `| **Audit Duration** | ${this.auditDuration}ms |\n`;
		md += `| **Rules Checked** | ${this.rulesChecked} |\n`;
		md += `| **Rules Passed** | ${this.rulesPassed} |\n\n`;

		md += `## Violations\n\n`;
		md += `**Total**: ${stats.total} violations\n\n`;
		md += `| Severity | Count |\n`;
		md += `|----------|-------|\n`;
		md += `| 🔴 CRITICAL | ${stats.critical} |\n`;
		md += `| 🟠 HIGH | ${stats.high} |\n`;
		md += `| 🟡 MEDIUM | ${stats.medium} |\n`;
		md += `| 🔵 LOW | ${stats.low} |\n`;
		md += `| ⚪ UNKNOWN | ${stats.unknown} |\n\n`;

		// Violations by file. getViolationsByFile() has already ordered the
		// files by path and the violations within each by severity then line,
		// so this loop inherits a stable, input-order-independent rendering.
		if (Object.keys(byFile).length > 0) {
			md += `## Violations by File\n\n`;
			for (const [file, violations] of Object.entries(byFile)) {
				md += `### ${file}\n\n`;
				md += `${violations.length} violations found\n\n`;

				for (const violation of violations) {
					md +=
						typeof violation.toMarkdown === 'function'
							? violation.toMarkdown()
							: `### ${text(violation.severity, DEFAULT_SEVERITY)} - ${text(violation.message, 'No message provided')}\n\n`;
				}
			}
		}

		// Trends — field names follow the contract's trends object
		if (this.trends) {
			md += `## Trends\n\n`;
			md += `| Metric | Change |\n`;
			md += `|--------|--------|\n`;

			if (this.trends.previousReportId !== undefined) {
				md += `| Previous Report | ${this.trends.previousReportId} |\n`;
			}

			if (this.trends.violationsTrend !== undefined) {
				const icon =
					this.trends.violationsTrend === 'improving'
						? '📈'
						: this.trends.violationsTrend === 'declining'
							? '📉'
							: '➡️';
				md += `| Trend | ${icon} ${this.trends.violationsTrend} |\n`;
			}

			if (this.trends.violationsFixed !== undefined) {
				md += `| Violations Fixed | ${this.trends.violationsFixed} |\n`;
			}

			if (this.trends.newViolations !== undefined) {
				md += `| New Violations | ${this.trends.newViolations} |\n`;
			}

			if (this.trends.daysImproving !== undefined) {
				md += `| Days Improving | ${this.trends.daysImproving} |\n`;
			}

			md += '\n';
		}

		return md;
	}
}

/**
 * Report writer - saves reports to disk
 */
class ReportWriter {
	constructor(outputDir) {
		this.outputDir = outputDir;
		this._ensureDirectory();
	}

	/**
	 * Ensure output directory exists
	 */
	_ensureDirectory() {
		if (!fs.existsSync(this.outputDir)) {
			fs.mkdirSync(this.outputDir, { recursive: true });
		}
	}

	/**
	 * Write report to JSON file
	 */
	writeJson(report) {
		const filename = `${report.reportId}.json`;
		const filepath = path.join(this.outputDir, filename);
		const content = JSON.stringify(report.toJSON(), null, 2);
		fs.writeFileSync(filepath, content, 'utf8');
		return { format: 'json', filename, filepath };
	}

	/**
	 * Write report to Markdown file
	 */
	writeMarkdown(report) {
		const filename = `${report.reportId}.md`;
		const filepath = path.join(this.outputDir, filename);
		const content = report.toMarkdown();
		fs.writeFileSync(filepath, content, 'utf8');
		return { format: 'markdown', filename, filepath };
	}

	/**
	 * Write both formats
	 */
	writeBoth(report) {
		const json = this.writeJson(report);
		const markdown = this.writeMarkdown(report);
		return { json, markdown };
	}

	/**
	 * Get recent reports
	 */
	getRecentReports(limit = 10) {
		if (!fs.existsSync(this.outputDir)) {
			return [];
		}

		try {
			const files = fs.readdirSync(this.outputDir);
			const jsonFiles = files
				.filter((f) => f.endsWith('.json'))
				.map((f) => ({
					filename: f,
					filepath: path.join(this.outputDir, f),
					mtime: fs.statSync(path.join(this.outputDir, f)).mtime,
				}))
				.sort((a, b) => b.mtime - a.mtime)
				.slice(0, limit);

			return jsonFiles.map((f) => {
				try {
					const content = fs.readFileSync(f.filepath, 'utf8');
					return JSON.parse(content);
				} catch (error) {
					console.error(`Failed to read report ${f.filename}: ${error.message}`);
					return null;
				}
			}).filter((r) => r !== null);
		} catch (error) {
			console.error(`Failed to read reports directory: ${error.message}`);
			return [];
		}
	}
}

module.exports = {
	ComplianceReport,
	ReportWriter,
	SEVERITIES,
	normaliseSeverity,
	generateReportId,
	contractViolationId,
	compareViolations,
	SEVERITY_RANK,
};
