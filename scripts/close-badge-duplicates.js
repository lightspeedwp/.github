#!/usr/bin/env node

/**
 * Badge Health Check Duplicate Closer
 * Finds and closes duplicate badge health check issues
 * Consolidates all broken links into the latest issue
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

  const result = runGH(
    `issue list --repo "${REPO}" --label "area:automation" --state open --json number,title,createdAt -q '.[] | select(.title | startswith("🏥 Badge Health Check"))'`,
  );

  if (!result) {
    console.log('No Badge Health Check issues found');
    return [];
  }

  try {
    const issues = JSON.parse(`[${result.split('\n').join(',')}]`);
    return issues.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (err) {
    console.error('Failed to parse issue list:', err);
    return [];
  }
}

function getIssueBody(issueNumber) {
  try {
    return runGH(`issue view "${issueNumber}" --repo "${REPO}" --json body -q '.body'`);
  } catch {
    return '';
  }
}

function closeIssue(issueNumber, reason) {
  try {
    console.log(`  Closing issue #${issueNumber}...`);
    runGH(`issue close "${issueNumber}" --repo "${REPO}" --comment "${reason}"`);
    console.log(`  ✅ Issue #${issueNumber} closed`);
    return true;
  } catch (err) {
    console.error(`  ❌ Failed to close issue #${issueNumber}:`, err.message);
    return false;
  }
}

function extractBrokenLinks(body) {
  const brokenSection = body.match(/## Broken Links\n([\s\S]*?)(?=##|$)/);
  if (!brokenSection) return [];

  return brokenSection[1]
    .split('\n')
    .filter(line => line.trim().startsWith('http'))
    .map(line => line.trim());
}

function consolidateIssues(issues) {
  if (issues.length <= 1) {
    console.log('\n✅ Only one badge health check issue exists - no duplicates to close\n');
    return;
  }

  console.log(`\n🔗 Found ${issues.length} Badge Health Check issues\n`);

  const latestIssue = issues[0];
  const oldestIssues = issues.slice(1);

  console.log(`Latest issue: #${latestIssue.number} (${latestIssue.title})`);
  console.log(`Duplicates to close: ${oldestIssues.map(i => `#${i.number}`).join(', ')}\n`);

  // Collect all broken links from all issues
  const allBrokenLinks = new Set();

  for (const issue of issues) {
    const body = getIssueBody(issue.number);
    const links = extractBrokenLinks(body);
    links.forEach(link => allBrokenLinks.add(link));
  }

  console.log(`📊 Total unique broken links across all issues: ${allBrokenLinks.size}\n`);

  // Close duplicate issues
  console.log('🗑️  Closing duplicate issues...\n');
  let closedCount = 0;

  for (const issue of oldestIssues) {
    const closeReason =
      `This issue is a duplicate of #${latestIssue.number}. ` +
      `Consolidating all badge health checks into a single tracking issue to reduce noise. ` +
      `See #${latestIssue.number} for the latest status.`;

    if (closeIssue(issue.number, closeReason)) {
      closedCount++;
    }
  }

  console.log(`\n✅ Closed ${closedCount} duplicate issues`);
  console.log(`📍 Main tracking issue: #${latestIssue.number}\n`);
}

function main() {
  console.log('🏥 Badge Health Check Duplicate Closer\n');
  console.log(`Repository: ${REPO}\n`);
  console.log('=' .repeat(60));

  const issues = findBadgeHealthCheckIssues();

  if (issues.length === 0) {
    console.log('✅ No Badge Health Check issues found');
    process.exit(0);
  }

  consolidateIssues(issues);
}

main();
