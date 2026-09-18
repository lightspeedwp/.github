/**
 * GitHub Check Run Reporter
 * Posts validation results as GitHub Check Runs with annotations
 */

import * as github from '@actions/github';
import * as core from '@actions/core';

export class CheckRunReporter {
  constructor(token, owner, repo) {
    this.octokit = github.getOctokit(token);
    this.owner = owner;
    this.repo = repo;
  }

  /**
   * Create or update a GitHub Check Run with validation results
   * @param {Object} context - GitHub Actions context
   * @param {Object} validationResult - Result from validation engine
   * @returns {Promise<Object>} Check run response from GitHub API
   */
  async reportCheckRun(context, validationResult) {
    const checkRunName = 'Changelog Validation';
    const headSha = context.payload.pull_request?.head?.sha || context.sha;

    // Determine conclusion based on validation result
    const conclusion = this.determineConclusion(validationResult);

    // Build check run output with title and summary
    const { title, summary, annotations } = this.buildCheckOutput(validationResult);

    try {
      // Create the check run
      const checkRun = await this.octokit.rest.checks.create({
        owner: this.owner,
        repo: this.repo,
        name: checkRunName,
        head_sha: headSha,
        status: 'completed',
        conclusion,
        output: {
          title,
          summary,
          annotations: annotations.slice(0, 50), // GitHub API limit: 50 annotations per check run
        },
      });

      core.info(`✓ Check run created: ${checkRun.data.html_url}`);
      return checkRun;
    } catch (error) {
      core.warning(`Failed to create check run: ${error.message}`);
      throw error;
    }
  }

  /**
   * Determine check conclusion from validation result
   * @param {Object} validationResult - Validation engine result
   * @returns {string} 'success', 'failure', or 'neutral'
   */
  determineConclusion(validationResult) {
    if (!validationResult || !validationResult.summary) {
      return 'neutral';
    }

    const { failed, warnings } = validationResult.summary;

    if (failed > 0) {
      return 'failure';
    }

    if (warnings > 0) {
      return 'neutral'; // Warnings don't fail the check but still show as noteable
    }

    return 'success';
  }

  /**
   * Build check run output (title, summary, annotations)
   * @param {Object} validationResult - Validation engine result
   * @returns {Object} { title, summary, annotations }
   */
  buildCheckOutput(validationResult) {
    const { summary = {}, violations = [] } = validationResult;
    const { passed = 0, failed = 0, warnings = 0 } = summary;
    const totalEntries = passed + failed + warnings;

    // Build title and summary
    let title = '✅ Changelog entries pass validation';
    let summaryText = `All ${totalEntries} entries meet quality standards.`;

    if (failed > 0) {
      title = `❌ Changelog validation failed: ${failed} error(s)`;
      summaryText = `${failed} of ${totalEntries} entries have validation errors.\n\n`;
      summaryText += `**Summary:**\n`;
      summaryText += `- ✅ Passing: ${passed}\n`;
      summaryText += `- ⚠️ Warnings: ${warnings}\n`;
      summaryText += `- ❌ Failing: ${failed}\n`;
    } else if (warnings > 0) {
      title = `⚠️ Changelog validation: ${warnings} warning(s)`;
      summaryText = `${warnings} of ${totalEntries} entries have warnings.\n\n`;
      summaryText += `**Summary:**\n`;
      summaryText += `- ✅ Passing: ${passed}\n`;
      summaryText += `- ⚠️ Warnings: ${warnings}\n`;
    }

    // Build annotations from violations
    const annotations = this.buildAnnotations(violations);

    return {
      title,
      summary: summaryText,
      annotations,
    };
  }

  /**
   * Build GitHub Check Run annotations from violations
   * @param {Array} violations - Array of violation objects
   * @returns {Array} GitHub annotation objects
   */
  buildAnnotations(violations) {
    if (!Array.isArray(violations) || violations.length === 0) {
      return [];
    }

    return violations.map((violation) => {
      const {
        entry_id = 'unknown',
        rule_id = 'unknown',
        severity = 'notice',
        message = 'Validation error',
        details = '',
      } = violation;

      const annotationLevel = this.severityToAnnotationLevel(severity);

      return {
        path: 'CHANGELOG.md',
        start_line: 1, // Line number not tracked in current impl, default to start
        annotation_level: annotationLevel,
        title: `[${rule_id}] Entry ${entry_id}`,
        message: `${message}${details ? `\n\n${details}` : ''}`,
      };
    });
  }

  /**
   * Convert validation severity to GitHub annotation level
   * @param {string} severity - 'critical', 'high', 'medium', 'low'
   * @returns {string} 'failure', 'warning', or 'notice'
   */
  severityToAnnotationLevel(severity) {
    switch (severity?.toLowerCase()) {
      case 'critical':
      case 'high':
        return 'failure';
      case 'medium':
        return 'warning';
      case 'low':
      default:
        return 'notice';
    }
  }
}

export default CheckRunReporter;
