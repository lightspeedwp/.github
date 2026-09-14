---
title: "Branch Naming & PR Strategy — Project Control Panel"
description: "Comprehensive specification and implementation roadmap for GitHub branch naming and PR workflows"
file_type: "project-documentation"
status: "active"
created_date: "2026-09-12"
last_updated: "2026-09-12"
owner: "ashley@lightspeedwp.agency"
---

# Branch Naming & PR Strategy — Project Control Panel

> **Project:** Formalizing Branch Naming & PR Workflows  
> **Status:** Specification Draft  
> **Phase:** 0 (Planning & Specification)  
> **Target Completion:** End Q4 2026  
> **Date:** 2026-09-12

---

## 📋 Quick Links

### Core Documents (START HERE)

1. **[BRANCH_AND_PR_STRATEGY.md](./BRANCH_AND_PR_STRATEGY.md)** ← **READ THIS FIRST**
   - Complete 10-section specification
   - Branch naming rules (24 types, patterns, validation)
   - PR template routing & labeling strategy
   - Validation framework & enforcement
   - 6-phase implementation roadmap (58-73 hours)

2. **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** ← **FOR DEVELOPERS**
   - Fast lookup guide
   - Type picker table
   - Validation checklist
   - Common mistakes & fixes

### Background & Context

- **[CLAUDE.md](../../CLAUDE.md)** — Current informal branch naming rules (sections 1-2)
- **[docs/BRANCHING_STRATEGY.md](../../docs/BRANCHING_STRATEGY.md)** — User-facing guide (needs update)
- **[docs/PR_CREATION_PROCESS.md](../../docs/PR_CREATION_PROCESS.md)** — Current PR workflow

### Related Projects

- **[Changelog Quality Audit (Phase 5)](../changelog-audit-quality-audit-2026-09-12/README.md)** — Uses branch naming for entry tracking
- **[Changelog Automation Hardening](../changelog-automation-hardening/README.md)** — Uses PR templates for entry linking

---

## 🎯 Executive Summary

### Current State (2026-09-12)

**What Exists:**
- ✅ Informal branch naming rules in CLAUDE.md
- ✅ 19 PR templates (varying quality)
- ✅ Some automatic labeling
- ✅ Branch protection rules on main/develop

**What's Missing:**
- ❌ Formal specification document
- ❌ Automated branch name validation (pre-merge)
- ❌ Consistent PR template routing by type
- ❌ Complete type reference documentation
- ❌ Developer training materials

**Problem:** Inconsistent enforcement leads to:
- Wrong PR templates applied (wrong checklist)
- Naming violations slip through (repo clutter)
- Unclear rules for new developers
- Wasted time fixing branches after PR open

### Project Goals

1. **Formalize** branch naming rules (24 types, clear patterns)
2. **Automate** template routing (branch type → PR template)
3. **Enforce** via CI gates (block invalid branches)
4. **Document** comprehensively (spec + quick ref + guide)
5. **Train** team (video, FAQ, Q&A session)

### Timeline & Effort

- **Duration:** 6 weeks
- **Effort:** 58-73 hours (~10 hours/week)
- **Target Completion:** Late October 2026
- **Owner:** GitHub Operations & Release Engineering

---

## 📊 Key Sections of the Strategy

### 1. Branch Naming Specification

**24 Authorized Types:**
- `feat`, `fix`, `hotfix`, `release` — Primary change types
- `refactor`, `chore`, `task`, `docs`, `test` — Common work types
- `perf`, `ci`, `build`, `deps`, `security` — Infrastructure & quality
- `design`, `a11y`, `ux`, `i18n`, `ops`, `proto`, `audit`, `codex`, `research`, `revert` — Specialized

**Pattern:**
```
{type}/{scope}-{title}
```

**Rules:**
- Type: lowercase, from authorized list
- Scope: kebab-case, specific to what's changing
- Title: brief, action-oriented description
- Forbidden: `claude/`, `copilot/`, `openai/` prefixes

**Examples:**
- ✅ `feat/user-auth-login-redesign`
- ✅ `fix/pr-template-routing-bug`
- ✅ `docs/branching-strategy-guide`
- ❌ `claude/my-feature` (forbidden prefix)
- ❌ `Feature/my-work` (uppercase)
- ❌ `feat/my_work` (underscore)

### 2. PR Template Routing

**Automatic Detection:**
1. Developer creates PR from branch like `feat/user-auth-login`
2. GitHub workflow extracts type: `feat`
3. Correct PR template auto-loads: `pr_feature.md`
4. Developer fills out feature-specific checklist

**Template Mapping (19 Templates):**
| Type | Template |
|------|----------|
| feat | pr_feature.md |
| fix | pr_bugfix.md |
| docs | pr_docs.md |
| test | pr_test.md |
| ... | (19 total) |

### 3. Validation & Enforcement

**Validation Script:**
- Runs on every PR open/update
- Checks: pattern, forbidden prefixes, type validity
- Blocks merge if validation fails
- Clear error messages guide developer to fix

**Branch Protection:**
- Require passing validation
- Require approved review
- Require CI/CD passing
- Dismiss stale reviews

### 4. Label Integration

**Automatic Labels:**
- `type:feature` (from branch type)
- `area:ci` (from scope, if recognized)
- `meta:breaking-change` (from PR body keywords)

**Used For:**
- Filtering & searching
- Metrics & reporting
- Workflow automation
- Release notes generation

### 5. Implementation Phases

| Phase | Weeks | Focus | Hours |
|-------|-------|-------|-------|
| **1** | 1 | Spec & docs | 8-10 |
| **2** | 2-3 | Template routing | 10-12 |
| **3** | 3-4 | Validation & enforcement | 10-12 |
| **4** | 4-5 | Auto-labeling | 8-10 |
| **5** | 5-6 | Team training | 12-15 |
| **6** | 6-7 | Monitoring & refinement | 8-10 |
| **Total** | 6 weeks | Complete system | 58-73 hours |

---

## 🚀 Getting Started

### For Project Leads

1. **Review:** Read [BRANCH_AND_PR_STRATEGY.md](./BRANCH_AND_PR_STRATEGY.md) — full specification
2. **Approve:** Review with team, get stakeholder sign-off
3. **Plan:** Schedule phases, assign owners
4. **Execute:** Follow week-by-week roadmap
5. **Track:** Update progress in this project

### For Developers (Now & After Implementation)

1. **Learn:** Read [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) — quick lookup
2. **Validate:** `npm run validate:branch-name -- --branch your-branch`
3. **Create:** Use correct type/scope/title pattern
4. **Fix:** If PR template is wrong, close PR and reopen with correct branch
5. **Ask:** Comment on validation errors or join Q&A session

### For Implementation Teams (When Approved)

1. Phase 1: Create specification & docs (✅ DONE)
2. Phase 2: Update PR templates and build routing workflow
3. Phase 3: Deploy validation workflow and branch protection
4. Phase 4: Build auto-labeling workflow
5. Phase 5: Train team with video & Q&A
6. Phase 6: Monitor and refine based on feedback

---

## 📈 Success Criteria

### By End of Project

- ✅ **Formal specification** document published and reviewed
- ✅ **19 PR templates** updated with consistent structure
- ✅ **Branch validation** deployed to block invalid branches
- ✅ **PR template routing** automatic based on branch type
- ✅ **Auto-labeling** applied to all PRs
- ✅ **Team training** completed (90%+ attendance)
- ✅ **95%+ compliance** with naming rules on new branches
- ✅ **<5% false positives** in validation (only genuinely invalid caught)
- ✅ **Monitoring dashboard** tracking metrics weekly

---

## 🔗 Related Issues & Projects

### Epic
- **[#1271](https://github.com/lightspeedwp/.github/issues/1271)** — Changelog Automation Hardening (parent epic)

### Related Projects
- **[changelog-audit-quality-audit-2026-09-12](../changelog-audit-quality-audit-2026-09-12/)** — Phase 5 planning (uses branch naming)
- **[changelog-automation-hardening](../changelog-automation-hardening/)** — Main project (Phases 1-4)
- **[label-prefix-audit-2026-08-05](../label-prefix-audit-2026-08-05/)** — Label governance (coordinates with this project)

### Dependencies
- Workflow files (`.github/workflows/`)
- PR templates (`.github/PULL_REQUEST_TEMPLATE/`)
- Documentation (`docs/`)
- Validation scripts (`scripts/`)

---

## 📅 Timeline

| Week | Phase | Status | Target Date | Owner |
|------|-------|--------|-------------|-------|
| 1 | Specification & docs | ✅ Complete | 2026-09-19 | Ashley |
| 2-3 | Template & routing | Planned | 2026-10-03 | TBD |
| 3-4 | Validation & enforcement | Planned | 2026-10-10 | TBD |
| 4-5 | Auto-labeling | Planned | 2026-10-17 | TBD |
| 5-6 | Team training | Planned | 2026-10-24 | TBD |
| 6-7 | Monitoring & refinement | Planned | 2026-10-31 | TBD |

---

## 📂 File Structure

```
.github/projects/active/branch-and-pr-strategy-2026-09-12/
├── README.md (this file)
├── BRANCH_AND_PR_STRATEGY.md (comprehensive spec — 10 sections)
├── QUICK_REFERENCE.md (developer quick lookup)
├── IMPLEMENTATION_CHECKLIST.md (phase-by-phase tasks)
├── (Created during execution)
│   ├── VALIDATION_SCRIPT.md (validate-branch-name.js)
│   ├── ROUTING_WORKFLOW.md (route-pr-template.yml)
│   ├── LABELING_WORKFLOW.md (auto-label-pr.yml)
│   ├── TRAINING_VIDEO_NOTES.md
│   ├── TEAM_FEEDBACK_SUMMARY.md
│   └── COMPLETION_REPORT.md
```

---

## 🎓 Key Learnings

1. **Consistency requires enforcement.** Rules don't work without CI gates. Developers need immediate feedback.

2. **Naming enables automation.** Branch type used for: template routing, label application, workflow triggers, metrics.

3. **Good defaults help.** Auto-detection + auto-routing means developers rarely need to think about it.

4. **Clear error messages reduce friction.** "❌ Type `features` not found. Did you mean `feat`?" vs generic "validation failed"

5. **Team alignment takes investment.** Training video + quick ref + Q&A + FAQ = 90%+ adoption.

---

## 📞 Questions & Support

### For Strategy Questions
- See [BRANCH_AND_PR_STRATEGY.md](./BRANCH_AND_PR_STRATEGY.md) — detailed sections 1-5

### For Developer Questions
- See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) — fast lookup
- See Section 6 (Troubleshooting) in main spec

### For Implementation Questions
- See Section 4 (Implementation Roadmap) in main spec
- See [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) (when created)

### For General Questions
- Ask in GitHub issue or project discussions
- Attend Q&A session (scheduled after Phase 5)

---

## 📝 Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-09-12 | 1.0 | Initial specification, quick reference, and project documentation |

---

**Status:** ✅ Specification Phase Complete — Ready for Review & Phase 1 Sign-Off  
**Owner:** GitHub Operations & Release Engineering  
**Last Updated:** 2026-09-12

---

## Next Steps

1. **Review** — Team reviews specification and quick reference
2. **Approve** — Stakeholder sign-off for Phase 2 (template & routing)
3. **Plan** — Schedule phases 2-6, assign owners, reserve capacity
4. **Execute** — Phase 2 begins when Phase 1 approved
5. **Track** — Weekly progress updates in project

**Ready to proceed with Phase 2? Comment on the project or this README.**
