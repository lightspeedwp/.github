#!/usr/bin/env node

/**
 * Milestone Assignment Agent
 *
 * Intelligently assigns milestones to issues based on:
 * - Issue type labels
 * - Priority labels
 * - Issue title keywords
 * - Existing milestone patterns
 *
 * Used by: issue creation workflows, batch remediation tasks
 */

const fs = require("fs");
const path = require("path");

class MilestoneAssignmentAgent {
  constructor(github, owner, repo) {
    this.github = github;
    this.owner = owner;
    this.repo = repo;
    this.milestones = null;
    this.milestoneMap = {};
  }

  /**
   * Load all milestones from the repository
   */
  async loadMilestones() {
    if (this.milestones) return this.milestones;

    try {
      this.milestones = await this.github.paginate(
        this.github.rest.issues.listMilestones,
        {
          owner: this.owner,
          repo: this.repo,
          state: "all",
          per_page: 100,
        },
      );

      // Build lookup map: title -> milestone
      this.milestones.forEach((m) => {
        this.milestoneMap[m.title] = m;
        // Also map common aliases (v1.0 -> v1.0.0, etc)
        if (m.title.match(/^v\d+\.\d+$/)) {
          const patch = m.title + ".0";
          this.milestoneMap[patch] = m;
        }
      });

      return this.milestones;
    } catch (error) {
      console.error(`Failed to load milestones: ${error.message}`);
      return [];
    }
  }

  /**
   * Determine appropriate milestone for an issue
   */
  async assignMilestone(issue) {
    if (!issue) return null;

    const labels = (issue.labels || []).map((l) =>
      typeof l === "string" ? l : l.name,
    );
    const title = (issue.title || "").toLowerCase();
    const body = ((issue.body || "") + (issue.description || "")).toLowerCase();
    const combinedText = `${title} ${body}`;

    // Already assigned
    if (issue.milestone) {
      return issue.milestone.number;
    }

    // Load milestones if not already loaded
    await this.loadMilestones();

    // Priority-ordered milestone assignment rules
    const candidates = [];

    // Rule 1: Version-specific keywords in title/body
    const versionMatch = combinedText.match(/v(\d+\.\d+(?:\.\d+)?)/);
    if (versionMatch) {
      const version = versionMatch[1];
      const milestone =
        this.milestoneMap[`v${version}`] || this.milestoneMap[`v${version}.0`];
      if (milestone) {
        candidates.push({
          milestone,
          confidence: 0.95,
          reason: "version-keyword",
        });
      }
    }

    // Rule 2: Epic issues -> next major milestone
    if (labels.includes("type:epic")) {
      const nextMajor = this.findNextMajorMilestone();
      if (nextMajor) {
        candidates.push({
          milestone: nextMajor,
          confidence: 0.9,
          reason: "epic-type",
        });
      }
    }

    // Rule 3: Release issues -> release milestone
    if (labels.includes("type:release")) {
      const releaseMilestone = this.milestones.find((m) =>
        m.title.match(/^(release|v\d+\.\d+)/i),
      );
      if (releaseMilestone) {
        candidates.push({
          milestone: releaseMilestone,
          confidence: 0.9,
          reason: "release-type",
        });
      }
    }

    // Rule 4: Phase-based milestone assignment
    const phaseMatch = combinedText.match(/phase\s+(\d+(?:\.\d+)?)/i);
    if (phaseMatch) {
      const phaseMilestone = this.milestones.find((m) =>
        m.title.match(new RegExp(`phase\\s*${phaseMatch[1]}`, "i")),
      );
      if (phaseMilestone) {
        candidates.push({
          milestone: phaseMilestone,
          confidence: 0.85,
          reason: "phase-match",
        });
      }
    }

    // Rule 5: High-priority issues -> current/next milestone
    if (
      labels.includes("priority:urgent") ||
      labels.includes("priority:high")
    ) {
      const currentMilestone = this.findCurrentMilestone();
      if (currentMilestone) {
        candidates.push({
          milestone: currentMilestone,
          confidence: 0.8,
          reason: "high-priority",
        });
      }
    }

    // Rule 6: Default to backlog or next planned milestone
    const backlogMilestone =
      this.milestones.find((m) =>
        m.title.match(/^(backlog|icebox|future)$/i),
      ) || this.milestones.find((m) => !m.closed_at);

    if (backlogMilestone) {
      candidates.push({
        milestone: backlogMilestone,
        confidence: 0.5,
        reason: "default",
      });
    }

    // Select highest-confidence candidate
    if (candidates.length > 0) {
      candidates.sort((a, b) => b.confidence - a.confidence);
      const selected = candidates[0];
      return {
        milestoneNumber: selected.milestone.number,
        milestoneTitle: selected.milestone.title,
        confidence: selected.confidence,
        reason: selected.reason,
        alternatives: candidates.slice(1).map((c) => ({
          title: c.milestone.title,
          reason: c.reason,
        })),
      };
    }

    return null;
  }

  /**
   * Find the current/active milestone
   */
  findCurrentMilestone() {
    return this.milestones.find((m) => {
      const dueDate = new Date(m.due_on || "");
      const now = new Date();
      return !m.closed_at && dueDate > now;
    });
  }

  /**
   * Find the next major milestone (v1.0, v2.0, etc)
   */
  findNextMajorMilestone() {
    const majorMilestones = this.milestones
      .filter((m) => m.title.match(/^v\d+\.0(?:\.0)?$/))
      .sort((a, b) => {
        const aVer = a.title.match(/\d+/)[0];
        const bVer = b.title.match(/\d+/)[0];
        return parseInt(bVer) - parseInt(aVer);
      });

    if (majorMilestones.length > 0) {
      const latestClosed = majorMilestones.find((m) => m.closed_at);
      if (latestClosed) {
        const latestClosedVersion = parseInt(
          latestClosed.title.match(/\d+/)[0],
        );
        const nextVersion = `v${latestClosedVersion + 1}.0`;
        return this.milestoneMap[nextVersion];
      }
    }

    return majorMilestones[0] || null;
  }

  /**
   * Bulk-assign milestones to issues
   */
  async bulkAssignMilestones(issues, options = {}) {
    const dryRun = options.dryRun || false;
    const reportPath = options.reportPath;
    const results = [];

    console.log(
      `[milestone-assignment] Starting bulk assignment for ${issues.length} issue(s)...`,
    );

    for (const issue of issues) {
      try {
        const assignment = await this.assignMilestone(issue);

        if (!assignment) {
          results.push({
            issueNumber: issue.number,
            status: "no-milestone-found",
            reason: "No applicable milestone found",
          });
          continue;
        }

        if (dryRun) {
          results.push({
            issueNumber: issue.number,
            status: "dry-run-success",
            milestone: assignment.milestoneTitle,
            confidence: assignment.confidence,
            reason: assignment.reason,
          });
        } else {
          await this.github.rest.issues.update({
            owner: this.owner,
            repo: this.repo,
            issue_number: issue.number,
            milestone: assignment.milestoneNumber,
          });

          results.push({
            issueNumber: issue.number,
            status: "assigned",
            milestone: assignment.milestoneTitle,
            confidence: assignment.confidence,
            reason: assignment.reason,
          });
        }
      } catch (error) {
        results.push({
          issueNumber: issue.number,
          status: "error",
          error: error.message,
        });
      }
    }

    // Write report if requested
    if (reportPath) {
      this.writeReport(results, reportPath, dryRun);
    }

    return results;
  }

  /**
   * Generate assignment report
   */
  writeReport(results, reportPath, dryRun) {
    const dir = path.dirname(reportPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const timestamp = new Date().toISOString();
    const summary = {
      timestamp,
      total: results.length,
      assigned: results.filter((r) => r.status === "assigned").length,
      dryRun: results.filter((r) => r.status === "dry-run-success").length,
      skipped: results.filter((r) => r.status === "no-milestone-found").length,
      errors: results.filter((r) => r.status === "error").length,
    };

    const report = [
      `# Milestone Assignment Report`,
      `Generated: ${timestamp}`,
      `Mode: ${dryRun ? "DRY-RUN" : "WRITE"}`,
      "",
      `## Summary`,
      `- Total issues: ${summary.total}`,
      `- Assigned: ${summary.assigned}`,
      `- Dry-run: ${summary.dryRun}`,
      `- Skipped: ${summary.skipped}`,
      `- Errors: ${summary.errors}`,
      "",
      `## Details`,
      "",
    ];

    // Group by status
    const byStatus = {};
    results.forEach((r) => {
      if (!byStatus[r.status]) byStatus[r.status] = [];
      byStatus[r.status].push(r);
    });

    Object.entries(byStatus).forEach(([status, items]) => {
      report.push(`### ${status.toUpperCase()} (${items.length})`);
      report.push("");
      items.forEach((item) => {
        if (status === "assigned" || status === "dry-run-success") {
          report.push(
            `- #${item.issueNumber}: ${item.milestone} (confidence: ${(item.confidence * 100).toFixed(0)}%, reason: ${item.reason})`,
          );
        } else if (status === "error") {
          report.push(`- #${item.issueNumber}: ${item.error}`);
        } else {
          report.push(`- #${item.issueNumber}: ${item.reason}`);
        }
      });
      report.push("");
    });

    fs.writeFileSync(reportPath, report.join("\n"), "utf8");
    console.log(`[milestone-assignment] Report written to ${reportPath}`);
  }
}

module.exports = { MilestoneAssignmentAgent };
