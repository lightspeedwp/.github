/**
 * GitHub Check Run Reporter
 * Posts validation results as GitHub Check Runs with annotations
 */

import * as github from '@actions/github';
import * as core from '@actions/core';

export class CheckRunReporter {
  /**
   * Configure the GitHub client and repository used for check run creation.
   * @param {string} token - Token used to authenticate GitHub API requests.
   * @param {string} owner - Repository owner.
   * @param {string} repo - Repository name.
   */
  constructor(token, owner, repo) {
    this.octokit = github.getOctokit(token);
    this.owner = owner;
    this.repo = repo;
  }

  /**
   * Create a completed changelog check run for the pull request head SHA, or
   * context.sha when the pull request head SHA is unavailable. At most 50
   * annotations are included in the request.
   * @param {Object} context - GitHub Actions context with payload and SHA.
   * @param {Object} validationResult - Report with summary and optional violations.
   * @returns {Promise<Object>} GitHub API response for the created check run.
   * @throws {Error} Propagates errors from the GitHub check creation request.
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
   * Choose failure for any failed entries, neutral for warnings or a missing
   * result or summary, and success otherwise.
   * @param {Object} validationResult - Report whose summary contains failed and warning counts.
   * @returns {string} The check run conclusion.
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
   * Format the check title and summary from passed, failed, and warning counts.
   * Missing counts default to zero; annotations come from top-level violations
   * and are not limited here.
   * @param {Object} validationResult - Report with summary and optional violations.
   * @returns {Object} Check output with title, summary, and annotations.
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
   * Annotate each violation at line 1 of CHANGELOG.md using its rule, entry,
   * message, optional details, and severity. Missing fields use fallback text;
   * non-array or empty input produces no annotations.
   * @param {Array} violations - Violation objects to annotate.
   * @returns {Array} GitHub annotation objects, without a count limit.
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
   * Map severity to a GitHub annotation level, ignoring case. Critical and high
   * are failures, medium is a warning, and low or unknown values are notices.
   * @param {string} severity - Violation severity.
   * @returns {string} The annotation level.
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
