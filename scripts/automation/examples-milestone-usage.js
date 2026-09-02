#!/usr/bin/env node

/**
 * examples-milestone-usage.js
 *
 * Example usage patterns for milestone management scripts
 * Shows how to use the scripts programmatically in custom workflows
 *
 * NOT EXECUTABLE - Educational reference only
 * To run actual scripts: node reassign-v1-to-v1-1.js or node distribute-unallocated-milestones.js
 */

// Example 1: Using MilestoneReassigner in your own code
// =====================================================

/*
import { MilestoneReassigner } from './reassign-v1-to-v1-1.js';

async function migrateV1Issues() {
  const reassigner = new MilestoneReassigner({
    owner: 'lightspeedwp',
    repo: '.github',
    dryRun: false,
    verbose: true
  });

  try {
    // Find specific milestones
    const milestones = await reassigner.findMilestones();
    const v1_0 = milestones['v1.0'];
    const v1_1 = milestones['v1.1'];

    if (!v1_0 || !v1_1) {
      console.error('Required milestones not found');
      return;
    }

    // Reassign all issues
    const result = await reassigner.reassignMilestone(v1_0.number, v1_1.number);
    console.log('Migration complete:', result.stats);
  } catch (err) {
    console.error('Migration failed:', err.message);
  }
}

migrateV1Issues();
*/

// Example 2: Using MilestoneDistributor with AI analysis
// =======================================================

/*
import { MilestoneDistributor } from './distribute-unallocated-milestones.js';

async function planNextReleases() {
  const distributor = new MilestoneDistributor({
    owner: 'lightspeedwp',
    repo: '.github',
    dryRun: true,  // Preview only
    verbose: true
  });

  try {
    // Find target milestones (v1.1 to v1.6)
    const milestones = await distributor.findMilestones();
    console.log('Target milestones:', Object.keys(milestones));

    // Fetch unallocated issues
    const issues = await distributor.fetchUnallocatedIssues();
    console.log('Found', issues.length, 'unallocated issues');

    // Analyze with AI and distribute
    const result = await distributor.distribute(issues);
    if (result.success) {
      console.log('Distribution plan ready:', result.stats);
    }
  } catch (err) {
    console.error('Planning failed:', err.message);
  }
}

planNextReleases();
*/

// Example 3: Batch processing with custom logic
// ==============================================

/*
import { MilestoneReassigner } from './reassign-v1-to-v1-1.js';

async function batchReassignMultipleMilestones() {
  const reassigner = new MilestoneReassigner({
    verbose: false
  });

  const migrations = [
    { from: 'v0.9', to: 'v1.0' },
    { from: 'v1.0', to: 'v1.1' },
    { from: 'v1.1', to: 'v1.2' }
  ];

  const milestones = await reassigner.findMilestones();

  for (const migration of migrations) {
    const source = milestones[migration.from];
    const target = milestones[migration.to];

    if (!source || !target) {
      console.log(`Skipping ${migration.from} → ${migration.to}: milestone not found`);
      continue;
    }

    console.log(`\nMigrating ${migration.from} → ${migration.to}...`);
    const result = await reassigner.reassignMilestone(source.number, target.number);
    console.log(`  Reassigned: ${result.stats.reassigned}`);
  }
}

batchReassignMultipleMilestones();
*/

// Example 4: Conditional distribution based on issue properties
// ==============================================================

/*
import { MilestoneDistributor } from './distribute-unallocated-milestones.js';

async function intelligentAllocation() {
  const distributor = new MilestoneDistributor();

  const issues = await distributor.fetchUnallocatedIssues();

  // Custom filtering: only process high-priority issues
  const highPriority = issues.filter(issue => {
    const labels = issue.labels.map(l => l.name);
    return labels.includes('priority:high') || labels.includes('priority:critical');
  });

  console.log(`Processing ${highPriority.length} high-priority issues...`);

  // Analyze and distribute only the filtered set
  const result = await distributor.distribute(highPriority);
  console.log('Allocation complete:', result.stats);
}

intelligentAllocation();
*/

// Example 5: GitHub Actions workflow integration
// ===============================================

// File: .github/workflows/milestone-management.yml
/*
name: Manage Milestones

on:
  schedule:
    # Run every Monday at 9 AM UTC
    - cron: '0 9 * * MON'
  workflow_dispatch:  # Allow manual trigger

jobs:
  distribute-backlog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '24'

      - run: npm ci

      - name: Distribute unallocated issues
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          node scripts/automation/distribute-unallocated-milestones.js \
            --verbose

      - name: Create summary
        if: always()
        run: |
          echo "### Milestone Distribution Complete" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "Check the workflow run for details." >> $GITHUB_STEP_SUMMARY
*/

// Example 6: Error handling and recovery
// =======================================

/*
import { MilestoneDistributor } from './distribute-unallocated-milestones.js';

async function robustDistribution() {
  const distributor = new MilestoneDistributor({
    verbose: true
  });

  try {
    // Verify milestones exist before proceeding
    await distributor.findMilestones();
    const issues = await distributor.fetchUnallocatedIssues();

    if (issues.length === 0) {
      console.log('No issues to distribute');
      return;
    }

    // Run in dry-run mode first for large sets
    if (issues.length > 100) {
      console.log('Large issue set detected. Running in dry-run mode first...');
      const dryRunner = new MilestoneDistributor({
        dryRun: true,
        verbose: true
      });
      await dryRunner.distribute(issues);
      console.log('Preview complete. Review results before running live.');
      return;
    }

    // Small set: run live
    const result = await distributor.distribute(issues);
    if (!result.success) {
      console.error('Distribution failed:', result.error);
      console.error('Errors:');
      distributor.errors.forEach(err => console.error('  -', err));
    }
  } catch (err) {
    console.error('Fatal error:', err.message);
    process.exit(1);
  }
}

robustDistribution();
*/

// Example 7: Monitoring and metrics
// ==================================

/*
import { MilestoneReassigner } from './reassign-v1-to-v1-1.js';
import { MilestoneDistributor } from './distribute-unallocated-milestones.js';

async function generateMetrics() {
  const reassigner = new MilestoneReassigner();
  const distributor = new MilestoneDistributor();

  // Get milestone stats
  const milestones = await distributor.findMilestones();
  const unallocated = await distributor.fetchUnallocatedIssues();

  const metrics = {
    timestamp: new Date().toISOString(),
    milestones: {
      total: Object.keys(milestones).length,
      names: Object.keys(milestones)
    },
    issues: {
      unallocated: unallocated.length,
      byLabel: {}
    }
  };

  // Count issues by label
  for (const issue of unallocated) {
    for (const label of issue.labels) {
      if (!metrics.issues.byLabel[label.name]) {
        metrics.issues.byLabel[label.name] = 0;
      }
      metrics.issues.byLabel[label.name]++;
    }
  }

  console.log(JSON.stringify(metrics, null, 2));
}

generateMetrics();
*/

// Example 8: Custom categorization logic
// =======================================

/*
function customCategorizeIssue(issue) {
  const labels = issue.labels.map(l => l.name);
  const title = issue.title.toLowerCase();
  const body = (issue.body || '').toLowerCase();

  // Priority-based categorization
  if (labels.includes('priority:critical')) return 'Critical Path';
  if (labels.includes('priority:high')) return 'High Priority';

  // Feature-based categorization
  if (title.includes('dashboard')) return 'Dashboard';
  if (title.includes('api')) return 'API';
  if (title.includes('performance')) return 'Performance';
  if (title.includes('security')) return 'Security';

  // Fall back to type
  if (labels.includes('bug')) return 'Bug Fixes';
  if (labels.includes('documentation')) return 'Documentation';

  return 'General Tasks';
}

// Usage in distribution logic:
const categories = {};
for (const issue of unallocatedIssues) {
  const category = customCategorizeIssue(issue);
  if (!categories[category]) {
    categories[category] = [];
  }
  categories[category].push(issue.number);
}

console.log('Custom categories:', categories);
*/

console.log(
  "This file contains example patterns for using milestone management scripts.",
);
console.log("See the commented code blocks for various usage scenarios.");
console.log("");
console.log("To use these patterns:");
console.log("1. Uncomment the example(s) you want to use");
console.log("2. Update with your repository details");
console.log("3. Run: node examples-milestone-usage.js");
console.log("");
console.log("Or use the CLI scripts directly:");
console.log("  node reassign-v1-to-v1-1.js --dry-run --verbose");
console.log("  node distribute-unallocated-milestones.js --dry-run --verbose");
