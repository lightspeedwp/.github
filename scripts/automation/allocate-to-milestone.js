#!/usr/bin/env node

/**
 * allocate-to-milestone.js
 *
 * Allocates merged PRs and closed issues to the current active milestone.
 *
 * Usage:
 *   node allocate-to-milestone.js [--dry-run] [--verbose] [--milestone N]
 *
 * Environment:
 *   GITHUB_TOKEN  - Required. PAT with repo scope
 *   GITHUB_OWNER  - Optional. Default: lightspeedwp
 *   GITHUB_REPO   - Optional. Default: .github
 */

import { Octokit } from "octokit";

class AllocationError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "AllocationError";
  }
}

class MilestoneAllocator {
  constructor(options = {}) {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new AllocationError(
        "NO_TOKEN",
        "GITHUB_TOKEN environment variable is required",
      );
    }

    this.octokit = new Octokit({ auth: token });
    this.owner = options.owner || process.env.GITHUB_OWNER || "lightspeedwp";
    this.repo = options.repo || process.env.GITHUB_REPO || ".github";
    this.dryRun = options.dryRun || false;
    this.verbose = options.verbose || false;
    this.forcedMilestone = options.milestone || null;

    this.stats = {
      allocatedPRs: 0,
      allocatedIssues: 0,
      skipped: 0,
      errors: 0,
    };

    this.errors = [];
  }

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

  verbose_log(message) {
    if (this.verbose) {
      console.log(`  → ${message}`);
    }
  }

  async fetchActiveMilestone() {
    try {
      this.verbose_log("Fetching open milestones...");

      const response = await this.octokit.rest.issues.listMilestones({
        owner: this.owner,
        repo: this.repo,
        state: "open",
        sort: "due_on",
        direction: "asc",
        per_page: 100,
      });

      if (!response.data || response.data.length === 0) {
        throw new AllocationError(
          "NO_ACTIVE_MILESTONE",
          "No open milestones found in repository",
        );
      }

      const sorted = response.data.sort((a, b) => {
        if (a.due_on && b.due_on) {
          const dateA = new Date(a.due_on);
          const dateB = new Date(b.due_on);
          if (dateA.getTime() !== dateB.getTime()) {
            return dateA.getTime() - dateB.getTime();
          }
        } else if (a.due_on) {
          return -1;
        } else if (b.due_on) {
          return 1;
        }

        const createdA = new Date(a.created_at);
        const createdB = new Date(b.created_at);
        return createdB.getTime() - createdA.getTime();
      });

      const milestone = sorted[0];
      this.verbose_log(
        `Selected milestone #${milestone.number} "${milestone.title}" ` +
          `(due: ${milestone.due_on || "no date"}, created: ${milestone.created_at})`,
      );

      return milestone;
    } catch (err) {
      if (err instanceof AllocationError) {
        throw err;
      }
      throw new AllocationError(
        "MILESTONE_FETCH_FAILED",
        `Failed to fetch milestones: ${err.message}`,
      );
    }
  }

  parseLinkedIssues(prBody) {
    if (!prBody) return [];

    const regex = /(?:Closes|Resolves|Fixes|Close|Resolve|Fix|and)\s+#(\d+)/gi;
    const matches = Array.from(prBody.matchAll(regex), (m) =>
      parseInt(m[1], 10),
    );

    const unique = [...new Set(matches)];
    this.verbose_log(
      `Parsed ${unique.length} unique linked issue(s) from PR body`,
    );

    return unique;
  }

  isAlreadyAllocated(item, targetMilestone) {
    if (!item.milestone) {
      return false;
    }
    return item.milestone.number === targetMilestone.number;
  }

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

  async allocateIssue(issueNumber, milestone) {
    try {
      this.verbose_log(`Fetching issue #${issueNumber}...`);

      const issueResponse = await this.octokit.rest.issues.get({
        owner: this.owner,
        repo: this.repo,
        issue_number: issueNumber,
      });

      const issue = issueResponse.data;

      if (this.isAlreadyAllocated(issue, milestone)) {
        this.log(
          "skip",
          "allocate-issue",
          `Issue #${issueNumber} already allocated to milestone #${milestone.number}`,
        );
        this.stats.skipped++;
        return { status: "skipped", reason: "already-allocated" };
      }

      if (this.dryRun) {
        this.log(
          "success",
          "allocate-issue",
          `[DRY-RUN] Would allocate issue #${issueNumber} to milestone #${milestone.number}`,
        );
        this.stats.allocatedIssues++;
        return { status: "dry-run" };
      }

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
      if (err.status === 404) {
        this.log(
          "warn",
          "allocate-issue",
          `Issue #${issueNumber} not found (deleted?)`,
        );
        this.stats.skipped++;
        return { status: "not-found" };
      }
      const errorMsg = `Failed to allocate issue #${issueNumber}: ${err.message}`;
      this.log("error", "allocate-issue", errorMsg);
      this.stats.errors++;
      this.errors.push(errorMsg);
      return { status: "error", error: err.message };
    }
  }

  async allocate(prNumber, issueNumber) {
    try {
      this.log("success", "main", "Starting allocation...");

      const milestone = this.forcedMilestone
        ? { number: this.forcedMilestone }
        : await this.fetchActiveMilestone();

      if (prNumber) {
        this.log("success", "main", `Allocating PR #${prNumber}...`);
        await this.allocatePR(prNumber, milestone);

        const prResponse = await this.octokit.rest.pulls.get({
          owner: this.owner,
          repo: this.repo,
          pull_number: prNumber,
        });
        const linkedIssues = this.parseLinkedIssues(prResponse.data.body);
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

      if (issueNumber) {
        this.log("success", "main", `Allocating issue #${issueNumber}...`);
        await this.allocateIssue(issueNumber, milestone);
      }

      this.logSummary();
      return { success: true, stats: this.stats };
    } catch (err) {
      if (err instanceof AllocationError) {
        this.log("error", "main", `${err.code}: ${err.message}`);
      } else {
        this.log("error", "main", `Unexpected error: ${err.message}`);
      }
      return { success: false, error: err.message, stats: this.stats };
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

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: false,
    verbose: false,
    milestone: null,
    prNumber: null,
    issueNumber: null,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--verbose") {
      options.verbose = true;
    } else if (arg === "--milestone" && args[i + 1]) {
      options.milestone = parseInt(args[i + 1], 10);
      i++;
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

export { MilestoneAllocator, AllocationError };

// CLI entry point: only run main() if this file is executed directly (not imported)
if (
  typeof import.meta !== "undefined" &&
  import.meta.url === `file://${process.argv[1]}`
) {
  main();
}
