# Issue Type & Metadata Automation Initiative — Project Index

**Objective:** Fix critical gaps in GitHub issue creation automation so that issue types, labels, assignees, projects, and custom fields are automatically populated when issues are created, preventing manual cleanup and enabling AI agents to create issues correctly.

**Project Duration:** 5 weeks (July 23 — August 27, 2026)  
**Total Effort:** ~37.5 hours across 3 phases  
**Status:** 🟢 Active — All Issues Created, Ready for Phase 1 Execution  
**Epic Issue:** [#1167 — Issue Type & Metadata Automation Initiative](https://github.com/lightspeedwp/.github/issues/1167)  

---

## 📂 Project Files

### 1. **README.md** — Quick Navigation & Overview

- Quick start by role (executive, technical lead, contributor)
- File descriptions
- Current status summary

**Read First:** 5 minutes

### 2. **IMPLEMENTATION_PLAN.md** — Detailed Roadmap & Architecture

- Executive summary of all findings
- Complete 3-phase implementation plan
- Timeline & effort breakdown
- Success criteria
- Risk assessment

**Read Next:** 30 minutes

### 3. **Project Reports** (Reference Documentation)

- Located in `.github/reports/issue-management/`
- `audit-2026-07-23-comprehensive.md` — Full audit findings
- `solution-design-2026-07-23.md` — Detailed solution architecture

**Reference During Implementation:** Use for detailed design decisions

### 4. **Issue Files** (GitHub Issue Templates)

Located in `./issues/` subfolder:

**Phase 1 (Critical Fixes):**

- `01-epic-issue-type-automation.md` — Parent epic
- `02-fix-nonexistent-label.md` — Fix 1.1
- `03-fix-type-aliases.md` — Fix 1.2
- `04-issue-body-labeling-rules.md` — Fix 1.3
- `05-fix-template-enforcement.md` — Fix 1.4
- `06-issue-dod-validation.md` — Fix 1.5

**Phase 2 (Enhanced Automation):**

- `07-pr-merge-blocker.md` — Feature 2.1
- `08-custom-field-population.md` — Feature 2.2
- `09-template-aware-type.md` — Feature 2.3

**Phase 3 (Documentation & Testing):**

- `10-ai-agent-guidance.md` — Task 3.1
- `11-update-agents-md.md` — Task 3.2
- `12-test-and-validate.md` — Task 3.3

---

## 🚀 Quick Start

### For Executives / Stakeholders

1. Read **IMPLEMENTATION_PLAN.md** (30 min)
2. Review epic issue status
3. Approve resource allocation
4. Authorize Phase 1 execution

### For Technical Leads

1. Read **IMPLEMENTATION_PLAN.md** (complete) (30 min)
2. Review `.github/reports/issue-management/solution-design-2026-07-23.md` (30 min)
3. Review critical fixes (Phase 1)
4. Assign team members to phases
5. Authorize Phase 1 execution

### For Individual Contributors (Execution)

1. Read **README.md** (5 min)
2. Check assigned issues (Phase 1 tasks)
3. Follow issue details for step-by-step implementation
4. Create PR and request review

---

## 📋 Project Overview

### What's the Problem?

When issues are created (by AI agents or humans):

- ❌ Issue types not automatically assigned (guessed from keywords)
- ❌ Area/component labels not applied
- ❌ Assignees not set (should default to code owner)
- ❌ Projects not assigned (should default to .github #33)
- ❌ Custom fields empty (7 fields undefined)
- ❌ Status unclear (no triage label)
- ❌ GitHub bot silently reopens incomplete issues (confusing)
- ❌ DoD enforcement missing for issues (only PRs validated)
- ❌ PR merges not blocked if linked issue incomplete

Result: Issues require manual cleanup before processing

### What's the Solution?

**3 Phases of Implementation:**

**Phase 1: Critical Fixes (11.5 hours, Weeks 1-2)**

- Remove non-existent label reference
- Add missing type label aliases
- Implement issue-body labeling rules (25+ templates)
- Fix template-enforcement silent reopening
- Add issue DoD validation (prevent closing with incomplete checklist)

**Phase 2: Enhanced Automation (15 hours, Weeks 3-4)**

- Implement PR merge blocker (check linked issue DoD)
- Auto-populate custom fields (7 fields: Risk, Impact, Domain, Team, Effort, etc.)
- Template-aware type detection (improvement over keyword detection)

**Phase 3: Documentation & Testing (11 hours, Weeks 4-5)**

- Create AI agent issue creation guide
- Update AGENTS.md with best practices
- End-to-end testing & validation
- Deploy to production

---

## 🎯 Success Criteria

### Phase 1 ✅

- [ ] Non-existent label removed
- [ ] Type aliases complete
- [ ] Issue-body labeling rules added for all 25 templates
- [ ] Template-enforcement posts clear guidance (no silent reopening)
- [ ] Issue DoD validation prevents close with unchecked items
- [ ] All Phase 1 tests passing
- [ ] PR #1 merged to develop

### Phase 2 ✅

- [ ] PR merge blocker working (validates linked issue DoD)
- [ ] Custom fields auto-populated on issue creation
- [ ] Template-aware type detection enabled
- [ ] All Phase 2 tests passing
- [ ] PR #2 merged to develop

### Phase 3 ✅

- [ ] AI agent guidance documented
- [ ] AGENTS.md updated
- [ ] End-to-end test suite passing
- [ ] All documentation reviewed
- [ ] PR #3 merged to develop

### Overall Success ✅

- ✅ Issues created by AI agents have correct metadata at creation
- ✅ All 158 labels protected in governance
- ✅ No silent issue reopening
- ✅ DoD enforced on both issues and PRs
- ✅ PR merges blocked if linked issues incomplete
- ✅ Documented best practices for all contributors

---

## 📊 Effort Breakdown

| Phase | Tasks | Duration | Effort | Status |
|-------|-------|----------|--------|--------|
| **Phase 1: Critical Fixes** | 5 | Weeks 1-2 | 11.5h | 🔴 Pending |
| Fix 1.1: Remove label | 1 | 5m | 0.5h | ⏳ Ready |
| Fix 1.2: Add aliases | 1 | 30m | 1h | ⏳ Ready |
| Fix 1.3: Issue labeling | 1 | 3-4h | 3-4h | ⏳ Ready |
| Fix 1.4: Template enforcement | 1 | 2-3h | 2-3h | ⏳ Ready |
| Fix 1.5: DoD validation | 1 | 2-3h | 2-3h | ⏳ Ready |
| **Phase 2: Enhanced** | 3 | Weeks 3-4 | 15h | 🔴 Pending |
| Feature 2.1: PR blocker | 1 | 3-4h | 3-4h | ⏳ Ready |
| Feature 2.2: Custom fields | 1 | 4-5h | 4-5h | ⏳ Ready |
| Feature 2.3: Type detection | 1 | 1-2h | 1-2h | ⏳ Ready |
| **Phase 3: Docs & Testing** | 3 | Weeks 4-5 | 11h | 🔴 Pending |
| Task 3.1: AI guidance | 1 | 2h | 2h | ⏳ Ready |
| Task 3.2: Update AGENTS | 1 | 2h | 2h | ⏳ Ready |
| Task 3.3: Testing | 1 | 4h | 4h | ⏳ Ready |
| **TOTAL** | 11 | 5 weeks | 37.5h | 🟢 Ready to Start |

---

## 📅 Timeline

**Week 1 (July 23-27):**

- Phase 1, Fix 1.1–1.2 (1.5h)

**Week 2 (July 30–Aug 3):**

- Phase 1, Fix 1.3–1.5 (10h)
- Phase 1 PR review & merge

**Week 3 (Aug 6-10):**

- Phase 2, Feature 2.1–2.2 (8h)

**Week 4 (Aug 13-17):**

- Phase 2, Feature 2.3 (2h)
- Phase 3, Task 3.1–3.2 (4h)
- Phase 2 PR review & merge

**Week 5 (Aug 20-27):**

- Phase 3, Task 3.3 (4h)
- Testing & validation (3h)
- Phase 3 PR review & merge
- **Target Completion:** Aug 27, 2026

---

## 🔗 Related Issues & Documentation

### Audit Reports (Reference)

- `.github/reports/issue-management/audit-2026-07-23-comprehensive.md`
- `.github/reports/issue-management/solution-design-2026-07-23.md`

### Key Configuration Files

- `.github/labels.yml` (158 labels, canonical source)
- `.github/labeler.yml` (40+ automation rules)
- `.github/issue-types.yml` (32 issue types)
- `.github/issue-fields.yml` (7 custom fields)
- `.github/label-governance-policy.yml` (label protection)

### Key Workflows

- `.github/workflows/issues.yml` (type detection on issue open)
- `.github/workflows/labeling.yml` (unified labeling agent)
- `.github/workflows/template-enforcement.yml` (DoR/DoD validation)
- `.github/workflows/validate-pr-template.yml` (PR DoD validation)

### Related Documents

- `.github/AGENTS.md` — AI agent governance
- `.github/CLAUDE.md` — Repository standards

---

## ✅ Project Status

**Overall:** 🟢 Active — Audit Complete, Ready for Phase 1 Implementation

**Phase 1:** ⏳ Ready to begin (5 critical fixes)  
**Phase 2:** 📅 Planned (3 enhanced features)  
**Phase 3:** 📅 Planned (documentation & testing)  

**Key Metrics:**

- Audit findings: 5 Critical + 5 Major issues identified
- Solution designed: 37.5 hours of work across 11 tasks
- Test coverage: 12-step validation matrix planned
- Risk assessment: LOW with proposed mitigations

---

## 📞 Contact & Support

**Project Owner:** Ash Shaw (<ashley@lightspeedwp.agency>)

**Getting Help:**

- For quick overview: See README.md
- For timeline/effort: See IMPLEMENTATION_PLAN.md
- For detailed design: See solution-design-2026-07-23.md in reports folder
- For task details: See individual issue markdown files in ./issues/

---

**Last Updated:** 2026-07-23  
**Project Created:** 2026-07-23  
**Status:** ✅ Complete & Ready for Execution
