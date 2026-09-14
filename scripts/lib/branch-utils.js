/**
 * branch-utils.js — Shared utility functions for branch operations.
 *
 * Pure utility functions with no side effects: branch type extraction,
 * date/age calculations, formatting, and storage estimation.
 *
 * @module scripts/lib/branch-utils
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const AVG_STORAGE_BYTES_PER_COMMIT = 4096;

export function branchTypeOf(branch) {
  if (branch.includes("/")) {
    return branch.split("/")[0];
  }
  return "other";
}

export function daysSince(isoDate) {
  if (!isoDate) return 0;
  const then = new Date(isoDate);
  if (Number.isNaN(then.getTime())) return 0;
  return (Date.now() - then.getTime()) / MS_PER_DAY;
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

export function toInt(value, fallback = 0) {
  const parsed = parseInt(String(value).trim(), 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function toPct(numerator, denominator) {
  if (denominator === 0) return "0.00%";
  return `${((numerator / denominator) * 100).toFixed(2)}%`;
}

export function estimateStorageFreedBytes(commitCount) {
  return commitCount * AVG_STORAGE_BYTES_PER_COMMIT;
}
