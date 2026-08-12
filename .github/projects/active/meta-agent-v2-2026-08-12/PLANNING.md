---
title: Meta Agent v2.0 — Detailed Planning & Implementation Roadmap
description: >
  Step-by-step implementation plan for Meta Agent v2.0 with clear tasks,
  dependencies, and delivery timeline.
file_type: planning
category: project-planning
version: 1.0
status: active
author: Ash Shaw
date: '2026-08-12'
---

# Meta Agent v2.0 — Detailed Planning & Implementation Roadmap

## Executive Summary

This document provides a detailed implementation roadmap for Meta Agent v2.0 across five phases (Aug 12 – Sep 30+). Phase 1 (Design & Schemas) is complete. Phases 2–5 are planned with clear tasks, deliverables, and success criteria.

**Current Status:** Phase 1 ✅ Complete, Phase 2 ⏳ Ready to Start

## Phase 1: Design & Schemas ✅ COMPLETE

**Duration:** 2026-08-12 (1 day)  
**Status:** ✅ Complete, PR #1893 submitted  
**Effort:** 6 hours

### Tasks Completed

- [x] **T1.1:** Design Meta Agent v2.0 architecture
  - Auto-detection logic for 4 repo types
  - Context-specific metadata application
  - Schema selection algorithm
  - Deliverable: Detailed agent specification

- [x] **T1.2:** Create four frontmatter schemas
  - `block-plugin.frontmatter.schema.json` (required fields + plugin-specific)
  - `block-theme.frontmatter.schema.json` (required fields + theme-specific)
  - `control-plane.frontmatter.schema.json` (required fields + governance-specific)
  - `documentation.frontmatter.schema.json` (required fields + doc-specific)
  - Deliverable: 4 JSON Schema Draft 2020-12 files

- [x] **T1.3:** Improve Meta Agent documentation
  - Repo-type detection algorithm
  - Context-specific metadata application rules
  - Schema field reference
  - Troubleshooting guide
  - Deliverable: Comprehensive agent README

- [x] **T1.4:** Create schema reference documentation
  - Field definitions for each schema
  - Validation rules and patterns
  - Usage examples per repo type
  - Common validation errors + fixes
  - Deliverable: `schemas/README.md` (300+ lines)

- [x] **T1.5:** Create GitHub branch and commit
  - Branch: `feat/meta-agent-org-wide-schemas`
  - Commit: `ef146a842` (1,455 insertions)
  - PR: #1893 (submitted for review)

### Phase 1 Deliverables

✅ **`.github/agents/meta.agent.md`** (v2.0, 500+ lines)

- Repo-type detection logic
- Context-specific metadata application
- Badge and footer templates
- Configuration and usage guide
- Handoff to doc-validator agent

✅ **`schemas/block-plugin.frontmatter.schema.json`** (90 lines)

- Required: title, description, status, language
- Plugin-specific: block_name, block_supports, plugin_name, requires_wordpress, requires_php
- Validation: enum, pattern, minLength, maxLength
- Examples: User Input block

✅ **`schemas/block-theme.frontmatter.schema.json`** (95 lines)

- Required: title, description, status, language
- Theme-specific: theme_name, theme_slug, block_pattern_name, supported_features
- Validation: pattern matching for namespaced identifiers
- Examples: Hero block pattern

✅ **`schemas/control-plane.frontmatter.schema.json`** (115 lines)

- Required: title, description, file_type, category, status, language, owners
- Control-plane-specific: maintainer, permissions_required, audience, related_issues
- Archival fields: deprecation_date, successor, last_reviewed, next_review_date
- Examples: Contributing guidelines, instruction files

✅ **`schemas/documentation.frontmatter.schema.json`** (85 lines)

- Required: title, description, status, language
- Documentation-specific: category, difficulty, estimated_read_time, prerequisites
- Audit fields: last_reviewed, next_review_date
- Examples: Getting started tutorials, troubleshooting guides

✅ **`schemas/README.md`** (400+ lines)

- Schema overview and usage
- Field reference tables
- Validation rules and patterns
- Common errors and fixes
- Integration with Meta agent

### Phase 1 Sign-Off

- **PR Status:** #1893 submitted for review
- **Ready for Merge:** Yes, awaiting approval
- **Next Step:** Approve and merge to develop

---

## Phase 2: Validation & Testing

**Duration:** 2026-08-13–2026-08-15 (est. 3 days, 15 hours effort)  
**Status:** ⏳ Planned  
**Owner:** TBD  
**Slack:** #dev-meta-agent

### Phase 2 Overview

Build comprehensive test suite and CI/CD validation for all four schemas. Ensure schemas validate correctly and error messages are helpful.

### Tasks

- [ ] **T2.1:** Create schema validation test suite
  - **Subtask 2.1.1:** Block plugin schema tests (5 test cases)
    - Valid frontmatter with all fields
    - Valid with minimal fields (title, description, status, language)
    - Invalid: missing required field
    - Invalid: wrong enum value (status)
    - Invalid: wrong pattern (block_name not matching namespace/identifier)
    - Deliverable: `schemas/__tests__/block-plugin.schema.test.js`

  - **Subtask 2.1.2:** Block theme schema tests (5 test cases)
    - Valid frontmatter with all theme fields
    - Valid block pattern name
    - Invalid: theme_slug with uppercase (should fail pattern)
    - Invalid: missing required field
    - Invalid: block_pattern_name without namespace
    - Deliverable: `schemas/__tests__/block-theme.schema.test.js`

  - **Subtask 2.1.3:** Control-plane schema tests (5 test cases)
    - Valid with all fields
    - Valid with only required fields
    - Invalid: missing owners (required)
    - Invalid: invalid file_type enum
    - Invalid: invalid date format
    - Deliverable: `schemas/__tests__/control-plane.schema.test.js`

  - **Subtask 2.1.4:** Documentation schema tests (5 test cases)
    - Valid with all fields
    - Valid minimal (title, description, status, language)
    - Invalid: difficulty not in enum
    - Invalid: estimated_read_time > 120
    - Invalid: date format wrong (not YYYY-MM-DD)
    - Deliverable: `schemas/__tests__/documentation.schema.test.js`

  - **Estimated Effort:** 4 hours
  - **Dependencies:** Phase 1 (schemas created)
  - **Success Criteria:** ≥20 test cases, 100% pass rate, ≥90% coverage

- [ ] **T2.2:** Create sample frontmatter test cases
  - **Subtask 2.2.1:** Real-world block plugin examples
    - User input block, form validation block, data fetch block
    - Deliverable: `schemas/__tests__/fixtures/block-plugin-samples.yml`

  - **Subtask 2.2.2:** Real-world block theme examples
    - Hero pattern, call-to-action pattern, testimonials pattern
    - Deliverable: `schemas/__tests__/fixtures/block-theme-samples.yml`

  - **Subtask 2.2.3:** Real-world control-plane examples
    - Instruction file, governance file, workflow documentation
    - Deliverable: `schemas/__tests__/fixtures/control-plane-samples.yml`

  - **Subtask 2.2.4:** Real-world documentation examples
    - Getting started guide, API reference, troubleshooting guide
    - Deliverable: `schemas/__tests__/fixtures/documentation-samples.yml`

  - **Estimated Effort:** 3 hours
  - **Dependencies:** T2.1 (test structure created)
  - **Success Criteria:** ≥3 examples per schema, all examples valid

- [ ] **T2.3:** Build CI/CD validation workflow
  - **Subtask 2.3.1:** GitHub Action for schema validation
    - Validates all `.md` files changed in PR
    - Auto-detects repo type from markers
    - Runs schema validation
    - Reports errors inline
    - Deliverable: `.github/workflows/validate-frontmatter.yml`

  - **Subtask 2.3.2:** Pre-commit hook for local validation
    - Quick schema check before commit
    - Provides helpful error messages
    - Optional (can be skipped with `--no-verify`)
    - Deliverable: `.github/hooks/validate-frontmatter.sh`

  - **Subtask 2.3.3:** Documentation for running validation locally
    - NPM script: `npm run validate:frontmatter`
    - Manual command: `npx ajv validate -s schemas/...`
    - Troubleshooting common errors
    - Deliverable: `schemas/VALIDATION.md`

  - **Estimated Effort:** 5 hours
  - **Dependencies:** T2.1, T2.2 (tests exist)
  - **Success Criteria:** Workflow passes all tests, helpful error messages

- [ ] **T2.4:** Create error handling & messaging guide
  - Common validation errors and fixes
  - Helpful error message formatting
  - Recovery strategies
  - Deliverable: `schemas/ERROR_HANDLING.md`
  - **Estimated Effort:** 2 hours
  - **Dependencies:** T2.1, T2.2, T2.3
  - **Success Criteria:** Covers ≥10 common error scenarios

### Phase 2 Deliverables

- `schemas/__tests__/*.test.js` — 4 test suites (≥20 test cases total)
- `schemas/__tests__/fixtures/*.yml` — Sample frontmatter (≥12 samples)
- `.github/workflows/validate-frontmatter.yml` — CI/CD validation workflow
- `.github/hooks/validate-frontmatter.sh` — Pre-commit hook
- `schemas/VALIDATION.md` — Validation guide
- `schemas/ERROR_HANDLING.md` — Error handling & recovery guide

### Phase 2 Success Criteria

- ✅ All tests pass (100% pass rate)
- ✅ Test coverage ≥90%
- ✅ Validation workflow runs on all PRs
- ✅ Error messages are actionable and clear
- ✅ Documentation complete and examples work
- ✅ Zero critical issues blocking Phase 3

---

## Phase 3: Deployment & Distribution

**Duration:** 2026-08-16–2026-08-20 (est. 5 days, 20 hours effort)  
**Status:** ⏳ Planned  
**Owner:** TBD  

### Phase 3 Overview

Create deployment guide and tooling for organisation-wide distribution. Support three distribution models (single source, federated, auto-sync).

### Tasks

- [ ] **T3.1:** Create deployment guide
  - **Subtask 3.1.1:** Model 1 — Single Source (reference)
    - All repos reference .github repo version
    - Lowest maintenance burden
    - Requires network access to .github
    - Step-by-step setup guide
    - Deliverable: `DEPLOYMENT.md` section

  - **Subtask 3.1.2:** Model 2 — Federated (copy)
    - Each repo has its own copy
    - Manual updates required
    - No network dependencies
    - Step-by-step setup guide
    - Deliverable: `DEPLOYMENT.md` section

  - **Subtask 3.1.3:** Model 3 — Auto-Sync (hybrid)
    - GitHub Action syncs from .github repo
    - Automatic updates
    - Handles merge conflicts
    - Step-by-step setup guide
    - Deliverable: `DEPLOYMENT.md` section

  - **Estimated Effort:** 4 hours
  - **Dependencies:** Phase 1 & 2 complete
  - **Success Criteria:** All three models documented with clear examples

- [ ] **T3.2:** Create auto-sync GitHub Action
  - **Subtask 3.2.1:** Scheduled workflow (daily/weekly)
    - Pulls latest meta.agent.md from .github repo
    - Checks for differences
    - Creates PR if changes needed
    - Deliverable: `.github/workflows/meta-agent-sync.yml`

  - **Subtask 3.2.2:** Conflict resolution
    - Handles merge conflicts gracefully
    - Notifies team if conflict occurs
    - Provides manual resolution steps
    - Deliverable: workflow script section

  - **Subtask 3.2.3:** Sync status reporting
    - Logs sync attempts
    - Reports success/failure
    - Optional Slack notification
    - Deliverable: workflow reporting section

  - **Estimated Effort:** 6 hours
  - **Dependencies:** T3.1 (deployment guide created)
  - **Success Criteria:** Workflow tested in sandbox, syncs without breaking changes

- [ ] **T3.3:** Create organisation announcement
  - **Subtask 3.3.1:** Slack announcement
    - What's changing (Meta Agent v2.0)
    - Benefits (single agent, auto-detection, etc.)
    - How to use (quick start)
    - When deployed (timeline)
    - Deliverable: Slack message template

  - **Subtask 3.3.2:** Documentation link
    - Meta agent documentation URL
    - Schema reference link
    - Deployment guide link
    - FAQ link
    - Deliverable: Announcement document

  - **Subtask 3.3.3:** Getting started guide
    - Quick start for each repo type
    - Common tasks (validate, apply metadata)
    - Troubleshooting
    - Deliverable: `GETTING_STARTED.md`

  - **Estimated Effort:** 3 hours
  - **Dependencies:** T3.1, T3.2 (complete)
  - **Success Criteria:** Clear, actionable, links work

- [ ] **T3.4:** Update project documentation
  - Link Meta agent v2.0 from AGENTS.md
  - Add to agent registry
  - Update CLAUDE.md if needed
  - Deliverable: Documentation updates
  - **Estimated Effort:** 2 hours
  - **Dependencies:** All deliverables ready
  - **Success Criteria:** All links work, registry updated

### Phase 3 Deliverables

- `DEPLOYMENT.md` — Complete deployment guide (3 models)
- `.github/workflows/meta-agent-sync.yml` — Auto-sync workflow
- `GETTING_STARTED.md` — Quick-start guide
- Slack announcement template
- Updated AGENTS.md and documentation links

### Phase 3 Success Criteria

- ✅ Deployment guide covers all 3 distribution models
- ✅ Auto-sync workflow tested and working
- ✅ Team announcements ready
- ✅ Documentation complete and links verified
- ✅ Ready for Phase 4 pilot testing

---

## Phase 4: Real-World Testing & Refinement

**Duration:** 2026-08-21–2026-08-30 (est. 10 days, 25 hours effort)  
**Status:** ⏳ Planned  
**Owner:** TBD  

### Phase 4 Overview

Pilot test in 2–3 real repositories. Gather feedback, fix bugs, refine schemas based on real-world usage.

### Tasks

- [ ] **T4.1:** Select pilot repositories
  - **Subtask 4.1.1:** Choose 1 block plugin repo
    - Criteria: Active, good documentation, willing to participate
    - Candidate: lightspeedwp/wp-blocks (if available)
    - Owner contact: [TBD]
    - Deliverable: Pilot repo confirmation

  - **Subtask 4.1.2:** Choose 1 block theme repo
    - Criteria: Active, good documentation, willing to participate
    - Candidate: lightspeedwp/block-theme (if available)
    - Owner contact: [TBD]
    - Deliverable: Pilot repo confirmation

  - **Subtask 4.1.3:** Choose 1 control-plane repo
    - This repo (.github) is the pilot
    - Owner contact: Ash Shaw
    - Deliverable: Confirmation (automatic)

  - **Estimated Effort:** 2 hours
  - **Dependencies:** Phase 3 complete
  - **Success Criteria:** 3 repos selected, owners contacted, approval received

- [ ] **T4.2:** Deploy Meta agent to pilot repos
  - **Subtask 4.2.1:** Deploy to block plugin repo
    - Copy meta.agent.md or set up reference
    - Configure schemas location
    - Run validation on existing docs
    - Deliverable: Deployment confirmation + validation report

  - **Subtask 4.2.2:** Deploy to block theme repo
    - Copy meta.agent.md or set up reference
    - Configure schemas location
    - Run validation on existing docs
    - Deliverable: Deployment confirmation + validation report

  - **Subtask 4.2.3:** Deploy to .github repo
    - Already deployed with Phase 1
    - Test with real documentation files
    - Deliverable: Test results + feedback

  - **Estimated Effort:** 3 hours
  - **Dependencies:** T4.1 (repos selected), Phase 3 (deployment guide)
  - **Success Criteria:** Deployment successful, validation runs without errors

- [ ] **T4.3:** Run pilot testing & gather feedback
  - **Subtask 4.3.1:** Block plugin team testing
    - Apply Meta agent to existing docs
    - Gather feedback on schema fields
    - Note missing fields or validation errors
    - Deliverable: Feedback report (T4.3.1-feedback.md)

  - **Subtask 4.3.2:** Block theme team testing
    - Apply Meta agent to existing docs
    - Gather feedback on schema fields
    - Note missing fields or validation errors
    - Deliverable: Feedback report (T4.3.2-feedback.md)

  - **Subtask 4.3.3:** .github team testing
    - Apply Meta agent to control-plane docs
    - Gather feedback on schema fields
    - Note missing fields or validation errors
    - Deliverable: Feedback report (T4.3.3-feedback.md)

  - **Subtask 4.3.4:** Centralised feedback analysis
    - Aggregate feedback from all repos
    - Identify common themes
    - Prioritise refinements
    - Deliverable: Summary report + priority list

  - **Estimated Effort:** 8 hours
  - **Dependencies:** T4.2 (deployed)
  - **Success Criteria:** Feedback collected, documented, prioritised

- [ ] **T4.4:** Refine schemas based on feedback
  - **Subtask 4.4.1:** Add missing fields
    - Based on priority list from T4.3.4
    - Update all affected schemas
    - Validate examples still work
    - Deliverable: Updated schemas + changelog

  - **Subtask 4.4.2:** Improve validation rules
    - Relax overly strict rules
    - Add clearer error messages
    - Validate no regressions
    - Deliverable: Updated schemas + test updates

  - **Subtask 4.4.3:** Update documentation
    - Add new fields to schema reference
    - Update examples if needed
    - Document migration path (if breaking)
    - Deliverable: Updated `schemas/README.md`

  - **Estimated Effort:** 6 hours
  - **Dependencies:** T4.3 (feedback received)
  - **Success Criteria:** All feedback addressed, tests pass, no regressions

- [ ] **T4.5:** Bug fixes & polishing
  - **Subtask 4.5.1:** Fix reported bugs
    - Schema validation errors
    - Error message clarity
    - Documentation accuracy
    - Deliverable: Bug fixes + test updates

  - **Subtask 4.5.2:** Performance optimisation
    - Test validation speed with large files
    - Optimise if needed
    - Deliverable: Performance report

  - **Subtask 4.5.3:** Final documentation polish
    - Improve examples
    - Clarify edge cases
    - Add troubleshooting tips
    - Deliverable: Final documentation

  - **Estimated Effort:** 6 hours
  - **Dependencies:** T4.3, T4.4 (feedback processed)
  - **Success Criteria:** All critical bugs fixed, documentation polished

### Phase 4 Deliverables

- Pilot testing reports (3 repos)
- Feedback analysis & priority list
- Updated schemas with new fields
- Updated tests (if validation rules changed)
- Updated documentation
- Bug fix reports

### Phase 4 Success Criteria

- ✅ Pilot testing completed on 3 repos
- ✅ Feedback collected and analysed
- ✅ Schemas refined based on real-world usage
- ✅ All critical bugs fixed
- ✅ Documentation updated and tested
- ✅ Zero showstoppers blocking Phase 5

---

## Phase 5: Organisation-Wide Rollout

**Duration:** 2026-09-01 onwards (ongoing)  
**Status:** 🔵 Future  
**Owner:** TBD  

### Phase 5 Overview

Deploy Meta Agent v2.0 organisation-wide across all WordPress repos. Monitor adoption and gather metrics.

### Tasks

- [ ] **T5.1:** Deploy to all WordPress repos
  - Identify all WordPress repos in organisation
  - Deploy using Model 2 (Federated) or Model 3 (Auto-Sync)
  - Verify deployment successful
  - Deliverable: Deployment checklist (all repos)

- [ ] **T5.2:** Team training & onboarding
  - Slack training session
  - Documentation walkthroughs
  - Q&A session
  - Deliverable: Training materials

- [ ] **T5.3:** Monitor adoption & feedback
  - Track schema validation adoption
  - Gather team feedback (surveys)
  - Monitor error reports
  - Deliverable: Adoption metrics + feedback report

- [ ] **T5.4:** Continuous improvement
  - Regular schema updates based on feedback
  - Community feedback incorporation
  - Documentation improvements
  - Deliverable: Ongoing updates

### Phase 5 Success Criteria

- ✅ ≥80% of WordPress repos deployed by 2026-09-30
- ✅ All new PRs pass frontmatter validation
- ✅ Team satisfaction ≥8/10
- ✅ ≤1 critical bug per month

---

## Dependencies & Critical Path

```
Phase 1 (Design)          [████] ✅ Complete
  ↓
Phase 2 (Testing)         [    ] ⏳ Blocked on Phase 1 merge
  ↓
Phase 3 (Deployment)      [    ] ⏳ Depends on Phase 2 complete
  ↓
Phase 4 (Real-world test) [    ] ⏳ Depends on Phase 3 complete
  ↓
Phase 5 (Rollout)         [    ] 🔵 Depends on Phase 4 complete
```

**Critical Path:** Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5

**Blockers:**

- Phase 1 PR (#1893) must be approved & merged before Phase 2 starts
- Phase 2 must have zero critical bugs before Phase 3 starts
- Phase 4 pilot feedback must be incorporated before Phase 5 starts

---

## Resource Allocation

| Phase | Owner | Effort | Duration | Start | End |
|-------|-------|--------|----------|-------|-----|
| Phase 1 | Ash Shaw | 6h | 1 day | Aug 12 | Aug 12 ✅ |
| Phase 2 | TBD | 15h | 3 days | Aug 13 | Aug 15 |
| Phase 3 | TBD | 20h | 5 days | Aug 16 | Aug 20 |
| Phase 4 | TBD | 25h | 10 days | Aug 21 | Aug 30 |
| Phase 5 | TBD | ∞ | Ongoing | Sep 1 | — |

**Total Effort (Phases 1–4):** 66 hours (≈8 days)

---

## Acceptance Criteria (Overall)

- ✅ Single Meta agent works across all repo types
- ✅ Auto-detection requires zero configuration
- ✅ Four comprehensive, tested schemas
- ✅ CI/CD validation on every PR
- ✅ Documentation complete and accurate
- ✅ ≥80% team adoption by Sep 30
- ✅ ≤1 critical bug per month in production

---

## References

- [README.md](./README.md) — Project overview
- [Meta Agent v2.0](./.github/agents/meta.agent.md)
- [Schema Reference](./schemas/README.md)
- [PR #1893](https://github.com/lightspeedwp/.github/pull/1893)

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
