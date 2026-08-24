---
file_type: documentation
title: Release Engineer Certification Template
description: Certification checklist for release engineering team members
version: v1.0
last_updated: '2026-08-22'
status: active
---

# Release Engineer Certification Template

> Certification that team member has completed release workflow training and is authorized to execute releases.

---

## Certification Record

**Trainee Information:**

- **Name:** ____________________________________
- **Email:** ____________________________________
- **GitHub Username:** ____________________________________
- **Organization:** LightSpeed WordPress (@lightspeedwp)
- **Completion Date:** ____________________________________
- **Release Lead (Certifier):** ____________________________________

---

## Training Modules Completed

All modules must be completed. Check each as completed:

### Module 1: Release Fundamentals

- [ ] Understood semantic versioning (MAJOR.MINOR.PATCH)
- [ ] Understood release scope determination (patch/minor/major)
- [ ] Understood two-phase workflow architecture
- [ ] Understood all 7 safety gates
- [ ] Understood authorization requirements
- [ ] Reviewed: [RELEASE_TEAM_TRAINING.md](../docs/RELEASE_TEAM_TRAINING.md) Module 1

**Sign-off date:** ________________

### Module 2: Patch Release Training

- [ ] Understood when to use patch releases (bug fixes, security patches)
- [ ] Understood dry-run process
- [ ] Understood live release execution
- [ ] Can identify correct version bump (v1.0.0 → v1.0.1)
- [ ] Can verify release post-completion
- [ ] Reviewed: [RELEASE_RUNBOOK_PATCH.md](../docs/RELEASE_RUNBOOK_PATCH.md)
- [ ] Reviewed: [RELEASE_TEAM_TRAINING.md](../docs/RELEASE_TEAM_TRAINING.md) Module 2

**Sign-off date:** ________________

### Module 3: Minor Release Training

- [ ] Understood when to use minor releases (new features)
- [ ] Understood feature vs. bug fix distinction
- [ ] Understood approver communication (send notice before release)
- [ ] Understood approval workflow (1 maintainer reviews PR #2)
- [ ] Understood approval methods (Approve button recommended)
- [ ] Understood approval timeline (5–20 min typical)
- [ ] Reviewed: [RELEASE_RUNBOOK_MINOR.md](../docs/RELEASE_RUNBOOK_MINOR.md)
- [ ] Reviewed: [RELEASE_TEAM_TRAINING.md](../docs/RELEASE_TEAM_TRAINING.md) Module 3

**Sign-off date:** ________________

### Module 4: Major Release Training

- [ ] Understood when to use major releases (breaking changes)
- [ ] Understood ADR requirement and purpose
- [ ] Understood dual approval workflow (2 maintainers)
- [ ] Understood breaking change documentation
- [ ] Understood migration guide requirements
- [ ] Understood ADR acceptance requirement
- [ ] Reviewed: [RELEASE_RUNBOOK_MAJOR.md](../docs/RELEASE_RUNBOOK_MAJOR.md)
- [ ] Reviewed: [RELEASE_TEAM_TRAINING.md](../docs/RELEASE_TEAM_TRAINING.md) Module 4

**Sign-off date:** ________________

### Module 5: Troubleshooting & Recovery

- [ ] Understood common issues and their solutions
- [ ] Familiar with emergency rollback procedure
- [ ] Understood how to read workflow logs
- [ ] Understood escalation procedures
- [ ] Reviewed: [RELEASE_TROUBLESHOOTING.md](../docs/RELEASE_TROUBLESHOOTING.md)
- [ ] Reviewed: [RELEASE_TEAM_TRAINING.md](../docs/RELEASE_TEAM_TRAINING.md) Module 5

**Sign-off date:** ________________

---

## Hands-On Practice Releases

All practice releases must be completed successfully on test repository.

### Practice Release 1: Patch Release

- [ ] Used test repository: `https://github.com/lightspeedwp/test-releases.git`
- [ ] Completed pre-release checklist
- [ ] Executed dry-run successfully
  - Dry-run command: `gh workflow run release.yml -f scope=patch -f dry_run=true`
  - All gates ✅ PASSED
  - Agentic score ≥ 0.80: YES / NO
- [ ] Executed live release successfully
  - Live command: `gh workflow run release.yml -f scope=patch -f dry_run=false`
  - Workflow completed without errors: YES / NO
  - GitHub Release published: YES / NO
- [ ] Verified release completion
  - Git tag created: YES / NO
  - VERSION file updated: YES / NO
  - GitHub Release visible: YES / NO

**Practice Release 1 Completion Date:** ________________

**Release Version:** v __________ (test repo)

### Practice Release 2: Minor Release

- [ ] Used test repository
- [ ] Identified feature entries in changelog
- [ ] Notified designated approver (simulated or real team member)
- [ ] Executed dry-run successfully
  - All gates ✅ PASSED
  - Agentic score ≥ 0.80: YES / NO
  - Approval requirement shown: YES / NO
- [ ] Executed live release successfully
  - Workflow Phase 1 completed: YES / NO
  - PR #1 merged to develop: YES / NO
  - PR #2 created for approval: YES / NO
  - Approval provided: YES / NO
  - Workflow Phase 2 completed: YES / NO
- [ ] Verified release completion
  - Git tag created: YES / NO
  - GitHub Release published: YES / NO

**Practice Release 2 Completion Date:** ________________

**Release Version:** v __________ (test repo)

**Approver (if available):** ____________________________________

### Practice Release 3: Major Release (Optional but Recommended)

- [ ] Used test repository
- [ ] Created and accepted test ADR
  - ADR location: docs/adr/TEST-0001.md
  - ADR status: Accepted
  - ADR content reviewed: YES / NO
- [ ] Identified breaking changes in changelog
  - Marked with ⚠️: YES / NO
- [ ] Notified two designated approvers
- [ ] Executed dry-run successfully
  - All gates ✅ PASSED
  - Approval requirement (2 maintainers): Shown / Not shown
- [ ] Executed live release successfully
  - Phase 1 completed: YES / NO
  - PR #2 created with ADR reference: YES / NO
  - Both approvals received: YES / NO
  - Phase 2 completed: YES / NO
- [ ] Verified release completion
  - Git tag created: YES / NO
  - GitHub Release published: YES / NO
  - ADR referenced in release notes: YES / NO

**Practice Release 3 Completion Date:** ________________ (Optional)

**Release Version:** v __________ (test repo)

**Approvers (if available):**

- ____________________________________
- ____________________________________

---

## Competency Verification

Team member has demonstrated competency in:

### Release Scope Determination

- [ ] Can identify correct release type (patch/minor/major)
- [ ] Understands decision criteria (breaking changes → major, etc.)
- [ ] Can read git history and changelog to determine scope
- [ ] Has not confused patch/minor/major in practice releases

### Patch Release Execution

- [ ] Can execute patch release independently ✅
- [ ] Can use dry-run mode before live release
- [ ] Can monitor workflow logs for issues
- [ ] Can verify release post-completion
- [ ] Can troubleshoot common patch issues

### Minor Release Execution

- [ ] Can coordinate with one approver ✅
- [ ] Can notify approver with appropriate messaging
- [ ] Can identify approval in PR workflow
- [ ] Can wait patiently for human approval (doesn't retry unnecessarily)
- [ ] Can escalate if approval is delayed

### Major Release Execution

- [ ] Can verify ADR exists and is "Accepted" ✅
- [ ] Can explain breaking changes to team
- [ ] Can coordinate with two approvers
- [ ] Can include ADR reference in release messaging
- [ ] Understands migration guide requirements

### Troubleshooting & Recovery

- [ ] Can read workflow logs and identify failures ✅
- [ ] Can use RELEASE_TROUBLESHOOTING.md to diagnose issues
- [ ] Can apply fixes and retry dry-runs
- [ ] Can explain emergency rollback procedure
- [ ] Knows when to escalate to Release Lead

---

## Authorization Level

Upon successful completion of this certification, team member is authorized for:

- [ ] **Patch Releases** — Can trigger independently
  - Scope: Bug fixes, security patches, performance improvements
  - Approval: Auto-approved (no human approval required)
  - Risk level: Low (fully automated, reversible if needed)
  - Authorized repositories: [List repos]

- [ ] **Minor Releases** — Can trigger with coordination
  - Scope: New features, backwards-compatible improvements
  - Approval: Requires 1 maintainer review
  - Risk level: Medium (requires human judgment)
  - Authorized repositories: [List repos]

- [ ] **Major Releases** — Can trigger with dual approval & ADR
  - Scope: Breaking changes, significant refactors
  - Approval: Requires 2 maintainers + ADR
  - Risk level: High (breaking changes, user impact)
  - Authorized repositories: [List repos]

---

## Authorization Restrictions (If Any)

If trainee does not yet have authorization for all release types, note restrictions:

- **Cannot trigger:** (list any release types not authorized)
- **Reason:** ____________________________________
- **Review date for escalation:** ____________________________________
- **Release Lead signature (restricted):** ____________________________________

---

## Knowledge Verification Questions

Team member must answer the following questions correctly (≥80% correct required):

**Q1: You want to release bug fixes. What release type?**

- [ ] Patch (1.0.0 → 1.0.1) ✅ CORRECT
- [ ] Minor (1.0.0 → 1.1.0)
- [ ] Major (1.0.0 → 2.0.0)

**Q2: A minor release requires approval from:**

- [ ] No one (auto-approved)
- [ ] 1 maintainer ✅ CORRECT
- [ ] 2 maintainers

**Q3: An ADR is required for which release type?**

- [ ] Patch
- [ ] Minor
- [ ] Major ✅ CORRECT

**Q4: What's the best way to approve a release?**

- [ ] Comment "LGTM" on PR
- [ ] Click "Approve" button in review ✅ CORRECT
- [ ] Add "approved" label
- [ ] Mention @user in comment

**Q5: If a dry-run fails, what should you do?**

- [ ] Skip to live release anyway
- [ ] Fix the issue and retry dry-run ✅ CORRECT
- [ ] Contact Release Lead immediately
- [ ] Delete and recreate the branch

**Score:** _____ / 5 (≥4 required to pass)

**Q1 Answer:** __________  
**Q2 Answer:** __________  
**Q3 Answer:** __________  
**Q4 Answer:** __________  
**Q5 Answer:** __________  

---

## Sign-Off & Certification

By signing below, trainee confirms:

- ✅ I have completed all training modules
- ✅ I have successfully executed practice releases
- ✅ I understand the two-phase release workflow
- ✅ I can execute patch releases independently
- ✅ I can coordinate minor and major releases with approvers
- ✅ I understand the emergency rollback procedure
- ✅ I know when to escalate to Release Lead
- ✅ I am authorized to execute releases per scope above

### Trainee Certification

**Trainee Name:** ____________________________________

**Trainee Signature:** ____________________________________

**Date:** ____________________________________

**GitHub Username (verification):** ____________________________________

---

### Release Lead Certification & Authorization

**Release Lead Name:** ____________________________________

**Release Lead GitHub Username:** ____________________________________

**Certification Status:**

- [ ] **APPROVED** — Team member certified and authorized
  - Authorized effective date: ____________________________________
  - Valid until: ____________________________________
  - Release types authorized: Patch / Minor / Major (check all applicable)

- [ ] **CONDITIONAL** — Authorized with restrictions (see above)
  - Review date: ____________________________________

- [ ] **NOT YET** — Additional training required
  - Reason: ____________________________________
  - Suggested review: ____________________________________

**Release Lead Signature:** ____________________________________

**Certification Date:** ____________________________________

---

## Post-Certification Maintenance

This certification remains valid for **12 months** from sign-off date.

Annual refresher requirements:

- [ ] Review all three runbooks (annually)
- [ ] Execute at least one release per quarter
- [ ] Watch updated training video (if released)
- [ ] Attend team training update (if scheduled)

**Certification Renewal Date:** ____________________________________

**Renewal Release Lead:** ____________________________________

---

## Incident Log (If Applicable)

If trainee had issues requiring escalation, record here:

| Date | Issue | Resolution | Escalated | Notes |
|------|-------|-----------|-----------|-------|
| | | | | |
| | | | | |

---

**Certification Template v1.0**  
**Last Updated:** 2026-08-22  
**Valid for:** 12 months from sign-off date

*Keep this certification on file in Release Engineering records.*
