#!/usr/bin/env node

/**
 * distribute-unallocated-milestones.js
 *
 * AI-enhanced script to distribute issues without milestones across v1.1 to v1.6
 *
 * OVERVIEW:
 * - Fetches all open issues without milestone assignment
 * - Uses AI analysis to group related issues
 * - Distributes grouped issues across milestones v1.1 to v1.6
 * - Balances workload across milestones while keeping related issues together
 *
 * USAGE:
 *   node distribute-unallocated-milestones.js [--dry-run] [--verbose] [--limit N]
 *
 * OPTIONS:
 *   --dry-run        Show what would be changed without making API calls
 *   --verbose        Enable detailed logging of analysis and decisions
 *   --limit N        Limit to processing first N issues (for testing)
 *
 * ENVIRONMENT:
 *   GITHUB_TOKEN     - Required. Personal Access Token with 'repo' scope
 *   ANTHROPIC_API_KEY - Optional. API key for Claude AI analysis
 *   GITHUB_OWNER     - Optional. Repository owner (default: lightspeedwp)
 *   GITHUB_REPO      - Optional. Repository name (default: .github)
 *
 * ALGORITHM:
 * 1. Fetch all open issues without milestone
 * 2. If AI enabled: send issues to Claude for intelligent categorization
 * 3. Group issues by category/topic
 * 4. Distribute groups across milestones v1.1-v1.6 to balance workload
 * 5. Update each issue with assigned milestone
 */

import { Octokit } from "octokit";
import fetch from "node-fetch";

class MilestoneDistributor {
  constructor(options = {}) {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error("GITHUB_TOKEN environment variable is required");
    }

    this.octokit = new Octokit({ auth: token });
    this.owner = options.owner || process.env.GITHUB_OWNER || "lightspeedwp";
    this.repo = options.repo || process.env.GITHUB_REPO || ".github";
    this.dryRun = options.dryRun || false;
    this.verbose = options.verbose || false;
    this.limit = options.limit || null;

    // AI configuration
    this.useAI = !!process.env.ANTHROPIC_API_KEY;
    this.apiKey = process.env.ANTHROPIC_API_KEY || null;

    this.stats = {
      found: 0,
      distributed: 0,
      skipped: 0,
      errors: 0,
    };

    this.errors = [];
    this.milestones = {};
    this.distribution = {};
  }

  log(level, message) {
    const emoji = {
      success: "✅",
      skip: "⏭️",
      warn: "⚠️",
      error: "❌",
      info: "ℹ️",
    };
    const timestamp = new Date().toISOString();
    console.log(
      `${emoji[level] || "📝"} ${timestamp} [distribute-milestones] ${message}`,
    );
  }

  verbose_log(message) {
    if (this.verbose) {
      console.log(`  → ${message}`);
    }
  }

  async findMilestones() {
    try {
      this.verbose_log("Fetching all milestones...");

      const response = await this.octokit.rest.issues.listMilestones({
        owner: this.owner,
        repo: this.repo,
        state: "all",
        per_page: 100,
      });

      // Filter for v1.1 to v1.6 milestones
      const targetMilestones = {};
      for (const milestone of response.data) {
        if (/^v?1\.[1-6]$/.test(milestone.title)) {
          targetMilestones[milestone.title] = milestone;
          this.distribution[milestone.number] = [];
        }
      }

      this.milestones = targetMilestones;

      this.log(
        "info",
        `Found ${Object.keys(targetMilestones).length} target milestone(s): ${Object.keys(targetMilestones).join(", ")}`,
      );

      return targetMilestones;
    } catch (err) {
      throw new Error(`Failed to fetch milestones: ${err.message}`);
    }
  }

  async fetchUnallocatedIssues() {
    try {
      this.verbose_log("Fetching unallocated issues...");

      const response = await this.octokit.rest.issues.listForRepo({
        owner: this.owner,
        repo: this.repo,
        state: "open",
        milestone: "none",
        per_page: 100,
      });

      let issues = response.data;

      if (this.limit) {
        issues = issues.slice(0, this.limit);
        this.verbose_log(`Limited to first ${this.limit} issues`);
      }

      this.log("info", `Found ${issues.length} unallocated issue(s)`);
      this.stats.found = issues.length;

      return issues;
    } catch (err) {
      throw new Error(`Failed to fetch unallocated issues: ${err.message}`);
    }
  }

  async analyzeIssuesWithAI(issues) {
    if (!this.useAI) {
      return this.analyzeIssuesLocally(issues);
    }

    try {
      this.log("info", "Analyzing issues with AI...");

      const issuesSummary = issues
        .map(
          (issue) =>
            `#${issue.number}: ${issue.title}\nLabels: ${issue.labels.map((l) => l.name).join(", ") || "none"}\nDescription: ${(issue.body || "").substring(0, 200)}`,
        )
        .join("\n---\n");

      const prompt = `Analyze these GitHub issues and suggest how to group them into 5 coherent categories that align with product milestones:

${issuesSummary}

Respond with a JSON object where keys are category names and values are arrays of issue numbers.
Categories should represent distinct features, areas, or themes.
Example format:
{
  "Core Infrastructure": [123, 124],
  "API Improvements": [125, 126],
  "Documentation": [127],
  "Performance": [128, 129],
  "Security": [130]
}`;

      // Use fetch to call Claude API if available
      if (this.apiKey) {
        return await this.callClaudeAPI(prompt);
      } else {
        this.log(
          "warn",
          "ANTHROPIC_API_KEY not set, using local analysis instead",
        );
        return this.analyzeIssuesLocally(issues);
      }
    } catch (err) {
      this.log(
        "warn",
        `AI analysis failed: ${err.message}, using local analysis`,
      );
      return this.analyzeIssuesLocally(issues);
    }
  }

  async callClaudeAPI(prompt) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 2000,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.content[0].text;

      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const categories = JSON.parse(jsonMatch[0]);
      this.verbose_log(
        `AI analysis produced ${Object.keys(categories).length} categories`,
      );
      return categories;
    } catch (err) {
      throw new Error(`Failed to call Claude API: ${err.message}`);
    }
  }

  analyzeIssuesLocally(issues) {
    this.verbose_log(
      "Using local analysis to group issues by labels and title patterns",
    );

    const categories = {
      "Infrastructure & Tooling": [],
      "Features & Enhancements": [],
      "Bug Fixes": [],
      "Documentation & Examples": [],
      "Testing & Quality": [],
    };

    for (const issue of issues) {
      const labels = issue.labels
        .map((l) => l.name)
        .join(" ")
        .toLowerCase();
      const title = issue.title.toLowerCase();

      // Simple categorization by labels and keywords
      if (
        labels.includes("bug") ||
        title.includes("fix") ||
        title.includes("broken")
      ) {
        categories["Bug Fixes"].push(issue.number);
      } else if (
        labels.includes("documentation") ||
        title.includes("doc") ||
        title.includes("example")
      ) {
        categories["Documentation & Examples"].push(issue.number);
      } else if (
        labels.includes("test") ||
        labels.includes("ci") ||
        title.includes("test")
      ) {
        categories["Testing & Quality"].push(issue.number);
      } else if (
        labels.includes("chore") ||
        labels.includes("infrastructure") ||
        title.includes("setup") ||
        title.includes("config")
      ) {
        categories["Infrastructure & Tooling"].push(issue.number);
      } else {
        categories["Features & Enhancements"].push(issue.number);
      }
    }

    // Remove empty categories
    return Object.fromEntries(
      Object.entries(categories).filter(([, issues]) => issues.length > 0),
    );
  }

  distributeToMilestones(categories) {
    const milestoneArray = Object.values(this.milestones)
      .sort((a, b) => a.number - b.number)
      .map((m) => m.number);

    this.verbose_log(
      `Distributing ${Object.values(categories).flat().length} issues across ${milestoneArray.length} milestone(s)`,
    );

    const distribution = {};

    let milestoneIndex = 0;
    const categoryEntries = Object.entries(categories);

    // Round-robin distribution
    for (const [category, issues] of categoryEntries) {
      const targetMilestone =
        milestoneArray[milestoneIndex % milestoneArray.length];

      if (!distribution[targetMilestone]) {
        distribution[targetMilestone] = [];
      }

      for (const issueNumber of issues) {
        distribution[targetMilestone].push(issueNumber);
      }

      this.verbose_log(
        `Category "${category}" (${issues.length} issue(s)) → Milestone #${targetMilestone}`,
      );

      milestoneIndex++;
    }

    return distribution;
  }

  async assignIssueToMilestone(issueNumber, milestoneNumber) {
    try {
      if (this.dryRun) {
        this.log(
          "success",
          `[DRY-RUN] Would assign issue #${issueNumber} to milestone #${milestoneNumber}`,
        );
        this.stats.distributed++;
        return { status: "dry-run" };
      }

      await this.octokit.rest.issues.update({
        owner: this.owner,
        repo: this.repo,
        issue_number: issueNumber,
        milestone: milestoneNumber,
      });

      this.log(
        "success",
        `Assigned issue #${issueNumber} to milestone #${milestoneNumber}`,
      );
      this.stats.distributed++;
      return { status: "assigned" };
    } catch (err) {
      const errorMsg = `Failed to assign issue #${issueNumber}: ${err.message}`;
      this.log("error", errorMsg);
      this.stats.errors++;
      this.errors.push(errorMsg);
      return { status: "error", error: err.message };
    }
  }

  async distribute(issues) {
    try {
      this.log("success", "Starting intelligent milestone distribution...");

      if (issues.length === 0) {
        this.log("skip", "No unallocated issues found");
        return { success: true, stats: this.stats };
      }

      // Step 1: Analyze and categorize issues
      const categories = await this.analyzeIssuesWithAI(issues);
      this.verbose_log(
        `Issues categorized into ${Object.keys(categories).length} group(s)`,
      );

      // Step 2: Distribute categories across milestones
      const distribution = this.distributeToMilestones(categories);

      // Step 3: Apply assignments
      this.log("info", "Applying milestone assignments...");
      for (const [milestoneNumber, issueNumbers] of Object.entries(
        distribution,
      )) {
        for (const issueNumber of issueNumbers) {
          await this.assignIssueToMilestone(
            issueNumber,
            parseInt(milestoneNumber, 10),
          );
        }
      }

      this.logSummary(distribution);
      return { success: true, stats: this.stats };
    } catch (err) {
      this.log("error", `${err.message}`);
      return {
        success: false,
        error: err.message,
        stats: this.stats,
      };
    }
  }

  logSummary(_distribution) {
    const summary = [
      `Distribution complete.`,
      `Distributed: ${this.stats.distributed}`,
      `Skipped: ${this.stats.skipped}`,
      `Errors: ${this.stats.errors}`,
      `Milestones: ${Object.keys(this.milestones).join(", ")}`,
    ].join(" | ");
    this.log("success", summary);
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: false,
    verbose: false,
    limit: null,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--dry-run") {
      options.dryRun = true;
    } else if (args[i] === "--verbose") {
      options.verbose = true;
    } else if (args[i] === "--limit" && args[i + 1]) {
      options.limit = parseInt(args[i + 1], 10);
      i++;
    }
  }

  return options;
}

async function main() {
  const options = parseArgs();

  try {
    const distributor = new MilestoneDistributor(options);

    // Find target milestones
    await distributor.findMilestones();

    // Fetch unallocated issues
    const issues = await distributor.fetchUnallocatedIssues();

    // Distribute across milestones
    const result = await distributor.distribute(issues);

    process.exit(result.success ? 0 : 1);
  } catch (err) {
    console.error(`❌ Fatal error: ${err.message}`);
    process.exit(1);
  }
}

export { MilestoneDistributor };

if (typeof eval !== "undefined") {
  try {
    const meta = eval("typeof import.meta !== 'undefined' && import.meta");
    if (meta && meta.url === `file://${process.argv[1]}`) {
      main();
    }
  } catch {
    // CommonJS context
  }
}
