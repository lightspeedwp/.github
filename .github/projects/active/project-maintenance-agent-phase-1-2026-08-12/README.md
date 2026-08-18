---
file_type: documentation
title: Project Maintenance Agent — Phase 1 & 2 Planning
description: Portable agent for maintaining active projects, updating documentation, and managing project state
status: active
created_date: "2026-08-12"
last_updated: "2026-08-12"
owners:
  - Ash Shaw
tags:
  - agents
  - project-management
  - automation
  - maintenance
---

# Project Maintenance Agent — Phase 1 & 2 Planning

**Project Duration:** Phase 1 (1 week), Phase 2 (2 weeks)  
**Start Date:** 2026-08-12  
**Status:** Planning Complete, Phase 1 (Scripts) Merged, Phase 2 (Agent) Ready  
**GitHub Base Issue:** [#1862](https://github.com/lightspeedwp/.github/issues/1862)

---

## Project Overview

Build a portable, multi-provider agent that automates project maintenance operations: updating project documentation, syncing project metadata, archiving completed projects, and maintaining project state consistency across the `.github/projects/active` directory.

**Problem Solved:**

- Projects lack consistent documentation (PLANNING.md, OPENSPEC.md, README.md)
- Manual updates to project metadata are error-prone and time-consuming
- Project archival process is undefined and inconsistent
- Documentation gaps are discovered reactively, not proactively

**Solution Approach:**

- Portable agent with three provider implementations (Claude, Copilot, OpenAI)
- Operational skills wrapping proven automation scripts
- Integration with Task Planning and Task Research agents
- Both scheduled monitoring (nightly) and on-demand execution

---

## Phase 1: Fix & Enhance Scripts ✅ COMPLETE

**PR:** [#1867](https://github.com/lightspeedwp/.github/pull/1867)  
**Status:** Merged to `develop`  
**Completion Date:** 2026-08-12

### Deliverables

1. ✅ **Security Fix:** Sed injection vulnerability (safe delimiters + character escaping)
2. ✅ **Logic Fixes:** Project detection, find command filtering, return value convention
3. ✅ **Code Quality:** Help text, consistent stats format
4. ✅ **Documentation:** `docs/SCRIPT_USAGE.md` (3,500+ lines)
5. ✅ **Testing:** Enhanced test suite with 4 new edge-case tests

### Key Files

```
scripts/automation/project-docs-update.sh          # Main script (all fixes applied)
scripts/automation/test-project-docs-update.sh     # Enhanced test suite
docs/SCRIPT_USAGE.md                               # Comprehensive documentation
.github/projects/_templates/                       # Template files
CHANGELOG.md                                       # Phase 1 entry
```

### Test Results

- ✅ All 12 existing tests passing
- ✅ 4 new edge-case tests passing
- ✅ Help text validation working
- ✅ Special character handling confirmed (security fix verified)

---

## Phase 2: Project Maintenance Agent + Skills (READY TO START)

**Estimated Duration:** 2 weeks  
**Effort:** ~50 hours  
**Start Date:** After Phase 1 merge (2026-08-13)

### Phase 2 Deliverables

#### 1. Portable Agent Specification

**File Structure:**

```
agents/project-maintenance-agent/
├── AGENT.md                              # Formal specification
├── README.md                             # Usage guide and overview
├── shared/
│   └── core-prompt.md                   # Agent methodology and approach
├── claude/
│   └── agent.md                         # Claude implementation
├── copilot/
│   └── agent.md                         # Copilot implementation
├── openai/
│   └── agent.md                         # OpenAI implementation
├── skills/
│   ├── project-docs-updater/
│   │   ├── SKILL.md                     # Wraps project-docs-update.sh
│   │   ├── handler.js
│   │   └── config.json
│   ├── project-validator/
│   │   ├── SKILL.md                     # Health checks & validation
│   │   ├── handler.js
│   │   └── config.json
│   └── documentation-sync/
│       ├── SKILL.md                     # Bulk sync orchestration
│       ├── handler.js
│       └── config.json
├── config/
│   ├── github.config.js                 # GitHub-specific config
│   ├── wordpress-plugin.config.js       # WordPress plugin config
│   └── wordpress-theme.config.js        # WordPress theme config
└── tests/
    ├── unit/
    ├── integration/
    └── fixtures/
```

#### 2. Agent Capabilities

**Core Operations:**

- ✅ Check project documentation completeness
- ✅ Create missing PLANNING.md, OPENSPEC.md, README.md
- ✅ Validate project structure and metadata
- ✅ Generate documentation audit reports
- ✅ Archive completed projects
- ✅ Move projects to completed state

**Integration Patterns:**

- Reactive: Task Planner identifies gaps → calls Maintenance Agent
- Proactive: Nightly scheduled workflow → reports to team
- Interactive: On-demand execution with approval

#### 3. Portable Skills

**skill:project-docs-updater**

- Wraps `scripts/automation/project-docs-update.sh`
- Input: `{ projects: string[], dryRun: boolean }`
- Output: `{ created: number, updated: number, errors: string[] }`
- Modes: dry-run (preview), live (execute), validate (check)

**skill:project-validator**

- Validates project structure and documentation
- Input: `{ projects: string[] }`
- Output: `{ valid: Project[], invalid: Project[], missingDocs: File[] }`
- Rules: README required, PLANNING optional, OPENSPEC optional for simple projects

**skill:documentation-sync**

- Bulk synchronization of project metadata
- Input: `{ sourceProject: string, targetProjects: string[] }`
- Output: `{ synced: number, conflicts: number, skipped: number }`
- Handles: PLANNING.md, README metadata, related issues

#### 4. Implementation Timeline

| Week | Task | Hours | Deliverables |
|------|------|-------|--------------|
| Week 1 | Agent spec + core prompt | 12 | AGENT.md, core-prompt.md, architecture docs |
| Week 1 | Provider implementations | 10 | claude/agent.md, copilot/agent.md, openai/agent.md |
| Week 2 | Skills development | 15 | 3 portable skills with handlers, configs |
| Week 2 | Integration testing | 10 | Unit + integration test suites |
| Week 3 | Documentation + examples | 8 | README, usage guide, integration examples |

**Total:** ~50 hours over 2 weeks

#### 5. Success Criteria

- ✅ All 3 provider implementations passing tests
- ✅ All 3 skills working with Phase 1 scripts
- ✅ Integration tests covering: happy path, error cases, edge cases
- ✅ Documentation: README, code comments, inline examples
- ✅ Security review passed (no injection vectors, safe input handling)
- ✅ Code quality: ESLint clean, Prettier formatted, >80% coverage

---

## Phase 3: Integration & Workflow (PLANNED)

**Estimated Duration:** 1 week  
**Effort:** ~20 hours

### Deliverables

1. **GitHub Actions Workflow**
   - `project-maintenance-nightly.yml` (scheduled dry-run, report to team)
   - `project-maintenance-on-demand.yml` (manual dispatch with approval)

2. **Integration with Task Agents**
   - Task Planner → calls Maintenance Agent for bulk operations
   - Task Research → analyzes project state
   - Maintenance Agent → executes operations

3. **Runbook & Incident Response**
   - Documentation for common scenarios
   - Error recovery procedures
   - Escalation paths

---

## Related Issues

| Issue | Type | Status | Purpose |
|-------|------|--------|---------|
| [#1862](https://github.com/lightspeedwp/.github/issues/1862) | Epic | ✅ OPEN | Parent epic for all phases |
| Phase 1 (Scripts) | Task | ✅ COMPLETE | Fix & enhance automation scripts |
| Phase 2 (Agent) | Task | 🔄 IN PROGRESS | Design & build portable agent |
| Phase 3 (Integration) | Task | 📋 PLANNED | Workflows & team integration |

---

## Design Decisions

### Why a Portable Agent?

**Rationale:**

- Reusable across LightSpeedWP projects (WordPress plugins, themes, monorepos)
- Multi-provider support (Claude, Copilot, OpenAI) ensures flexibility
- Decouples agent logic from GitHub-specific operations

**Trade-off:**

- Higher upfront design effort
- Benefits: reusability, flexibility, maintainability

### Reactive vs Proactive vs Both?

**Decision:** Both patterns supported

**Proactive (Scheduled):**

- Nightly dry-run at 2 AM UTC
- Reports gaps to team Slack channel
- No execution—visibility only

**Reactive (On-Demand):**

- Task Planner triggers when needed
- Requires explicit approval before execution
- Allows flexible scheduling

**Benefit:** Teams get automatic monitoring + control over execution timing

### Why Wrap Scripts as Skills?

**Rationale:**

- Proven, tested code in Phase 1
- Skills provide consistent interface for agent integration
- Reduces implementation risk
- Enables independent testing and versioning

---

## Architecture Overview

```
Task Research Agent
        ↓
    (discovers gaps)
        ↓
Task Planning Agent
        ↓
    (identifies 49 projects missing PLANNING.md)
        ↓
Project Maintenance Agent
        ├─→ project-docs-updater skill
        ├─→ project-validator skill
        └─→ documentation-sync skill
        ↓
    (executes bulk updates)
        ↓
Reports results to team
```

**Integration Points:**

- Task Planner: "49 projects missing PLANNING.md" → Maintenance Agent
- Maintenance Agent: Use project-docs-updater skill
- Result: "Created 45 PLANNING.md files, 4 errors" → Team report

---

## Known Unknowns

1. **OpenSpec Format:** Will Phase 2 use existing OPENSPEC_TEMPLATE.md or define custom format?
2. **Approval Workflow:** Should on-demand execution require approval? If so, how?
3. **Error Recovery:** How aggressive should auto-retry be? What's the failure threshold?
4. **Conflict Resolution:** How to handle projects with custom documentation not matching templates?

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Scripts have bugs after Phase 1 | Low | Medium | Comprehensive Phase 1 testing |
| Agent design too complex | Medium | High | Start with minimal spec, iterate |
| Poor integration with Task Agents | Medium | High | Early alignment meetings |
| Performance issues on large projects | Low | Medium | Batch processing + monitoring |

---

## Next Steps

1. ✅ **Phase 1 PR Review & Merge** — Monitor [#1867](https://github.com/lightspeedwp/.github/pull/1867)
2. 🔄 **Phase 2 Design Work** — Start AGENT.md specification
3. 📋 **Provider Implementations** — Implement Claude, Copilot, OpenAI versions
4. 🧪 **Integration Testing** — Comprehensive test suite
5. 📚 **Documentation** — Usage guide, integration examples
6. 🚀 **Phase 3 Planning** — GitHub Actions workflows and team integration

---

## Key Files & References

- **Phase 1 PR:** [#1867](https://github.com/lightspeedwp/.github/pull/1867)
- **Main Epic:** [#1862](https://github.com/lightspeedwp/.github/issues/1862)
- **Script Documentation:** [docs/SCRIPT_USAGE.md](../../docs/SCRIPT_USAGE.md)
- **Issue Maintenance Scripts:** [docs/ISSUE_MAINTENANCE_SCRIPTS.md](../../docs/ISSUE_MAINTENANCE_SCRIPTS.md)
- **CLAUDE.md:** [Project instructions](../../CLAUDE.md)
- **AGENTS.md:** [AI governance rules](../../AGENTS.md)

---

## Project Communication

**Status Updates:** Posted in GitHub issues as comments  
**Design Reviews:** Link to PLANNING.md + OPENSPEC.md  
**Implementation:** Track progress in PLANNING.md phases  
**Completion:** Archive with `.archive-status.md` when done

---

*Built with 🚀 LightSpeed automation and open-source spirit!*
