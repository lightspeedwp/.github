---
file_type: documentation
title: "Multi-Repo Rollout Plan"
description: "Phased rollout strategy for labeling consolidation across control plane, WordPress plugins, and WordPress themes"
created_date: 2026-09-03
last_updated: 2026-09-03
status: complete
tags:
  - rollout
  - multi-repo
  - strategy
  - deployment
---

# Multi-Repo Rollout Plan

**Status:** ✅ Complete (Phase 2 Deliverable)  
**Owner:** Task-Planner Agent  
**Version:** 1.0.0  
**Related:** [OPENSPEC.md](./OPENSPEC.md), [PLANNING.md](./PLANNING.md)

---

## Executive Summary

This plan details the **phased rollout** of the unified labeling system across the entire LightSpeed organization, from the control plane (`.github` repo) to WordPress plugins to WordPress themes.

**Key Strategy (Research Finding Q1):** Pilot → Validate → Scale
- **Phase A (Oct 1–15):** Deploy to control plane
- **Phase B (Oct 20–Nov 15):** Roll out to WordPress plugins (pilot then full)
- **Phase C (Nov 20–Dec 15):** Roll out to WordPress themes (pilot then full)

**Timeline:** 12 weeks (Oct 1 – Dec 15, 2026)  
**Repos Impacted:** 30+ repos (1 control plane + 20+ plugins + 5–10 themes)  
**Estimated Success Probability:** 95%+ (with proposed mitigations)

---

## Phase Overview

| Phase | Target | Duration | Repos | Effort | Risk |
|-------|--------|----------|-------|--------|------|
| **A** | Control Plane (`.github`) | 2 weeks | 1 | High | Low |
| **B** | WordPress Plugins | 4 weeks | 20+ | High | Low |
| **C** | WordPress Themes | 4 weeks | 5–10 | Medium | Low |

---

## Phase A: Control Plane Deployment (Oct 1–15)

### Week 1: Pre-Deployment (Oct 1–5)

**Goal:** Validate unified labeling system in staging without impacting production

**Activities:**

1. **Deploy to staging branch** (`.github/staging`)
   ```bash
   git checkout -b feat/labeling-staging
   Deploy labeling-core.yml, labeling-automation.yml, etc.
   ```
   
   ⚠️ **Workflow Trigger Limitation:** GitHub Actions workflows only trigger on the default branch by default. For staging validation on a non-default branch, use one of:
   - Create a staging repository instead of a staging branch
   - Use `workflow_dispatch` (manual) triggers for testing
   - Manually replay test events using a CI simulation harness
   - Use a separate staging environment with a staging default branch

2. **Run parallel validation** (7 days)
   - Old workflows on main branch (production)
   - New workflows on staging branch (using manual triggers or replay harness)
   - Compare outputs for equivalence

3. **Validation Checks:**
   - ✅ 100% label agreement (same labels on same issues)
   - ✅ Timing equivalence (< 5 minute difference)
   - ✅ Error rate < 0.1%
   - ✅ Audit trail completeness

4. **Go/No-Go Decision** (Oct 5)
   - If validation passes: Proceed to Week 2
   - If issues found: Debug, fix, re-test (1–2 day extension)

### Week 2: Production Rollout (Oct 6–15)

**Goal:** Deploy to production and stabilize

**Day 1–2 (Oct 6–7): Cutover**

```bash
# Disable old workflows
# Enable new workflows
# Monitor closely
```

**Cutover Checklist:**

- [ ] Backup old workflow files to `workflows/archived/`
- [ ] Enable new consolidated workflows
- [ ] Disable old fragmented workflows
- [ ] Monitor GitHub Actions execution
- [ ] Check label application accuracy
- [ ] Monitor error rates

**Day 3–7 (Oct 8–12): Monitoring**

- ✅ Monitor workflow success rate (target: > 99%)
- ✅ Check label application accuracy (target: 100% match)
- ✅ Watch for regressions (none expected)
- ✅ Review audit trail entries
- ✅ Gather team feedback

**Day 8–10 (Oct 13–15): Decommission & Handover**

- [ ] Archive old workflows
- [ ] Update documentation
- [ ] Consolidate/cleanup scripts
- [ ] Conduct post-deployment review
- [ ] Get team sign-off

### Success Criteria (Phase A)

- ✅ 99%+ workflow execution success rate
- ✅ 100% label equivalence between old and new system
- ✅ < 0.1% error rate
- ✅ Audit trail completeness (all changes logged)
- ✅ Zero regressions in production
- ✅ Team confidence: "Ready for plugin rollout"

### Rollback Procedure (Phase A)

If issues detected during Week 2:

**Before Cutover (Oct 5):**
Record the pre-cutover commit SHA for immediate reference:
```bash
PRE_CUTOVER_SHA=$(git rev-parse HEAD)
echo "Pre-cutover commit: $PRE_CUTOVER_SHA" > ROLLBACK_REFERENCE.txt
```

1. **Immediate Rollback** (< 5 minutes)
   ```bash
   # Use recorded pre-cutover commit SHA, not HEAD~1 (which may be unrelated after other pushes)
   ROLLBACK_SHA="<recorded pre-cutover SHA>"
   git checkout $ROLLBACK_SHA -- .github/workflows/
   git commit -m "rollback: Restore workflows from $ROLLBACK_SHA"
   git push origin <branch>
   ```

2. **Investigation** (1–2 hours)
   - Analyze what went wrong
   - Review logs and audit trail
   - Identify root cause

3. **Fix & Re-Test** (1–3 days)
   - Fix issue in staging
   - Validate equivalence
   - Prepare for re-deployment

4. **Re-Deploy** (after fix is validated)

---

## Phase B: WordPress Plugins Rollout (Oct 20–Nov 15)

### Overview

**Goal:** Roll out unified labeling to all WordPress plugin repos safely

**Approach:** Pilot (2–3 repos) → Validate → Full Rollout (20+ repos)

**Success Criteria:**
- ✅ 99%+ label consistency across all pilot repos
- ✅ 100% canonical label adoption
- ✅ Zero breaking changes
- ✅ Plugin teams satisfied with system

### Pilot Repos (Selection Criteria)

Choose 2–3 repos that represent different plugin types:

| Criteria | Repo A | Repo B | Repo C |
|----------|--------|--------|--------|
| **Size** | Small | Medium | Large |
| **Activity** | Low | Medium | High |
| **Team** | Experienced | Experienced | Experienced |
| **Complexity** | Simple | Moderate | Advanced |
| **Example** | [TBD] | [TBD] | [TBD] |

### Week 1: Pilot Setup (Oct 20–26)

**Activities:**

1. **Create `.github/labeler-extensions.yml`** for each pilot repo
   ```yaml
   repo_config:
     name: [repo-name]
     parent_org: lightspeedwp
     type: wordpress-plugin
     inherit_canonical: true
     custom_areas: []  # Add if needed
     validation:
       enforce_canonical: true
   ```

2. **Deploy unified workflows** to pilot repos
   - Copy `labeling-core.yml` to each repo
   - Copy `labeling-automation.yml` to each repo
   - Disable old repo-local labeling logic (if any)

3. **Run validation checks**
   - Verify canonical labels exist
   - Check schema conformance
   - Validate labeling rules work

4. **Dry-run label application**
   - Test on 10–20 existing issues
   - Compare with expected labels
   - Document any discrepancies

### Week 2: Pilot Validation (Oct 27–Nov 2)

**Activities:**

1. **Monitor pilot repos** (7 days)
   - Track label application accuracy
   - Check workflow success rates
   - Watch for errors or conflicts

2. **Compare with control plane**
   - Same label applied for similar issues?
   - Timing within expectations?
   - Error rates consistent?

3. **Gather pilot team feedback**
   - Interview maintainers of pilot repos
   - Ask about usability, issues, concerns
   - Document lessons learned

4. **Go/No-Go Decision** (Nov 2)
   - If pilot successful: Proceed to full rollout
   - If issues found: Debug and re-test (extension possible)

### Week 3–4: Full Rollout (Nov 3–15)

**Staggered Deployment Approach:**

```
Nov 3–5:   Deploy to repos 1–5 (1 repo/day)
Nov 6–10:  Deploy to repos 6–15 (2 repos/day)
Nov 11–15: Deploy to repos 16–20+ (2–3 repos/day)
```

**Deployment Checklist (Per Repo):**

- [ ] Create `.github/labeler-extensions.yml`
- [ ] Copy unified workflows
- [ ] Validate schema conformance
- [ ] Test on sample issues
- [ ] Enable workflows
- [ ] Monitor for 24 hours
- [ ] Check label accuracy
- [ ] Document any issues
- [ ] Move to next repo

**Monitoring During Rollout:**

- Daily: Check workflow success rates across all repos
- Daily: Audit label application accuracy
- Weekly: Generate cross-repo consistency report
- Alert if: Any repo fails 3+ times, error rate > 1%, labels non-canonical

### Success Criteria (Phase B)

- ✅ 99%+ canonical label consistency across all plugin repos
- ✅ Zero breaking changes to existing issues/PRs
- ✅ Workflow success rate > 98% across all repos
- ✅ Zero critical errors
- ✅ Plugin teams satisfied with transition

### Rollback Procedure (Phase B)

If issues detected during rollout:

**Per-Repo Rollback:**
```bash
# For affected repo only - use recorded pre-deployment SHA, not HEAD~1
ROLLBACK_SHA="<recorded pre-deployment SHA for this repo>"
git -C repos/plugin-x/ checkout $ROLLBACK_SHA -- .github/workflows/
git -C repos/plugin-x/ checkout $ROLLBACK_SHA -- .github/labeler-extensions.yml
git -C repos/plugin-x/ commit -m "rollback: Restore labeling from $ROLLBACK_SHA"
git -C repos/plugin-x/ push origin main
```

**Full Rollback (if systemic issue):**
- Stop all remaining deployments
- Roll back all deployed repos
- Debug in staging
- Re-plan rollout

---

## Phase C: WordPress Themes Rollout (Nov 20–Dec 15)

### Overview

**Goal:** Apply same rollout strategy to theme repos

**Approach:** Same as Phase B (Pilot → Validate → Scale)

**Repos:** 5–10 theme repos

### Timeline

- **Nov 20–26:** Pilot deployment (1–2 theme repos)
- **Nov 27–Dec 2:** Pilot validation (7 days)
- **Dec 3–15:** Full rollout (staggered)

### Differences from Phase B

**Theme-Specific Considerations:**

1. **Custom Area Labels** (if needed)
   ```yaml
   custom_areas:
     - area:wp-customizer
     - area:theme-json
     - area:block-templates
   ```

2. **Theme-Specific Workflows** (if any)
   - Check for existing theme labeling logic
   - Migrate if needed to unified system
   - Validate compatibility

3. **Theme Team Training**
   - Document unified labeling for theme developers
   - Provide examples specific to theme repos
   - Offer Q&A session

### Success Criteria (Phase C)

- ✅ Same as Phase B (99%+ consistency, zero breaking changes)
- ✅ Theme-specific area labels working correctly
- ✅ Theme teams satisfied with system

---

## Per-Repo Schema Management

### Canonical vs. Custom Labels

**All Repos Inherit (Mandatory):**
- 33 `type:*` labels
- 20 `status:*` labels
- 4 `priority:*` labels
- All `meta:*` labels

**Plugin/Theme Repos Can Add:**
- Custom `area:*` labels (e.g., `area:woocommerce`)
- Custom `comp:*` labels (e.g., `comp:cache-plugin`)
- Custom `env:*` labels (e.g., `env:staging`)

**Never Customizable:**
- Type, status, priority (org-wide only)
- Meta (governance labels)
- Release labels (org-wide)

### Deployment Validation

**Pre-Deployment Checks (Automated):**

```javascript
async function validateRepoDeployment(repo) {
  checks = [
    checkCanonicalLabelsExist(repo),
    checkNoUnauthorizedExtensions(repo),
    checkColorConsistency(repo),
    checkDescriptionConsistency(repo),
    checkNoCustomMetaLabels(repo),
    checkValidationRules(repo)
  ];
  
  if (checks.every(c => c.passed)) {
    return 'READY_FOR_DEPLOYMENT';
  } else {
    return 'VALIDATION_FAILED';
  }
}
```

---

## Label Sync Strategy

### Retroactive Labeling (Per Phase)

**Phase A (Control Plane):**
```bash
# One-time retroactive pass on 11,000+ existing issues
gh issue list --state all --limit 5000 | \
  node scripts/automation/label-orchestrator.js apply \
    --batch-size 100 \
    --dry-run > retroactive-plan.json

# Review and apply
node scripts/automation/label-orchestrator.js apply \
  --from-file retroactive-plan.json
```

**Phase B & C (Plugins/Themes):**
- Per-repo retroactive labeling optional
- Team decides based on repo needs
- Same script used for consistency

### Ongoing Automated Labeling

**Daily (02:00 UTC):**
- Label unlabeled issues
- Sync PR labels to linked issues
- Remediate bare labels

**Weekly (Sundays):**
- Generate audit reports
- Check governance compliance
- Report any violations

---

## Rollback Procedures

### Immediate Rollback (< 5 minutes)

**Restore Previous Workflows:**

```bash
# Restore all workflows from archived versions (use recorded pre-deployment SHA)
ROLLBACK_SHA="<recorded pre-deployment SHA>"
git checkout $ROLLBACK_SHA -- .github/workflows/
git commit -m "rollback: Restore workflows from $ROLLBACK_SHA"
git push origin main

# Clear any partial labels
# (Handled by automated cleanup job)
```

### Phased Rollback (if needed)

1. **Stop future deployments** (immediately)
2. **Analyze root cause** (1–2 hours)
3. **Fix identified issue** (1–3 days)
4. **Re-validate in staging** (1–2 days)
5. **Resume deployment** (with updated approach)

---

## Success Metrics & Reporting

### Per-Phase Metrics

| Metric | Phase A | Phase B | Phase C | Target |
|--------|---------|---------|---------|--------|
| Workflow success rate | % | % | % | > 98% |
| Label consistency | % | % | % | > 99% |
| Error rate | % | % | % | < 0.1% |
| Critical issues | # | # | # | 0 |
| Team satisfaction | score | score | score | > 4.0/5.0 |

### Weekly Status Reports

**Template:**
```markdown
## Labeling Rollout Status — Week [N]

### Metrics
- Workflow success rate: [X]%
- Label consistency: [Y]%
- Critical issues: [Z]

### Completed
- [ ] Deployment to [repos]
- [ ] Validation checks
- [ ] Team feedback

### Issues
- [ ] [Issue 1]
- [ ] [Issue 2]

### Blockers
- [ ] [Blocker 1]

### Next Week
- [ ] [Plan for next week]
```

---

## Disaster Recovery

### Scenario 1: Mass Label Corruption

**Response:**
1. Halt all labeling workflows (emergency stop)
2. Investigate scope and severity
3. Run remediation scripts to fix corrupted labels
4. Re-enable workflows after verification

### Scenario 2: Workflow Infinite Loop

**Response:**
1. Disable affected workflow
2. Investigate root cause
3. Fix logic
4. Re-enable with safeguards

### Scenario 3: Performance Degradation

**Response:**
1. Monitor GitHub API rate limits
2. Implement throttling if needed
3. Optimize queries if possible
4. Scale execution if necessary

---

## Communication Plan

### Pre-Rollout

- [ ] Announce rollout in team channels (1 week prior)
- [ ] Share rollout plan and FAQs
- [ ] Offer training sessions
- [ ] Collect questions and concerns

### During Rollout

- [ ] Daily standup updates in Slack
- [ ] Weekly status reports
- [ ] Issue tracking and resolution
- [ ] Real-time monitoring dashboard

### Post-Rollout

- [ ] Retrospective meeting
- [ ] Document lessons learned
- [ ] Update playbooks and runbooks
- [ ] Celebrate successful deployment!

---

## Post-Rollout Activities (Phase D+)

**Dec 16–31:**

- [ ] Stabilization and monitoring
- [ ] Address any post-deployment issues
- [ ] Gather final team feedback
- [ ] Plan for future enhancements
- [ ] Document final architecture

---

**Status:** ✅ COMPLETE (Phase 2 Deliverable)  
**Version:** 1.0.0  
**Last Updated:** 2026-09-03  
**Maintained By:** Task-Planner Agent

