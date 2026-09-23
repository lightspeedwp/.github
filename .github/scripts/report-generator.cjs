/**
 * Report Generator (T007)
 * Generates compliance reports in JSON and Markdown formats
 * Handles compliance metrics, violation summaries, and trend analysis
 */

const fs = require('fs');
const path = require('path');

class ComplianceReport {
	constructor(options = {}) {
		this.reportId = this._generateReportId();
		this.timestamp = new Date().toISOString();
		this.auditDuration = options.auditDuration || 0;
		this.filesScanned = options.filesScanned || 0;
		this.filesTotal = options.filesTotal || 0;
		this.rulesChecked = options.rulesChecked || 0;
		this.rulesPassed = options.rulesPassed || 0;
		this.violations = options.violations || [];
		this.trends = options.trends || null;
		this.metadata = options.metadata || {};
	}

	/**
	 * Generate report ID from timestamp
	 */
	_generateReportId() {
		const now = new Date();
		const date = now.toISOString().split('T')[0].replace(/-/g, '');
		const time = now.toISOString().split('T')[1].split('.')[0].replace(/:/g, '');
		return `audit-${date}-${time}`;
	}

	/**
	 * Calculate compliance percentage
	 */
	getCompliancePercentage() {
		if (this.rulesChecked === 0) return 100;
		return Math.round((this.rulesPassed / this.rulesChecked) * 100);
	}

	/**
	 * Check if report passes compliance threshold
	 */
	passesThreshold(threshold = 95) {
		return this.getCompliancePercentage() >= threshold;
	}

	/**
	 * Get violations by severity
	 */
	getViolationsBySeverity() {
		const bySeverity = {
			CRITICAL: [],
			HIGH: [],
			MEDIUM: [],
			LOW: [],
		};

		for (const violation of this.violations) {
			const severity = violation.severity || 'MEDIUM';
			if (bySeverity[severity]) {
				bySeverity[severity].push(violation);
			}
		}

		return bySeverity;
	}

	/**
	 * Get violations by file
	 */
	getViolationsByFile() {
		const byFile = {};

		for (const violation of this.violations) {
			const file = violation.file || 'unknown';
			if (!byFile[file]) {
				byFile[file] = [];
			}
			byFile[file].push(violation);
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
		};
	}

	/**
	 * Add trend data
	 */
	setTrends(trends) {
		this.trends = trends;
		return this;
	}

	/**
	 * Serialize to JSON
	 */
	toJSON() {
		const stats = this.getViolationStats();

		return {
			reportId: this.reportId,
			timestamp: this.timestamp,
			audit: {
				duration: `${this.auditDuration}ms`,
				filesScanned: this.filesScanned,
				filesTotal: this.filesTotal,
			},
			rules: {
				checked: this.rulesChecked,
				passed: this.rulesPassed,
				failed: this.rulesChecked - this.rulesPassed,
			},
			compliance: {
				percentage: this.getCompliancePercentage(),
				passed: this.passesThreshold(),
			},
			violations: {
				total: stats.total,
				critical: stats.critical,
				high: stats.high,
				medium: stats.medium,
				low: stats.low,
				byFile: this.getViolationsByFile(),
				details: this.violations.map((v) => v.toJSON()),
			},
			trends: this.trends,
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
		const passed = this.passesThreshold() ? '✅' : '❌';

		let md = `# Governance Audit Report\n\n`;
		md += `**Report ID**: ${this.reportId}\n`;
		md += `**Generated**: ${new Date(this.timestamp).toLocaleString()}\n\n`;

		md += `## Summary\n\n`;
		md += `| Metric | Value |\n`;
		md += `|--------|-------|\n`;
		md += `| **Compliance** | ${compliance}% ${passed} |\n`;
		md += `| **Files Scanned** | ${this.filesScanned}/${this.filesTotal} |\n`;
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
		md += `| 🔵 LOW | ${stats.low} |\n\n`;

		// Violations by file
		if (Object.keys(byFile).length > 0) {
			md += `## Violations by File\n\n`;
			for (const [file, violations] of Object.entries(byFile)) {
				md += `### ${file}\n\n`;
				md += `${violations.length} violations found\n\n`;

				for (const violation of violations) {
					md += violation.toMarkdown();
				}
			}
		}

		// Trends
		if (this.trends) {
			md += `## Trends\n\n`;
			md += `| Metric | Change |\n`;
			md += `|--------|--------|\n`;

			if (this.trends.complianceTrend !== undefined) {
				const trend = this.trends.complianceTrend >= 0 ? '📈' : '📉';
				md += `| Compliance | ${trend} ${this.trends.complianceTrend}% |\n`;
			}

			if (this.trends.violationsFixed !== undefined) {
				md += `| Violations Fixed | ${this.trends.violationsFixed} |\n`;
			}

			if (this.trends.violationsNew !== undefined) {
				md += `| New Violations | ${this.trends.violationsNew} |\n`;
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
			const content = fs.readFileSync(f.filepath, 'utf8');
			return JSON.parse(content);
		});
	}
}

module.exports = {
	ComplianceReport,
	ReportWriter,
};
