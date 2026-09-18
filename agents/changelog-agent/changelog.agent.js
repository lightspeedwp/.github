/**
 * Changelog Agent
 * Portable changelog management agent with validation and formatting
 */

const validator = require("./includes/changelogValidator.cjs");
const formatter = require("./includes/changelogFormatter.cjs");
const parser = require("./includes/keepAChangelogParser.cjs");

/**
 * Validate a changelog entry before adding to [Unreleased]
 * Performs Gate 1 validation (entry format)
 *
 * @param {Object} entry - { title, description, prLink }
 * @param {Object} options - { autoFormat, changelogPath }
 * @returns {Promise<Object>} Validation result with optional formatting
 */
async function validateEntry(entry = {}, options = {}) {
  const { autoFormat = false } = options;

  const result = {
    valid: false,
    errors: [],
    entry,
    formatted: null,
    status: "pending",
    message: "",
  };

  try {
    // Validate against the canonical rule set. The validator returns
    // { metadata, validation: { ruleResults, summary, complianceScore,
    // complianceStatus } }; map it onto this wrapper's {valid, errors}
    // contract. A "warning" status still counts as valid (non-blocking).
    const validation = validator.validateEntry(entry);
    const summary = validation.validation?.summary || {};
    const failedIssues = summary.issues || [];
    const errors = failedIssues.map(
      (i) => i.message || i.ruleId || "validation failed",
    );

    if (validation.validation?.complianceStatus === "failing") {
      result.errors.push(...errors);
    }

    // Auto-format if requested and has errors
    if (autoFormat && result.errors.length > 0) {
      const formatted = formatter.formatEntryComprehensive(entry);
      result.formatted = formatted;

      // Re-validate formatted entry (same standard-shape mapping)
      const revalidation = validator.validateEntry(formatted);
      const reformattedErrors = (
        revalidation.validation?.summary?.issues || []
      ).map((i) => i.message || i.ruleId || "validation failed");
      if (revalidation.validation?.complianceStatus !== "failing") {
        result.valid = true;
        result.entry = formatted;
        result.status = "success";
        result.message = "Entry auto-formatted and validated successfully";
      } else {
        result.errors = reformattedErrors;
        result.status = "failed";
        result.message = "Entry could not be auto-formatted";
      }
    } else if (result.errors.length === 0) {
      result.valid = true;
      result.status = "success";
      result.message = "Entry is valid";
    } else {
      result.status = "failed";
      result.message = `Entry validation failed: ${result.errors.join(", ")}`;
    }
  } catch (error) {
    result.status = "failed";
    result.message = error.message;
    result.errors.push(error.message);
  }

  return result;
}

/**
 * Validate changelog file structure
 * Performs Gate 2 validation (full changelog validation)
 *
 * @param {string} changelogPath
 * @param {Object} options - { parseContent }
 * @returns {Promise<Object>} Validation result with parsed content
 */
async function validateChangelog(changelogPath, options = {}) {
  const { parseContent = false } = options;

  const result = {
    valid: false,
    errors: [],
    warnings: [],
    parsed: null,
    status: "pending",
    message: "",
  };

  try {
    // Validate structure: the file must be a Keep a Changelog document
    // with a top-level title and at least one version section. Parsing
    // alone never throws, so check the markers explicitly.
    const fs = require("fs");
    const content = fs.readFileSync(changelogPath, "utf8");
    const structureErrors = [];
    if (!/^# Changelog/m.test(content)) {
      structureErrors.push("Missing top-level '# Changelog' title");
    }
    if (!/^## \[/m.test(content)) {
      structureErrors.push("No version sections (## [x.y.z]) found");
    }

    result.errors = structureErrors;
    result.valid = structureErrors.length === 0;

    // Parse if requested
    if (parseContent) {
      try {
        result.parsed = parser.parseChangelog(changelogPath);
      } catch (error) {
        result.warnings.push(`Could not parse changelog: ${error.message}`);
      }
    }

    if (result.valid) {
      result.status = "success";
      result.message = "Changelog structure is valid";
    } else {
      result.status = "failed";
      result.message = `Changelog validation failed: ${result.errors.join(", ")}`;
    }
  } catch (error) {
    result.status = "failed";
    result.message = error.message;
    result.errors.push(error.message);
  }

  return result;
}

/**
 * Process changelog for release
 * Converts [Unreleased] to [version] and updates references
 *
 * @param {string} changelogPath
 * @param {string} version - New version (e.g. "1.2.3")
 * @param {string} date - Release date (e.g. "2026-08-09")
 * @returns {Promise<Object>} Processing result with updated content
 */
async function processChangelog(changelogPath, version, date) {
  const result = {
    success: false,
    errors: [],
    updated: false,
    version,
    date,
    content: null,
    status: "pending",
    message: "",
  };

  try {
    // Parse current changelog
    const parsed = parser.parseChangelog(changelogPath);

    // Check [Unreleased] exists and has entries
    if (!parsed.unreleased || parsed.unreleased.length === 0) {
      result.errors.push("[Unreleased] section is empty or missing");
      result.status = "failed";
      result.message = "No unreleased entries to process";
      return result;
    }

    // Convert [Unreleased] to [version]
    const updated = parser.convertUnreleasedToRelease(
      parsed.content,
      version,
      date,
    );

    // Write back to file
    const writeSuccess = parser.writeChangelog(changelogPath, updated);

    if (writeSuccess) {
      result.success = true;
      result.updated = true;
      result.content = updated;
      result.status = "success";
      result.message = `Changelog updated: [Unreleased] → [${version}] - ${date}`;
    } else {
      result.errors.push("Failed to write changelog to file");
      result.status = "failed";
      result.message = "Could not update changelog file";
    }
  } catch (error) {
    result.status = "failed";
    result.message = error.message;
    result.errors.push(error.message);
  }

  return result;
}

/**
 * Add entry to changelog
 * @param {string} changelogPath
 * @param {Object} entry - { category, text, prLink }
 * @param {Object} options - { validate, autoFormat }
 * @returns {Promise<Object>} Result with updated changelog
 */
async function addEntry(changelogPath, entry = {}, options = {}) {
  const { validate = true, autoFormat = false } = options;

  const result = {
    success: false,
    errors: [],
    updated: false,
    entry,
    status: "pending",
    message: "",
  };

  try {
    // Validate entry if requested
    if (validate) {
      const validation = await validateEntry(entry, { autoFormat });

      if (!validation.valid) {
        result.errors = validation.errors;
        result.status = "failed";
        result.message = `Entry validation failed: ${validation.errors.join(", ")}`;
        return result;
      }

      if (autoFormat && validation.formatted) {
        result.entry = validation.formatted;
      }
    }

    // Read and append to changelog
    const fs = require("fs");
    const currentContent = fs.readFileSync(changelogPath, "utf8");
    const updated = parser.appendEntry(currentContent, {
      category: entry.category || "Changed",
      text: entry.text || entry.title || "",
    });

    // Write back
    const writeSuccess = parser.writeChangelog(changelogPath, updated);

    if (writeSuccess) {
      result.success = true;
      result.updated = true;
      result.status = "success";
      result.message = "Entry added to [Unreleased] section";
    } else {
      result.errors.push("Failed to write changelog");
      result.status = "failed";
    }
  } catch (error) {
    result.status = "failed";
    result.message = error.message;
    result.errors.push(error.message);
  }

  return result;
}

/**
 * Audit all changelog entries for a specific release or date range
 * Validates each entry and collects results for compliance reporting
 *
 * @param {string} changelogPath - Path to changelog file
 * @param {string} version - Version to audit (e.g. "1.2.0"), or null for date-range audit
 * @param {Object} options - { branch, fromDate, toDate }
 * @returns {Promise<Object>} Audit data with all validation results
 */
async function auditRelease(changelogPath, version, options = {}) {
  const { branch = "main", fromDate = null, toDate = null } = options;

  const result = {
    success: false,
    error: null,
    audit_date: new Date().toISOString(),
    scope: version
      ? `release:${version}`
      : `date-range:${fromDate}-${toDate}`,
    version,
    branch,
    total_entries: 0,
    entries: [],
    passing_entries: [],
    failing_entries: [],
    warning_entries: [],
    status: "pending",
    message: "",
  };

  try {
    // Parse changelog
    const parsed = parser.parseChangelog(changelogPath);

    let releaseEntries = [];

    // Get entries based on audit type
    if (version) {
      // Version-based audit
      if (!parsed.releases || !parsed.releases[version]) {
        result.error = `No entries found for version ${version}`;
        result.status = "failed";
        result.message = `Version ${version} not found in changelog`;
        return result;
      }
      releaseEntries = parsed.releases[version];
    } else if (fromDate && toDate) {
      // Date-range audit - collect all entries within date range
      // Note: This is simplified - real implementation would parse dates from headers
      if (parsed.releases) {
        for (const v in parsed.releases) {
          releaseEntries.push(...parsed.releases[v]);
        }
      }
      result.scope = `date-range:${fromDate}-${toDate}`;
    } else {
      result.error = "Must provide either version or date range";
      result.status = "failed";
      result.message = "Audit requires either --release <version> or --from/--to dates";
      return result;
    }

    result.total_entries = 0;

    // Validate each category's items
    for (const section of releaseEntries) {
      const { category, items } = section;

      for (const itemText of items) {
        result.total_entries += 1;

        // Build entry object for validation
        const entry = {
          title: itemText.substring(0, 100), // First 100 chars as title
          description: itemText,
          category: category.toLowerCase(),
          version,
        };

        // Validate the entry
        const validation = validator.validateEntry(entry);

        // Collect results
        const entryResult = {
          index: result.total_entries,
          category,
          text: itemText,
          validation: validation.validation || validation,
          status:
            validation.validation?.complianceStatus ||
            validation.complianceStatus,
        };

        result.entries.push(entryResult);

        // Categorize by status
        const status =
          validation.validation?.complianceStatus ||
          validation.complianceStatus;
        if (status === "passing") {
          result.passing_entries.push(entryResult);
        } else if (status === "failing") {
          result.failing_entries.push(entryResult);
        } else if (status === "warning") {
          result.warning_entries.push(entryResult);
        }
      }
    }

    // Calculate compliance
    const passed = result.passing_entries.length;
    const total = result.total_entries;
    const compliance = total > 0 ? (passed / total) * 100 : 0;

    result.compliance_percentage = Math.round(compliance * 10) / 10;
    result.passed_count = passed;
    result.failed_count = result.failing_entries.length;
    result.warning_count = result.warning_entries.length;

    result.success = true;
    result.status = "success";
    const scopeDesc = version ? `version ${version}` : `date range ${fromDate} to ${toDate}`;
    result.message = `Audited ${total} entries for ${scopeDesc}: ${passed} passing, ${result.failed_count} failing, ${result.warning_count} warnings`;
  } catch (error) {
    result.error = error.message;
    result.status = "failed";
    result.message = `Audit failed: ${error.message}`;
  }

  return result;
}

/**
 * Collect metrics snapshot for current changelog state
 * @param {string} changelogPath - Path to changelog file
 * @param {Object} options - { version, includeDetails }
 * @returns {Promise<Object>} Metrics collection result
 */
async function collectMetricsSnapshot(changelogPath, options = {}) {
  const metricsBuilder = require("./includes/metricsSnapshotBuilder.cjs");

  const { version = null } = options;

  const result = {
    success: false,
    error: null,
    snapshot: null,
    file_path: null,
    status: "pending",
    message: "",
  };

  try {
    // Audit the release to get validation data
    const auditResult = await auditRelease(changelogPath, version);

    if (!auditResult.success) {
      result.error = auditResult.error;
      result.status = "failed";
      result.message = `Metrics collection failed: ${auditResult.message}`;
      return result;
    }

    // Build metrics snapshot
    const snapshot = metricsBuilder.buildMetricsSnapshot({
      snapshot_date: new Date().toISOString(),
      total_entries: auditResult.total_entries,
      compliant_entries: auditResult.passing_entries.length,
      entries: auditResult.entries,
      version,
    });

    // Save snapshot
    const saveResult = metricsBuilder.saveMetricsSnapshot(snapshot);

    result.success = true;
    result.snapshot = snapshot;
    result.file_path = saveResult.file_path;
    result.status = "success";
    result.message = `Collected metrics for ${auditResult.total_entries} entries`;
  } catch (error) {
    result.error = error.message;
    result.status = "failed";
    result.message = `Metrics collection error: ${error.message}`;
  }

  return result;
}

/**
 * Export metrics as CSV
 * @param {string} metricsDir - Directory containing metrics snapshots
 * @param {Object} options - { days, outputPath }
 * @returns {Promise<Object>} Export result
 */
async function exportMetricsToCSV(metricsDir, options = {}) {
  const metricsBuilder = require("./includes/metricsSnapshotBuilder.cjs");
  const fs = require("fs");

  const { days = 30, outputPath = "metrics_export.csv" } = options;

  const result = {
    success: false,
    error: null,
    file_path: null,
    rows_exported: 0,
    status: "pending",
    message: "",
  };

  try {
    // Collect metrics files from last N days
    const files = fs.readdirSync(metricsDir).filter((f) => f.endsWith(".json"));

    const now = new Date();
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const snapshots = [];

    for (const file of files) {
      const dateStr = file.replace(".json", "");
      const fileDate = new Date(
        dateStr.substring(0, 4),
        parseInt(dateStr.substring(4, 6)) - 1,
        dateStr.substring(6, 8),
      );

      if (fileDate >= cutoffDate) {
        const snapshot = metricsBuilder.loadMetricsSnapshot(dateStr, metricsDir);
        if (snapshot) {
          snapshots.push(snapshot);
        }
      }
    }

    // Generate CSV
    const csvHeader = `Date,Compliance %,Total Entries,Compliant,Warnings,Failed,Most Common Issue`;
    const csvRows = snapshots.map((s) => {
      const mostCommon = s.most_common_violations?.[0];
      const mostCommonStr = mostCommon
        ? `${mostCommon.rule_id}: ${mostCommon.count}`
        : "N/A";

      return `${s.snapshot_date.split("T")[0]},${s.compliance_percentage},${s.total_entries},${s.compliant_entries},${s.warning_count},${s.error_count},"${mostCommonStr}"`;
    });

    const csvContent = [csvHeader, ...csvRows].join("\n");

    // Write CSV file
    fs.writeFileSync(outputPath, csvContent, "utf8");

    result.success = true;
    result.file_path = outputPath;
    result.rows_exported = csvRows.length;
    result.status = "success";
    result.message = `Exported ${csvRows.length} metrics records to ${outputPath}`;
  } catch (error) {
    result.error = error.message;
    result.status = "failed";
    result.message = `CSV export failed: ${error.message}`;
  }

  return result;
}

/**
 * Export release notes in specified format
 * @param {string} changelogPath - Path to changelog file
 * @param {string} version - Version to export (e.g. "1.2.0")
 * @param {Object} options - { format: 'markdown'|'html'|'plaintext', includeLinks }
 * @returns {Promise<Object>} Export result with formatted content
 */
async function exportReleaseNotes(changelogPath, version, options = {}) {
  const releaseNotesGen = require("./includes/releaseNotesGenerator.cjs");
  const referenceLinker = require("./includes/referenceLinker.cjs");

  const { format = "markdown", includeLinks = true } = options;

  const result = {
    success: false,
    error: null,
    format,
    version,
    content: null,
    status: "pending",
    message: "",
  };

  try {
    // Parse changelog
    const parsed = parser.parseChangelog(changelogPath);

    // Get entries for this version
    if (!parsed.releases || !parsed.releases[version]) {
      result.error = `No entries found for version ${version}`;
      result.status = "failed";
      result.message = `Version ${version} not found in changelog`;
      return result;
    }

    const releaseEntries = parsed.releases[version];
    const entries = [];

    // Build entry objects
    for (const section of releaseEntries) {
      const { category, items } = section;

      for (const itemText of items) {
        const entry = {
          text: itemText,
          category: category,
          pr_links: [],
          issue_links: [],
        };

        // Extract and enrich links if requested
        if (includeLinks) {
          const prs = referenceLinker.extractPRReferences(itemText);
          const issues = referenceLinker.extractIssueReferences(itemText);

          for (const pr of prs) {
            entry.pr_links.push({
              number: pr,
              url: referenceLinker.buildPRUrl("lightspeedwp", "ls-flow", pr),
              valid: true,
            });
          }

          for (const issue of issues) {
            entry.issue_links.push({
              number: issue,
              url: referenceLinker.buildIssueUrl(
                "lightspeedwp",
                "ls-flow",
                issue,
              ),
              valid: true,
            });
          }

          entry.linked_text = itemText;
        } else {
          entry.linked_text = itemText;
        }

        entries.push(entry);
      }
    }

    // Generate release notes in requested format
    let content;
    const releaseDate = parsed.dates[version] || new Date().toISOString().split("T")[0];

    switch (format.toLowerCase()) {
      case "html":
        content = releaseNotesGen.generateHTMLReleaseNotes(
          version,
          releaseDate,
          entries,
        );
        break;
      case "plaintext":
      case "plain":
      case "text":
        content = releaseNotesGen.generatePlainTextReleaseNotes(
          version,
          releaseDate,
          entries,
        );
        break;
      case "markdown":
      case "md":
      default:
        content = releaseNotesGen.generateMarkdownReleaseNotes(
          version,
          releaseDate,
          entries,
        );
        break;
    }

    result.success = true;
    result.content = content;
    result.status = "success";
    result.message = `Exported ${entries.length} entries as ${format} release notes`;
  } catch (error) {
    result.error = error.message;
    result.status = "failed";
    result.message = `Export failed: ${error.message}`;
  }

  return result;
}

/**
 * Query and analyze trend data from historical metrics
 * Returns trend report with compliance trajectory, velocity, and recommendations
 *
 * @param {Object} options - { days: 30, metricsDir: '.github/reports/changelog-metrics' }
 * @returns {Promise<Object>} Trend report with analysis and recommendations
 */
async function queryMetricsTrend(options = {}) {
  const fs = require("fs");
  const metricsBuilder = require("./includes/metricsSnapshotBuilder.cjs");
  const trendCalc = require("./includes/trendCalculator.cjs");

  const {
    days = 30,
    metricsDir = ".github/reports/changelog-metrics",
  } = options;

  const result = {
    success: false,
    trend_report: null,
    status: "pending",
    message: "",
    snapshots_analyzed: 0,
    error: null,
  };

  try {
    // Calculate date range
    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // Load all available snapshots
    const snapshots = [];

    if (fs.existsSync(metricsDir)) {
      const files = fs.readdirSync(metricsDir)
        .filter(f => f.match(/^\d{8}\.json$/))
        .sort();

      // Filter to requested date range
      for (const file of files) {
        const dateStr = file.replace(".json", "");
        const year = parseInt(dateStr.substring(0, 4));
        const month = parseInt(dateStr.substring(4, 6)) - 1;
        const day = parseInt(dateStr.substring(6, 8));
        const fileDate = new Date(year, month, day);

        if (fileDate >= startDate && fileDate <= now) {
          const snapshotData = metricsBuilder.loadMetricsSnapshot(
            dateStr,
            metricsDir,
          );
          if (snapshotData) {
            snapshots.push(snapshotData);
          }
        }
      }
    }

    if (snapshots.length < 2) {
      result.success = false;
      result.status = "insufficient_data";
      result.message = `Insufficient data: need at least 2 snapshots, found ${snapshots.length}`;
      result.snapshots_analyzed = snapshots.length;
      return result;
    }

    // Generate trend report
    const trendReport = trendCalc.generateTrendReport(snapshots);

    result.success = true;
    result.trend_report = {
      ...trendReport,
      query_params: {
        days,
        start_date: startDate.toISOString(),
        end_date: now.toISOString(),
      },
    };
    result.snapshots_analyzed = snapshots.length;
    result.status = "success";
    result.message = `Analyzed ${snapshots.length} snapshots over ${days} days`;
  } catch (error) {
    result.error = error.message;
    result.status = "failed";
    result.message = `Trend query failed: ${error.message}`;
  }

  return result;
}

/**
 * Check PR changelog validation and set status
 * @param {Object} options - { owner, repo, prNumber, force }
 * @returns {Promise<Object>} Status check result
 */
async function checkPRValidation(options = {}) {
  const prChecker = require("./includes/prStatusChecker.cjs");

  try {
    return prChecker.checkPRStatus(options);
  } catch (error) {
    return {
      success: false,
      status: "error",
      message: error.message,
    };
  }
}

/**
 * Override PR validation check (release managers only)
 * @param {Object} options - { owner, repo, prNumber, reason, user }
 * @returns {Promise<Object>} Override result with audit log
 */
async function overridePRValidation(options = {}) {
  const prChecker = require("./includes/prStatusChecker.cjs");

  try {
    return prChecker.overrideValidation(options);
  } catch (error) {
    return {
      success: false,
      status: "error",
      message: error.message,
    };
  }
}

module.exports = {
  validateEntry,
  validateChangelog,
  processChangelog,
  addEntry,
  auditRelease,
  collectMetricsSnapshot,
  exportMetricsToCSV,
  exportReleaseNotes,
  queryMetricsTrend,
  checkPRValidation,
  overridePRValidation,
};
