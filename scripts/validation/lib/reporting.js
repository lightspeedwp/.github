/**
 * Reporting utilities for audit scripts
 * Provides structured logging, JSON serialization, and report formatting
 */

import fs from 'fs';
import path from 'path';

export class Reporter {
  constructor(options = {}) {
    this.verbose = options.verbose || false;
    this.outputDir = options.outputDir || './reports';
    this.format = options.format || 'json';
    this.reports = new Map();
  }

  /**
   * Log a message with optional severity level
   */
  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    console.log(`${prefix} ${message}`);
  }

  /**
   * Log debug information (only if verbose mode enabled)
   */
  debug(message) {
    if (this.verbose) {
      this.log(message, 'debug');
    }
  }

  /**
   * Create a new report section
   */
  startReport(name, description = '') {
    this.reports.set(name, {
      name,
      description,
      startTime: new Date(),
      entries: [],
      stats: {},
    });
  }

  /**
   * Add an entry to the current report
   */
  addEntry(reportName, entry) {
    if (!this.reports.has(reportName)) {
      this.startReport(reportName);
    }
    this.reports.get(reportName).entries.push(entry);
  }

  /**
   * Update report statistics
   */
  updateStats(reportName, stats) {
    if (this.reports.has(reportName)) {
      this.reports.get(reportName).stats = { ...this.reports.get(reportName).stats, ...stats };
    }
  }

  /**
   * Get report data
   */
  getReport(reportName) {
    return this.reports.get(reportName);
  }

  /**
   * Save a report to file
   */
  saveReport(reportName, filename) {
    const report = this.getReport(reportName);
    if (!report) {
      this.log(`Report '${reportName}' not found`, 'error');
      return false;
    }

    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    const filepath = path.join(this.outputDir, filename || `${reportName}.json`);
    const reportData = {
      name: report.name,
      description: report.description,
      generatedAt: report.startTime.toISOString(),
      completedAt: new Date().toISOString(),
      stats: report.stats,
      entries: report.entries,
    };

    try {
      fs.writeFileSync(filepath, JSON.stringify(reportData, null, 2));
      this.log(`Report saved: ${filepath}`, 'info');
      return true;
    } catch (error) {
      this.log(`Failed to save report: ${error.message}`, 'error');
      return false;
    }
  }

  /**
   * Generate summary report
   */
  generateSummary() {
    const summary = {
      totalReports: this.reports.size,
      reports: Array.from(this.reports.values()).map((r) => ({
        name: r.name,
        entryCount: r.entries.length,
        stats: r.stats,
      })),
    };
    return summary;
  }
}

export default Reporter;
