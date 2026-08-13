#!/usr/bin/env node

/**
 * Comprehensive Auto-Update Script
 * 1. Auto-applies labels (type + priority)
 * 2. Updates descriptions with correct template sections
 */

const { execSync } = require('child_process');
const fs = require('fs');

const OWNER = 'lightspeedwp';
const REPO = '.github';
const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');
const BATCH_SIZE = process.argv.includes('--batch')
  ? parseInt(process.argv[process.argv.indexOf('--batch') + 1])
  : 10;

const stats = {
  issuesProcessed: 0,
  issuesLabeledAdded: 0,
  issuesDescriptionUpdated: 0,
  prsProcessed: 0,
  prsDescriptionUpdated: 0,
  errors: []
};

function log(msg, type = 'info') {
  if (VERBOSE || type !== 'debug') {
    const prefix = {
      info: '📋',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      debug: '🔍',
    }[type] || '•';
    console.log(`${prefix} ${msg}`);
  }
}

function exec(cmd, silent = false) {
  try {
    return execSync(cmd, {
      encoding: 'utf-8',
      stdio: silent ? 'pipe' : 'inherit',
      maxBuffer: 10 * 1024 * 1024
    }).trim();
  } catch (e) {
    if (!silent) log(`Command failed: ${cmd}`, 'error');
    return '';
  }
}

function getOpenIssues() {
  log('Fetching open issues...', 'info');
  const result = exec(
    `gh issue list --repo ${OWNER}/${REPO} --state open --limit 300 --json number,title,labels,body`,
    true
  );
  return JSON.parse(result || '[]');
}

function getOpenPRs() {
  log('Fetching open PRs...', 'info');
  const result = exec(
    `gh pr list --repo ${OWNER}/${REPO} --state open --limit 100 --json number,title,labels,body`,
    true
  );
  return JSON.parse(result || '[]');
}

function detectIssueType(title) {
  title = title.toLowerCase();
  if (/bug|fix|issue|error|fail|break/i.test(title)) return 'type:bug';
  if (/feature|add|new|implement|create|build/i.test(title)) return 'type:feature';
  if (/epic|phase|initiative|release/i.test(title)) return 'type:epic';
  if (/design|ui|ux|mockup|wireframe/i.test(title)) return 'type:design';
  if (/refactor|cleanup|simplify|improve/i.test(title)) return 'type:refactor';
  if (/doc|guide|readme|help|tutorial/i.test(title)) return 'type:documentation';
  if (/test|coverage|qa|assert/i.test(title)) return 'type:test';
  if (/perf|speed|optim|memory|cache/i.test(title)) return 'type:performance';
  if (/security|vuln|auth|encrypt|protect/i.test(title)) return 'type:security';
  return 'type:task';
}

function hasLabel(labels, name) {
  return labels && labels.some(l => l.name === name);
}

function hasTypeLabel(labels) {
  return labels && labels.some(l => l.name.startsWith('type:'));
}

function hasPriorityLabel(labels) {
  return labels && labels.some(l => l.name.startsWith('priority:'));
}

function addLabelToIssue(number, label) {
  if (DRY_RUN) {
    log(`[DRY RUN] Would add label "${label}" to issue #${number}`, 'debug');
    return;
  }

  try {
    exec(`gh issue edit ${number} --repo ${OWNER}/${REPO} --add-label "${label}"`, true);
    log(`Added label "${label}" to issue #${number}`, 'success');
  } catch (e) {
    log(`Failed to add label to issue #${number}`, 'error');
  }
}

function updateIssueDescription(number, body, title) {
  // Add Definition of Ready and Done sections if missing
  let updated = false;
  let newBody = body || '';

  const hasDoR = /## Definition of Ready|## DoR/i.test(newBody);
  const hasDoD = /## Definition of Done|## DoD/i.test(newBody);

  if (!hasDoR) {
    newBody = `${newBody}\n\n## Definition of Ready (DoR)\n\n- [ ] Issue has clear acceptance criteria\n- [ ] Related issues are linked\n- [ ] Scope is well-defined`;
    updated = true;
  }

  if (!hasDoD) {
    newBody = `${newBody}\n\n## Definition of Done (DoD)\n\n- [ ] Code is reviewed and approved\n- [ ] Tests pass (unit + integration)\n- [ ] Documentation updated\n- [ ] Changelog entry added (if applicable)`;
    updated = true;
  }

  if (updated) {
    if (DRY_RUN) {
      log(`[DRY RUN] Would update description for issue #${number}`, 'debug');
      return true;
    }

    try {
      const escaped = newBody.replace(/"/g, '\\"').replace(/\n/g, '\\n');
      exec(`gh issue edit ${number} --repo ${OWNER}/${REPO} --body "${escaped}"`, true);
      log(`Updated description for issue #${number}`, 'success');
      return true;
    } catch (e) {
      log(`Failed to update issue #${number} description`, 'error');
      return false;
    }
  }

  return false;
}

function updatePRDescription(number, body) {
  let updated = false;
  let newBody = body || '';

  const hasReadme = /## Summary|## Changes/i.test(newBody);
  const hasTestPlan = /## Test plan|## Testing/i.test(newBody);
  const hasChangelog = /## Changelog|### Added|### Changed|### Fixed/i.test(newBody);

  if (!hasReadme) {
    newBody = `## Summary\n\n[Brief description of changes]\n\n${newBody}`;
    updated = true;
  }

  if (!hasTestPlan) {
    newBody = `${newBody}\n\n## Test plan\n\n- [ ] Manual testing complete\n- [ ] Automated tests pass\n- [ ] No regressions detected`;
    updated = true;
  }

  if (!hasChangelog) {
    newBody = `${newBody}\n\n## Changelog\n\n### Added\n- \n\n### Changed\n- \n\n### Fixed\n- `;
    updated = true;
  }

  if (updated) {
    if (DRY_RUN) {
      log(`[DRY RUN] Would update description for PR #${number}`, 'debug');
      return true;
    }

    try {
      const escaped = newBody.replace(/"/g, '\\"').replace(/\n/g, '\\n');
      exec(`gh pr edit ${number} --repo ${OWNER}/${REPO} --body "${escaped}"`, true);
      log(`Updated description for PR #${number}`, 'success');
      return true;
    } catch (e) {
      log(`Failed to update PR #${number} description`, 'error');
      return false;
    }
  }

  return false;
}

function processIssues(issues) {
  log(`\n📋 Processing ${issues.length} issues...`, 'info');

  issues.forEach((issue, index) => {
    if (index % 10 === 0) {
      log(`Progress: ${index}/${issues.length}`, 'debug');
    }

    stats.issuesProcessed++;

    // Add missing labels
    const labelsToAdd = [];

    if (!hasTypeLabel(issue.labels)) {
      labelsToAdd.push(detectIssueType(issue.title));
    }

    if (!hasPriorityLabel(issue.labels)) {
      labelsToAdd.push('priority:normal');
    }

    labelsToAdd.forEach(label => {
      addLabelToIssue(issue.number, label);
      stats.issuesLabeledAdded++;
    });

    // Update description with template sections
    if (updateIssueDescription(issue.number, issue.body, issue.title)) {
      stats.issuesDescriptionUpdated++;
    }
  });

  log(`✅ Issues processed: ${stats.issuesProcessed}`, 'success');
  log(`✅ Labels added: ${stats.issuesLabeledAdded}`, 'success');
  log(`✅ Descriptions updated: ${stats.issuesDescriptionUpdated}`, 'success');
}

function processPRs(prs) {
  log(`\n📋 Processing ${prs.length} PRs...`, 'info');

  prs.forEach((pr, index) => {
    if (index % 10 === 0) {
      log(`Progress: ${index}/${prs.length}`, 'debug');
    }

    stats.prsProcessed++;

    // Update description with template sections
    if (updatePRDescription(pr.number, pr.body)) {
      stats.prsDescriptionUpdated++;
    }
  });

  log(`✅ PRs processed: ${stats.prsProcessed}`, 'success');
  log(`✅ PR descriptions updated: ${stats.prsDescriptionUpdated}`, 'success');
}

function main() {
  log('🚀 Starting comprehensive auto-update...', 'info');
  log(`DRY_RUN: ${DRY_RUN}, BATCH_SIZE: ${BATCH_SIZE}\n`, 'debug');

  try {
    const issues = getOpenIssues();
    const prs = getOpenPRs();

    processIssues(issues);
    processPRs(prs);

    // Print final summary
    log('\n📊 Final Summary:', 'info');
    log(`  Issues processed: ${stats.issuesProcessed}`, 'debug');
    log(`  Labels added: ${stats.issuesLabeledAdded}`, 'success');
    log(`  Issue descriptions updated: ${stats.issuesDescriptionUpdated}`, 'success');
    log(`  PRs processed: ${stats.prsProcessed}`, 'debug');
    log(`  PR descriptions updated: ${stats.prsDescriptionUpdated}`, 'success');

    if (stats.errors.length > 0) {
      log(`\n⚠️  Errors encountered: ${stats.errors.length}`, 'warning');
      stats.errors.slice(0, 5).forEach(err => log(`  - ${err}`, 'error'));
      if (stats.errors.length > 5) {
        log(`  ... and ${stats.errors.length - 5} more`, 'error');
      }
    }

    if (DRY_RUN) {
      log('\n(This was a dry run - no changes were made)', 'info');
    }

    log('\n✅ Comprehensive auto-update complete!', 'success');

  } catch (e) {
    log(`Failed: ${e.message}`, 'error');
    process.exit(1);
  }
}

main();
