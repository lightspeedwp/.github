/**
 * branch-categorization.js — 8-gate branch categorization decision tree
 *
 * Implements the unambiguous decision tree for categorizing branches
 * as KEEP, DELETE, or DISCUSS with supporting metadata.
 *
 * Decision order (8 gates):
 * 1. Protected branch? → KEEP
 * 2. Excluded by pattern? → KEEP
 * 3. Has open PR? → KEEP
 * 3b. Empty agent-session branch (claude/*, merged, old enough)? → DELETE (auto-approved)
 * 4. Invalid branch name? → DISCUSS
 * 5. Not merged to any base? → DISCUSS (if stale)
 * 6. Meets age threshold? → DELETE
 * 7. Excluded by policy? → DISCUSS
 * 8. Unclear status? → DISCUSS
 *
 * @module scripts/lib/branch-categorization
 */

import {
  AUTO_DELETE_MIN_AGE_DAYS,
  AUTO_DELETE_PREFIXES,
  FORBIDDEN_PREFIXES,
  PROTECTED_BRANCHES,
  REASON_CODES,
} from './constants.js';
import { getAgeInDays, meetsAgeThreshold } from './age-calculator.js';
import { matchesExclusionPattern } from './exclusion-patterns.js';
import { validateBranchName as validateCanonicalBranchName } from '../../lib/validate-branch-name.js';

export function validateBranchName(branch) {
  const result = validateCanonicalBranchName(branch);
  if (result.valid) {
    return { valid: true };
  }

  const prefix = typeof branch === 'string' ? branch.split('/')[0] : '';
  if (result.errors.includes('forbidden_prefix') && FORBIDDEN_PREFIXES.has(prefix)) {
    return { valid: false, reason: `forbidden prefix: ${prefix}` };
  }

  return {
    valid: false,
    reason: `must follow pattern: {type}/{scope}-{title} (${result.errors.join(', ')})`,
  };
}

function extractMetadata(branch, metadata = {}) {
  const type = branch.includes('/') ? branch.split('/')[0] : 'other';
  const ageInDays = getAgeInDays(metadata.lastCommitDate || '');

  return {
    type,
    author: metadata.author || 'unknown',
    ageInDays,
    lastCommitDate: metadata.lastCommitDate || '',
    mergeStatus: metadata.mergeStatus || { merged: false, state: 'unmerged' },
  };
}

export function categorizeBranch(
  branch,
  metadata = {},
  openPRs = new Set(),
  excludePattern = null,
  inactiveDays = 30
) {
  const extracted = extractMetadata(branch, metadata);

  // Gate 1: Protected branch?
  if (PROTECTED_BRANCHES.has(branch)) {
    return {
      category: 'KEEP',
      reason: REASON_CODES.KEEP.protected_branch,
      metadata: extracted,
    };
  }

  // Gate 2: Excluded by pattern?
  if (excludePattern && matchesExclusionPattern(branch, excludePattern)) {
    return {
      category: 'KEEP',
      reason: REASON_CODES.KEEP.excluded_pattern,
      metadata: extracted,
    };
  }

  // Gate 3: Has open PR?
  if (openPRs && openPRs.has(branch)) {
    return {
      category: 'KEEP',
      reason: REASON_CODES.KEEP.active_pr,
      metadata: extracted,
    };
  }

  // Gate 3b: Empty agent-session branch? Merged means it holds no commits of
  // its own, so deleting it cannot lose work. The caller downgrades this to
  // DISCUSS when open-PR verification was unavailable (spec 016 FR-020).
  const prefix = branch.split('/')[0];
  if (
    AUTO_DELETE_PREFIXES.has(prefix) &&
    extracted.mergeStatus.merged === true &&
    meetsAgeThreshold(extracted.ageInDays, AUTO_DELETE_MIN_AGE_DAYS)
  ) {
    return {
      category: 'DELETE',
      autoApproved: true,
      reason: REASON_CODES.DELETE.auto_delete_empty_agent_branch,
      metadata: extracted,
    };
  }

  // Gate 4: Invalid branch name?
  const nameValidation = validateBranchName(branch);
  if (!nameValidation.valid) {
    return {
      category: 'DISCUSS',
      reason: `${REASON_CODES.DISCUSS.naming_violation}: ${nameValidation.reason}`,
      metadata: extracted,
    };
  }

  // Gate 5: Merged status
  const merged = extracted.mergeStatus.merged || false;

  // If not merged and stale → DISCUSS
  if (!merged && meetsAgeThreshold(extracted.ageInDays, inactiveDays)) {
    return {
      category: 'DISCUSS',
      reason: REASON_CODES.DISCUSS.unmerged_stale,
      metadata: extracted,
    };
  }

  // If not merged but recent → KEEP
  if (!merged) {
    return {
      category: 'KEEP',
      reason: REASON_CODES.KEEP.unmerged,
      metadata: extracted,
    };
  }

  // Gate 6: Meets age threshold (merged + stale)?
  if (meetsAgeThreshold(extracted.ageInDays, inactiveDays)) {
    return {
      category: 'DELETE',
      reason: REASON_CODES.DELETE.merged_stale,
      metadata: extracted,
    };
  }

  // Gate 7: Merged but recent → KEEP
  if (merged) {
    return {
      category: 'KEEP',
      reason: REASON_CODES.KEEP.recent_activity,
      metadata: extracted,
    };
  }

  // Gate 8: Unclear status (fallback)
  return {
    category: 'DISCUSS',
    reason: REASON_CODES.DISCUSS.unclear_status,
    metadata: extracted,
  };
}

export function categorizeBranches(
  branches = [],
  branchMetadata = {},
  openPRs = new Set(),
  excludePattern = null,
  inactiveDays = 30
) {
  const result = {
    KEEP: [],
    DELETE: [],
    DISCUSS: [],
  };

  if (
    !Array.isArray(branches) ||
    !branches.every((branch) => typeof branch === 'string' && branch.length > 0)
  ) {
    console.error('branches must be an array of non-empty strings');
    return result;
  }

  if (!branchMetadata || typeof branchMetadata !== 'object' || Array.isArray(branchMetadata)) {
    console.error('branchMetadata must be an object');
    return result;
  }

  let normalizedOpenPRs;
  if (openPRs instanceof Set) {
    normalizedOpenPRs = openPRs;
  } else if (Array.isArray(openPRs)) {
    normalizedOpenPRs = new Set(openPRs);
  } else {
    console.error('openPRs must be a Set or an array');
    return result;
  }

  if (!Number.isInteger(inactiveDays) || inactiveDays < 0) {
    console.error('inactiveDays must be a non-negative integer');
    return result;
  }

  for (const branch of branches) {
    const metadata = branchMetadata[branch] || {};
    const categorization = categorizeBranch(
      branch,
      metadata,
      normalizedOpenPRs,
      excludePattern,
      inactiveDays
    );

    result[categorization.category].push({
      name: branch,
      category: categorization.category,
      reason: categorization.reason,
      autoApproved: categorization.autoApproved === true,
      ...categorization.metadata,
    });
  }

  return result;
}
