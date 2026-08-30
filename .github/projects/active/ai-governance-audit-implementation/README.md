# AI Governance Audit Implementation — Active Project

**Status:** 🔄 In Progress (Phase 3)  
**Branch:** `feat/ai-governance-audit-implementation`  
**Milestone:** `v1.1`  
**Duration:** 3-4 weeks  
**Issues:** 11 (6 docs + 3 build/ci + 2 test)

---

## Project Overview

This project implements fixes for critical gaps in AI governance discovered in Phase 1-2 audit. The issue is that Claude and Copilot systematically ignore branch naming conventions, causing PR template assignment failures and forcing manual workarounds.

**Goal:** Zero manual workarounds. AI agents follow governance rules. All issues/PRs properly typed and titled.

---

## Documents in This Folder

| File | Purpose |
|------|---------|
| **KICKOFF.md** | Project overview, objectives, timeline |
| **PLANNING.md** | Detailed work breakdown, effort estimates, dependencies |
| **SPEC-issue-*.md** | OpenSpec documents for each GitHub issue |
| **README.md** | This file |

---

## Issues Created

All issues assigned to milestone `v1.1`:

### Week 1: Visibility + Fallback Routing (4 issues)
- [#2534](https://github.com/lightspeedwp/.github/issues/2534) — Move branch naming rules to top of CLAUDE.md
- [#2535](https://github.com/lightspeedwp/.github/issues/2535) — Add branch naming section to AGENTS.md
- [#2536](https://github.com/lightspeedwp/.github/issues/2536) — Add branch naming to custom-instructions.md
- [#2537](https://github.com/lightspeedwp/.github/issues/2537) — Update PR template routing config

### Week 2: Scripts & Workflows (6 issues)
- [#2538](https://github.com/lightspeedwp/.github/issues/2538) — Create PR template resolver GitHub Action
- [#2539](https://github.com/lightspeedwp/.github/issues/2539) — Create title normalization script
- [#2540](https://github.com/lightspeedwp/.github/issues/2540) — Add title normalization tests
- [#2541](https://github.com/lightspeedwp/.github/issues/2541) — Create title normalization workflow
- [#2542](https://github.com/lightspeedwp/.github/issues/2542) — Create PR-issue linking enforcement
- [#2543](https://github.com/lightspeedwp/.github/issues/2543) — Update PR templates

### Week 3: Testing & Documentation (2 issues)
- [#2544](https://github.com/lightspeedwp/.github/issues/2544) — Add branch validation tests
- [#2545](https://github.com/lightspeedwp/.github/issues/2545) — Create BRANCHING_STRATEGY.md
- [#2546](https://github.com/lightspeedwp/.github/issues/2546) — Run title normalization

---

## Getting Started

1. **Read the docs:**
   - Start with **KICKOFF.md** for overview
   - Then **PLANNING.md** for detailed work plan
   - Each issue has a corresponding SPEC-*.md file with complete details

2. **Check dependencies:**
   - See dependency graph in PLANNING.md
   - Critical path: Script → Tests → Real execution

3. **Assign issues:**
   - Issues are ready to assign
   - Labels already applied
   - Will need manual milestone assignment (v1.1)

4. **Track progress:**
   - Use GitHub project view to see issue status
   - Link issues to PRs as work is done
   - Update PLANNING.md as progress is made

---

## Related Audit Reports

**Phase 1-2 Audit (Complete):**  
- File: `/tmp/claude-0/-home-user--github/1dd12737-b8e3-5e97-ae4d-092880e59e1b/scratchpad/governance-audit-phase-1-2-report.md`
- Findings: Three-layer gap (visibility, clarity, platform conflict) + no fallback mechanism

**Audit Prompt (used to guide this work):**  
- File: `/tmp/claude-0/-home-user--github/1dd12737-b8e3-5e97-ae4d-092880e59e1b/scratchpad/GOVERNANCE_AUDIT_PROMPT.md`

---

## Success Criteria

- [ ] All 11 issues completed and merged
- [ ] Branch validation tests show 100% coverage
- [ ] Template routing fallback works for all 9 templates
- [ ] Title normalization runs without errors
- [ ] All issues/PRs have type-prefixed titles
- [ ] All PRs link to issues
- [ ] Zero manual workarounds
- [ ] Rules documented and portable for rollout

---

## Quick Links

- **Branch:** `feat/ai-governance-audit-implementation`
- **GitHub Issues:** #2534–#2546
- **Milestone:** v1.1
- **Audit Reports:** See /scratchpad folder

---

## Notes for Future Phases

**Phase 4 (Validation):**
- Comprehensive testing of all fixes
- Edge case handling
- Integration with existing workflows

**Phase 5 (Rollout):**
- Extend rules to WordPress block themes and plugins
- Create portable instructions and workflows
- Team onboarding and documentation

---

**Project Owner:** Ashley @ LightSpeed  
**Created:** 2026-08-30  
**Last Updated:** 2026-08-30
