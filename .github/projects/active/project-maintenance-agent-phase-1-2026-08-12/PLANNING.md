---
file_type: documentation
title: "Project Maintenance Agent — Detailed Planning & Specification"
description: "Phase 1 & 2 planning with detailed requirements, timelines, and deliverables"
created_date: 2026-08-12
last_updated: "2026-08-25"
status: active
---

# Project Maintenance Agent — Planning & Specification

## Executive Summary

**Project Goal:** Build a portable, intelligent agent for maintaining project documentation and state across the `.github/projects/active` directory.

**Scope:** 4 phases across 5 weeks

- **Phase 1 (1 week):** ✅ COMPLETE (2026-08-12) — Fix automation scripts, add security patches
- **Phase 3 (1 week):** ✅ COMPLETE (2026-08-18) — GitHub Actions workflows, team integration
- **Phase 2 (2 weeks):** 🔄 READY TO START — Design & implement portable agent with 3 provider versions
- **Phase 4 (1 week):** 📋 PLANNED — Team training, documentation, runbooks

**Success Metric:** Agent can autonomously maintain project documentation for 50+ active projects with >95% accuracy.

---

## Phase 1: Script Fixes & Enhancements ✅ COMPLETE

**Status:** Merged to `develop` (PR #1867)  
**Completion Date:** 2026-08-12

### Requirements Met

- ✅ Security: Fix sed injection vulnerability
- ✅ Logic: Project detection, find command, return values
- ✅ Testing: Enhanced test suite with edge cases
- ✅ Documentation: Create `docs/SCRIPT_USAGE.md` (3,500+ lines)
- ✅ Code Quality: Add --help support, consistent stats format

### Phase 1 Deliverables

```
scripts/automation/project-docs-update.sh         # Fixed & enhanced
scripts/automation/test-project-docs-update.sh    # New tests added
docs/SCRIPT_USAGE.md                              # Comprehensive usage guide
CHANGELOG.md                                      # Phase 1 entry
```

### Phase 1 Test Results

| Test | Status | Notes |
|------|--------|-------|
| Script exists & executable | ✅ PASS | |
| Help text (--help/-h) | ✅ PASS | New feature |
| Dry-run mode | ✅ PASS | No files created |
| Template files | ✅ PASS | 3 templates present |
| Validation logic | ✅ PASS | Identifies missing docs |
| Error handling | ✅ PASS | Missing templates reported |
| Integration test | ✅ PASS | Full dry-run execution |
| Special characters | ✅ PASS | Ampersand, forward slash |
| Return values | ✅ PASS | Bash convention (0=success) |
| Stats format | ✅ PASS | Consistent output |

---

## Phase 2: Portable Agent Development

**Duration:** 2 weeks (2026-08-13 → 2026-08-26)  
**Effort:** ~50 hours  
**Status:** Ready to start

### 2.1: Agent Specification

**Input:** Phase 1 script fixes + requirements from Phase 1 testing  
**Output:** Formal AGENT.md specification

#### Requirements

- [ ] Multi-provider support (Claude, Copilot, OpenAI)
- [ ] Three core operations: check, create, archive
- [ ] Operational skills wrapping proven Phase 1 scripts
- [ ] Both reactive (on-demand) and proactive (scheduled) modes
- [ ] Integration with Task Planning/Research agents
- [ ] Error recovery and reporting

#### 2.1.1: Agent Capabilities

**Capability 1: Documentation Audit**

```
Input: { projects: ['project1', 'project2'], verbose: true }
Output: {
  total_projects: 2,
  documentation_status: {
    project1: {
      has_planning: false,
      has_openspec: true,
      has_readme: true,
      recommended_action: 'create PLANNING.md'
    },
    project2: {
      has_planning: true,
      has_openspec: false,
      has_readme: true,
      recommended_action: 'none'
    }
  },
  summary: 'Create 1 file (50% complete)'
}
```

**Capability 2: Bulk Documentation Creation**

```
Input: { projects: ['project1', 'project2'], files: ['PLANNING.md'], dry_run: false }
Output: {
  created: { PLANNING: 2 },
  skipped: { PLANNING: 0 },
  errors: [],
  execution_time_ms: 245
}
```

**Capability 3: Project Validation**

```
Input: { projects: ['project1'], check_structure: true }
Output: {
  valid: ['project1'],
  invalid: [],
  issues: [],
  recommendations: ['Update OPENSPEC.md date']
}
```

**Capability 4: Project Archival**

```
Input: { project: 'completed-project', archive_reason: 'Phase complete' }
Output: {
  archived: true,
  old_path: '.github/projects/active/completed-project',
  new_path: '.github/projects/archive/completed-project',
  archive_status_created: true
}
```

#### 2.1.2: Agent Prompting Strategy

**Core Approach:**

1. Analyze project state (structure, documentation completeness)
2. Identify gaps (missing files, outdated metadata)
3. Recommend actions (create, update, archive, validate)
4. Execute with approval (dry-run preview, then live)
5. Report results (summary, errors, next steps)

**Safety Guards:**

- Always offer dry-run preview before execution
- Require explicit approval for destructive operations (archival)
- Validate inputs against project structure
- Provide clear error messages with remediation steps

#### 2.1.3: Integration Points

**With Task Planner Agent:**

```
Task Planner: "49 projects missing PLANNING.md"
    ↓ (calls with results)
Maintenance Agent: "Check these 49 projects"
    ↓ (returns audit)
Task Planner: "Create PLANNING.md for 49 projects?"
    ↓ (approves)
Maintenance Agent: "Creating... created 45, 4 errors"
    ↓ (reports back)
Task Planner: "Log results and create follow-up issues"
```

**With Scheduled Workflows:**

```
GitHub Actions (nightly at 2 AM UTC)
    ↓
Maintenance Agent (dry-run mode)
    ↓
Post report to team Slack
    ↓
Team reviews gaps, decides on action
```

### 2.2: Portable Skills Development

**Skill 1: project-docs-updater**

**File:** `agents/project-maintenance-agent/skills/project-docs-updater/SKILL.md`

**Description:** Wraps `scripts/automation/project-docs-update.sh` for agent integration

**Interface:**

```json
{
  "name": "project-docs-updater",
  "input_schema": {
    "projects": { "type": "array", "description": "Project slugs to update" },
    "files": { "type": "array", "enum": ["PLANNING.md", "OPENSPEC.md", "README.md"] },
    "dry_run": { "type": "boolean", "default": true }
  },
  "output_schema": {
    "created": { "type": "object" },
    "skipped": { "type": "object" },
    "errors": { "type": "array" }
  }
}
```

**Implementation:**

- Wraps Phase 1 script
- Supports selective file creation (not all three)
- Always dry-run by default (safe)
- Clear error reporting

**Tests:**

- [ ] Create PLANNING.md only
- [ ] Create all three files
- [ ] Dry-run vs live execution
- [ ] Error cases (permissions, templates missing)
- [ ] Special characters in project names

---

**Skill 2: project-validator**

**File:** `agents/project-maintenance-agent/skills/project-validator/SKILL.md`

**Description:** Validates project structure and documentation completeness

**Interface:**

```json
{
  "name": "project-validator",
  "input_schema": {
    "projects": { "type": "array" },
    "check_level": { "enum": ["basic", "full"], "default": "basic" }
  },
  "output_schema": {
    "valid": { "type": "array" },
    "invalid": { "type": "array" },
    "missing_docs": { "type": "array" },
    "recommendations": { "type": "array" }
  }
}
```

**Validation Rules:**

**Basic Check:**

- [ ] Folder exists in `.github/projects/active/`
- [ ] Has at least one of: README.md, PLANNING.md
- [ ] Has valid folder structure

**Full Check:**

- [ ] README.md exists and has frontmatter
- [ ] PLANNING.md exists (if complex project)
- [ ] Frontmatter fields valid (title, status, dates)
- [ ] Related issues linked in README
- [ ] No broken links to develop/HEAD branches

**Tests:**

- [ ] Valid project passes basic check
- [ ] Invalid project fails with clear reason
- [ ] Recommends missing files
- [ ] Checks frontmatter validity
- [ ] Validates link targets

---

**Skill 3: documentation-sync**

**File:** `agents/project-maintenance-agent/skills/documentation-sync/SKILL.md`

**Description:** Bulk synchronization of project metadata across folders

**Interface:**

```json
{
  "name": "documentation-sync",
  "input_schema": {
    "source_project": { "type": "string" },
    "target_projects": { "type": "array" },
    "sync_fields": { "type": "array", "enum": ["title", "status", "owners", "tags"] }
  },
  "output_schema": {
    "synced": { "type": "number" },
    "conflicts": { "type": "number" },
    "skipped": { "type": "number" }
  }
}
```

**Sync Strategy:**

- Copy metadata from source project frontmatter
- Prompt on conflicts (which version to keep?)
- Skip projects with local customizations
- Report summary (synced count, conflicts, skipped)

**Tests:**

- [ ] Sync single field across projects
- [ ] Detect and report conflicts
- [ ] Skip customized projects
- [ ] Handle missing source field
- [ ] Validate YAML formatting after sync

---

### 2.3: Provider Implementations

**Target:** 3 providers, all passing same test suite

**Provider 1: Claude (claude-opus-5)**

**File:** `agents/project-maintenance-agent/claude/agent.md`

**Approach:**

- Multi-turn conversation model
- Iterative refinement of decisions
- Structured tool calls for skills

**Strengths:**

- Extended context window for complex projects
- Strong reasoning for conflict resolution
- Code generation for custom templates

---

**Provider 2: Copilot (GPT-4 Turbo)**

**File:** `agents/project-maintenance-agent/copilot/agent.md`

**Approach:**

- Function calling for skill invocation
- Conversation history for context
- Structured outputs for integration

**Strengths:**

- Integration with VS Code for IDE workflow
- Real-time feedback in editor
- GitHub native integration

---

**Provider 3: OpenAI (GPT-4 Turbo)**

**File:** `agents/project-maintenance-agent/openai/agent.md`

**Approach:**

- Function calling API
- Async job processing for long-running tasks
- Batch processing for multiple projects

**Strengths:**

- Lowest latency for simple operations
- Best pricing for high-volume usage
- Fine-tuning available for custom behavior

---

### 2.4: Configuration Files

**github.config.js** — GitHub-specific settings

```javascript
module.exports = {
  projectsDir: '.github/projects/active',
  templatesDir: '.github/projects/_templates',
  archiveDir: '.github/projects/archive',
  requiredFiles: ['README.md', 'PLANNING.md'],
  optionalFiles: ['OPENSPEC.md'],
  validStatuses: ['active', 'paused', 'archived', 'completed']
};
```

**wordpress-plugin.config.js** — WordPress plugin projects

```javascript
module.exports = {
  projectsDir: 'plugins',
  requiredFiles: ['README.md', 'plugin-manifest.md'],
  optionalFiles: ['CHANGELOG.md', 'ROADMAP.md'],
  customMetadata: ['plugin-slug', 'minimum-wordpress-version']
};
```

**wordpress-theme.config.js** — WordPress theme projects

```javascript
module.exports = {
  projectsDir: 'themes',
  requiredFiles: ['README.md', 'theme-manifest.md'],
  optionalFiles: ['CHANGELOG.md', 'SUPPORT.md'],
  customMetadata: ['theme-slug', 'minimum-wordpress-version']
};
```

---

### 2.5: Testing Strategy

**Unit Tests** (test individual skills)

- [ ] project-docs-updater: create files, dry-run, errors
- [ ] project-validator: check rules, recommendations
- [ ] documentation-sync: metadata copying, conflict detection

**Integration Tests** (agent + skills together)

- [ ] Audit → find 10 projects missing docs → create them
- [ ] Validate → find 3 invalid projects → report issues
- [ ] Sync → copy metadata from project A to B, C, D → verify

**End-to-End Tests** (full workflow)

- [ ] Schedule: Nightly audit, report to team
- [ ] Manual: User requests "audit project X", gets results, approves creation
- [ ] Error: Handle permission errors, missing templates, network failures

**Test Coverage Target:** >80% code coverage, all error cases covered

---

## Phase 3: GitHub Actions & Team Integration ✅ COMPLETE

**Duration:** 1 week (2026-08-12 → 2026-08-18)  
**PR:** [#2005](https://github.com/lightspeedwp/.github/pull/2005)  
**Status:** Merged to `develop` (2026-08-18)

### 3.1: GitHub Actions Workflows ✅ IMPLEMENTED

**Workflow 1: project-maintenance-nightly.yml** ✅

```yaml
name: Project Maintenance — Nightly Audit
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily
  workflow_dispatch:
status: ACTIVE (merged in PR #2005)
```

**Features:**

- Daily audit at 2 AM UTC (timezone: UTC)
- Dry-run mode: no files created, visibility only
- Slack notification of gaps found
- Verbose output for debugging
- Can be manually triggered via workflow_dispatch

---

**Workflow 2: project-maintenance-on-demand.yml** ✅

```yaml
name: Project Maintenance — On-Demand
on:
  workflow_dispatch:
    inputs:
      operation: [audit, create-docs, validate, archive]
      projects: (comma-separated project slugs)
      dry_run: (true/false, default true)
status: ACTIVE (merged in PR #2005)
```

**Supported Operations:**

- `audit` — Check documentation completeness across projects
- `create-docs` — Generate missing PLANNING.md, OPENSPEC.md, README.md
- `validate` — Validate project structure and metadata
- `archive` — Move completed projects to archive folder

**Safety Features:**

- Dry-run mode by default (preview only)
- Clear output of what will be changed
- Error reporting with next steps
- Can be executed manually from GitHub Actions tab

### 3.2: Team Integration Points

**Slack Integration:**

- Post nightly audit results to #projects channel
- Alert on critical gaps (5+ projects missing PLANNING.md)
- Link to manual workflow for immediate action

**GitHub Issues:**

- Create "project-maintenance" label
- Link audit findings to issues
- Auto-link to project README

**Dashboard:**

- Display project documentation completeness %
- Track archival history
- Monitor script execution times

---

## Success Criteria

### Phase 2 Completion Checklist

- [ ] AGENT.md specification complete and reviewed
- [ ] All 3 provider implementations passing tests
- [ ] All 3 portable skills implemented and documented
- [ ] Integration tests (15+ scenarios) all passing
- [ ] Code quality: >80% test coverage, ESLint clean
- [ ] Documentation: README, examples, integration guide
- [ ] Security review: No injection vectors, safe input handling
- [ ] Performance: <5 minutes for 50 projects in dry-run mode

### Phase 3 Completion Checklist

- [ ] Both GitHub Actions workflows implemented
- [ ] Slack/team notifications working
- [ ] Manual workflow deployment tested
- [ ] Runbook & incident response guide complete
- [ ] Team trained on using agent
- [ ] Monitoring & observability in place

---

## Phase 4: Team Integration & Runbooks (PLANNED)

**Duration:** 1 week (after Phase 2)  
**Status:** Planning ready  
**Effort:** ~15 hours

### 4.1: Team Training Documentation

**Deliverables:**

- [ ] Team training guide (30-min walkthrough)
- [ ] FAQ with common scenarios
- [ ] Troubleshooting guide
- [ ] Example workflows (5+ real-world scenarios)

**Topics:**

1. What the Project Maintenance Agent does
2. Running nightly audits (demo)
3. Manual on-demand operations (demo)
4. Reading audit reports
5. Creating documentation from recommendations
6. Archiving completed projects
7. Integration with other workflows

### 4.2: Runbooks & Incident Response

**Runbooks:**

- [ ] "Project missing documentation" — how to fix
- [ ] "Audit found 10+ gaps" — escalation procedure
- [ ] "Workflow failed" — recovery steps
- [ ] "Custom templates needed" — approval process

### 4.3: Operations Handbook

**Chapters:**

- [ ] Monitoring & alerting
- [ ] Performance optimization
- [ ] Scaling to more projects
- [ ] Integration with CI/CD
- [ ] Troubleshooting guide

---

## Risk Analysis

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Scope creep (too many features) | Medium | High | Keep to 3 operations, defer advanced features |
| Provider inconsistency (Phase 2) | Low | Medium | Shared test suite, validate all three pass |
| Performance issues on large projects | Low | Medium | Batch processing, monitor execution time |
| Documentation maintenance burden | Medium | Medium | Use agent to keep docs up-to-date automatically |
| Team adoption (Phase 4) | Medium | Medium | Early training, clear documentation, support |

---

## Assumptions

- Phase 1 scripts are stable and won't need major changes
- Template files in `.github/projects/_templates/` are authoritative
- All active projects should follow naming conventions
- Team is comfortable with scheduled automation

---

## Open Questions

1. **Approval Workflow:** Should on-demand execution require GitHub approval/review?
2. **Custom Templates:** How to handle projects needing custom templates?
3. **Archive Retention:** How long to keep archived projects before deletion?
4. **Conflict Resolution:** How aggressive should metadata sync be?

---

## Dependencies & Blockers

**Phase 2 Dependencies:**

- ✅ Phase 1 scripts merged (unblocked by PR #1867)
- Task Planning Agent specification (for integration)
- Provider API access (Claude, OpenAI, Copilot)

**No Critical Blockers** — Ready to start Phase 2 immediately after Phase 1 merge.

---

## Timeline Summary

```
Week 1 (Aug 12-18):    Phase 1 Scripts ✅ COMPLETE
Week 1 (Aug 12-18):    Phase 3 Workflows ✅ COMPLETE
Week 2-3 (Aug 19-Sep2): Phase 2 Agent Spec & Development (READY TO START)
Week 4 (Sep 3-9):      Phase 4 Team Integration & Training
```

**Expected Go-Live:** Week of September 9, 2026 (after Phase 2 + Phase 4)

---

## Related Documents

- [README.md](./README.md) — Project overview
- [PHASE_3_IMPLEMENTATION.md](./PHASE_3_IMPLEMENTATION.md) — Phase 3 technical summary
- [OPENSPEC.md](./OPENSPEC.md) — Technical specification (if exists)
- [SLACK_WEBHOOK_SETUP.md](./SLACK_WEBHOOK_SETUP.md) — Webhook configuration guide
- Phase 1 PR: [#1867](https://github.com/lightspeedwp/.github/pull/1867) ✅ MERGED
- Phase 3 PR: [#2005](https://github.com/lightspeedwp/.github/pull/2005) ✅ MERGED
- Epic Issue: [#1862](https://github.com/lightspeedwp/.github/issues/1862)

---

## Phase 2 Quick Start Checklist

When ready to begin Phase 2 (Portable Agent Development):

- [ ] Review Phase 1 & 3 PRs to understand script integration
- [ ] Read PHASE_3_IMPLEMENTATION.md for workflow architecture
- [ ] Create new issue for Phase 2 tracking (link to epic #1862)
- [ ] Plan with team: which provider to start with (Claude recommended)?
- [ ] Create branch: `feat/project-maintenance-agent-phase-2`
- [ ] Start with AGENT.md specification
- [ ] Follow Section 2.1-2.5 of this document for implementation order

**Estimated Start:** Next scheduled session  
**Estimated Duration:** 2 weeks (50 hours)

---

*Last updated: 2026-08-18 by ash (Phase 3 completion)*
