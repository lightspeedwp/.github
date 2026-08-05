---
file_type: markdown
title: "RFC: Release Process V2 — Multi-Repo Support & Governance"
description: "Request for Comments on release process redesign covering control plane, WordPress plugins, and themes"
status: draft
version: "1.0"
last_updated: "2026-08-05"
owners: ["Ash Shaw"]
tags: ["rfc", "release", "multi-repo", "automation"]
stability: stable
---

# RFC: Release Process V2 — Multi-Repo Support & Governance

**Request for Comments (RFC) Document**

This RFC proposes a complete redesign of the release process to address critical issues, support multi-repo deployments, and establish clear governance.

**Stage:** Requirements Definition (awaiting questionnaire answers & OpenSpec analysis)

---

## Problem Statement

### Current State

The LightSpeedWP organization has:

1. **Control Plane** (.github repo) — Central governance, workflows, documentation
2. **WordPress Plugins** — Block plugins with Version headers, readme.txt, package.json
3. **WordPress Themes** — Block themes with Version headers in style.css, package.json

Each repo type has different versioning requirements, but no unified release process.

### Issues with Current Release Process

**Critical Issues:**

1. ❌ Authorization gating doesn't work (telemetry continues on error)
2. ❌ Release flow contradicts documentation (code: PR to main, docs: vague)
3. ❌ Workflow badges reference non-existent workflows (broken in docs)

**Major Issues:**
4. ❌ No version sync after release (develop stays stale)
5. ❌ Pre-release checklist documented but not enforced
6. ❌ Rollback automation missing (referenced but not implemented)
7. ❌ Dry-run defaults to true (easy to forget actual release)
8. ❌ No unified process for plugins/themes (each would need custom implementation)

See [AUDIT_REPORT.md](./AUDIT_REPORT.md) for complete findings.

---

## Proposed Solution

### Architecture: Portable Release Agents

**Key Insight:** Create portable release agents that work across all repo types.

```
agents/
├── release/
│   ├── release.agent.js          # Main agent (repo-agnostic)
│   ├── release.agent.md          # Specification
│   └── includes/
│       ├── versionManager.cjs    # Detect + bump versions
│       ├── wordpressUtils.cjs    # Handle plugin headers, etc.
│       └── [other utilities]
│
└── changelog/
    ├── changelog.agent.js
    └── includes/ [...]
```

**How It Works:**

1. **Detect Repo Type**

   ```javascript
   if (fs.existsSync('plugin-file.php')) return 'wordpress-plugin'
   if (fs.existsSync('style.css')) return 'wordpress-theme'
   if (fs.existsSync('.github/workflows/')) return 'github-control-plane'
   ```

2. **Get Version Files (per type)**

   ```
   Plugin:  VERSION + plugin-file.php (Version:) + readme.txt + package.json
   Theme:   VERSION + style.css (Version:) + package.json
   Control: VERSION + package.json
   ```

3. **Validate Consistency**
   - All version files must be in sync before bumping
   - Fail if any version file doesn't match

4. **Bump All Files**
   - Update VERSION file
   - Update plugin headers / theme CSS / etc.
   - Commit all changes together

### Release Flow: Develop-First

**Your Stated Preference (Q2):**

```
develop (current version)
  ↓ create release/vX.Y.Z branch
release/vX.Y.Z
  ↓ bump VERSION, update headers, roll changelog
  ↓ create PR #1
PR #1: release/vX.Y.Z → develop
  ↓ CI runs: tests, lint, changelog validation
  ↓ merge to develop (user approves)
develop (updated version)
  ↓ create PR #2
PR #2: develop → main
  ↓ CI runs: final validation
  ↓ merge to main (user approves)
main (updated version)
  ↓ tag vX.Y.Z
  ↓ create GitHub Release
  ↓ (optional) deploy
```

**Benefits:**

- ✅ develop always up-to-date (no version skew)
- ✅ Two stages of validation (develop, then main)
- ✅ Clear separation: integration (develop) vs production (main)
- ✅ Rollback available at either stage

**Trade-off:**

- ⚠️ Two PRs instead of one (more steps)
- ⚠️ Takes slightly longer (but both PRs run in parallel CI)

### Governance: Single Decision-Maker (You)

**Authorization Model:**

- Only Ash Shaw can trigger `workflow_dispatch` for release.yml
- GitHub branch protection prevents merging without authorization
- Audit trail logs all release attempts (successful & failed)

**Pre-Release Checklist (Enforced):**

- [ ] CHANGELOG.md has [Unreleased] with entries
- [ ] VERSION file correct
- [ ] Tests green
- [ ] Linting green
- [ ] Git status clean
- [ ] Branch is develop

**Error Handling:**

- ✅ Rollback automation available (one-button undo)
- ✅ Pre-release validation prevents bad releases
- ✅ Changelog validation strict (prevents empty releases)

### Documentation: Organized by Audience

**Structure:**

```
docs/
├── RELEASE_PROCESS.md
│   └── Main flow, checklist, examples (all repos)
├── RELEASE_AUTOMATION.md
│   └── Workflow YAML, agent details (technical)
├── RELEASE_WORDPRESS.md
│   └── Plugin headers, theme CSS, readme.txt (WordPress repos)
├── RELEASE_TROUBLESHOOTING.md
│   └── Common issues + solutions
├── RELEASE_ROLLBACK.md
│   └── Step-by-step rollback procedure
└── CHANGELOG_AUTOMATION.md
    └── Changelog format, validation (all repos)
```

**Audience-Specific Sections:**

- **Developers:** How to prepare for release (changelog format, testing)
- **Technical Leads:** Workflow architecture, agent implementation
- **Release Manager (You):** Procedures, troubleshooting, rollback

---

## Key Design Decisions

### Decision 1: Release Flow (Develop-First vs Direct-Main)

**Question:** Should release PR target `develop` first, or go directly to `main`?

**Your Answer (Q2):** Develop-first

**Rationale:** Develop is primary integration branch; version should be validated there first.

**OpenSpec Will Confirm:** Design spec will detail stacked PR workflow, CI gates, timing.

---

### Decision 2: Post-Release Sync

**Question:** After releasing to `main`, should version sync back to `develop`?

**Your Answer (Q3):** Not needed (if develop-first flow adopted)

**Rationale:** Develop is updated in first PR; no back-sync needed.

**OpenSpec Will Detail:** Implementation of version consistency validation.

---

### Decision 3: Authorization Model

**Question:** Who can trigger releases?

**Your Answer (Q17):** Only authorized users (you)

**Rationale:** Single decision-maker; governance is clear.

**OpenSpec Will Specify:** Implementation of authorization checks (GitHub-native, webhook, or other).

---

### Decision 4: Pre-Release Version Support

**Question:** Support beta/RC versions (v1.0.0-beta.1)?

**Your Answer (Q11):** Yes, optional; support but don't require

**Rationale:** Flexibility for planned release cycles; not mandatory.

**OpenSpec Will Define:** Tag naming, pre-release handling in GitHub Releases, changelog versioning.

---

### Decision 5: Multi-Repo Support

**Question:** How to handle WordPress plugins & themes?

**Your Answer (Q45-50):** Portable agents + repo-type detection + WordPress-specific version handling

**Rationale:** Single agent works across all repo types; reusable across organization.

**OpenSpec Will Design:** Version file detection, header update logic, Windows theme support specifics.

---

## Success Metrics

Release process V2 is successful when:

✅ **No Critical Issues Remain**

- [ ] Authorization actually blocks unauthorized releases
- [ ] Release flow matches documentation exactly
- [ ] All broken links/badges fixed

✅ **Governance Established**

- [ ] Pre-release checklist enforced by workflow
- [ ] Audit trail logs all attempts
- [ ] Rollback automation available

✅ **Multi-Repo Support Works**

- [ ] Control plane can release
- [ ] Plugins can release with portable agent
- [ ] Themes can release with portable agent
- [ ] Same process for all (no special cases)

✅ **One-Button Release**

- [ ] User runs: `node agents/release/release.agent.js --scope=patch`
- [ ] Workflow handles everything else
- [ ] Time-to-release < 10 minutes

✅ **Documentation is Accurate**

- [ ] All links live
- [ ] Docs match code exactly
- [ ] CI prevents doc/code drift

---

## Open Questions Requiring Answers

These questions will be answered through the questionnaire + OpenSpec analysis:

1. **Release Authorization:** GitHub user-based, webhook-based, or other?
2. **Changelog Validation:** When exactly (on PR vs at release)?
3. **Rollback Scope:** Auto-clean partial releases, or manual?
4. **WordPress Deployment:** Should release workflow auto-deploy to WordPress.org?
5. **Pre-Release Beta/RC:** What's the complete flow for beta testing cycles?
6. **Breaking Changes:** How to flag breaking changes in release notes?
7. **Hotfix Integration:** Should hotfix flow also update develop?
8. **Documentation Structure:** Single doc vs split documents?

**How They'll Be Answered:**

1. Questionnaire (50 questions) → Your answers
2. OpenSpec Analysis → Requirements + decision matrix + architecture spec
3. Design Phase → Detailed specification
4. Implementation → Code + tests

---

## Timeline

### Week 1: Requirements & Analysis

- You complete questionnaire (1 hour)
- OpenSpec analysis (2-3 hours, automated)
- Design phase (2-3 days)
- **Deliverable:** Full design spec ready to implement

### Week 2-3: Implementation

- Update workflows (2-3 days)
- Build portable agents (3-4 days)
- Add WordPress support (2-3 days)
- Rewrite docs (3-4 days)
- **Deliverable:** Code + docs ready to test

### Week 4: Testing & Rollout

- Test all repo types (2-3 days)
- Rollback validation (1 day)
- Team training (1 day)
- **Deliverable:** Production-ready release process

**Total: 18-23 days implementation + ~1 day your time**

---

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|-----------|
| Flow change breaks existing releases | High | Medium | Dry-run mode + rollback testing |
| Documentation remains inconsistent | Medium | High | CI validation for docs/code alignment |
| Authorization too strict | Medium | Medium | Design with override + audit trail |
| WordPress versioning issues | Medium | Medium | Test matrix (plugin + theme repos) |
| Team resistance to two-PR flow | Medium | Low | Justification in ADRs, training |

---

## Next Steps

### For Product Owner (You)

1. **Review This RFC**
   - Do you agree with proposed architecture?
   - Do proposed decisions align with your intent?

2. **Complete Questionnaire** ([QUESTIONNAIRE_PREPOPULATED.md](./QUESTIONNAIRE_PREPOPULATED.md))
   - Review 50 prepopulated answers
   - Modify if needed
   - Approve for OpenSpec analysis

3. **Approve OpenSpec Output**
   - Review requirements spec
   - Review decision matrix & architecture
   - Sign off on detailed design

### For OpenSpec Analysis

Once questionnaire approved, OpenSpec will:

1. Parse all 50 questions + your answers
2. Identify decision dependencies
3. Flag any conflicts
4. Generate:
   - Formal requirements (50+)
   - Decision matrix (dependencies & tradeoffs)
   - Architecture specification (diagrams, YAML, pseudocode)
   - Implementation plan (prioritized tasks, effort estimates)
   - ADRs (architectural decisions)

### For Implementation

Once design approved, will:

1. Create 47 child issues (organized in phases)
2. Update release.yml workflow
3. Build portable agents (agents/release/, agents/changelog/)
4. Add WordPress plugin/theme support
5. Rewrite documentation
6. Test across all repo types

---

## References

- **Audit Report:** [AUDIT_REPORT.md](./AUDIT_REPORT.md) — Complete findings
- **Questionnaire:** [QUESTIONNAIRE_PREPOPULATED.md](./QUESTIONNAIRE_PREPOPULATED.md) — 50 questions with answers
- **Multi-Repo Strategy:** [MULTI_REPO_AGENT_STRATEGY.md](./MULTI_REPO_AGENT_STRATEGY.md) — Technical architecture
- **Epic Parent:** [EPIC_PARENT_ISSUE.md](./EPIC_PARENT_ISSUE.md) — Issue tracking & timeline
- **Child Issues:** [CHILD_ISSUES_TEMPLATES.md](./CHILD_ISSUES_TEMPLATES.md) — Templates for GitHub issues
- **OpenSpec Setup:** [OPENSPEC_SETUP.md](./OPENSPEC_SETUP.md) — Analysis instructions

---

## Comments & Feedback

This RFC is **open for feedback and comments** from the team.

**Questions to consider:**

- Does the proposed architecture solve the problems?
- Are there concerns about the develop-first flow?
- Should we add/remove any features?
- Are the success metrics achievable?

**Please comment on:**

- Critical decisions (flow, authorization, multi-repo)
- Timeline feasibility
- Risk assessment
- Documentation organization

**Expected Outcome:**

- Team agreement on proposed approach
- Questionnaire completion
- OpenSpec analysis → full design spec

---

## Approval & Sign-Off

- **Proposed:** 2026-08-05 (Audit + RFC completion)
- **Status:** DRAFT — Awaiting feedback
- **Next Gate:** Questionnaire approval → OpenSpec analysis
- **Owner:** Ash Shaw

---

*This RFC captures the complete scope, architecture, and decision framework for Release Process V2. OpenSpec analysis will convert it into a detailed technical specification.*
