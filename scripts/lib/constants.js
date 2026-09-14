/**
 * constants.js — Shared constants for branch cleanup infrastructure.
 *
 * Centralized definitions for protected branches, forbidden prefixes,
 * allowed branch types, and reason codes used across categorization and reporting.
 *
 * @module scripts/lib/constants
 */

export const PROTECTED_BRANCHES = new Set([
  "main",
  "develop",
  "production",
  "staging",
]);

export const FORBIDDEN_PREFIXES = new Set(["claude", "copilot", "openai"]);

export const ALLOWED_BRANCH_TYPES = new Set([
  "feat",
  "fix",
  "hotfix",
  "release",
  "refactor",
  "chore",
  "task",
  "docs",
  "test",
  "perf",
  "ci",
  "build",
  "deps",
  "security",
  "design",
  "a11y",
  "ux",
  "i18n",
  "ops",
  "proto",
  "ds",
  "api",
  "schema",
  "telemetry",
  "content",
  "seo",
  "config",
  "migrate",
  "qa",
  "uat",
  "audit",
  "codex",
  "revert",
  "research",
]);

export const DEFAULT_INACTIVE_DAYS = 30;

export const BRANCH_NAME_PATTERN = /^[a-z]+\/[a-z0-9]+(-[a-z0-9]+)*$/;

export const REASON_CODES = {
  KEEP: {
    protected_branch: "Protected branch (main, develop, production, staging)",
    excluded_pattern: "Matches exclusion pattern (release/*, hotfix/*)",
    active_pr: "Has active pull request",
    unmerged: "Not fully merged to any base branch",
    recent_activity: "Recently active (merged and recent)",
  },
  DELETE: {
    merged_stale: "Merged and inactive beyond threshold",
  },
  DISCUSS: {
    naming_violation: "Invalid branch name format",
    unmerged_stale: "Unmerged and stale",
    unclear_status: "Unclear merge/age status (manual review needed)",
  },
};
