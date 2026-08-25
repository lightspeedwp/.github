# Project Maintenance Agent — Phase 2 Kickoff Guide

**Phase Duration:** Estimated 2 weeks (50 hours)  
**Status:** Ready to start (Phase 1 ✅ and Phase 3 ✅ complete)  
**Effort Estimate:** ~50 hours  
**Team:** 1 engineer (primary)  
**Start Date:** Next scheduled session

---

## Phase 2 Overview

**Goal:** Design and implement a portable agent that wraps Phase 1 scripts with multi-provider support (Claude, Copilot, OpenAI) and three operational skills.

**Key Difference from Phase 1 & 3:**
- Phase 1: Fixed automation scripts (bash)
- Phase 3: Created GitHub Actions workflows (YAML)
- **Phase 2: Design intelligent agent (prompt-based + skills)**

**Scope:**
- 1 agent specification (AGENT.md)
- 3 provider implementations (claude, copilot, openai)
- 3 portable skills (project-docs-updater, project-validator, documentation-sync)
- Comprehensive testing (unit + integration + e2e)
- Documentation & examples

---

## Quick Start (Session Kickoff)

### Step 1: Prepare Workspace

```bash
# Create fresh branch
git checkout develop
git pull origin develop
git checkout -b feat/project-maintenance-agent-phase-2

# Create agent folder structure
mkdir -p agents/project-maintenance-agent/{shared,claude,copilot,openai,skills,config,tests/{unit,integration,fixtures}}

# Verify Phase 1 script is present
ls -la scripts/automation/project-docs-update.sh  # Should exist
```

### Step 2: Review Foundation

**Read these files (in order):**
1. `PHASE_3_IMPLEMENTATION.md` — How workflows execute scripts
2. `PLANNING.md` Section 2 — Full Phase 2 requirements
3. `scripts/automation/project-docs-update.sh` — Script we're wrapping

**Key Insight:** Phase 2 is essentially:
```
User Input
   ↓
Agent (Claude/Copilot/OpenAI)
   ↓
Skills (call Phase 1 scripts)
   ↓
Results to user/Slack/GitHub
```

### Step 3: Start with Agent Specification

**First Deliverable:** `.github/agents/project-maintenance-agent/AGENT.md`

**Template:**
```markdown
---
name: project-maintenance-agent
description: Intelligent agent for maintaining project documentation
provider: claude|copilot|openai
version: 1.0.0
---

# Project Maintenance Agent

## Capabilities

1. **Documentation Audit**
   - Input: projects list
   - Output: gaps and recommendations
   
2. **Bulk Documentation Creation**
   - Input: projects, file types, dry-run flag
   - Output: created count, errors

3. **Project Validation**
   - Input: projects list
   - Output: valid/invalid, issues, recommendations

4. **Project Archival**
   - Input: project, reason
   - Output: move details, archive status

## Integration Points

- Task Planning Agent: receives audit results
- GitHub Actions: triggered via workflow_dispatch
- Slack: posts results to webhook

## Safety Guards

- Always offer dry-run first
- Explicit approval for destructive operations
- Clear error messages
- Input validation
```

---

## Implementation Roadmap

### Week 1: Agent Spec + Claude Implementation

#### Day 1: Agent Specification (4 hours)
- [ ] Create `AGENT.md` with capabilities and integration points
- [ ] Document input/output schemas for each operation
- [ ] Define integration with Phase 1 scripts
- [ ] Define error handling strategy

**Deliverable:** `agents/project-maintenance-agent/AGENT.md` (2,000 words)

#### Day 2-3: Claude Provider (8 hours)
- [ ] Create `agents/project-maintenance-agent/claude/agent.md`
- [ ] Implement core prompt for Claude
- [ ] Add capability: documentation-audit
- [ ] Add capability: bulk-create-docs
- [ ] Test with Phase 1 script integration

**Deliverable:** `agents/project-maintenance-agent/claude/agent.md` (1,000 words)

#### Day 4: Core Prompt Shared File (4 hours)
- [ ] Create `agents/project-maintenance-agent/shared/core-prompt.md`
- [ ] Document agent methodology
- [ ] Define decision-making framework
- [ ] List all capabilities and their use cases

**Deliverable:** `agents/project-maintenance-agent/shared/core-prompt.md` (800 words)

#### Day 5: Provider Implementations — Copilot & OpenAI (4 hours)
- [ ] Create `agents/project-maintenance-agent/copilot/agent.md`
- [ ] Create `agents/project-maintenance-agent/openai/agent.md`
- [ ] Both should mirror Claude capabilities
- [ ] Note provider-specific strengths/limitations

**Deliverable:** Both files created, ~1,000 words each

**Week 1 Total:** 20 hours, 5 files, ~5,000 words of agent specs

---

### Week 2: Skills Implementation + Testing

#### Day 6-7: Skill 1 — project-docs-updater (6 hours)
- [ ] Create `agents/project-maintenance-agent/skills/project-docs-updater/SKILL.md`
- [ ] Create handler that wraps Phase 1 script
- [ ] Create `config.json` with input/output schemas
- [ ] Write unit tests (8+ test cases)

**Test Cases:**
- Create PLANNING.md only
- Create all three files
- Dry-run vs live
- Error handling (missing templates, permissions)
- Special characters in project names

**Deliverable:** Handler working, 8+ tests passing

#### Day 8-9: Skill 2 — project-validator (6 hours)
- [ ] Create `agents/project-maintenance-agent/skills/project-validator/SKILL.md`
- [ ] Implement validation rules (basic + full checks)
- [ ] Create handler
- [ ] Create `config.json`
- [ ] Write unit tests (8+ test cases)

**Test Cases:**
- Valid project passes checks
- Invalid project fails with reason
- Recommends missing files
- Validates frontmatter
- Checks link targets

**Deliverable:** Handler working, 8+ tests passing

#### Day 10: Skill 3 — documentation-sync (5 hours)
- [ ] Create `agents/project-maintenance-agent/skills/documentation-sync/SKILL.md`
- [ ] Implement sync logic (copy metadata, detect conflicts)
- [ ] Create handler
- [ ] Create `config.json`
- [ ] Write unit tests (6+ test cases)

**Test Cases:**
- Sync single field
- Detect conflicts
- Skip customized projects
- Handle missing fields
- Validate YAML after sync

**Deliverable:** Handler working, 6+ tests passing

#### Day 11-12: Configuration Files + Integration Tests (8 hours)
- [ ] Create `agents/project-maintenance-agent/config/github.config.js`
- [ ] Create `agents/project-maintenance-agent/config/wordpress-plugin.config.js`
- [ ] Create `agents/project-maintenance-agent/config/wordpress-theme.config.js`
- [ ] Write integration tests (10+ scenarios)
- [ ] Test agent + skills together

**Integration Test Scenarios:**
- Audit finds 5 projects missing docs
- Create docs for selected projects
- Validate specific project
- Archive completed project
- Handle permission errors
- Handle missing templates

**Deliverable:** All configs working, 10+ integration tests passing

**Week 2 Total:** 25 hours, 3 skills + config files, ~30 tests

---

### Remaining (Week 2.5): Documentation + Code Quality

#### Day 13: Testing & Code Quality (5 hours)
- [ ] Run full test suite: `npm test`
- [ ] Target >80% code coverage
- [ ] Fix ESLint issues
- [ ] Format with Prettier
- [ ] Document test instructions

**Deliverable:** All tests passing, >80% coverage, code quality gates met

#### Day 14: Documentation (5 hours)
- [ ] Create `agents/project-maintenance-agent/README.md`
- [ ] Document each skill
- [ ] Create usage examples (3-5 real scenarios)
- [ ] Document integration with Phase 3 workflows
- [ ] Create provider comparison table

**Deliverable:** Complete documentation, examples ready

---

## Daily Standup Template

**Use this for progress tracking:**

```markdown
## Day X Standup

**Completed:**
- [ ] Task 1
- [ ] Task 2

**In Progress:**
- [ ] Task 3

**Blockers:**
- None (or describe)

**Files Changed:**
- agents/project-maintenance-agent/...

**Tests:**
- XYZ tests passing, N% coverage

**Next Day:**
- Task 4
- Task 5
```

---

## Testing Strategy

### Unit Tests (Skills)
- [ ] project-docs-updater: 8+ tests
- [ ] project-validator: 8+ tests
- [ ] documentation-sync: 6+ tests
- **Total: 22+ unit tests**

### Integration Tests
- [ ] Audit → find gaps → report: 2 tests
- [ ] Create docs → verify files: 2 tests
- [ ] Validate → check results: 2 tests
- [ ] Archive → move files → verify: 2 tests
- [ ] Error scenarios: 4 tests
- **Total: 12+ integration tests**

### End-to-End Tests
- [ ] Agent handles invalid input gracefully
- [ ] All 3 providers work with same skills
- [ ] Performance: <5 min for 50 projects
- [ ] Error messages are helpful

### Coverage Target
- **Goal:** >80% code coverage
- **Files:** Skills, handlers, config files
- **Excluded:** Provider prompts (external), test fixtures

---

## Code Organization Best Practices

**Folder Structure:**
```
agents/project-maintenance-agent/
├── AGENT.md                              # Main specification
├── README.md                             # Usage guide
├── shared/
│   └── core-prompt.md                    # Shared methodology
├── claude/
│   ├── agent.md                          # Claude-specific implementation
│   └── system-prompt.md                  # Claude system prompt
├── copilot/
│   ├── agent.md                          # Copilot-specific
│   └── function-schema.json              # Function calling schema
├── openai/
│   ├── agent.md                          # OpenAI-specific
│   └── functions.json                    # Function definitions
├── skills/
│   ├── project-docs-updater/
│   │   ├── SKILL.md                      # Skill documentation
│   │   ├── index.js                      # Handler
│   │   ├── config.json                   # I/O schemas
│   │   └── __tests__/
│   │       ├── unit.test.js
│   │       └── fixtures/
│   ├── project-validator/
│   │   ├── SKILL.md
│   │   ├── index.js
│   │   ├── config.json
│   │   └── __tests__/
│   │       └── unit.test.js
│   └── documentation-sync/
│       ├── SKILL.md
│       ├── index.js
│       ├── config.json
│       └── __tests__/
│           └── unit.test.js
├── config/
│   ├── github.config.js                  # GitHub-specific settings
│   ├── wordpress-plugin.config.js        # Plugin settings
│   └── wordpress-theme.config.js         # Theme settings
├── __tests__/
│   ├── integration/                      # Agent + skills together
│   ├── e2e/                              # Full workflows
│   └── fixtures/                         # Test data
└── docs/
    ├── INTEGRATION_GUIDE.md              # Workflow integration
    ├── EXAMPLES.md                       # Real-world scenarios
    └── TROUBLESHOOTING.md                # Common issues
```

**Naming Conventions:**
- Files: kebab-case (project-docs-updater.js)
- Classes: PascalCase (ProjectDocsUpdater)
- Functions: camelCase (validateProject)
- Constants: UPPER_SNAKE_CASE (MAX_PROJECTS)
- Folders: kebab-case or descriptive names

---

## Success Criteria for Phase 2

### Functional
- ✅ All 3 provider implementations passing tests
- ✅ All 3 portable skills working end-to-end
- ✅ Integration with Phase 1 scripts verified
- ✅ Dry-run mode working correctly
- ✅ Error handling comprehensive

### Quality
- ✅ >80% test coverage across codebase
- ✅ ESLint clean (no warnings)
- ✅ Prettier formatted
- ✅ All tests passing on CI
- ✅ No security vulnerabilities

### Documentation
- ✅ AGENT.md complete (2,000+ words)
- ✅ README.md with usage guide
- ✅ Each skill documented
- ✅ Integration guide for workflows
- ✅ 5+ real-world examples
- ✅ Troubleshooting guide

### Delivery
- ✅ Feature branch created
- ✅ PR template filled correctly
- ✅ All CI checks passing
- ✅ Code review completed
- ✅ Ready to merge to develop

---

## Potential Blockers & Mitigations

| Blocker | Likelihood | Mitigation |
|---------|-----------|-----------|
| Phase 1 script API changes | Low | Script is stable; if issues arise, create bug fix PR |
| Provider API differences | Medium | Start with Claude, use shared test suite for validation |
| Complex error cases | Medium | Focus on happy path first, iterate on edge cases |
| Template file changes | Low | Verify _templates folder exists before Phase 2 starts |
| Time overrun | Medium | Prioritize skills over enhancements; defer Phase 2.5 features |

---

## Git Workflow for Phase 2

### Initial Setup
```bash
git checkout develop
git pull origin develop
git checkout -b feat/project-maintenance-agent-phase-2
```

### Daily Commits
```bash
# At end of each day
git add agents/project-maintenance-agent/
git commit -m "feat: Add project-docs-updater skill implementation

- Implement handler wrapping Phase 1 script
- Add config.json with schemas
- Write 8 unit tests
- All tests passing

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

### When Ready to Push
```bash
git rebase develop  # Resolve any conflicts
git push origin feat/project-maintenance-agent-phase-2

# Create PR
gh pr create \
  --title "feat: Project Maintenance Agent Phase 2 — Portable Agent with Skills" \
  --body "Phase 2 deliverables:
  - Agent specification (3 providers)
  - 3 portable skills (project-docs-updater, project-validator, documentation-sync)
  - 30+ tests with >80% coverage
  - Full documentation

Related: #1862"
```

---

## Resources & References

**Phase 1 Output:**
- Script: `scripts/automation/project-docs-update.sh`
- Documentation: `docs/SCRIPT_USAGE.md`
- PR: [#1867](https://github.com/lightspeedwp/.github/pull/1867)

**Phase 3 Output:**
- Workflows: `.github/workflows/project-maintenance-*.yml`
- Setup guide: `.github/projects/active/.../SLACK_WEBHOOK_SETUP.md`
- Implementation: `PHASE_3_IMPLEMENTATION.md`

**Planning Documents:**
- Full spec: `PLANNING.md`
- Project overview: `README.md`

**Similar Agent Examples:**
- Check `agents/` folder for other agent implementations
- Review how other agents wrap scripts/tools

---

## Phase 2 Success Metrics

**Deliver by End of Week 2:**

| Metric | Target | Status |
|--------|--------|--------|
| Files created | 20+ | TBD |
| Lines of code | 2,000+ | TBD |
| Tests written | 30+ | TBD |
| Test coverage | >80% | TBD |
| Providers | 3 (Claude, Copilot, OpenAI) | TBD |
| Skills | 3 (updater, validator, sync) | TBD |
| Documentation | 3,000+ words | TBD |

---

## When Phase 2 is Complete

**Handoff to Phase 4:**

1. **Create GitHub Issue** for Phase 4 tracking
2. **Archive Phase 2 Branch** or keep for reference
3. **Update Epic #1862** with Phase 2 completion
4. **Plan Phase 4** with team (training, runbooks)
5. **Schedule Phase 4** kickoff (1 week duration)

**Phase 4 will cover:**
- Team training materials
- Operational runbooks
- Incident response procedures
- Integration with other agents

---

## Quick Reference Checklist

**Before Starting:**
- [ ] Phase 1 & 3 PRs merged to develop
- [ ] Phase 1 script is stable (no pending fixes)
- [ ] Template files in `.github/projects/_templates/` exist
- [ ] Team aligned on Phase 2 scope

**During Phase 2:**
- [ ] Daily standup in memory/progress
- [ ] Tests written as code is developed
- [ ] Code quality gates maintained
- [ ] Documentation kept up-to-date

**Before Submitting PR:**
- [ ] All tests passing locally
- [ ] Coverage >80%
- [ ] ESLint clean
- [ ] Prettier formatted
- [ ] PR template filled
- [ ] Related issues linked

**After PR Submission:**
- [ ] Monitor CI checks
- [ ] Address code review feedback
- [ ] Update branch if needed
- [ ] Ready for merge to develop

---

## Contact & Questions

**For questions during Phase 2:**
1. Check PLANNING.md Section 2 for detailed requirements
2. Review Phase 1 script for API reference
3. Check Phase 3 implementation for workflow integration
4. Refer to similar agents in `agents/` folder

**If blocked:**
- Document the blocker clearly
- Create a separate issue if it's a pre-existing problem
- Propose solution (defer, workaround, escalate)

---

*Phase 2 Kickoff Guide prepared 2026-08-18*  
*Ready for next session*
