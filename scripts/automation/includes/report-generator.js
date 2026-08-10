/**
 * Report Generation Utilities
 * Generate reports in multiple formats (JSON, CSV, Markdown)
 * @module scripts/automation/includes/report-generator.js
 */

import fs from "fs";
import path from "path";

/**
 * ReportGenerator provides multi-format report generation
 */
export class ReportGenerator {
  constructor(options = {}) {
    this.verbose = options.verbose || false;
  }

  /**
   * Generate JSON report
   * @param {object} data - Data to include in report
   * @returns {string} JSON string
   */
  generateJSON(data) {
    return JSON.stringify(data, null, 2);
  }

  /**
   * Generate CSV report from data
   * Flattens nested objects and handles arrays
   * @param {object[]} records - Array of records to convert
   * @returns {string} CSV string
   */
  generateCSV(records) {
    if (!Array.isArray(records) || records.length === 0) {
      return "";
    }

    // Extract all unique keys from all records
    const keys = new Set();
    records.forEach((record) => {
      this.extractKeys(record, "", keys);
    });

    const headers = Array.from(keys).sort();
    const rows = [headers.join(",")];

    // Add data rows
    records.forEach((record) => {
      const values = headers.map((key) => {
        const value = this.getNestedValue(record, key);
        const stringValue = String(value === undefined ? "" : value);
        // Escape quotes and wrap in quotes if needed
        const escaped = stringValue.replace(/"/g, '""');
        const needsQuotes =
          escaped.includes(",") ||
          escaped.includes("\n") ||
          escaped.includes('"');
        return needsQuotes ? `"${escaped}"` : escaped;
      });
      rows.push(values.join(","));
    });

    return rows.join("\n");
  }

  /**
   * Generate Markdown report
   * Creates a structured markdown document from data
   * @param {object} data - Data to include in report
   * @returns {string} Markdown string
   */
  generateMarkdown(data) {
    let markdown = "";

    if (data.title) {
      markdown += `# ${data.title}\n\n`;
    }

    if (data.description) {
      markdown += `${data.description}\n\n`;
    }

    if (data.timestamp || data.audit_date) {
      const date = data.timestamp || data.audit_date;
      markdown += `**Generated:** ${date}\n\n`;
    }

    // Add summary section
    if (data.summary) {
      markdown += "## Summary\n\n";
      markdown += this.objectToMarkdownTable(data.summary);
      markdown += "\n\n";
    }

    // Add findings/results section
    if (data.findings) {
      markdown += "## Findings\n\n";
      markdown += this.arrayToMarkdownList(data.findings);
      markdown += "\n\n";
    }

    // Add issues/recommendations
    if (data.recommendations) {
      markdown += "## Recommendations\n\n";
      markdown += this.arrayToMarkdownList(data.recommendations);
      markdown += "\n\n";
    }

    // Add details section
    if (data.details) {
      markdown += "## Details\n\n";
      markdown += this.objectToMarkdownTable(data.details);
      markdown += "\n\n";
    }

    return markdown;
  }

  /**
   * Export report to file
   * @param {string} format - Format (json, csv, markdown)
   * @param {object} data - Data to export
   * @param {string} outputPath - File path to write to
   */
  exportToFile(format, data, outputPath) {
    let content;

    switch (format.toLowerCase()) {
      case "json":
        content = this.generateJSON(data);
        break;
      case "csv":
        // For CSV, data should be an array of records
        content = Array.isArray(data)
          ? this.generateCSV(data)
          : this.generateCSV([data]);
        break;
      case "markdown":
      case "md":
        content = this.generateMarkdown(data);
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, content, "utf-8");

    if (this.verbose) {
      console.log(`Report exported to: ${outputPath}`);
    }

    return outputPath;
  }

  /**
   * Helper: Extract all keys from nested object
   * @private
   */
  extractKeys(obj, prefix, keys) {
    if (obj === null || typeof obj !== "object") {
      return;
    }

    if (Array.isArray(obj)) {
      // For arrays, just add index
      obj.forEach((item, index) => {
        const key = prefix ? `${prefix}[${index}]` : `[${index}]`;
        this.extractKeys(item, key, keys);
      });
    } else {
      Object.keys(obj).forEach((k) => {
        const key = prefix ? `${prefix}.${k}` : k;
        keys.add(key);
        this.extractKeys(obj[k], key, keys);
      });
    }
  }

  /**
   * Helper: Get nested value from object
   * @private
   */
  getNestedValue(obj, path) {
    return path.split(".").reduce((current, part) => {
      if (current === undefined || current === null) {
        return undefined;
      }
      if (part.includes("[")) {
        const [key, index] = part.split("[");
        const idx = parseInt(index.slice(0, -1), 10);
        return current[key]?.[idx];
      }
      return current[part];
    }, obj);
  }

  /**
   * Helper: Convert object to markdown table
   * @private
   */
  objectToMarkdownTable(obj) {
    const rows = ["| Key | Value |", "|-----|-------|"];

    Object.entries(obj).forEach(([key, value]) => {
      const valueStr = this.valueToString(value);
      rows.push(`| ${key} | ${valueStr} |`);
    });

    return rows.join("\n");
  }

  /**
   * Helper: Convert array to markdown list
   * @private
   */
  arrayToMarkdownList(arr) {
    if (!Array.isArray(arr)) {
      return `- ${this.valueToString(arr)}`;
    }

    return arr
      .map((item) => {
        const str = this.valueToString(item);
        return `- ${str}`;
      })
      .join("\n");
  }

  /**
   * Helper: Convert value to string
   * @private
   */
  valueToString(value) {
    if (value === undefined || value === null) {
      return "(empty)";
    }
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return String(value);
  }
}

export default ReportGenerator;
