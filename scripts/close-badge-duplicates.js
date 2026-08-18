#!/usr/bin/env node
/**
 * Badge Health Check Duplicate Closer
 * Consolidates duplicate badge health check issues into single tracking issue
 */
import { execSync } from 'child_process';

const REPO = process.env.GITHUB_REPOSITORY || 'lightspeedwp/.github';

function runGH(args) {
  try {
    return execSync(`gh ${args}`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (err) {
    console.error(`GH command failed: gh ${args}`);
    throw err;
  }
}

function findBadgeHealthCheckIssues() {
  console.log('🔍 Finding Badge Health Check issues...\n');
  const result = runGH(`issue list --repo "${REPO}" --label "area:automation" --state open --json number,title -q '.[] | select(.title | startswith("🏥 Badge Health Check"))'`);
  if (!result) return [];

  try {
    return JSON.parse(`[${result.split('\n').join(',')}]`).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (err) {
    console.error('Failed to parse issues:', err);
    return [];
  }
}

function closeIssue(issueNumber, reason) {
  try {
    console.log(`  Closing #${issueNumber}...`);
    runGH(`issue close "${issueNumber}" --repo "${REPO}" --comment "${reason}"`);
    console.log(`  ✅ Closed`);
    return true;
  } catch (err) {
    console.error(`  ❌ Failed:`, err.message);
    return false;
  }
}

function main() {
  console.log('🏥 Badge Health Check Duplicate Closer\n');
  const issues = findBadgeHealthCheckIssues();

  if (issues.length === 0) {
    console.log('✅ No Badge Health Check issues found');
    return;
  }

  if (issues.length <= 1) {
    console.log('✅ Only one issue exists - no duplicates to close\n');
    return;
  }

  const [latestIssue, ...oldestIssues] = issues;
  console.log(`📍 Latest: #${latestIssue.number}\n🗑️  Closing duplicates:\n`);

  let closedCount = 0;
  for (const issue of oldestIssues) {
    if (closeIssue(issue.number, `Duplicate of #${latestIssue.number}. Use that issue for consolidated tracking.`)) {
      closedCount++;
    }
  }

  console.log(`\n✅ Closed ${closedCount} duplicates\n`);
}

main();
