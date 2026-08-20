#!/usr/bin/env node

/**
 * allocate-to-milestone.js
 *
 * Automatically allocates merged pull requests and closed issues to the current active milestone.
 *
 * OVERVIEW:
 * This script implements FR-1 through FR-5 of the PR/Issue → Milestone Allocation specification:
 * - FR-1: Detect the current active milestone (open milestone with earliest due date)
 * - FR-2: Allocate merged PRs to that milestone
 * - FR-3: Allocate closed issues to that milestone
 * - FR-4: Detect and allocate linked issues via "Closes #", "Resolves #", "Fixes #" syntax
 * - FR-5: Dry-run mode for preview without making changes
 *
 * USAGE:
 *   node allocate-to-milestone.js [--dry-run] [--verbose] [--milestone N] [--pr N] [--issue N]
 *
 * OPTIONS:
 *   --dry-run        Show what would be changed without making API calls
 *   --verbose        Enable detailed logging of decision-making process
 *   --milestone N    Force allocation to specific milestone number (overrides auto-detection)
 *   --pr N           Allocate specific PR number (useful for manual runs)
 *   --issue N        Allocate specific issue number (useful for manual runs)
 *
 * ENVIRONMENT:
 *   GITHUB_TOKEN  - Required. Personal Access Token with 'repo' scope
 *   GITHUB_OWNER  - Optional. Repository owner/organization (default: lightspeedwp)
 *   GITHUB_REPO   - Optional. Repository name (default: .github)
 *
 * EXAMPLES:
 *   # Dry-run to see what would be allocated
 *   node allocate-to-milestone.js --dry-run
 *
 *   # Allocate with verbose logging
 *   node allocate-to-milestone.js --verbose
 *
 *   # Force allocation to milestone #5
 *   node allocate-to-milestone.js --milestone 5
 *
 *   # Allocate specific PR and see changes
 *   node allocate-to-milestone.js --pr 123 --verbose
 *
 * ERROR HANDLING:
 * - NO_TOKEN: GITHUB_TOKEN not set
 * - NO_ACTIVE_MILESTONE: No open milestones found
 * - MILESTONE_FETCH_FAILED: Error fetching milestones from API
 * - Individual PR/issue failures logged but don't stop processing
 * - 404 errors for deleted issues handled gracefully
 *
 * ALGORITHM (Milestone Selection):
 * 1. Fetch all open milestones from GitHub API
 * 2. Sort by due_date (ascending) — earliest due date first
 * 3. If tied on due_date, sort by created_at (descending) — latest created first
 * 4. Return first milestone in sorted list
 * 5. If no open milestones exist, throw error
 *
 * IDEMPOTENCY:
 * This script is idempotent — running it multiple times is safe because:
 * - Already-allocated items are detected and skipped
 * - Dry-run mode doesn't make any changes
 * - Errors in processing individual items don't stop the whole process
 */

import { Octokit } from "octokit";

/**
 * Custom error class for allocation-specific errors
 * Allows distinguishing allocation errors from generic JavaScript errors
 */
class AllocationError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "AllocationError";
  }
}

/**
 * Main class for handling milestone allocation logic
 *
 * Encapsulates:
 * - GitHub API authentication (via Octokit)
 * - Milestone selection algorithm
 * - PR and issue allocation
 * - Linked issue detection from PR bodies
 * - Logging and statistics tracking
 */
class MilestoneAllocator {
  /**
   * Constructor: Initialize allocator with configuration
   *
   * @param {Object} options - Configuration object
   * @param {string} options.owner - GitHub owner/org (overrides GITHUB_OWNER env)
   * @param {string} options.repo - Repository name (overrides GITHUB_REPO env)
   * @param {boolean} options.dryRun - If true, don't make API changes
   * @param {boolean} options.verbose - If true, log detailed decision-making
   * @param {number} options.milestone - Force allocation to specific milestone (overrides auto-detection)
   *
   * @throws {AllocationError} If GITHUB_TOKEN environment variable is not set
   */
  constructor(options = {}) {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new AllocationError(
        "NO_TOKEN",
        "GITHUB_TOKEN environment variable is required",
      );
    }

    // Initialize Octokit client for GitHub API calls
    this.octokit = new Octokit({ auth: token });

    // Set repository context — supports both CLI options and environment variables
    this.owner = options.owner || process.env.GITHUB_OWNER || "lightspeedwp";
    this.repo = options.repo || process.env.GITHUB_REPO || ".github";
    this.dryRun = options.dryRun || false;
    this.verbose = options.verbose || false;

    // If --milestone option provided, use that instead of auto-detecting
    // This allows forcing allocation to a specific milestone for testing
    this.forcedMilestone = options.milestone || null;

    // Statistics tracking: counts allocations, skips, and errors
    this.stats = {
      allocatedPRs: 0,
      allocatedIssues: 0,
      skipped: 0,
      errors: 0,
    };

    // Collect all errors for summary reporting at the end
    this.errors = [];
  }

  /**
   * Structured logging with timestamps and component identification
   *
   * @param {string} level - Log level: 'success', 'skip', 'warn', 'error'
   * @param {string} component - Component name for identifying log source
   * @param {string} message - Log message
   *
   * Output format: emoji [timestamp] [component] message
   * Emoji meanings:
   *   ✅ = Successful operation
   *   ⏭️  = Item skipped (already allocated, not found, etc.)
   *   ⚠️  = Warning (non-critical issue)
   *   ❌ = Error (operation failed)
   */
  log(level, component, message) {
    const timestamp = new Date().toISOString();
    const levelEmoji = {
      success: "✅",
      skip: "⏭️",
      warn: "⚠️",
      error: "❌",
    };
    const emoji = levelEmoji[level] || "📝";
    console.log(`${emoji} ${timestamp} [${component}] ${message}`);
  }

  /**
   * Verbose logging - only outputs if --verbose flag enabled
   * Used for detailed decision-making and troubleshooting
   *
   * @param {string} message - Message to log in verbose mode
   */
  verbose_log(message) {
    if (this.verbose) {
      console.log(`  → ${message}`);
    }
  }

  /**
   * Fetch and return the current active milestone
   *
   * Implements FR-1: Detect Current Active Milestone
   *
   * ALGORITHM:
   * 1. Fetch all open milestones from GitHub API
   * 2. Sort by due_on date (ascending) — earliest due date comes first
   *    - Milestones WITH due dates are sorted by date
   *    - Milestones WITHOUT due dates are sorted to the end
   * 3. If milestones have same due date, sort by created_at (descending) — latest created first
   * 4. Return the first milestone in the sorted list (earliest due date, or if tied, latest created)
   *
   * IMPORTANT NOTES:
   * - Past-due milestones are still considered valid "active" milestones
   * - If a milestone has no due date, it sorts to the end (lower priority)
   * - Requires repo:read permission on GitHub token
   *
   * @returns {Promise<Object>} Milestone object with: number, title, due_on, created_at
   * @throws {AllocationError} If no open milestones exist or API call fails
   */
  async fetchActiveMilestone() {
    try {
      this.verbose_log("Fetching open milestones...");

      // API call: list all open milestones
      // GitHub returns them unsorted, so we'll sort them ourselves
      const response = await this.octokit.rest.issues.listMilestones({
        owner: this.owner,
        repo: this.repo,
        state: "open",
        sort: "due_on",
        direction: "asc",
        per_page: 100,
      });

      // Error if no open milestones exist
      if (!response.data || response.data.length === 0) {
        throw new AllocationError(
          "NO_ACTIVE_MILESTONE",
          "NO_ACTIVE_MILESTONE: No open milestones found in repository",
        );
      }

      // Sort milestones by due date (earliest first), then by creation date (latest first)
      const sorted = response.data.sort((a, b) => {
        // Primary sort: by due_on date (ascending = earliest first)
        if (a.due_on && b.due_on) {
          const dateA = new Date(a.due_on);
          const dateB = new Date(b.due_on);
          if (dateA.getTime() !== dateB.getTime()) {
            return dateA.getTime() - dateB.getTime(); // Earliest due date wins
          }
        } else if (a.due_on) {
          // If only 'a' has a due date, it comes first
          return -1;
        } else if (b.due_on) {
          // If only 'b' has a due date, it comes first
          return 1;
        }

        // Secondary sort (tiebreaker): by created_at date (descending = latest first)
        // This ensures deterministic selection when multiple milestones share the same due date
        const createdA = new Date(a.created_at);
        const createdB = new Date(b.created_at);
        return createdB.getTime() - createdA.getTime(); // Latest created date wins
      });

      const milestone = sorted[0];
      this.verbose_log(
        `Selected milestone #${milestone.number} "${milestone.title}" ` +
          `(due: ${milestone.due_on || "no date"}, created: ${milestone.created_at})`,
      );

      return milestone;
    } catch (err) {
      // Re-throw AllocationError as-is
      if (err instanceof AllocationError) {
        throw err;
      }
      // Wrap other errors in AllocationError
      throw new AllocationError(
        "MILESTONE_FETCH_FAILED",
        `MILESTONE_FETCH_FAILED: Failed to fetch milestones: ${err.message}`,
      );
    }
  }

  /**
   * Parse PR body to extract linked issue numbers
   *
   * Implements FR-4: Allocate Linked Issues When PR is Merged
   *
   * REGEX PATTERN:
   * (?:Closes|Resolves|Fixes|Close|Resolve|Fix|and)\s+#(\d+)
   *
   * This regex matches:
   * - "Closes #123"
   * - "Resolves #456"
   * - "Fixes #789"
   * - "Close #100" (singular)
   * - "Resolve #200" (singular)
   * - "Fix #300" (singular)
   * - "and #400" (for comma-separated lists)
   *
   * Case-insensitive matching (via 'i' flag).
   * Can match multiple times in same PR body.
   * Deduplicates results using Set.
   *
   * EXAMPLES OF MATCHED TEXT:
   * "Fixes #123 and #456 — closes #789"
   *   → Matches: 123, 456, 789
   *
   * "CLOSES #1000\nResolves issue #2000"
   *   → Matches: 1000, 2000 (case-insensitive)
   *
   * "This is unrelated to PR #999"
   *   → No matches (missing keyword)
   *
   * @param {string} prBody - PR body text (may be null/undefined)
   * @returns {number[]} Array of unique issue numbers found (sorted)
   */
  parseLinkedIssues(prBody) {
    if (!prBody) return [];

    // Regex: case-insensitive, global flag to match all occurrences
    // Captures the issue number in group 1
    const regex = /(?:Closes|Resolves|Fixes|Close|Resolve|Fix|and)\s+#(\d+)/gi;

    // Extract all matches and convert to integers
    const matches = Array.from(prBody.matchAll(regex), (m) =>
      parseInt(m[1], 10),
    );

    // Deduplicate using Set, then convert back to array
    const unique = [...new Set(matches)];

    this.verbose_log(
      `Parsed ${unique.length} unique linked issue(s) from PR body`,
    );

    return unique;
  }

  /**
   * Check if an item (PR or issue) is already allocated to target milestone
   *
   * Used to implement idempotent behavior: already-allocated items are skipped.
   *
   * @param {Object} item - GitHub item (PR or issue) with optional milestone property
   * @param {Object} targetMilestone - Target milestone object with 'number' property
   * @returns {boolean} true if item.milestone.number === targetMilestone.number
   */
  isAlreadyAllocated(item, targetMilestone) {
    if (!item.milestone) {
      return false;
    }
    return item.milestone.number === targetMilestone.number;
  }

  /**
   * Allocate a single PR to the target milestone
   *
   * Implements FR-2: Allocate Merged PR to Current Milestone
   *
   * PROCESS:
   * 1. Fetch PR from GitHub API
   * 2. Check if already allocated to target milestone (idempotency check)
   * 3. If already allocated, skip and log
   * 4. If dry-run mode, log what would happen and return
   * 5. If live mode, make PATCH request to update PR milestone
   * 6. Log result and update stats
   *
   * ERROR HANDLING:
   * - 404 errors (PR not found) are logged and counted as errors
   * - Other errors are logged and caught (don't stop processing)
   * - Errors are accumulated in this.errors array for summary reporting
   *
   * STATS TRACKING:
   * - this.stats.allocatedPRs incremented on successful allocation
   * - this.stats.skipped incremented if already allocated
   * - this.stats.errors incremented on error
   *
   * @param {number} prNumber - PR number to allocate
   * @param {Object} milestone - Target milestone object with 'number' property
   * @returns {Promise<Object>} Result object: { status, reason?, error? }
   *                            status can be: 'allocated', 'skipped', 'dry-run', 'error'
   */
  async allocatePR(prNumber, milestone) {
    try {
      this.verbose_log(`Fetching PR #${prNumber}...`);

      const prResponse = await this.octokit.rest.pulls.get({
        owner: this.owner,
        repo: this.repo,
        pull_number: prNumber,
      });

      const pr = prResponse.data;

      if (this.isAlreadyAllocated(pr, milestone)) {
        this.log(
          "skip",
          "allocate-pr",
          `PR #${prNumber} already allocated to milestone #${milestone.number}`,
        );
        this.stats.skipped++;
        return { status: "skipped", reason: "already-allocated" };
      }

      if (this.dryRun) {
        this.log(
          "success",
          "allocate-pr",
          `[DRY-RUN] Would allocate PR #${prNumber} to milestone #${milestone.number}`,
        );
        this.stats.allocatedPRs++;
        return { status: "dry-run" };
      }

      await this.octokit.rest.pulls.update({
        owner: this.owner,
        repo: this.repo,
        pull_number: prNumber,
        milestone: milestone.number,
      });

      this.log(
        "success",
        "allocate-pr",
        `Allocated PR #${prNumber} to milestone #${milestone.number}`,
      );
      this.stats.allocatedPRs++;
      return { status: "allocated" };
    } catch (err) {
      const errorMsg = `Failed to allocate PR #${prNumber}: ${err.message}`;
      this.log("error", "allocate-pr", errorMsg);
      this.stats.errors++;
      this.errors.push(errorMsg);
      return { status: "error", error: err.message };
    }
  }

  /**
   * Allocate a single issue to the target milestone
   *
   * Implements FR-3: Allocate Closed Issue to Current Milestone
   *
   * PROCESS:
   * 1. Fetch issue from GitHub API
   * 2. Check if already allocated to target milestone (idempotency check)
   * 3. If already allocated, skip and log
   * 4. If dry-run mode, log what would happen and return
   * 5. If live mode, make PATCH request to update issue milestone
   * 6. Log result and update stats
   *
   * EDGE CASE: DELETED ISSUES
   * If issue has been deleted, the API returns 404 status code.
   * This is handled gracefully: logged as warning, counted as skipped (not error).
   * This is important because PR may reference an issue that was later deleted.
   *
   * ERROR HANDLING:
   * - 404 errors (issue deleted) → warn + skip
   * - Other errors → error + accumulate in this.errors
   * - All errors are caught (don't stop processing other items)
   *
   * STATS TRACKING:
   * - this.stats.allocatedIssues incremented on successful allocation
   * - this.stats.skipped incremented if already allocated or not found
   * - this.stats.errors incremented on other errors
   *
   * @param {number} issueNumber - Issue number to allocate
   * @param {Object} milestone - Target milestone object with 'number' property
   * @returns {Promise<Object>} Result object: { status, reason?, error? }
   *                            status can be: 'allocated', 'skipped', 'dry-run', 'not-found', 'error'
   */
  async allocateIssue(issueNumber, milestone) {
    try {
      this.verbose_log(`Fetching issue #${issueNumber}...`);

      // Fetch issue from API to get current state and milestone info
      const issueResponse = await this.octokit.rest.issues.get({
        owner: this.owner,
        repo: this.repo,
        issue_number: issueNumber,
      });

      const issue = issueResponse.data;

      // Check idempotency: skip if already allocated to this milestone
      if (this.isAlreadyAllocated(issue, milestone)) {
        this.log(
          "skip",
          "allocate-issue",
          `Issue #${issueNumber} already allocated to milestone #${milestone.number}`,
        );
        this.stats.skipped++;
        return { status: "skipped", reason: "already-allocated" };
      }

      // Dry-run mode: show what would happen without making changes
      if (this.dryRun) {
        this.log(
          "success",
          "allocate-issue",
          `[DRY-RUN] Would allocate issue #${issueNumber} to milestone #${milestone.number}`,
        );
        this.stats.allocatedIssues++;
        return { status: "dry-run" };
      }

      // Live mode: actually update the issue milestone on GitHub
      await this.octokit.rest.issues.update({
        owner: this.owner,
        repo: this.repo,
        issue_number: issueNumber,
        milestone: milestone.number,
      });

      this.log(
        "success",
        "allocate-issue",
        `Allocated issue #${issueNumber} to milestone #${milestone.number}`,
      );
      this.stats.allocatedIssues++;
      return { status: "allocated" };
    } catch (err) {
      // Graceful handling of deleted issues: 404 is expected for deleted issues
      if (err.status === 404) {
        this.log(
          "warn",
          "allocate-issue",
          `Issue #${issueNumber} not found (deleted?)`,
        );
        this.stats.skipped++; // Treat as skipped, not error
        return { status: "not-found" };
      }

      // Other errors: log and accumulate for summary reporting
      const errorMsg = `Failed to allocate issue #${issueNumber}: ${err.message}`;
      this.log("error", "allocate-issue", errorMsg);
      this.stats.errors++;
      this.errors.push(errorMsg);
      return { status: "error", error: err.message };
    }
  }

  /**
   * Main allocation orchestration method
   *
   * FLOW:
   * 1. Fetch current active milestone (FR-1)
   * 2. If PR number provided: allocate PR (FR-2)
   * 3. If PR allocated: fetch PR body and allocate linked issues (FR-4)
   * 4. If issue number provided: allocate issue (FR-3)
   * 5. Log summary and return stats
   *
   * Can be called with either (or both) PR and issue numbers.
   * Used by both CLI and GitHub Actions workflow.
   *
   * ERROR HANDLING:
   * - Catches AllocationError and logs with code prefix
   * - Catches generic errors and logs as "Unexpected error"
   * - Returns failure status but with stats for logging
   *
   * @param {number} prNumber - Optional PR number to allocate
   * @param {number} issueNumber - Optional issue number to allocate
   * @returns {Promise<Object>} Result object:
   *                            { success: boolean, stats: Object, error?: string }
   */
  async allocate(prNumber, issueNumber) {
    try {
      this.log("success", "main", "Starting allocation...");

      // Step 1: Determine which milestone to use
      // If --milestone option was provided, use that; otherwise fetch current active milestone
      const milestone = this.forcedMilestone
        ? { number: this.forcedMilestone }
        : await this.fetchActiveMilestone();

      // Step 2: Allocate PR and its linked issues (if PR number provided)
      if (prNumber) {
        this.log("success", "main", `Allocating PR #${prNumber}...`);
        await this.allocatePR(prNumber, milestone);

        // Fetch PR body to find linked issues
        const prResponse = await this.octokit.rest.pulls.get({
          owner: this.owner,
          repo: this.repo,
          pull_number: prNumber,
        });
        const linkedIssues = this.parseLinkedIssues(prResponse.data.body);

        // Allocate each linked issue to the same milestone
        if (linkedIssues.length > 0) {
          this.log(
            "success",
            "main",
            `Allocating ${linkedIssues.length} linked issue(s)...`,
          );
          for (const issueNum of linkedIssues) {
            await this.allocateIssue(issueNum, milestone);
          }
        }
      }

      // Step 3: Allocate standalone issue (if issue number provided)
      if (issueNumber) {
        this.log("success", "main", `Allocating issue #${issueNumber}...`);
        await this.allocateIssue(issueNumber, milestone);
      }

      // Step 4: Log summary and return results
      this.logSummary();
      return { success: true, stats: this.stats };
    } catch (err) {
      // Error handling: log and return failure status
      if (err instanceof AllocationError) {
        this.log("error", "main", `${err.code}: ${err.message}`);
        return { success: false, error: `${err.code}: ${err.message}`, stats: this.stats };
      } else {
        this.log("error", "main", `Unexpected error: ${err.message}`);
        return { success: false, error: err.message, stats: this.stats };
      }
    }
  }

  logSummary() {
    const summary = [
      `Allocation complete.`,
      `Allocated: ${this.stats.allocatedPRs} PR(s), ${this.stats.allocatedIssues} issue(s)`,
      `Skipped: ${this.stats.skipped}`,
      `Errors: ${this.stats.errors}`,
    ].join(" | ");
    this.log("success", "summary", summary);
  }
}

/**
 * Parse command-line arguments into options object
 *
 * SUPPORTED FLAGS:
 * - --dry-run: Enable dry-run mode (no API changes)
 * - --verbose: Enable verbose logging
 * - --milestone N: Force allocation to milestone N (overrides auto-detection)
 * - --pr N: Allocate PR number N (useful for manual invocation)
 * - --issue N: Allocate issue number N (useful for manual invocation)
 *
 * EXAMPLES:
 *   parseArgs() with: ["--dry-run", "--milestone", "5"]
 *   → { dryRun: true, milestone: 5, ... }
 *
 *   parseArgs() with: ["--pr", "123", "--verbose"]
 *   → { prNumber: 123, verbose: true, ... }
 *
 * @returns {Object} Parsed options object with all fields initialized
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: false,
    verbose: false,
    milestone: null,
    prNumber: null,
    issueNumber: null,
  };

  // Parse flags and their values
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--verbose") {
      options.verbose = true;
    } else if (arg === "--milestone" && args[i + 1]) {
      options.milestone = parseInt(args[i + 1], 10);
      i++; // Skip next arg since we consumed it
    } else if (arg === "--pr" && args[i + 1]) {
      options.prNumber = parseInt(args[i + 1], 10);
      i++;
    } else if (arg === "--issue" && args[i + 1]) {
      options.issueNumber = parseInt(args[i + 1], 10);
      i++;
    }
  }

  return options;
}

/**
 * Main CLI entry point
 *
 * PROCESS:
 * 1. Parse CLI arguments
 * 2. Create MilestoneAllocator instance with options
 * 3. Call allocate() method
 * 4. Exit with code 0 (success) or 1 (failure)
 *
 * INTEGRATION:
 * - Used by GitHub Actions workflow
 * - Can also be called manually from command line
 * - Exported for programmatic use in tests
 */
async function main() {
  const options = parseArgs();

  try {
    const allocator = new MilestoneAllocator(options);
    const result = await allocator.allocate(
      options.prNumber,
      options.issueNumber,
    );
    process.exit(result.success ? 0 : 1);
  } catch (err) {
    console.error(`Fatal error: ${err.message}`);
    process.exit(1);
  }
}

// Export for test use
export { MilestoneAllocator, AllocationError };

// CLI entry point: only run main() if this file is executed directly (not imported)
// Wrap import.meta check to prevent parsing errors in non-ESM contexts
if (typeof eval !== "undefined") {
  try {
    const meta = eval("typeof import.meta !== 'undefined' && import.meta");
    if (meta && meta.url === `file://${process.argv[1]}`) {
      main();
    }
  } catch {
    // In CommonJS context or when import.meta is not available, don't auto-run
  }
}
