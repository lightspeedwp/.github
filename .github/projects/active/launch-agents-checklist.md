---
file_type: "project"
title: "Agent Launch Checklist"
description: "Final pre-launch validation checklist for all automation agents before v1.0.0 release"
version: "1.0"
created_date: "2025-12-10"
last_updated: "2025-12-10"
author: "LightSpeed Team"
maintainer: "Ash Shaw"
owners: ["lightspeedwp/maintainers"]
tags: ["agents", "launch", "validation", "checklist", "release"]
category: "project"
status: "active"
priority: "critical"
---

# Agent Launch Checklist v1.0.0

**Status**: 🔴 In Progress
**Priority**: Critical
**Target**: Pre-release validation
**Estimated Time**: 2-3 hours

## Overview

This checklist ensures all automation agents are production-ready before the v1.0.0 release. Testing coverage will be addressed in Phase 2 (post-launch).

---

## Phase 1: Agent Specification Validation

### 1.1 Validate Agent Specs + References

**Objective**: Ensure all agent specs have valid frontmatter and workflow references.

```bash
# Run agent validator
node scripts/validation/validate-agents.js --verbose
```

**Tasks**:

- [ ] Run validator and capture output
- [ ] Fix any missing frontmatter fields
- [ ] Fix broken workflow path references
- [ ] Verify all agent specs in `.github/agents/*.agent.md`
- [ ] Ensure reciprocal workflow references exist

**Success Criteria**: `node scripts/validation/validate-agents.js` → 0 errors, 0 warnings

**Common Issues**:

- Missing `version`, `last_updated`, or `maintainer` fields
- Workflow files referenced that don't exist
- Broken cross-references between agents

---

## Phase 2: Dry-Run Smoke Tests

### 2.1 Labeling Agent Dry-Run

**Objective**: Verify labeling agent runs without fatal errors.

```bash
# Run labeling agent in dry-run mode
DRY_RUN=true node scripts/agents/labeling.agent.js
```

**Tasks**:

- [ ] Execute dry-run command
- [ ] Verify no fatal exceptions
- [ ] Check label config loads correctly
- [ ] Confirm rule matching works
- [ ] Validate output format

**Success Criteria**: Completes with exit code 0, produces expected log output

---

### 2.2 Release Agent Dry-Run

**Objective**: Validate release flow without making changes.

```bash
# Simulate release flow
node scripts/agents/release.agent.js --scope=patch --dry-run
```

**Tasks**:

- [ ] Execute dry-run command
- [ ] Verify VERSION file exists
- [ ] Confirm CHANGELOG.md has unreleased entries
- [ ] Validate release notes generation
- [ ] Check PR body format

**Success Criteria**: Generates complete release notes and PR description without errors

---

### 2.3 Meta Agent Dry-Run

**Objective**: Verify metadata application without file modifications.

```bash
# Run meta agent in dry-run
DRY_RUN=true node scripts/agents/meta.agent.js
```

**Tasks**:

- [ ] Execute dry-run command
- [ ] Verify frontmatter validation
- [ ] Check badge generation logic
- [ ] Confirm footer selection works

**Success Criteria**: Processes all docs without errors

---

### 2.4 Other Key Agents

**Tasks**:

- [ ] Planner agent dry-run (if applicable)
- [ ] Reviewer agent dry-run (if applicable)
- [ ] Metrics agent dry-run (if applicable)

---

## Phase 3: Label Configuration Validation

### 3.1 Validate Label Configs

**Objective**: Ensure canonical label files are valid and sync-ready.

```bash
# Validate label configs
node scripts/agents/includes/label-sync.js --dry-run

# Generate report
node scripts/agents/includes/report-writer.js > .github/reports/labeling/dryrun-$(date +%s).md
```

**Tasks**:

- [ ] Check `.github/labels.yml` syntax
- [ ] Check `.github/labeler.yml` syntax
- [ ] Check `.github/issue-types.yml` syntax
- [ ] Run label-sync dry-run
- [ ] Generate and review sync report

**Success Criteria**: All configs valid, dry-run completes without errors

**Files to Validate**:

- `.github/labels.yml` - Canonical label definitions
- `.github/labeler.yml` - Pattern matching rules
- `.github/issue-types.yml` - Issue type mappings

---

## Phase 4: Linting & Validation Suite

### 4.1 Run Consolidated Checks

**Objective**: Ensure code quality and standards compliance.

```bash
# Run all linting checks
npm run lint:js
npm run lint:md
npm run lint:yaml

# Validate agents
node scripts/validation/validate-agents.js

# Run minimal agent tests (skip full coverage for now)
npm test -- scripts/agents/__tests__ --runInBand --testPathPattern="(labeling|release|planner|reviewer)"
```

**Tasks**:

- [ ] JavaScript/TypeScript linting passes
- [ ] Markdown linting passes
- [ ] YAML linting passes
- [ ] Agent validation passes
- [ ] Key agent tests pass (existing tests only)

**Success Criteria**: All checks pass with exit code 0

---

## Phase 5: Workflow Configuration Validation

### 5.1 Verify Workflow Wiring

**Objective**: Ensure workflows reference correct agents and have proper permissions.

**Files to Check**:

- [ ] `.github/workflows/labeling.yml`
- [ ] `.github/workflows/release.yml`
- [ ] `.github/workflows/meta.yml`
- [ ] Other active workflows

**Validation Points**:

- [ ] Permissions explicitly defined
- [ ] Concurrency control configured
- [ ] Environment variables correct
- [ ] Agent paths correct
- [ ] Trigger events appropriate

**Tool**: `scripts/validation/validate-agents.js` checks workflow references

---

## Phase 6: Release Simulation

### 6.1 Simulate Full Release Flow

**Objective**: Dry-run complete release process without pushing changes.

```bash
# Simulate complete release
node scripts/agents/release.agent.js --scope=patch --dry-run
```

**Tasks**:

- [ ] Verify version bump calculation
- [ ] Confirm changelog compilation
- [ ] Check tag creation logic
- [ ] Validate release PR body
- [ ] Review release notes format

**Success Criteria**: Complete release simulation without errors, all outputs look correct

**What to Verify**:

- VERSION file would be updated correctly
- CHANGELOG.md would be formatted properly
- Git tag would be created with correct format
- Release PR description is complete
- No actual git operations performed

---

## Phase 7: Documentation Updates

### 7.1 Update Agent Index

**Objective**: Ensure agent documentation is current and complete.

**Files to Update**:

- [ ] `AGENTS.md` - Main agent index
- [ ] `.github/agents/agent.md` - Agent directory index
- [ ] Cross-references between agent specs

**Tasks**:

- [ ] Link main agents in AGENTS.md
- [ ] Update agent.md with current specs
- [ ] Verify all cross-references work
- [ ] Remove outdated references
- [ ] Keep only essential documentation

**Note**: Full documentation cleanup deferred to Phase 2 (see `.github/projects/context-reduction-tasks.md`)

---

## Minimal Acceptance Criteria

### ✅ Launch-Ready Checklist

Must complete ALL items before launch:

- [ ] **Agent Validation**: All specs pass `validate-agents.js` with 0 errors
- [ ] **Dry-Run Success**: Key agents (labeling, release, meta) run in dry-run without fatal errors
- [ ] **Label Sync**: Label configs load and sync runs clean
- [ ] **Release Flow**: Release agent produces valid release notes and PR body
- [ ] **Workflow Config**: All referenced workflows exist with correct permissions
- [ ] **Linting**: All lint checks pass (js, md, yaml)
- [ ] **Documentation**: Agent indexes updated with current information

### 🚫 Out of Scope for Launch

Deferred to Phase 2 (post-launch):

- ❌ Full test coverage (75% threshold)
- ❌ Metrics agent comprehensive tests
- ❌ Linting agent comprehensive tests
- ❌ Coverage measurement baseline
- ❌ Complete documentation consolidation
- ❌ Context reduction implementation

---

## Quick Command Reference

### Essential Commands

```bash
# Validate everything
node scripts/validation/validate-agents.js --verbose

# Dry-run key agents
DRY_RUN=true node scripts/agents/labeling.agent.js
node scripts/agents/release.agent.js --scope=patch --dry-run
DRY_RUN=true node scripts/agents/meta.agent.js

# Validate label configs
node scripts/agents/includes/label-sync.js --dry-run

# Run linting
npm run lint:js && npm run lint:md && npm run lint:yaml

# Run existing agent tests only
npm test -- scripts/agents/__tests__ --runInBand --testPathPattern="(labeling|release)"
```

---

## Troubleshooting

### Common Issues & Solutions

**Issue**: Agent validator reports missing frontmatter fields
**Solution**: Add required fields to agent spec files (version, last_updated, maintainer)

**Issue**: Workflow reference not found
**Solution**: Create missing workflow file or update reference path

**Issue**: Label sync fails
**Solution**: Validate YAML syntax in labels.yml, labeler.yml, issue-types.yml

**Issue**: Dry-run produces errors
**Solution**: Check environment variables, file paths, and configuration

**Issue**: Linting fails
**Solution**: Run auto-fix: `npm run format` then `npm run lint:js -- --fix`

---

## Progress Tracking

### Completion Status

- [ ] Phase 1: Agent Specification Validation
- [ ] Phase 2: Dry-Run Smoke Tests
- [ ] Phase 3: Label Configuration Validation
- [ ] Phase 4: Linting & Validation Suite
- [ ] Phase 5: Workflow Configuration Validation
- [ ] Phase 6: Release Simulation
- [ ] Phase 7: Documentation Updates
- [ ] ✅ All Minimal Acceptance Criteria Met

**Estimated Time**: 2-3 hours total
**Current Status**: 🔴 Not Started
**Blocker**: None

---

## Next Steps After Launch

Once all criteria are met:

1. **Create v1.0.0 release PR** (use release agent)
2. **Merge to main** (after final review)
3. **Tag release** (automated by workflow)
4. **Create Phase 2 issues** (test coverage, documentation)

See also:

- [Test Coverage Expansion Plan](.github/reports/analysis/test-coverage-expansion-plan.md)
- [Technical Debt Report](.github/reports/tech-debt/v1.0.0-pre-launch-debt.md)
- [Pre-Release Audit](.github/reports/analysis/pre-release-audit-v1.0.0.md)

---

## References

- **Agent Validator**: `scripts/validation/validate-agents.js`
- **Labeling Agent**: `scripts/agents/labeling.agent.js`
- **Release Agent**: `scripts/agents/release.agent.js`
- **Label Sync**: `scripts/agents/includes/label-sync.js`
- **Workflows**: `.github/workflows/`
- **Release Process**: `docs/RELEASE_PROCESS.md`
- **Agent Specs**: `.github/agents/*.agent.md`

---

*Last Updated: 2025-12-10 | Maintainer: Ash Shaw | Status: Active*
