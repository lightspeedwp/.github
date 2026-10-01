/**
 * GitHub Check Run Reporter
 * Posts validation results as GitHub Check Runs with annotations
 */

import * as github from '@actions/github';
import * as core from '@actions/core';

/**
 * Collect the violations from a validator report into a single list.
 *
 * The validator used in production emits violations per entry, under
 * `validations[].violations`, and those violations carry no `entry_id` of their
 * own, so the parent entry's id is added to each. A report that also carries a
 * top-level `violations` array contributes those too: both shapes are merged
 * rather than one replacing the other, because an empty top-level array would
 * otherwise discard every nested violation.
 *
 * Non-array `validations` or `violations` values are ignored rather than
 * thrown on, matching the guard in `buildAnnotations`.
 *
 * @param {Object} report - Validator report, with nested or top-level violations.
 * @returns {Object[]} Violations, each carrying an `entry_id` and a `rule_id`.
 */
function flattenViolations(report) {
  const flattened = Array.isArray(report?.violations) ? [...report.violations] : [];

  for (const entry of Array.isArray(report?.validations) ? report.validations : []) {
    const violations = Array.isArray(entry?.violations) ? entry.violations : [];
    for (const violation of violations) {
      // The violation's own id wins: it is the more specific value.
      flattened.push({ entry_id: entry?.entry_id ?? 'unknown', ...violation });
    }
  }

  return flattened;
}

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
   * Choose the conclusion from the count of failures this change introduced.
   *
   * The gate is on `new_failed`, not on the branch total. `.github/workflows/changelog-unified.yml`
   * computes it as `summary.failed - base_failed` and states the rule: "Gate on new
   * failures only; pre-existing Unreleased debt never blocks." Keying this check on
   * the total instead would mark every changelog pull request as failing while
   * legacy entries remain in `Unreleased`, contradicting that rule and making the
   * badge disagree with the status check the same workflow enforces.
   *
   * `new_failed` falls back to `failed` when the caller has not computed it, so a
   * report used outside the workflow still reaches a conclusion.
   *
   * @param {Object} validationResult - Report whose summary holds the failure counts.
   * @returns {string} The check run conclusion.
   */
  determineConclusion(validationResult) {
    if (!validationResult || !validationResult.summary) {
      return 'neutral';
    }

    const { failed, warnings, new_failed: newFailed } = validationResult.summary;

    const introduced = Number.isInteger(newFailed) ? newFailed : failed;

    if (introduced > 0) {
      return 'failure';
    }

    if (warnings > 0) {
      return 'neutral'; // Warnings don't fail the check but still show as noteable
    }

    return 'success';
  }

  /**
   * Format the check title and summary from passed, failed, and warning counts.
   * Missing counts default to zero; annotations come from `flattenViolations`
   * and are not capped here, because the 50-annotation cap is applied by
   * `reportCheckRun` when the request is built.
   * @param {Object} validationResult - Report with summary and optional violations.
   * @returns {Object} Check output with title, summary, and annotations.
   */
  buildCheckOutput(validationResult) {
    const { summary = {} } = validationResult;
    const annotations = this.buildAnnotations(flattenViolations(validationResult));
    const { passed = 0, failed = 0, warnings = 0 } = summary;
    const totalEntries = passed + failed + warnings;

    // Build title and summary
    let title = '✅ Changelog entries pass validation';
    let summaryText = `All ${totalEntries} entries meet quality standards.`;

    if (failed > 0) {
      const hasIntroduced = Number.isInteger(summary.new_failed);
      const introduced = hasIntroduced ? summary.new_failed : failed;

      if (introduced > 0) {
        // Only call them "new" when the caller actually supplied the count.
        title = hasIntroduced
          ? `❌ Changelog validation failed: ${introduced} new error(s)`
          : `❌ Changelog validation failed: ${introduced} error(s)`;
      } else {
        title = `⚠️ Changelog validation: ${failed} pre-existing error(s), none introduced here`;
      }

      summaryText = `${failed} of ${totalEntries} entries have validation errors.\n\n`;
      summaryText += `**Summary:**\n`;
      summaryText += `- ✅ Passing: ${passed}\n`;
      summaryText += `- ⚠️ Warnings: ${warnings}\n`;
      summaryText += `- ❌ Failing: ${failed}\n`;
      if (hasIntroduced) {
        summaryText += `- 🆕 Introduced by this change: ${summary.new_failed}\n`;
      }
    } else if (warnings > 0) {
      title = `⚠️ Changelog validation: ${warnings} warning(s)`;
      summaryText = `${warnings} of ${totalEntries} entries have warnings.\n\n`;
      summaryText += `**Summary:**\n`;
      summaryText += `- ✅ Passing: ${passed}\n`;
      summaryText += `- ⚠️ Warnings: ${warnings}\n`;
    }

    return {
      title,
      summary: summaryText,
      annotations,
    };
  }

  /**
   * Annotate each violation at the changelog entry's own line using its rule,
   * entry, message, optional details, and severity. Missing fields use fallback
   * text; non-array or empty input produces no annotations.
   *
   * The parser records a line number per entry and the rule engine carries it
   * onto each validation, so an annotation is anchored to the entry it belongs
   * to. A violation without a usable line number falls back to line 1. The
   * Checks API requires `end_line` alongside `start_line`, so both are emitted
   * with the same value.
   *
   * @param {Array} violations - Violation objects to annotate.
   * @returns {Array} GitHub annotation objects, without a count limit.
   */
  buildAnnotations(violations) {
    if (!Array.isArray(violations) || violations.length === 0) {
      return [];
    }

    return violations.map((violation) => {
      const { rule_id = 'unknown', severity = 'notice', message = 'Validation error' } = violation;

      const entryId = violation?.entry_id ?? 'unknown';
      const annotationLevel = this.severityToAnnotationLevel(severity);

      // Line numbers start at 1. Anything that is not a positive integer is
      // treated as absent rather than sent to the API, which rejects it.
      const line = Number(violation?.line_number);
      const startLine = Number.isInteger(line) && line >= 1 ? line : 1;

      // Rule details are structured data, so they belong in raw_details rather
      // than in the message: interpolating an object into a template literal
      // would render the literal text "[object Object]".
      const rawDetails =
        violation?.details === undefined || violation?.details === null
          ? undefined
          : typeof violation.details === 'string'
            ? violation.details
            : JSON.stringify(violation.details, null, 2);

      return {
        path: 'CHANGELOG.md',
        start_line: startLine,
        end_line: startLine,
        annotation_level: annotationLevel,
        title: `[${rule_id}] Entry ${entryId}`,
        message,
        ...(rawDetails ? { raw_details: rawDetails } : {}),
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
