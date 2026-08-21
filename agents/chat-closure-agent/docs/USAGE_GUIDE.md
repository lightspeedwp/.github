# Chat Closure Agent — Usage Guide

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![allocate-pr-issue-to-milestone](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![badges-documentation-update](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml)
[![badges-health-check](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml)
[![badges-readme-status](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml)
[![badges-workflow-audit](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
[![docs-maintenance](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml)
[![docs-validation](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![gitleaks-reusable](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml)
[![gitleaks-update](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml)
[![gitleaks](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml)
[![issue-create-enhanced](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml)
[![issue-create-from-template](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml)
[![issue-fields-backfill](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml)
[![issue-health-audit](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml)
[![issue-labeling-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml)
[![issue-project-field-sync](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml)
[![issue-remediation-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml)
[![issue-remediation-bulk](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![label-audit-report](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml)
[![labeling-governance](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![manage-blocking-status-labels](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml)
[![meta-agent-validation](https://github.com/lightspeedwp/.github/actions/workflows/meta-agent-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-agent-validation.yml)
[![meta-labels-sync](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-pipeline](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml)
[![metrics-reporting](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml)
[![openspec-progress-phase](https://github.com/lightspeedwp/.github/actions/workflows/openspec-progress-phase.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-progress-phase.yml)
[![openspec-report-progression](https://github.com/lightspeedwp/.github/actions/workflows/openspec-report-progression.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-report-progression.yml)
[![openspec-sync-labels](https://github.com/lightspeedwp/.github/actions/workflows/openspec-sync-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-sync-labels.yml)
[![openspec-validate-labels](https://github.com/lightspeedwp/.github/actions/workflows/openspec-validate-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-validate-labels.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![pr-template-validation](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-validation.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-maintenance-nightly](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml)
[![project-maintenance-on-demand](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![validate-blocking-issue-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml)
[![validate-blocking-status-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml)
[![validate-dor-dod-sections](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml)
[![validate-issue-dod-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
[![validate-project-linking](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml)
<!-- BADGES-END -->

**How to invoke, configure, and customize the Chat Closure Agent for different scenarios.**

## Quick Start

### Basic Invocation

```javascript
const coreAnalysis = require('./shared/core-analysis');
const memoryUpdater = require('./shared/memory-updater');
const promptBuilder = require('./shared/continuation-prompt-builder');

// 1. Analyze current repository
const analysis = coreAnalysis.analyzeRepository('.');

// 2. Create memory entry
const memory = memoryUpdater.updateMemoryForSessionClosure('.', analysis, {
  sessionId: 'session-123',
  decisions: {
    'implementation-approach': {
      choice: 'Modular architecture',
      rationale: 'Enables component reuse'
    }
  },
  blockers: ['Documentation pending'],
  nextSteps: ['Write tests', 'Review with team']
});

// 3. Generate continuation prompt
const prompt = promptBuilder.buildContinuationPrompt(analysis, {
  memory: memory.entry.families
});

console.log(prompt.markdown);
```

## Invocation Patterns

### Pattern 1: Simple Analysis Only

**Use case:** Quick repo analysis without memory or cleanup

```javascript
const coreAnalysis = require('./shared/core-analysis');

const analysis = coreAnalysis.analyzeRepository('.');

console.log(`Branch: ${analysis.branch}`);
console.log(`Type: ${analysis.repoType}`);
console.log(`Commits: ${analysis.commits.length}`);
console.log(`Issues: ${analysis.issueNumbers.join(', ')}`);
```

**Output:**

```
Branch: feat/implementation
Type: control-plane
Commits: 4
Issues: #1850, #1851, #1852
```

### Pattern 2: Memory-Only Update

**Use case:** Document decisions without generating prompts

```javascript
const memoryUpdater = require('./shared/memory-updater');
const coreAnalysis = require('./shared/core-analysis');

const analysis = coreAnalysis.analyzeRepository('.');

const memory = memoryUpdater.updateMemoryForSessionClosure('.', analysis, {
  sessionId: 'chat-20260812',
  decisions: {
    'architecture': {
      choice: 'Monolithic with separation of concerns',
      rationale: 'Simpler deployment model'
    },
    'testing-strategy': {
      choice: 'Unit + integration tests',
      rationale: '85%+ coverage requirement'
    }
  },
  blockers: ['Waiting for design review'],
  nextSteps: ['Implementation phase', 'QA testing']
});

console.log(`✅ Memory saved: ${memory.entry.name}`);
console.log(`📍 Location: .remember/${memory.entry.name}.md`);
```

### Pattern 3: Full Handoff Workflow

**Use case:** Complete session closure with memory + prompt + cleanup

```javascript
const coreAnalysis = require('./shared/core-analysis');
const memoryUpdater = require('./shared/memory-updater');
const promptBuilder = require('./shared/continuation-prompt-builder');
const workspaceCleaner = require('./shared/workspace-cleaner');

async function closeSession() {
  // Step 1: Analyze
  const analysis = coreAnalysis.analyzeRepository('.');
  
  // Step 2: Memory
  const memory = memoryUpdater.updateMemoryForSessionClosure('.', analysis, {
    sessionId: `chat-${new Date().toISOString().split('T')[0]}`,
    decisions: { /* ... */ },
    blockers: [],
    nextSteps: ['Continue implementation']
  });
  
  // Step 3: Prompt
  const prompt = promptBuilder.buildContinuationPrompt(analysis, {
    memory: memory.entry.families
  });
  
  // Step 4: Cleanup (optional)
  const cleanup = workspaceCleaner.cleanupWorktree('.', process.env.PWD, {
    autoStash: false,
    deleteAfterCleanup: false,
    confirmationCallback: (details) => {
      console.log('Cleanup details:', details);
      return true; // User confirms
    }
  });
  
  // Display results
  console.log('=== SESSION CLOSURE COMPLETE ===\n');
  console.log(prompt.markdown);
  console.log('\n=== CLEANUP STATUS ===\n');
  console.log(cleanup.report);
}

closeSession();
```

### Pattern 4: Dry Run (Analysis Only)

**Use case:** See what would happen without making changes

```javascript
const workspaceCleaner = require('./shared/workspace-cleaner');

const analysis = workspaceCleaner.validateCleanupSafety('.', '.');

console.log('Cleanup Safety Assessment:');
console.log(`- Git state: ${analysis.gitState.isClean ? '✅ Clean' : '⚠️ Dirty'}`);
console.log(`- Files changed: ${analysis.gitState.changedFiles.length}`);
console.log(`- Commits ahead: ${analysis.commitsAhead}`);
console.log(`- Warnings: ${analysis.warnings.join(', ')}`);
```

## Configuration & Customization

### Environment Variables

```bash
# Git configuration
export GIT_AUTHOR_NAME="Your Name"
export GIT_AUTHOR_EMAIL="your.email@example.com"

# Memory system
export MEMORY_DIR=".remember"
export MEMORY_INDEX="MEMORY.md"

# Cleanup behavior
export AUTO_STASH=false
export AUTO_COMMIT=false
export REQUIRE_CONFIRMATION=true

# Repository paths
export REPO_PATH="."
export WORKTREE_PATH="${PWD}"
```

### Memory Options

**Update memory with custom data:**

```javascript
const memory = memoryUpdater.updateMemoryForSessionClosure('.', analysis, {
  sessionId: 'custom-session',
  
  // Document key decisions
  decisions: {
    'architecture': {
      choice: 'Feature flags for gradual rollout',
      rationale: 'Reduces risk of breaking changes'
    },
    'database-schema': {
      choice: 'Non-blocking migration',
      rationale: 'Enables zero-downtime deployments'
    }
  },
  
  // Track blockers
  blockers: [
    'Waiting for security review approval',
    'Mobile team coordinating release schedule'
  ],
  
  // List next actions
  nextSteps: [
    'Complete unit test coverage (target: 90%)',
    'Perform load testing (1M req/sec)',
    'Deploy to staging environment',
    'Schedule team review meeting'
  ],
  
  // Link projects (optional)
  projectNames: ['Chat Closure Agent', 'Session Optimization']
});
```

### Prompt Customization

**Build continuation prompt with custom context:**

```javascript
const prompt = promptBuilder.buildContinuationPrompt(analysis, {
  sessionId: 'session-123',
  
  // Include related projects (optional)
  projects: [
    { name: 'Chat Closure Agent', url: '#1850', status: 'In Progress' }
  ],
  
  // Include related issues (optional)
  issues: [
    { number: 1851, title: 'Phase 3 Documentation', status: 'Open' }
  ],
  
  // Include related PRs (optional)
  prs: [
    { number: 1856, title: 'Add memory integration', status: 'In Review' }
  ],
  
  // Pass memory families
  memory: memory.entry.families
});

// Validate prompt quality
const validation = promptBuilder.validatePrompt(prompt);
if (!validation.valid) {
  console.log('⚠️ Validation warnings:', validation.warnings);
}
```

### Cleanup Customization

**Configure workspace cleanup behavior:**

```javascript
const cleanup = workspaceCleaner.cleanupWorktree(repoPath, worktreePath, {
  // How to handle uncommitted changes
  autoStash: false,      // Don't auto-stash; prompt user
  autoCommit: false,     // Don't auto-commit; prompt user
  
  // Whether to delete worktree after cleanup
  deleteAfterCleanup: false,
  
  // Custom confirmation callback
  confirmationCallback: (details) => {
    // details = {
    //   gitState: { isClean, changedFiles },
    //   commitsAhead,
    //   warnings,
    //   suggestedAction
    // }
    
    // Implement custom confirmation logic
    console.log(`Unsafe to proceed. Warnings: ${details.warnings.join(', ')}`);
    
    // Return true to proceed, false to cancel
    return details.commitsAhead === 0; // Only proceed if no commits ahead
  }
});
```

## Real-World Examples

### Example 1: End-of-Day Session Closure

```javascript
const agent = require('./chat-closure-agent');

async function endOfDayHandoff() {
  const analysis = agent.coreAnalysis.analyzeRepository('.');
  
  const memory = agent.memoryUpdater.updateMemoryForSessionClosure('.', analysis, {
    sessionId: `eod-${new Date().toISOString().split('T')[0]}`,
    decisions: {
      'daily-status': {
        choice: 'Implementation 60% complete',
        rationale: 'Met standup goals for the day'
      }
    },
    blockers: ['Code review pending from @reviewer'],
    nextSteps: [
      'Resolve code review feedback',
      'Merge to develop branch',
      'Deploy to staging tomorrow morning'
    ]
  });
  
  const prompt = agent.promptBuilder.buildContinuationPrompt(analysis, {
    memory: memory.entry.families
  });
  
  console.log(prompt.markdown);
  console.log(`\n💾 Saved to: .remember/${memory.entry.name}.md`);
}

endOfDayHandoff();
```

### Example 2: Feature Branch Completion

```javascript
async function completeFeatureBranch() {
  const analysis = agent.coreAnalysis.analyzeRepository('.');
  
  // Document the feature completion
  const memory = agent.memoryUpdater.updateMemoryForSessionClosure('.', analysis, {
    sessionId: `feature-${analysis.parsedBranch.scope}`,
    decisions: {
      'feature-approach': {
        choice: 'Modular architecture with factory pattern',
        rationale: 'Enables easy extension for future features'
      },
      'testing-coverage': {
        choice: 'Unit tests + integration tests (92% coverage)',
        rationale: 'Exceeds project minimum of 85%'
      },
      'code-quality': {
        choice: 'ESLint strict mode, zero warnings',
        rationale: 'Maintains codebase consistency'
      }
    },
    blockers: [],
    nextSteps: [
      'Create pull request to develop',
      'Request code review from senior engineer',
      'Merge after approval'
    ]
  });
  
  const prompt = agent.promptBuilder.buildContinuationPrompt(analysis, {
    memory: memory.entry.families
  });
  
  console.log('=== FEATURE COMPLETE ===\n');
  console.log(`Branch: ${analysis.branch}`);
  console.log(`Commits: ${analysis.commits.length}`);
  console.log(`Coverage: 92%\n`);
  console.log(prompt.markdown);
}
```

### Example 3: Context Window Management

```javascript
function prepareContextHandoff() {
  const analysis = agent.coreAnalysis.analyzeRepository('.');
  
  // Lightweight memory for quick continuation
  const memory = agent.memoryUpdater.updateMemoryForSessionClosure('.', analysis, {
    sessionId: 'context-window',
    decisions: {
      'current-task': {
        choice: 'Implementing auth middleware',
        rationale: 'Critical path item for release'
      }
    },
    blockers: ['Waiting for OAuth config from DevOps'],
    nextSteps: [
      'Implement JWT validation',
      'Add role-based access control',
      'Write integration tests'
    ]
  });
  
  const prompt = agent.promptBuilder.buildContinuationPrompt(analysis, {
    memory: memory.entry.families
  });
  
  // Ensure prompt is suitable for next session
  const validation = agent.promptBuilder.validatePrompt(prompt);
  
  if (validation.valid && prompt.markdown.length > 200) {
    console.log('✅ Prompt ready for next session');
    return prompt.markdown;
  } else {
    console.log('⚠️ Prompt validation failed:', validation.warnings);
  }
}
```

## API Reference

### Core Analysis Module

```javascript
const analysis = coreAnalysis.analyzeRepository(repoPath, options = {})

// Returns:
{
  branch: 'feat/implementation',          // Current branch name
  parsedBranch: {                         // Parsed branch structure
    type: 'feat',
    scope: 'implementation',
    title: 'implementation'
  },
  repoType: 'control-plane',              // Repository type
  issueNumbers: ['#1850', '#1851'],       // Related issue numbers
  commits: [                              // Recent commits
    {
      hash: 'abc1234',
      subject: 'feat: Add core functionality',
      author: 'Ash Shaw',
      date: '2026-08-12'
    }
  ],
  gitState: {                             // Git repository state
    isClean: true,
    changedFiles: [],
    unstagedChanges: 0,
    stagedChanges: 0
  }
}
```

### Memory Updater Module

```javascript
const memory = memoryUpdater.updateMemoryForSessionClosure(
  repoPath,
  analysis,
  {
    sessionId: string,
    decisions: object,
    blockers: string[],
    nextSteps: string[],
    projectNames?: string[]
  }
)

// Returns:
{
  written: boolean,                       // Whether file was written
  entry: {
    name: 'chat-closure-session-123',
    families: {
      metadata: { /* ... */ },
      user_defaults: [ /* ... */ ],
      project_context: [ /* ... */ ],
      decision_log: [ /* ... */ ],
      execution_state: [ /* ... */ ],
      handoff: [ /* ... */ ]
    }
  },
  markdown: string,                       // Full file contents
  indexUpdated: boolean                   // Whether MEMORY.md updated
}
```

### Continuation Prompt Builder

```javascript
const prompt = promptBuilder.buildContinuationPrompt(
  analysis,
  {
    sessionId?: string,
    projects?: object[],
    issues?: object[],
    prs?: object[],
    memory?: object
  }
)

// Returns:
{
  title: 'Continuation Prompt — Chat Session Handoff',
  markdown: string,                       // Full markdown prompt
  sections: {
    sessionId: string,
    contextSummary: string,
    activeProjects: string,
    relatedIssues: string,
    relatedPRs: string,
    branchStatus: string,
    keyMemoryUpdates: string,
    continuationTasks: string,
    referenceLinks: string
  },
  valid: boolean,
  wordCount: number,
  characterCount: number
}
```

### Workspace Cleaner Module

```javascript
const cleanup = workspaceCleaner.cleanupWorktree(
  repoPath,
  worktreePath,
  {
    autoStash?: boolean,
    autoCommit?: boolean,
    deleteAfterCleanup?: boolean,
    confirmationCallback?: (details) => boolean
  }
)

// Returns:
{
  success: boolean,
  report: string,                         // Human-readable report
  steps: string[],                        // Steps executed
  errors: string[],                       // Any errors
  startTime: Date,
  endTime: Date,
  duration: number                        // Milliseconds
}
```

## Troubleshooting

### Issue: "Repository type not detected"

**Cause:** Repository doesn't match any known type markers

**Solution:**

```javascript
// Check what markers are present
const fs = require('fs');
const path = require('path');

const markers = {
  'control-plane': {
    '.github/projects/active': fs.existsSync('./.github/projects/active'),
    '.github/labels.yml': fs.existsSync('./.github/labels.yml')
  },
  'wordpress-plugin': {
    'plugin.php': fs.existsSync('./plugin.php'),
    'composer.json': fs.existsSync('./composer.json')
  },
  'wordpress-theme': {
    'style.css': fs.existsSync('./style.css'),
    'theme.json': fs.existsSync('./theme.json')
  }
};

console.log('Repository markers:', markers);
```

### Issue: "Memory file already exists"

**Cause:** Memory entry already written for this session

**Solution:**

```javascript
// Use different session ID
const memory = memoryUpdater.updateMemoryForSessionClosure('.', analysis, {
  sessionId: `session-${Date.now()}`, // Unique timestamp-based ID
  // ...
});
```

### Issue: "Cleanup requires confirmation but callback not provided"

**Cause:** Dirty worktree with no confirmation mechanism

**Solution:**

```javascript
// Provide confirmation callback
const cleanup = workspaceCleaner.cleanupWorktree(
  '.',
  process.env.PWD,
  {
    confirmationCallback: (details) => {
      console.log('Cleanup details:', details);
      return true; // Always confirm for testing
    }
  }
);
```

## Best Practices

### 1. Always Validate Repository Type

```javascript
const analysis = coreAnalysis.analyzeRepository('.');
if (!['control-plane', 'wordpress-plugin', 'wordpress-theme'].includes(analysis.repoType)) {
  throw new Error(`Unsupported repository type: ${analysis.repoType}`);
}
```

### 2. Document Decisions at Session End

```javascript
// Don't skip this step—future context windows depend on it
const memory = memoryUpdater.updateMemoryForSessionClosure('.', analysis, {
  decisions: {
    /* ... all key decisions made ... */
  }
});
```

### 3. Validate Prompts Before Handoff

```javascript
const prompt = promptBuilder.buildContinuationPrompt(analysis, { /* ... */ });
const validation = promptBuilder.validatePrompt(prompt);

if (!validation.valid) {
  console.log('Validation warnings:', validation.warnings);
  // Enhance prompt before returning
}
```

### 4. Handle Dirty Worktrees Gracefully

```javascript
// Always check git state before cleanup
const gitState = workspaceCleaner.getWorktreeStatus('.');
if (!gitState.isClean) {
  console.log(`⚠️ Working directory has ${gitState.changedFiles.length} changed files`);
  // Offer stash/commit options
}
```

### 5. Save Continuation Prompts

```javascript
const prompt = promptBuilder.buildContinuationPrompt(analysis, { /* ... */ });

// Save to file for next session
const fs = require('fs');
fs.writeFileSync(
  'CONTINUATION_PROMPT.md',
  prompt.markdown,
  'utf-8'
);

console.log('✅ Saved continuation prompt to CONTINUATION_PROMPT.md');
```

## Integration with Other Tools

### With GitHub CLI

```javascript
const { execSync } = require('child_process');

// Create PR with continuation prompt
const prompt = promptBuilder.buildContinuationPrompt(analysis, { /* ... */ });

const prBody = `
## Implementation Status

${prompt.markdown}

---
Generated by Chat Closure Agent
`;

execSync(`gh pr create --body "${prBody}"`);
```

### With Memory System

```javascript
// Automatically link to memory in PR description
const memory = memoryUpdater.updateMemoryForSessionClosure('.', analysis, {
  /* ... */
});

const prBody = `
Memory: .remember/${memory.entry.name}.md
`;
```

## Performance Optimization

### For Large Repositories

```javascript
// Limit commit history analysis
const analysis = coreAnalysis.analyzeRepository('.', {
  maxCommits: 20  // Only analyze last 20 commits
});
```

### For Memory-Constrained Environments

```javascript
// Minimal memory entry (metadata only)
const memory = memoryUpdater.updateMemoryForSessionClosure('.', analysis, {
  sessionId: 'minimal',
  decisions: {},  // Skip detailed decisions
  blockers: [],
  nextSteps: []
});
```

## References

- [ARCHITECTURE.md](./ARCHITECTURE.md) — System design and component interactions
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) — Testing patterns and test coverage
- [AGENT.md](../AGENT.md) — Full agent specification
- [claude/prompt.md](../claude/prompt.md) — Claude provider implementation

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
