---
file_type: "documentation"
title: "Agent Launch Checklist"
description: "Final pre-launch validation checklist for all automation agents before v1.0.0 release"
version: "1.2"
created_date: "2025-12-10"
last_updated: "2026-07-22"
author: "LightSpeed Team"
maintainer: "Ash Shaw"
owners: ["lightspeedwp/maintainers"]
tags: ["agents", "launch", "validation", "checklist", "release"]
category: "project"
status: active
priority: "critical"
---

# Agent Launch Checklist v1.0.0

**Status**: ✅ **LAUNCH READY** — All acceptance criteria met (2026-07-22)
**Priority**: Critical
**Target**: v1.0.0 Release
**Completion**: All 7 phases complete

## Overview

This checklist ensures all automation agents are production-ready before the v1.0.0 release. Testing coverage will be addressed in Phase 2 (post-launch).

## Wave 5 Audit Links

- Parent audit issues:
  - <https://github.com/lightspeedwp/.github/issues/902>
  - <https://github.com/lightspeedwp/.github/issues/903>
  - <https://github.com/lightspeedwp/.github/issues/904>
  - <https://github.com/lightspeedwp/.github/issues/905>
  - <https://github.com/lightspeedwp/.github/issues/906>
- Full issue index:
  - <https://github.com/lightspeedwp/.github/issues?q=is%3Aissue+902..927>

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
- [ ] Verify all agent specs in `agents/*.agent.md`
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
- [x] ✅ Reviewer agent test infrastructure fixed (2026-05-28): `reviewer.agent.test.js` now uses `fs.existsSync` pattern — no `import.meta.url` dependency in Jest context.
- [x] ✅ Project-meta-sync agent exportable (2026-05-28): `project-meta-sync.agent.js` now has `require.main === module` guard and `module.exports = run` — safe to `require()` in tests.
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
- [x] ✅ `reviewer.agent.test.js` passes (fixed 2026-05-28)
- [x] ✅ `project-meta-sync.agent.test.js` passes (fixed 2026-05-28)
- [ ] Other key agent tests pass (existing tests only)

**Success Criteria**: All checks pass with exit code 0

---

## Phase 5: Workflow Configuration Validation

### 5.1 Verify Workflow Wiring ✅

**Objective**: Ensure workflows reference correct agents and have proper permissions.

**Files to Check**:

- [x] ✅ `.github/workflows/labeling.yml` — Permissions defined, validated
- [x] ✅ `.github/workflows/release.yml` — Permissions defined, validated
- [x] ✅ `.github/workflows/meta.yml` — Permissions defined, validated
- [x] ✅ Other active workflows — All standard workflows operational

**Validation Points**:

- [x] ✅ Permissions explicitly defined
- [x] ✅ Concurrency control configured
- [x] ✅ Environment variables correct
- [x] ✅ Agent paths correct
- [x] ✅ Trigger events appropriate

**Tool**: `scripts/validation/validate-agents.js` checks workflow references

**Status**: ✅ **COMPLETE** (2026-07-22)

- Mergify configuration hardened with queue-based PR merge automation
- Dependabot auto-approval and queueing now active on develop branch
- Label sync will be managed by Mergify; automated label cleanup on each PR merge
- All workflows validated and operational

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

## Phase 7: Documentation Updates ✅

### 7.1 Update Agent Index ✅

**Objective**: Ensure agent documentation is current and complete.

**Files to Update**:

- [x] ✅ `AGENTS.md` - Main agent index with routing, standards, and instructions
- [x] ✅ `agents/agent.md` - Agent directory index and discoverability
- [x] ✅ `ai/agents.md` - AI agent references
- [x] ✅ Cross-references between agent specs validated

**Tasks Completed**:

- [x] ✅ Linked main agents in AGENTS.md
- [x] ✅ Updated agent.md with current specs and discoverability
- [x] ✅ Verified all cross-references work
- [x] ✅ Removed outdated references
- [x] ✅ Documented recent Mergify/Dependabot automation additions
- [x] ✅ Kept documentation essential and maintainable

**Status**: ✅ **COMPLETE** (2026-07-22)

- All agent indexes updated with current information
- Mergify/Dependabot automation documented and linked
- Cross-references validated across AGENTS.md, agents/, and ai/ folders
- Documentation ready for v1.0.0 release

**Note**: Full documentation cleanup deferred to Phase 2 (see `.github/projects/active/context-reduction-tasks.md`)

---

## Minimal Acceptance Criteria

### ✅ Launch-Ready Checklist — ALL CRITERIA MET

Must complete ALL items before launch:

- [x] ✅ **Agent Validation**: All specs pass `validate-agents.js` with 0 errors (2026-07-22)
- [x] ✅ **Dry-Run Success**: Key agents (labeling, release, meta) run in dry-run without fatal errors (2026-07-22)
- [x] ✅ **Label Sync**: Label configs load and sync operational; Mergify auto-cleanup active on PR merge (2026-07-22)
- [x] ✅ **Release Flow**: Release agent produces valid release notes and PR body (2026-07-22)
- [x] ✅ **Workflow Config**: All referenced workflows exist with correct permissions (2026-07-22)
- [x] ✅ **Linting**: All lint checks pass (js, md, yaml) (2026-07-22)
- [x] ✅ **Test Infrastructure**: `reviewer.agent.test.js` and `project-meta-sync.agent.test.js` fixed (2026-05-28)
- [x] ✅ **Documentation**: Agent indexes updated with current information (2026-07-22)

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

### Completion Status ✅ COMPLETE

- [x] ✅ Phase 1: Agent Specification Validation (2026-07-21)
- [x] ✅ Phase 2: Dry-Run Smoke Tests (2026-07-21)
- [x] ✅ Phase 3: Label Configuration Validation (2026-07-21)
- [x] ✅ Phase 4: Linting & Validation Suite (2026-07-21)
- [x] ✅ Phase 5: Workflow Configuration Validation (2026-07-22)
- [x] ✅ Phase 6: Release Simulation (2026-07-21)
- [x] ✅ Phase 7: Documentation Updates (2026-07-22)
- [x] ✅ All Minimal Acceptance Criteria Met (2026-07-22)

**Completion Date**: 2026-07-22
**Status**: ✅ **READY FOR v1.0.0 RELEASE**
**Blocker**: None — All gates cleared

---

## Next Steps After Launch

Once all criteria are met:

1. **Create v1.0.0 release PR** using the correct release flow:
   - Run release agent on `develop`: `node scripts/agents/release.agent.js --scope=minor`
   - Agent creates `release/v1.0.0` branch → PR to `main`
   - Merge after all gates are green
2. **Tag release** (automated by release.agent.js)
3. **Create Phase 2 issues** (test coverage, documentation)

See also:

- [RELEASE_PROCESS.md](../../../docs/RELEASE_PROCESS.md): Authoritative develop→main release flow
- [Test Coverage Expansion Plan](../../.github/reports/analysis/test-coverage-expansion-plan.md)
- [Technical Debt Report](../../.github/reports/tech-debt/v1.0.0-pre-launch-debt.md)
- [Pre-Release Audit](../../.github/reports/analysis/pre-release-audit-v1.0.0.md)

---

## References

- **Agent Validator**: `scripts/validation/validate-agents.js`
- **Labeling Agent**: `scripts/agents/labeling.agent.js`
- **Release Agent**: `scripts/agents/release.agent.js`
- **Label Sync**: `scripts/agents/includes/label-sync.js`
- **Workflows**: `.github/workflows/`
- **Release Process**: `docs/RELEASE_PROCESS.md`
- **Agent Specs**: `agents/*.agent.md`

---

*Last Updated: 2026-05-28 | Maintainer: Ash Shaw | Status: Active*
