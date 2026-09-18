# Index — Issue & PR Template Improvements Project

**Navigation Guide for Project Documentation**

---

## Quick Start

**New to this project?** Start here:

1. Read [`README.md`](./README.md) — Project overview and critical issues found
2. Review [`SPEC.md`](./SPEC.md) — Detailed findings for each issue
3. Check [`PLANNING.md`](./PLANNING.md) — Implementation roadmap with 5 phases
4. See [`ISSUES_CHECKLIST.md`](./ISSUES_CHECKLIST.md) — GitHub issues to create
5. Track progress in [`STATUS_TRACKING.md`](./STATUS_TRACKING.md)

---

## Project Files

### Core Documentation

| File | Purpose | When to Read |
|------|---------|--------------|
| **README.md** | Project overview, critical issues, success criteria | First thing — understand scope |
| **SPEC.md** | Detailed findings from template audit | Understand what's broken |
| **PLANNING.md** | 5-phase implementation plan with tasks & approval gates | Before starting work |
| **INDEX.md** | This file — navigation guide | Finding your way around |

### Execution & Tracking

| File | Purpose | When to Read |
|------|---------|--------------|
| **ISSUES_CHECKLIST.md** | List of GitHub issues to create (5 Task issues) | Before creating issues |
| **STATUS_TRACKING.md** | Real-time progress tracking across all phases | During/after work |
| **OPENSPEC.yml** | OpenSpec configuration for auto-generating issues | Reference only |

### Reference & Analysis

| File | Purpose | When to Read |
|------|---------|--------------|
| **Template Review Artifact** | Interactive analysis with tabs and tables | Deep dive into findings |
| **CLAUDE.md** | Project-wide instructions (parent repo) | Understanding branch naming rules |
| **.github/issue-types.yml** | Canonical issue type config (parent repo) | Understanding org-wide issue types |
| **.github/labels.yml** | Canonical label config (parent repo) | Understanding valid labels |

---

## Documentation Map by Role

### Project Manager / Lead
1. [`README.md`](./README.md) — Overview of issues and scope
2. [`PLANNING.md`](./PLANNING.md) — Timeline and phases
3. [`STATUS_TRACKING.md`](./STATUS_TRACKING.md) — Progress tracking
4. [`ISSUES_CHECKLIST.md`](./ISSUES_CHECKLIST.md) — Issues to create

### Developer / Implementer
1. [`PLANNING.md`](./PLANNING.md) — Which phase am I on?
2. [`SPEC.md`](./SPEC.md) — What exactly needs to be fixed?
3. [`ISSUES_CHECKLIST.md`](./ISSUES_CHECKLIST.md) — Acceptance criteria
4. Phase-specific checklist in [`PLANNING.md`](./PLANNING.md)

### Code Reviewer
1. [`SPEC.md`](./SPEC.md) — What changed and why?
2. [`PLANNING.md`](./PLANNING.md) — Was it done according to plan?
3. Phase-specific success criteria
4. Related GitHub issue for acceptance criteria

### AI Agent / Automation
1. [`ISSUES_CHECKLIST.md`](./ISSUES_CHECKLIST.md) — Issue templates to create
2. [`OPENSPEC.yml`](./OPENSPEC.yml) — Issue generation config
3. Phase-specific task descriptions
4. Success criteria per phase

---

## Key Information at a Glance

### Critical Issues Found (5)

| # | Issue | Files Affected | Severity | Fix |
|---|-------|-----------------|----------|-----|
| 1 | Duplicate templates | 17 files | Critical | Delete duplicates |
| 2 | Invalid YAML | 9+ templates | High | Quote label strings |
| 3 | Wrong title patterns | 9 PR templates | High | Update to branch format |
| 4 | Inconsistent frontmatter | 20+ templates | Medium | Standardize format |
| 5 | Misaligned templates | Multiple | Medium | Update descriptions |

### 5-Phase Implementation Plan

| Phase | Duration | Tasks | Status |
|-------|----------|-------|--------|
| **Phase 1** | 30 min | Delete 17 duplicates, renumber templates | — |
| **Phase 2** | 30 min | Standardize frontmatter, fix YAML | — |
| **Phase 3** | 15 min | Fix PR title patterns | — |
| **Phase 4** | 20 min | Schema validation, testing | — |
| **Phase 5** | 20 min | Create skill, update docs | — |
| **TOTAL** | **~2 hrs** | | |

### Success Criteria Checklist

- ✅ All 25 issue templates exist, no duplicates
- ✅ All templates conform to frontmatter schema
- ✅ PR template title patterns match branch naming
- ✅ All labels are prefixed and valid
- ✅ Issue Type Allocator skill created
- ✅ All GitHub issues linked and cross-referenced
- ✅ Documentation updated

---

## Related Project Resources

### In This Repository

- **Branch naming rules:** `CLAUDE.md` (Section: Branch Naming)
- **Issue type definitions:** `.github/issue-types.yml` + GitHub organization settings
- **Label inventory:** `.github/labels.yml`
- **Issue templates:** `.github/ISSUE_TEMPLATE/*.md` (25 files)
- **PR templates:** `.github/PULL_REQUEST_TEMPLATE/*.md` (9 files)
- **Frontmatter schema:** `.schemas/frontmatter.schema.json`

### Related Projects

- **Changelog Automation:** `.github/projects/active/changelog-automation-hardening/`
- **Branch Naming Enforcement:** `.github/projects/active/branch-naming-enforcement-2026-08-11/`
- **Label Management:** `.github/projects/active/label-prefix-audit-2026-08-05/`
- **Automation Governance:** `.github/projects/active/ai-governance-audit-implementation/`

### External References

- **GitHub Issue Types:** https://github.com/organizations/lightspeedwp/settings/issue-types
- **GitHub Labels:** https://github.com/lightspeedwp/.github/labels
- **Template Analysis:** https://claude.ai/code/artifact/bdda3d82-0c82-4f26-85c2-f222b1693ce0

---

## Workflow Guide

### Starting Phase 1
1. Read [`PLANNING.md#phase-1`](./PLANNING.md#phase-1)
2. Review deletion checklist
3. Execute deletions
4. Commit changes

### Between Phases
1. Review STATUS_TRACKING.md progress
2. Check phase approval gate requirements
3. Address any blockers
4. Update status tracking

### Completing Each Phase
1. Verify success criteria met
2. Update STATUS_TRACKING.md
3. Commit changes to develop
4. Ready for next phase

### After All Phases
1. Create GitHub issues from ISSUES_CHECKLIST.md
2. Link issues to project
3. Update final status
4. Close project when done

---

## Finding Information

### "I need to understand the project scope"
→ Start with [`README.md`](./README.md)

### "I need to see what's broken"
→ Read [`SPEC.md`](./SPEC.md)

### "I need to know what to do next"
→ Check [`PLANNING.md`](./PLANNING.md)

### "I need to see what's been done"
→ Look at [`STATUS_TRACKING.md`](./STATUS_TRACKING.md)

### "I need to create GitHub issues"
→ Use [`ISSUES_CHECKLIST.md`](./ISSUES_CHECKLIST.md)

### "I need to know if something is ready"
→ Check phase-specific success criteria in [`PLANNING.md`](./PLANNING.md)

### "I need the full technical analysis"
→ View the artifact: https://claude.ai/code/artifact/bdda3d82-0c82-4f26-85c2-f222b1693ce0

---

## Questions & Answers

**Q: Which file should I read first?**  
A: [`README.md`](./README.md) — gives you the full picture

**Q: Where's the implementation plan?**  
A: [`PLANNING.md`](./PLANNING.md) — detailed phases with tasks and approval gates

**Q: How do I know what to work on?**  
A: Go to [`PLANNING.md`](./PLANNING.md), find your phase, follow the checklist

**Q: How do I track progress?**  
A: Update [`STATUS_TRACKING.md`](./STATUS_TRACKING.md) as you complete phases

**Q: Where are the GitHub issues?**  
A: Defined in [`ISSUES_CHECKLIST.md`](./ISSUES_CHECKLIST.md) — ready to create

**Q: What's the success criteria?**  
A: See checklists in [`PLANNING.md`](./PLANNING.md) and [`README.md`](./README.md)

---

## Document Versions

| File | Last Updated | Status |
|------|--------------|--------|
| README.md | 2026-09-04 | Initial |
| SPEC.md | 2026-09-04 | Initial |
| PLANNING.md | 2026-09-04 | Initial |
| INDEX.md | 2026-09-04 | Initial |
| ISSUES_CHECKLIST.md | 2026-09-04 | Initial |
| STATUS_TRACKING.md | 2026-09-04 | Initial |
| OPENSPEC.yml | 2026-09-04 | Initial |

---

## Quick Links

- **GitHub Organization Issue Types:** https://github.com/organizations/lightspeedwp/settings/issue-types
- **GitHub Repository Labels:** https://github.com/lightspeedwp/.github/labels
- **Template Analysis Artifact:** https://claude.ai/code/artifact/bdda3d82-0c82-4f26-85c2-f222b1693ce0
- **CLAUDE.md (Parent Project):** `./CLAUDE.md`
- **Active Projects Folder:** `./.github/projects/active/`

---

**Last Updated:** 2026-09-04  
**Project Status:** Active — Awaiting Phase 1 Execution
