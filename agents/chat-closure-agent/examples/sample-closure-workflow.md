# Chat Closure Agent — Sample Closure Workflow

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
[![meta-labels-sync](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-pipeline](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml)
[![metrics-reporting](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
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

**Real-world example: End-of-session closure with memory, handoff prompt, and cleanup.**

## Scenario

You've been working on a new feature for the Chat Closure Agent. You're running out of context (>80% utilization) and need to close your session while preserving all context for the next session.

**Current state:**

- **Branch:** `feat/chat-closure-agent`
- **Commits ahead:** 4
- **Issues:** #1850 (Epic), #1853 (Phase 3), #1854 (Implementation)
- **Status:** Phase 3 implementation complete, Phase 4 documentation started

## Step 1: Analyze Current Repository

### Code

```javascript
const coreAnalysis = require('./agents/chat-closure-agent/shared/core-analysis');

console.log('📊 Analyzing repository...\n');
const analysis = coreAnalysis.analyzeRepository('.');

console.log('Branch Information:');
console.log(`  • Current branch: ${analysis.branch}`);
console.log(`  • Type: ${analysis.parsedBranch.type}`);
console.log(`  • Scope: ${analysis.parsedBranch.scope}`);
console.log(`  • Repository type: ${analysis.repoType}\n`);

console.log('Commit History:');
analysis.commits.forEach(commit => {
  console.log(`  • ${commit.hash.slice(0, 7)} — ${commit.subject}`);
});
console.log();

console.log('Related Issues:');
if (analysis.issueNumbers.length > 0) {
  analysis.issueNumbers.forEach(issue => {
    console.log(`  • ${issue}`);
  });
} else {
  console.log('  • No issues detected');
}
console.log();

console.log('Git State:');
console.log(`  • Status: ${analysis.gitState.isClean ? '✅ Clean' : '⚠️ Dirty'}`);
if (!analysis.gitState.isClean) {
  console.log(`  • Changed files: ${analysis.gitState.changedFiles.length}`);
}
```

### Output

```
📊 Analyzing repository...

Branch Information:
  • Current branch: feat/chat-closure-agent
  • Type: feat
  • Scope: chat-closure-agent
  • Repository type: control-plane

Commit History:
  • 48fe095 — feat: Phase 3 — Workspace Cleaner Module with 14 unit tests
  • c8a7b6f — docs: Reviewer Agent v2 — Comprehensive Planning & Specification Phase Complete
  • 5736165 — feat: Reviewer Agent v2 — Planning Phase & Implementation Roadmap
  • da217b2 — fix: Add octokit as runtime dependency for milestone allocation workflow

Related Issues:
  • #1850
  • #1853
  • #1854

Git State:
  • Status: ✅ Clean
```

## Step 2: Document Key Decisions

### Code

```javascript
const memoryUpdater = require('./agents/chat-closure-agent/shared/memory-updater');

console.log('📝 Creating memory entry...\n');

const memory = memoryUpdater.updateMemoryForSessionClosure('.', analysis, {
  sessionId: `chat-closure-2026-08-12-context-limit`,
  
  decisions: {
    'phase-3-scope': {
      choice: 'Workspace Cleaner module + E2E tests',
      rationale: 'Core cleanup functionality required for safe session closure'
    },
    'phase-4-approach': {
      choice: 'Comprehensive documentation with Mermaid diagrams',
      rationale: 'Architecture clarity enables future maintenance and extensions'
    },
    'testing-strategy': {
      choice: '95+ unit tests + 9 integration tests with ≥85% coverage',
      rationale: 'High test coverage provides confidence in agent behavior'
    },
    'memory-system': {
      choice: '10-family YAML structure for persistent session context',
      rationale: 'Structured format enables automated parsing in future sessions'
    },
    'git-safety': {
      choice: 'Non-destructive options (stash/commit) before cleanup',
      rationale: 'Prevents accidental data loss in worktree cleanup operations'
    }
  },
  
  blockers: [
    'Phase 4 documentation in progress (ARCHITECTURE.md created, USAGE_GUIDE.md started)',
    'Final test coverage audit pending',
    'PR submission waiting on documentation completion'
  ],
  
  nextSteps: [
    'Complete USAGE_GUIDE.md (API reference + examples)',
    'Complete TESTING_GUIDE.md (test patterns + coverage)',
    'Create sample-closure-workflow.md (this file)',
    'Run full test suite (expect 95+ tests passing)',
    'Audit coverage (target: ≥85% per module)',
    'Submit PR #[TBD] to develop branch',
    'Code review with team',
    'Merge to develop after approval'
  ],
  
  projectNames: [
    'Chat Closure Agent Implementation (Phase 3)',
    'Chat Closure Agent Documentation (Phase 4)'
  ]
});

if (memory.written) {
  console.log(`✅ Memory entry created`);
  console.log(`   Location: .remember/${memory.entry.name}.md`);
  console.log(`   Indexed in: .remember/MEMORY.md\n`);
} else {
  console.log('❌ Failed to create memory entry\n');
}
```

### Output

```
📝 Creating memory entry...

✅ Memory entry created
   Location: .remember/chat-closure-2026-08-12-context-limit.md
   Indexed in: .remember/MEMORY.md
```

## Step 3: Generate Continuation Prompt

### Code

```javascript
const promptBuilder = require('./agents/chat-closure-agent/shared/continuation-prompt-builder');

console.log('📋 Generating continuation prompt...\n');

const prompt = promptBuilder.buildContinuationPrompt(analysis, {
  sessionId: `chat-closure-2026-08-12-context-limit`,
  memory: memory.entry.families
});

// Validate prompt
const validation = promptBuilder.validatePrompt(prompt);
if (!validation.valid) {
  console.log('⚠️ Validation warnings:');
  validation.warnings.forEach(w => console.log(`   • ${w}`));
  console.log();
}

// Display summary
console.log(`✅ Prompt generated`);
console.log(`   Character count: ${prompt.characterCount}`);
console.log(`   Word count: ${prompt.wordCount}`);
console.log(`   Sections: ${Object.keys(prompt.sections).length}\n`);

// Display full prompt
console.log('='.repeat(80));
console.log(prompt.markdown);
console.log('='.repeat(80));
```

### Output (Abbreviated)

```
📋 Generating continuation prompt...

✅ Prompt generated
   Character count: 2,847
   Word count: 412
   Sections: 8

================================================================================

# Continuation Prompt — Chat Session Handoff

**Session ID:** chat-closure-2026-08-12-context-limit  
**Created:** 2026-08-12T16:30:00Z  
**Branch:** feat/chat-closure-agent (feat/scope: chat-closure-agent)  
**Repository:** control-plane

## Context Summary

Implementing Chat Closure Agent: Tier 1 portable agent for automated session 
handoff workflows. Completed Phase 3 (workspace-cleaner module + E2E tests) and 
started Phase 4 documentation (architecture, usage guide, testing guide).

## Active Projects

| Project | Status | Purpose |
|---------|--------|---------|
| [Chat Closure Agent Implementation](./../../issues/1850) | 🟡 In Progress | Phase 3: Workspace cleanup + integration tests |
| [Chat Closure Agent Documentation](./../../issues/1854) | 🟡 In Progress | Phase 4: Comprehensive documentation |

## Related Issues

| Issue | Title | Status |
|-------|-------|--------|
| [#1850](./../../issues/1850) | Chat Closure Agent (Epic) | 🟢 Open |
| [#1853](./../../issues/1853) | Phase 3 Implementation | 🟢 Open |
| [#1854](./../../issues/1854) | Phase 4 Documentation | 🟢 Open |

## Branch Status

| Metric | Value |
|--------|-------|
| **Current Branch** | `feat/chat-closure-agent` |
| **Base Branch** | `develop` |
| **Commits Ahead** | 4 |
| **Changed Files** | 0 (clean working directory) |
| **Uncommitted Changes** | None |

## Key Memory Updates

### Decisions Made
- ✅ **phase-3-scope**: Workspace Cleaner module + E2E tests
- ✅ **phase-4-approach**: Comprehensive documentation with Mermaid diagrams
- ✅ **testing-strategy**: 95+ tests with ≥85% coverage
- ✅ **memory-system**: 10-family YAML structure
- ✅ **git-safety**: Non-destructive cleanup options

### Active Blockers
- 📋 Phase 4 documentation in progress
- 📋 Final test coverage audit pending
- 📋 PR submission waiting on documentation completion

## Continuation Tasks

1. **Complete USAGE_GUIDE.md** — API reference with 15+ code examples (120 min)
2. **Complete TESTING_GUIDE.md** — Test patterns, coverage, debugging (90 min)
3. **Create sample-closure-workflow.md** — Real-world example (60 min)
4. **Run full test suite** — Verify all 95+ tests passing (15 min)
5. **Audit test coverage** — Target ≥85% per module (30 min)
6. **Submit PR to develop** — With documentation and test results (20 min)

**Estimated continuation time:** 4.5 hours

## Reference Materials

- **Agent Specification:** [AGENT.md](../AGENT.md)
- **Architecture:** [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)
- **Implementation:** [claude/prompt.md](../claude/prompt.md)
- **Test Suite:** [tests/](../tests/)
- **Related Epic:** [#1850](./../../issues/1850)

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
