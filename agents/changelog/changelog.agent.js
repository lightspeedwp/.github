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
    // Validate format
    const formatValidation = validator.validateEntryFormat(entry);

    if (!formatValidation.valid) {
      result.errors.push(...formatValidation.errors);
    }

    // Validate formatting
    const formattingValidation = validator.validateNoFormattingIssues(entry);

    if (!formattingValidation.valid) {
      result.errors.push(...formattingValidation.errors);
    }

    // Auto-format if requested and has errors
    if (autoFormat && result.errors.length > 0) {
      const formatted = formatter.formatEntryComprehensive(entry);
      result.formatted = formatted;

      // Re-validate formatted entry
      const reformatValidation = validator.validateEntry(formatted);
      if (reformatValidation.valid) {
        result.valid = true;
        result.entry = formatted;
        result.status = "success";
        result.message = "Entry auto-formatted and validated successfully";
      } else {
        result.errors = reformatValidation.errors;
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
    // Validate structure
    const structureValidation =
      validator.validateChangelogStructure(changelogPath);

    result.errors = structureValidation.errors;
    result.valid = structureValidation.valid;

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

module.exports = {
  validateEntry,
  validateChangelog,
  processChangelog,
  addEntry,
  auditRelease,
};
