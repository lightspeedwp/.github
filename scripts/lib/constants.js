/**
 * constants.js — Shared constants for branch cleanup infrastructure.
 *
 * Centralized definitions for protected branches, forbidden prefixes,
 * allowed branch types, and reason codes used across categorization and reporting.
 *
 * @module scripts/lib/constants
 */

import {
  AUTHORIZED_TYPES,
  FORBIDDEN_PREFIXES as CANONICAL_FORBIDDEN_PREFIXES,
} from '../../lib/validate-branch-name.js';

export const PROTECTED_BRANCHES = new Set(['main', 'develop', 'production', 'staging', 'master']);

// Branch naming rules come from the canonical validator shared with CI and the
// Claude Code branch guard, so the three can never drift apart.
export const FORBIDDEN_PREFIXES = new Set(
  CANONICAL_FORBIDDEN_PREFIXES.map((prefix) => prefix.replace(/\/$/, ''))
);

export const ALLOWED_BRANCH_TYPES = new Set(AUTHORIZED_TYPES);

export const DEFAULT_INACTIVE_DAYS = 30;

export const REASON_CODES = {
  KEEP: {
    protected_branch: 'Protected branch (main, develop, production, staging, master)',
    excluded_pattern: 'Matches exclusion pattern (release/*, hotfix/*)',
    active_pr: 'Has active pull request',
    author_preserved: 'Author matches an explicit preservation pattern',
    unmerged: 'Not fully merged to any base branch',
    recent_activity: 'Recently active (merged and recent)',
  },
  DELETE: {
    merged_stale: 'Merged and inactive beyond threshold',
  },
  DISCUSS: {
    naming_violation: 'Invalid branch name format',
    unmerged_stale: 'Unmerged and stale',
    pr_verification_unavailable: 'Open-PR verification unavailable; deletion blocked',
    unclear_status: 'Unclear merge/age status (manual review needed)',
  },
};
