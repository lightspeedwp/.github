---
title: Release Process Redesign — Complete Project Index
description: Navigation guide for all project documents, issues, and artifacts
---

# Release Process Redesign — Complete Project Index

**Project:** Release Process V2 & Multi-Repo Support  
**Owner:** Ash Shaw  
**Status:** Phase 1 & 2 COMPLETE — Implementation In Progress  
**Created:** 2026-08-05  
**Last Updated:** 2026-08-07

---

## 📋 Quick Navigation

### Start Here

1. **[RFC_RELEASE_PROCESS_V2.md](./RFC_RELEASE_PROCESS_V2.md)** — High-level proposal & decision framework
2. **[AUDIT_REPORT.md](./AUDIT_REPORT.md)** — Complete findings (3 critical, 7 major, 5 medium issues)
3. **[QUESTIONNAIRE_PREPOPULATED.md](./QUESTIONNAIRE_PREPOPULATED.md)** — 50 questions with recommended answers

### Planning & Design

1. **[EPIC_PARENT_ISSUE.md](./EPIC_PARENT_ISSUE.md)** — Epic issue template with success criteria
2. **[CHILD_ISSUES_TEMPLATES.md](./CHILD_ISSUES_TEMPLATES.md)** — Templates for 47 child issues
3. **[MULTI_REPO_AGENT_STRATEGY.md](./MULTI_REPO_AGENT_STRATEGY.md)** — Portable agent architecture

### Reference & Setup

1. **[QUESTIONNAIRE_ANSWERING_GUIDE.md](./QUESTIONNAIRE_ANSWERING_GUIDE.md)** — How to fill questionnaire
2. **[OPENSPEC_SETUP.md](./OPENSPEC_SETUP.md)** — OpenSpec analysis instructions
3. **[ADDITIONAL_DOCS_AUDIT.md](./ADDITIONAL_DOCS_AUDIT.md)** — Audit of supporting docs

### This File

1. **[PROJECT_INDEX.md](./PROJECT_INDEX.md)** — Navigation guide (you are here)

---

## 📊 Document Organization by Purpose

### Problem Statement & Analysis

```
RFC_RELEASE_PROCESS_V2.md
  └─ Proposes solution architecture
AUDIT_REPORT.md
  └─ Documents 15 issues found
ADDITIONAL_DOCS_AUDIT.md
  └─ Identifies doc inconsistencies
```

### Design & Planning

```
QUESTIONNAIRE_PREPOPULATED.md
  └─ 50 questions with recommended answers
QUESTIONNAIRE_ANSWERING_GUIDE.md
  └─ Explains answers & tradeoffs
MULTI_REPO_AGENT_STRATEGY.md
  └─ Architecture for portable agents
```

### Issue Tracking & Implementation

```
EPIC_PARENT_ISSUE.md
  └─ Epic issue (creates 47 child issues)
CHILD_ISSUES_TEMPLATES.md
  └─ Templates for GitHub issues
```

### How to Execute

```
OPENSPEC_SETUP.md
  └─ Steps for OpenSpec analysis
```

---

## 🎯 Next Steps (In Order)

### Step 1: Review Proposal (You)

**Time:** 30 minutes

1. Read [RFC_RELEASE_PROCESS_V2.md](./RFC_RELEASE_PROCESS_V2.md) (15 min)
   - Do you agree with proposed architecture?
   - Do key decisions align with your intent?
2. Skim [AUDIT_REPORT.md](./AUDIT_REPORT.md) summary (10 min)
   - Understand scope of issues
3. Review [QUESTIONNAIRE_PREPOPULATED.md](./QUESTIONNAIRE_PREPOPULATED.md) answers (5 min)
   - Quick check that answers look reasonable

### Step 2: Finalize Questionnaire (You)

**Time:** 20-60 minutes (depending on thoroughness)

1. Review [QUESTIONNAIRE_ANSWERING_GUIDE.md](./QUESTIONNAIRE_ANSWERING_GUIDE.md) if needed (15-30 min)
2. Modify any answers in [QUESTIONNAIRE_PREPOPULATED.md](./QUESTIONNAIRE_PREPOPULATED.md) that don't match your needs (10-30 min)
3. Approve questionnaire: "Ready for OpenSpec analysis"

### Step 3: Run OpenSpec Analysis (Automated)

**Time:** 2-3 hours (no action needed from you)

1. Questionnaire → OpenSpec analysis
2. Generates:
   - requirements.md (formal specification)
   - decision-matrix.md (dependencies & tradeoffs)
   - architecture-spec.md (detailed design)
   - implementation-plan.md (prioritized tasks)
   - flow-diagrams.md (Mermaid diagrams)

### Step 4: Review Design (You)

**Time:** 30-60 minutes

1. Review OpenSpec-generated requirements.md
2. Check architecture-spec.md for sanity
3. Review implementation-plan.md for timeline estimate
4. Approve or request changes

### Step 5: Create GitHub Issues

**Time:** 2-3 hours (me)

1. Create epic issue from [EPIC_PARENT_ISSUE.md](./EPIC_PARENT_ISSUE.md)
2. Create 47 child issues from [CHILD_ISSUES_TEMPLATES.md](./CHILD_ISSUES_TEMPLATES.md)
3. Organize by phase: critical → major → design → implementation → testing
4. Link to design specs

### Step 6: Begin Implementation

**Time:** 18-23 days total

1. Phase 1: Critical fixes (CHILD-001 to CHILD-003)
2. Phase 2: Major issues (CHILD-004 to CHILD-010)
3. Phase 3: Design (CHILD-011 to CHILD-017)
4. Phase 4: Implementation (CHILD-020 to CHILD-032)
5. Phase 5: Testing (CHILD-040 to CHILD-047)

---

## 📑 File Descriptions

### RFC_RELEASE_PROCESS_V2.md

**Purpose:** High-level Request for Comments  
**For:** Stakeholders, team feedback  
**Content:**

- Problem statement (current state vs desired)
- Proposed solution architecture (portable agents)
- Key design decisions (develop-first, multi-repo, authorization)
- Success metrics
- Timeline & risks
- Open questions
- Next steps

**When to read:** First — understand the proposal

---

### AUDIT_REPORT.md

**Purpose:** Complete audit findings (15 issues)  
**For:** Understanding scope & impact  
**Content:**

- Executive summary
- 3 critical issues (blocking release)
- 7 major process flow problems
- 5 documentation inconsistencies
- Action items for each issue
- Implementation complexity assessment
- References to questionnaire answers

**When to read:** Second — understand problems being solved

---

### QUESTIONNAIRE_PREPOPULATED.md

**Purpose:** 50 questions with recommended answers  
**For:** Documenting design decisions  
**Content:**

- All 50 questions (7 categories)
- Recommended best-practice answers
- Rationale for each answer
- WordPress-aware context
- 4 optional context questions (Q-A through Q-D)

**When to read:** To finalize design before OpenSpec  
**Action:** Modify answers if needed, then approve

---

### QUESTIONNAIRE_ANSWERING_GUIDE.md

**Purpose:** Explains tradeoffs & how to answer  
**For:** Understanding each question  
**Content:**

- "What it's asking" for each question
- Suggested answers with pros/cons
- Tradeoff examples
- Recommended approach
- Timeline estimates
- Resource needs

**When to read:** If you want to understand questionnaire answers in depth

---

### MULTI_REPO_AGENT_STRATEGY.md

**Purpose:** Technical architecture for portable agents  
**For:** Understanding implementation approach  
**Content:**

- Directory structure (agents/release/, agents/changelog/)
- How agent detects repo type (plugin vs theme vs control plane)
- Version file handling per repo type
- WordPress-specific utilities (plugin headers, style.css, etc.)
- Usage examples
- Testing strategy
- Migration path

**When to read:** To understand how portable agents will work

---

### EPIC_PARENT_ISSUE.md

**Purpose:** Epic issue template for GitHub  
**For:** Creating parent issue & tracking work  
**Content:**

- Epic title & description
- Critical/major/design/implementation/testing phases
- 47 child issue references
- Success criteria checklist
- Risk register
- Related documents

**When to use:** To create GitHub epic (after questionnaire approved)

---

### CHILD_ISSUES_TEMPLATES.md

**Purpose:** Templates for 47 child issues  
**For:** Creating individual GitHub issues  
**Content:**

- CHILD-001 to CHILD-003: Critical fixes
- CHILD-004 to CHILD-010: Major issues
- CHILD-011 to CHILD-017: Design phase
- CHILD-020 to CHILD-032: Implementation phase
- CHILD-040 to CHILD-047: Testing phase

**For each:** Summary, details, problem statement, solution, tasks, related issues

**When to use:** To create individual issues (after epic approved)

---

### OPENSPEC_SETUP.md

**Purpose:** Instructions for OpenSpec analysis  
**For:** Running automated analysis  
**Content:**

- Pre-analysis setup (questionnaire completion)
- How to trigger OpenSpec
- Configuration (.openspec.yml)
- Expected output files
- Analysis workflow
- Troubleshooting
- Next steps after analysis

**When to read:** Before triggering OpenSpec analysis

---

### ADDITIONAL_DOCS_AUDIT.md

**Purpose:** Audit of supporting documentation  
**For:** Identifying doc inconsistencies  
**Content:**

- Issues in ARCHITECTURE.md, AUTOMATION.md, etc.
- Alignment gaps between docs
- Badge validation results
- Recommendations for each doc

**When to read:** For context on broader doc issues

---

### PROJECT_INDEX.md

**Purpose:** This file — navigation guide  
**For:** Finding the right document  
**Content:** What you're reading now

---

## 🔄 Workflow: From Problem to Implementation

```
1. AUDIT_REPORT.md
   ↓ (understand problems)
2. RFC_RELEASE_PROCESS_V2.md
   ↓ (review proposed solution)
3. QUESTIONNAIRE_PREPOPULATED.md
   ↓ (finalize design decisions)
4. OPENSPEC_SETUP.md
   ↓ (trigger analysis)
5. OpenSpec Output (requirements.md, architecture-spec.md, etc.)
   ↓ (review design)
6. EPIC_PARENT_ISSUE.md + CHILD_ISSUES_TEMPLATES.md
   ↓ (create GitHub issues)
7. Implementation (follow task list from OpenSpec)
   ↓
8. Testing (CHILD-040 through CHILD-047)
   ↓
9. Production Release
```

---

## 📍 Current Status

**Phase:** Phase 1 & 2 COMPLETE — Phase 3 IN PROGRESS  
**Completed Work:** 9 issues fixed (CHILD-001 through CHILD-010)  
**Current Focus:** Phase 3 design & documentation  
**Next:** Phase 4 implementation & Phase 5 testing

### What's Done ✅

**Phase 1: Critical Fixes (CHILD-001 to CHILD-003)**

- [x] Authorization gating for release workflow (CHILD-001) — merged PR #1609
- [x] Implement develop-first release flow (CHILD-002) — merged PR #1609
- [x] Remove broken workflow badges (CHILD-003) — merged PR #1609

**Phase 2: Major Issues (CHILD-004 to CHILD-010)**

- [x] CHILD-004: Post-release sync automation — pushed to develop
- [x] CHILD-005: Changelog validation timing — pushed to develop
- [x] CHILD-006: Change dry-run default to false — pushed to develop
- [x] CHILD-007: Pre-release checklist enforcement — pushed to develop
- [x] CHILD-008: Rollback automation (rollback.cjs) — pushed to develop
- [x] CHILD-009: Trigger telemetry authorization — pushed to develop
- [x] CHILD-010: Release notes preview enhancement — pushed to develop

**Phase 3: Label Validation Enforcement (started)**

- [x] Phase 3 specification and implementation — merged PR #1613

**Documentation:**

- [x] Phase 2 implementation plan created
- [x] README updated with Phase 1 & 2 status
- [x] Issue tracking up-to-date

### What's Pending ⏳

- [ ] Phase 3: Complete design & documentation tasks
- [ ] Phase 4: Implementation validation & testing
- [ ] Phase 5: Full release cycle testing
- [ ] Documentation: Final RELEASE_PROCESS.md rewrite

---

## 👤 Roles & Responsibilities

| Role | Responsibility | Timeline |
|------|-----------------|----------|
| **You (Ash)** | Review RFC, approve questionnaire, review design | ~2 hours over 2 days |
| **Claude** | OpenSpec analysis, create issues, implement | 2-3 hours + 18-23 days |
| **Team** | Review & approve (optional), testing | TBD |

---

## 💾 Permanent Locations

All documents saved to:

```
.github/projects/active/release-process-redesign-2026-08-05/
├── AUDIT_REPORT.md ✅
├── RFC_RELEASE_PROCESS_V2.md ✅
├── QUESTIONNAIRE_PREPOPULATED.md ✅
├── QUESTIONNAIRE_ANSWERING_GUIDE.md ✅
├── MULTI_REPO_AGENT_STRATEGY.md ✅
├── EPIC_PARENT_ISSUE.md ✅
├── CHILD_ISSUES_TEMPLATES.md ✅
├── OPENSPEC_SETUP.md ✅
├── ADDITIONAL_DOCS_AUDIT.md ✅
├── README.md (original project overview)
└── PROJECT_INDEX.md (this file) ✅
```

**NOT in temp folder** ✅ — All permanently saved

---

## 🚀 How to Proceed

**Next Action (for you):**

1. **Read in this order:**
   1. This INDEX (you just did!)
   2. [RFC_RELEASE_PROCESS_V2.md](./RFC_RELEASE_PROCESS_V2.md) (15 min)
   3. [AUDIT_REPORT.md](./AUDIT_REPORT.md) summary (10 min)

2. **Decide:**
   - Do you agree with proposed architecture?
   - Should we proceed with questionnaire → OpenSpec?

3. **If yes:**
   - Message: "Approved, ready for OpenSpec"
   - I'll trigger analysis immediately

4. **If no/questions:**
   - Message questions/concerns
   - We'll refine proposal before proceeding

**Time commitment:** ~30 minutes from you, then wait 2-3 hours for OpenSpec.

---

*All documents created 2026-08-05 — Ready for your review.*
