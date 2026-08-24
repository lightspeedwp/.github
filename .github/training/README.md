---
file_type: documentation
title: Release Engineering Training Materials
description: Comprehensive training program for release workflow team
version: v1.0
last_updated: '2026-08-22'
status: active
---

# Release Engineering Training Materials

> Complete training program for Release Engineering team on the two-phase agentic release workflow.

---

## Overview

This folder contains Phase 9B deliverables: **Team Training & Runbooks** for the Release Process Redesign Initiative.

**Training covers:**

- ✅ Two-phase agentic workflow architecture
- ✅ Patch release execution (5–10 min, auto-approved)
- ✅ Minor release execution (10–30 min, 1 maintainer approval)
- ✅ Major release execution (30–120 min, 2 maintainers + ADR)
- ✅ Troubleshooting and emergency recovery
- ✅ Hands-on practice and certification

---

## Training Resources

### Primary Training Guide

**[RELEASE_TEAM_TRAINING.md](./RELEASE_TEAM_TRAINING.md)** (70+ minutes)

Comprehensive training manual with 5 modules:

1. **Module 1: Release Fundamentals** (10 min)
   - Semantic versioning and release types
   - Two-phase workflow architecture
   - Seven safety gates explained
   - Authorization and team roles

2. **Module 2: Patch Release Training** (20 min)
   - When to use patch releases
   - Step-by-step execution guide
   - Dry-run → live release process
   - Post-release verification

3. **Module 3: Minor Release Training** (25 min)
   - When to use minor releases
   - Feature vs. bug fix distinction
   - Pre-release approver communication
   - Approval workflow and timeline

4. **Module 4: Major Release Training** (30 min)
   - When to use major releases
   - Architecture Decision Record (ADR) requirement
   - Dual approval workflow
   - Breaking change documentation

5. **Module 5: Troubleshooting & Recovery** (15 min)
   - Common issues and quick fixes
   - Emergency rollback procedure
   - Escalation procedures

### Quick Reference Materials

**[RELEASE_QUICK_REFERENCE.md](./RELEASE_QUICK_REFERENCE.md)** (1-page cheat sheet)

Print and laminate this quick reference card:

- Decision tree for release type selection
- Pre-release checklist
- Step-by-step commands for each release type
- Common issues and fixes
- Key commands reference
- Timeline and approval requirements

**Ideal for:** Keeping at your desk during releases

---

### FAQ & Q&A

**[RELEASE_FAQ.md](./RELEASE_FAQ.md)** (30 questions answered)

Frequently asked questions organized by topic:

- **General Questions** (Q1–Q4): Release types, version selection, timing
- **Technical Questions** (Q5–Q10): Gates, dry-runs, branch strategy
- **Approval & Authorization** (Q11–Q13): Team access, approval methods
- **Breaking Changes & ADR** (Q14–Q16): When ADR required, ADR status
- **Post-Release** (Q17–Q23): Sync branches, conflicts, rollback
- **Workflow & Automation** (Q24–Q26): Parallel releases, concurrent pushes
- **Learning & Training** (Q27–Q30): Getting started, practice, help resources

**Ideal for:** Quick answers during training and execution

---

### Certification & Sign-Off

**[CERTIFICATION_TEMPLATE.md](./CERTIFICATION_TEMPLATE.md)** (certification record)

Complete certification checklist including:

- **Training completion tracking** — All 5 modules with sign-off dates
- **Hands-on practice verification** — 3 practice releases (patch, minor, optional major)
- **Competency verification** — Specific skills demonstrated
- **Knowledge verification** — 5-question quiz (≥80% pass)
- **Authorization levels** — Patch/minor/major authorization with restrictions
- **Dual sign-off** — Trainee + Release Lead signatures
- **Validity tracking** — 12-month certification with renewal date

**Ideal for:** Recording formal completion and authorization

---

## Supporting Documentation

These materials reference but do not replace:

### Main Release Runbooks

Located in `/docs/`:

- **[RELEASE_RUNBOOK_PATCH.md](../docs/RELEASE_RUNBOOK_PATCH.md)** — Detailed patch release procedure
- **[RELEASE_RUNBOOK_MINOR.md](../docs/RELEASE_RUNBOOK_MINOR.md)** — Detailed minor release procedure
- **[RELEASE_RUNBOOK_MAJOR.md](../docs/RELEASE_RUNBOOK_MAJOR.md)** — Detailed major release procedure
- **[RELEASE_TROUBLESHOOTING.md](../docs/RELEASE_TROUBLESHOOTING.md)** — Comprehensive troubleshooting guide
- **[RELEASE_PROCESS.md](../docs/RELEASE_PROCESS.md)** — Complete workflow architecture

### Reference Documents

- **[AGENTIC_RELEASE_USER_GUIDE.md](../docs/AGENTIC_RELEASE_USER_GUIDE.md)** — End-user guide
- **[AGENTIC_RELEASE_ADMIN_GUIDE.md](../docs/AGENTIC_RELEASE_ADMIN_GUIDE.md)** — Administrator guide
- **[RELEASE_WORDPRESS.md](../docs/RELEASE_WORDPRESS.md)** — WordPress-specific procedures

---

## Training Program Flow

### For New Team Members

**Recommended sequence (3–4 hours):**

1. **Read** → [RELEASE_TEAM_TRAINING.md](./RELEASE_TEAM_TRAINING.md) Modules 1–2 (30 min)
2. **Watch** → Video walkthrough (optional, 15 min)
3. **Practice** → Execute test patch release (30 min)
4. **Read** → [RELEASE_TEAM_TRAINING.md](./RELEASE_TEAM_TRAINING.md) Modules 3–5 (45 min)
5. **Practice** → Execute test minor release (30 min)
6. **Practice** → Execute test major release (30 min, optional)
7. **Sign** → Complete [CERTIFICATION_TEMPLATE.md](./CERTIFICATION_TEMPLATE.md) (15 min)
8. **Review** → Watch video again if needed (optional)

**Hands-on Practice:**

- Use test repository: `https://github.com/lightspeedwp/test-releases.git`
- Execute releases in safe environment
- Get comfortable with commands before production releases

### For Existing Team Members

**Annual refresher (1 hour):**

1. **Skim** → [RELEASE_QUICK_REFERENCE.md](./RELEASE_QUICK_REFERENCE.md)
2. **Check** → [RELEASE_FAQ.md](./RELEASE_FAQ.md) for new questions
3. **Watch** → Video walkthrough (if updated)
4. **Execute** → One real release
5. **Update** → Certification with current date

---

## Pre-Training Requirements

Before starting training, verify:

```bash
# 1. You have GitHub access
gh auth status

# 2. You are in maintainers team
gh api /orgs/lightspeedwp/teams/maintainers/members/$(git config user.name)

# 3. You have git and gh installed
git --version
gh --version

# 4. You can access the test repo
gh repo view lightspeedwp/test-releases
```

**No other prerequisites.**

---

## Training Outcomes

After completing this training, you will:

✅ Understand the two-phase agentic release workflow  
✅ Execute patch releases independently (5–10 min)  
✅ Coordinate minor releases with approval (10–30 min)  
✅ Understand major release requirements (30–120 min)  
✅ Identify and fix common release issues  
✅ Perform emergency rollback if needed  
✅ Know when to escalate to Release Lead  
✅ Be formally certified for production releases  

---

## Certification Process

### Eligibility

- [ ] Team member is in `@lightspeedwp/maintainers` GitHub team
- [ ] Team member has completed all 5 training modules
- [ ] Team member has executed practice releases successfully
- [ ] Team member has answered knowledge quiz (≥80% pass)

### Certification Steps

1. **Complete hands-on practice** — 3 successful test releases (patch, minor, optional major)
2. **Fill certification form** — [CERTIFICATION_TEMPLATE.md](./CERTIFICATION_TEMPLATE.md)
3. **Get Release Lead sign-off** — Trainer/Release Lead reviews and signs
4. **File certification** — Keep on record for 12 months
5. **Renew annually** — Refresher training + real release execution

### Authorization Levels

| Level | Scope | Prerequisites | Timeline |
|-------|-------|---------------|----------|
| **Patch** | Bug fixes, security patches | Complete Module 1–2 + practice patch | Immediately after certification |
| **Minor** | New features | Complete Module 1–3 + practice minor | Immediately after certification |
| **Major** | Breaking changes | Complete Module 1–4 + practice major | Immediately after certification |

---

## Support & Resources

### During Training

- **Video walkthrough:** (optional, ~50 min overview)
- **Hands-on practice:** Use test repository
- **Questions:** Ask in Release Engineering channel
- **Stuck?** Check [RELEASE_FAQ.md](./RELEASE_FAQ.md)

### During Release Execution

- **Reference:** Use [RELEASE_QUICK_REFERENCE.md](./RELEASE_QUICK_REFERENCE.md)
- **Detailed steps:** Use relevant runbook (patch/minor/major)
- **Common issues:** Check [RELEASE_TROUBLESHOOTING.md](../docs/RELEASE_TROUBLESHOOTING.md)
- **Help needed?** Create GitHub issue + tag @lightspeedwp/maintainers

### Escalation

| Issue | Action |
|-------|--------|
| Can't remember a step | Check the runbook or quick reference |
| Don't understand a concept | Re-read the training module |
| Workflow failed | Check troubleshooting guide |
| Still stuck after 15 min | Escalate to Release Lead |
| Authorization denied | Contact Release Lead for team access |

---

## Maintenance & Updates

This training program is maintained by Release Engineering Team.

### Update Frequency

- **Annually:** Full training review (Q4)
- **As-needed:** When workflow changes occur
- **Quarterly:** Video refresh if significant changes

### Feedback

Have suggestions for improving training?

1. Create GitHub issue in `.github` repo
2. Tag: `type:documentation` + `area:release`
3. Include: "Training feedback" in title
4. Release Lead will review and incorporate

---

## File Manifest

| File | Type | Purpose | Duration |
|------|------|---------|----------|
| [RELEASE_TEAM_TRAINING.md](./RELEASE_TEAM_TRAINING.md) | Training Guide | Comprehensive 5-module training | 70+ min |
| [RELEASE_QUICK_REFERENCE.md](./RELEASE_QUICK_REFERENCE.md) | Reference Card | One-page cheat sheet (print) | 1 page |
| [RELEASE_FAQ.md](./RELEASE_FAQ.md) | Q&A | 30 frequently asked questions | Reference |
| [CERTIFICATION_TEMPLATE.md](./CERTIFICATION_TEMPLATE.md) | Form | Certification checklist + sign-off | 30 min |
| [README.md](./README.md) | Overview | This file (training program map) | 10 min |

---

## Related Project

This training is part of **Phase 9: Release Workflow Validation & E2E Testing**

Project details: [.github/projects/active/release-workflow-validation-phase9-2026-08-22/](../../.github/projects/active/release-workflow-validation-phase9-2026-08-22/)

Related phases:

- Phase 9A: E2E Test Implementation (✅ COMPLETE)
- Phase 9B: Team Training Materials (🟢 ACTIVE — this folder)
- Phase 9C: Pilot Release Execution (📋 Planned)

---

## Quick Start

**For new team member:**

```bash
# Step 1: Read training
open RELEASE_TEAM_TRAINING.md

# Step 2: Do practice
cd test-releases  # (or use test repo locally)
gh workflow run release.yml -f scope=patch -f dry_run=true

# Step 3: Get certified
# Complete CERTIFICATION_TEMPLATE.md

# Step 4: Execute real release
# Use RELEASE_QUICK_REFERENCE.md as guide
```

**For experienced team member:**

```bash
# Step 1: Quick refresh
open RELEASE_QUICK_REFERENCE.md

# Step 2: Execute release
gh workflow run release.yml -f scope=patch -f dry_run=true
# (or minor/major as appropriate)

# Step 3: Verify
gh release view v1.0.1
```

---

**Training Program v1.0**  
**Last Updated:** 2026-08-22  
**Maintained By:** Release Engineering Team  
**Next Review:** 2027-08-22

---

*Questions? Check [RELEASE_FAQ.md](./RELEASE_FAQ.md) or ask @lightspeedwp/maintainers*
