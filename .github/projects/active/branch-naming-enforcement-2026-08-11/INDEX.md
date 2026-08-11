# Branch Naming Enforcement — Project Index

**Project Slug:** `branch-naming-enforcement-2026-08-11`  
**Status:** 🚀 Phase 1 Complete — Ready for Phase 2  
**Last Updated:** 2026-08-11  
**Parent Epic:** [#1755](https://github.com/lightspeedwp/.github/issues/1755)

## Quick Links

| Document | Purpose | Status |
| --- | --- | --- |
| [README.md](./README.md) | Project overview & deliverables | ✅ Complete |
| [SPEC.md](./SPEC.md) | Detailed requirements & design | ✅ Complete |
| [RFC.md](./RFC.md) | Technical approach & trade-offs | ✅ Complete |
| [PLANNING.md](./PLANNING.md) | Phase-by-phase execution plan | ✅ Complete |
| [ISSUES_CHECKLIST.md](./ISSUES_CHECKLIST.md) | GitHub issues & dependencies | ✅ Complete |
| [INDEX.md](./INDEX.md) | This document (file index) | ✅ Complete |

---

## Project Overview

### What Is This?

This project implements a **two-layer enforcement system** for branch naming conventions in the LightSpeed `.github` repository:

1. **Local Pre-Commit Hook** — Validates branch names before commits
2. **GitHub Actions Workflow** — Blocks PR merge if branch is invalid

### Why Now?

Branch naming violations have become recurring ("keeps fucking up the branch naming conventions"). This initiative adds automated enforcement at two points:

- Local: Instant feedback before push
- Cloud: Mandatory validation at PR time

### Key Problem Solved

- **Before:** Manual validation, users don't follow conventions, violations leak to PRs
- **After:** Automated enforcement, violations caught immediately, stricter compliance

---

## Document Guide

### 1. README.md

**Start here.** High-level project overview.

- **What:** 2-layer enforcement system
- **Why:** Recurring naming violations
- **How:** Pre-commit hook + PR workflow
- **When:** 2026-08-12 to 2026-08-14
- **Deliverables:** Quick reference table

**Read this if:** You want a 2-minute overview of the entire project

---

### 2. SPEC.md

**Deep dive into requirements.**

- **Functional Requirements (FR-1 to FR-5)**
  - Branch name validation pattern
  - Pre-commit hook behavior
  - PR validation workflow
  - Reusable validation script
  - Documentation & setup

- **Non-Functional Requirements (NFR-1 to NFR-5)**
  - Performance (<100ms hook, <30s workflow)
  - User experience (clear error messages)
  - Maintainability (single source of truth for pattern)
  - Security (no secret leaks, privacy)
  - Compatibility (macOS, Linux, Windows)

- **Design Decisions (5 key decisions)**
  - Why two-layer enforcement?
  - Why optional hook setup?
  - Why regex-based pattern?
  - Why PR trigger?
  - Why exempt release/hotfix?

- **Acceptance Criteria (12 criteria)**
- **Testing Strategy** (unit, integration, manual)
- **Success Metrics** (adoption, violation rate, setup time)

**Read this if:** You want to understand what the system does and why

---

### 3. RFC.md

**Design decisions & trade-offs.**

- **Problem Statement** — Why are naming violations happening?
- **Proposed Solution** — Two-layer approach explained
- **Design Trade-Offs** (3 major decisions)
  - Pre-commit only vs workflow only vs both
  - Hook auto-install vs optional vs documented
  - Validation pattern flexibility
- **Technical Approach** — Code structure (4 components)
- **Implementation Phases** (4 phases, timeline)
- **Success Criteria** (5 metrics)
- **Open Questions** (5 Q&A)
- **Risks & Mitigations** (5 risks with mitigation strategies)
- **Alternative Approaches** (3 rejected alternatives with rationale)

**Read this if:** You want to understand design decisions and why alternatives were rejected

---

### 4. PLANNING.md

**Execution roadmap & task breakdown.**

- **Project Phases (6 phases)**
  - Phase 1: Specification & Planning ✅
  - Phase 2: Validation Script (2 components, 5 hours)
  - Phase 3: Pre-Commit Hook (2 components, 7 hours)
  - Phase 4: GitHub Actions Workflow (2 components, 5 hours)
  - Phase 5: Documentation (3 components, 4.5 hours)
  - Phase 6: Rollout & Monitoring (3 components, 4 hours/week)

- **Detailed breakdown per phase**
  - Components & deliverables
  - Acceptance criteria
  - Estimated effort
  - Dependencies

- **GitHub Issues** (7 issues created)
- **Timeline** (2026-08-11 to 2026-08-21)
- **Risk Management** (4 risks with mitigations)
- **Success Criteria** (5 project-level criteria)
- **Dependencies & Resources**

**Read this if:** You're assigned to work on a phase and need detailed task breakdown

---

### 5. ISSUES_CHECKLIST.md

**GitHub issues & their relationships.**

- **Issue Roadmap** (7 issues listed with details)
  - [#1755](https://github.com/lightspeedwp/.github/issues/1755) — Initiative Epic
  - [#1756](https://github.com/lightspeedwp/.github/issues/1756) — Validation Script
  - [#1757](https://github.com/lightspeedwp/.github/issues/1757) — Unit Tests
  - [#1758](https://github.com/lightspeedwp/.github/issues/1758) — Pre-Commit Hook
  - [#1759](https://github.com/lightspeedwp/.github/issues/1759) — Setup & Testing
  - [#1760](https://github.com/lightspeedwp/.github/issues/1760) — Workflow
  - [#1761](https://github.com/lightspeedwp/.github/issues/1761) — Documentation
  - [#1762](https://github.com/lightspeedwp/.github/issues/1762) — Rollout

- **Dependency Graph** (ASCII diagram showing order)
- **Progress Tracking** (table with status & effort)
- **Critical Path** (sequence of must-do issues)
- **Interlinking & Cross-References**
- **How to Use This Document** (daily work, project updates, dependencies)

**Read this if:** You need to track progress or find your assigned issue in GitHub

---

## How Documents Relate

```
README.md (Overview)
    ↓
SPEC.md (What & Why)
    ↓
RFC.md (How & Trade-Offs)
    ↓
PLANNING.md (Execution Plan)
    ↓
ISSUES_CHECKLIST.md (GitHub Issues)
    ↓
    → [GitHub Issues #1755–#1762]
```

**Reading Path:**

1. **Manager/Overview:** README.md → PLANNING.md (timeline/effort)
2. **Designer/Architect:** SPEC.md → RFC.md (design decisions)
3. **Developer:** PLANNING.md → ISSUES_CHECKLIST.md → GitHub issues
4. **QA/Testing:** SPEC.md (acceptance criteria) → PLANNING.md (testing strategy)

---

## Key Stats

| Metric | Value |
| --- | --- |
| **Total Issues** | 7 (1 epic + 6 implementation) |
| **Total Effort** | ~30 hours |
| **Timeline** | 2026-08-12 to 2026-08-14 (main) + ongoing monitoring |
| **Phases** | 6 (1 complete, 5 to go) |
| **Deliverables** | 8 (script, hook, workflow, tests, docs, setup) |
| **Success Metrics** | 5 (adoption, violation rate, performance, UX, satisfaction) |

---

## File Structure

```
.github/projects/active/branch-naming-enforcement-2026-08-11/
├── README.md                    # Project overview
├── SPEC.md                      # Requirements & design
├── RFC.md                       # Technical approach
├── PLANNING.md                  # Execution plan
├── ISSUES_CHECKLIST.md          # GitHub issues tracker
└── INDEX.md                     # This file (navigation guide)
```

### Implementation Files (To Be Created)

These files will be created during Phase 2–4:

```
.github/
├── hooks/
│   └── pre-commit               # Phase 3.1
├── scripts/
│   └── validation/
│       ├── validate-branch-name.cjs          # Phase 2.1
│       └── __tests__/
│           └── validate-branch-name.test.js  # Phase 2.2
└── workflows/
    └── branch-name-validation.yml            # Phase 4.1

docs/
└── SETUP_BRANCH_VALIDATION.md   # Phase 5.1

(Updated in Phase 5.2)
docs/
└── BRANCHING_STRATEGY.md        # (add enforcement section)

package.json                      # (add setup:hooks command in Phase 3.2)
```

---

## Status & Progress

### Phase 1: ✅ Complete (2026-08-11)

- ✅ Specification written (SPEC.md)
- ✅ RFC completed (RFC.md)
- ✅ Planning finalized (PLANNING.md)
- ✅ GitHub issues created & linked (ISSUES_CHECKLIST.md)
- ✅ Project structure established

### Phase 2: ⏳ Ready (2026-08-12)

- Next: Create validation script (#1756)
- Write unit tests (#1757)

### Phase 3: ⏳ Ready (2026-08-12)

- Next: Create pre-commit hook (#1758)
- Setup command & testing (#1759)

### Phase 4: ⏳ Ready (2026-08-13)

- Next: Create GitHub Actions workflow (#1760)

### Phase 5: ⏳ Ready (2026-08-13)

- Next: Write documentation (#1761)

### Phase 6: ⏳ Ready (2026-08-14+)

- Next: Team rollout & monitoring (#1762)

---

## Getting Started

### For Project Managers

1. Read [README.md](./README.md) for overview
2. Review [PLANNING.md](./PLANNING.md) for timeline & effort
3. Check [ISSUES_CHECKLIST.md](./ISSUES_CHECKLIST.md) for issue list

### For Architects/Designers

1. Read [SPEC.md](./SPEC.md) for requirements
2. Review [RFC.md](./RFC.md) for design decisions
3. Check trade-offs and open questions

### For Developers

1. Review [PLANNING.md](./PLANNING.md) for your phase
2. Find your issue in [ISSUES_CHECKLIST.md](./ISSUES_CHECKLIST.md)
3. Click the GitHub issue link to get started
4. Follow acceptance criteria from [SPEC.md](./SPEC.md)

### For QA/Testing

1. Review [SPEC.md](./SPEC.md) for acceptance criteria
2. Check [PLANNING.md](./PLANNING.md) for testing strategy
3. Find your test issue in [ISSUES_CHECKLIST.md](./ISSUES_CHECKLIST.md)

---

## Support & Questions

### Questions About

**...what to build?**
→ Read [SPEC.md](./SPEC.md) (functional requirements section)

**...why design this way?**
→ Read [RFC.md](./RFC.md) (design decisions & trade-offs)

**...when to work on it?**
→ Read [PLANNING.md](./PLANNING.md) (timeline & phases)

**...which GitHub issue is mine?**
→ Check [ISSUES_CHECKLIST.md](./ISSUES_CHECKLIST.md) (progress tracking table)

**...how do I know if I'm done?**
→ Check the GitHub issue (acceptance criteria) or [SPEC.md](./SPEC.md) (acceptance criteria section)

---

## Related Links

- **Parent Epic:** [#1755 - Branch Naming Enforcement Workflow](https://github.com/lightspeedwp/.github/issues/1755)
- **Authoritative Source:** [docs/BRANCHING_STRATEGY.md](../../../docs/BRANCHING_STRATEGY.md)
- **Existing Script:** `npm run validate:branch-name`
- **Model Workflow:** [.github/workflows/main-branch-guard.yml](../.github/workflows/main-branch-guard.yml)
- **PR Templates:** [.github/PULL_REQUEST_TEMPLATE/config.yml](../.github/PULL_REQUEST_TEMPLATE/config.yml)

---

## Document Maintenance

**Owner:** Ash Shaw  
**Last Updated:** 2026-08-11  
**Next Review:** After Phase 2 (2026-08-12)  
**Frequency:** Update after each phase completion

**Update Schedule:**

- After Phase 2: Update progress in ISSUES_CHECKLIST.md
- After Phase 3: Update progress & blockers
- After Phase 4: Update progress & any design changes
- After Phase 5: Update with docs links
- After Phase 6: Final project completion report

---

**Ready to start? Pick a document above and dive in!**
