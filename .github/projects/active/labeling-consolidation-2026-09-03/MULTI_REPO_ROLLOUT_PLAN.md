---
file_type: documentation
title: Multi-Repo Rollout Strategy
description: Phased deployment plan for rolling out unified labeling agent to control plane and WordPress plugin/theme repos
created_date: 2026-09-03
last_updated: 2026-09-03
status: draft
tags:
  - rollout
  - deployment
  - multi-repo
  - strategy
---

# Multi-Repo Rollout Strategy

**Status:** 🟡 Draft (Phase 2 specification)  
**Owner:** Task-Planner Agent  
**Version:** 1.0.0  
**Related:** [PLANNING.md](./PLANNING.md) | [AUDIT_FINDINGS.md](./AUDIT_FINDINGS.md) | [OPENSPEC.md](./OPENSPEC.md)

---

## Executive Summary

This document outlines the phased deployment strategy for rolling out the unified labeling agent across the LightSpeed organisation. Based on Phase 1 research findings, the rollout follows a three-phase approach:

1. **Phase A: Control Plane** (.github) — Primary deployment, establish baseline
2. **Phase B: WordPress Plugins** — Pilot + full rollout to plugin repos
3. **Phase C: WordPress Themes** — Pilot + full rollout to theme repos

**Key Principle:** Validate each phase before proceeding; maintain rollback capability at all times.

---

## 1. Rollout Scope & Repo Types

### 1.1 Target Repositories

**Control Plane (1 repo):**
- `.github` — Master control plane

**WordPress Plugins (Estimated 8–12 repos):**
- LightSpeed Blocks
- LightSpeed Page Builder
- LightSpeed Fonts
- [Additional plugin repos TBD]

**WordPress Themes (Estimated 4–6 repos):**
- GeneratePress
- GenerateBlocks
- [Additional theme repos TBD]

**Total:** ~15–20 repos in Phase C (full rollout)

### 1.2 Per-Repo Label Strategy

**Canonical Labels (Mandatory everywhere):**
- All `type:*` (33 labels)
- All `status:*` (20 labels)
- All `priority:*` (4 labels)
- All `release:*` (4 labels)
- Core `area:*` labels (ci, docs, testing, security, performance)

**Repository-Specific Custom Labels (Optional, with approval):**
- Plugin-specific `area:*` — e.g., `area:lsb-blocks`, `area:marketplace-integration`
- Theme-specific `area:*` — e.g., `area:generatepress-theme`, `area:child-theme-support`
- Proprietary components — e.g., `comp:custom-block-type`

**Constraint:** All custom labels must follow family prefix convention and be documented in per-repo `schema.yml` override file.

---

## 2. Phase A: Control Plane Deployment

### 2.1 Timeline

**Phase A Duration:** 2 weeks (Oct 1–14)

```
Oct 1-5   (Week 1): Staged deployment in .github
├─ Oct 1-2: Deploy to staging/dev branch
├─ Oct 3-4: Validate in staging
└─ Oct 5: Deploy to production (main)

Oct 8-14  (Week 2): Stabilization & monitoring
├─ Oct 8-10: Monitor workflows, fix bugs
├─ Oct 11-12: Decommission old workflows
└─ Oct 13-14: Documentation update
```

### 2.2 Deployment Steps

**Step A1: Pre-Deployment Validation (Oct 1–2)**

- [ ] Verify all Phase 2 deliverables complete and reviewed
- [ ] Run full test suite locally (>80% coverage required)
- [ ] Create staging branch: `staging/labeling-agent-v1`
- [ ] Deploy consolidated workflows to staging environment
- [ ] Deploy schema validator as GitHub Action
- [ ] Enable new workflows on staging branch only

**Step A2: Staging Validation (Oct 3–4)**

- [ ] Create test PRs/issues on staging branch to validate:
  - PR auto-labeling by branch name
  - PR auto-labeling by file changes
  - Issue auto-labeling by type
  - Label conflict detection
  - Cross-schema validation
  - Status/priority inference

- [ ] Compare output with legacy workflows:
  - Exact label match on ≥95% of test cases
  - Document any intentional behavior changes
  - Validate schema compliance

- [ ] Performance validation:
  - Workflow execution time ≤30 seconds (target: <15s)
  - No regression vs. legacy workflows

**Step A3: Production Deployment (Oct 5)**

- [ ] Merge staging branch to main
- [ ] Deploy schema validator and new workflows
- [ ] Run smoke tests on production:
  - Create live test PR in .github
  - Verify labels applied correctly
  - Verify schema validation passing

**Step A4: Cutover (Oct 5–7)**

- [ ] Disable legacy labeling workflows:
  - [ ] Disable `labeling.yml`
  - [ ] Disable `pr-labeler.yml`
  - [ ] Disable `issue-labeler.yml`
  - [ ] Disable `validate-labels.yml`
  - [ ] Disable other fragmented workflows (keep in git for rollback)

- [ ] Monitor for 48 hours:
  - Check all workflow runs complete successfully
  - Verify no unlabeled PRs/issues
  - Alert on any validation failures

**Step A5: Post-Deployment Cleanup (Oct 8–14)**

- [ ] Gather metrics:
  - Time to label (should be <5s)
  - Label accuracy (≥98% expected)
  - Schema compliance (100% expected)

- [ ] Document findings in post-deployment report
- [ ] Update team documentation
- [ ] Archive old workflow scripts (keep in git history)

### 2.3 Rollback Procedure

**Trigger:** Any critical issue discovered (e.g., incorrect labels, workflow failures)

**Rollback Steps (estimated 5 minutes):**
1. Disable new consolidated workflows via workflow dispatch
2. Re-enable legacy workflows by reverting disable commits
3. Investigate root cause
4. Fix in separate branch
5. Re-test in staging
6. Re-deploy with fixes

---

## 3. Phase B: WordPress Plugins

### 3.1 Timeline

**Phase B Duration:** 3 weeks (Oct 15 – Nov 4)

```
Oct 15-21  (Week 1): Pilot deployment (2-3 repos)
├─ Oct 15-16: Select pilot repos
├─ Oct 17-18: Deploy labeling agent to pilot
└─ Oct 19-21: Validate & gather feedback

Oct 22-28  (Week 2): Feedback → full rollout
├─ Oct 22-24: Process feedback, fix issues
├─ Oct 25-26: Deploy to all plugin repos
└─ Oct 27-28: Monitoring & stabilization

Oct 29-Nov 4 (Week 3): Post-deployment
├─ Oct 29-31: Fix bugs, optimize
└─ Nov 1-4: Documentation, close issues
```

### 3.2 Pilot Selection

**Select 2–3 Plugin Repos for Initial Pilot:**

**Pilot Criteria:**
- ✅ Active maintainers available (for quick feedback loop)
- ✅ Regular PR/issue volume (validation data)
- ✅ Willing to participate in feedback process
- ✅ Represent diverse plugin types (simple, complex, dependency-heavy)

**Suggested Pilot Repos:**
- LightSpeed Blocks (high volume, active, complex)
- LightSpeed Fonts (medium volume, stable)
- [Select 3rd repo TBD based on interest]

### 3.3 Pilot Deployment

**Phase B-Pilot (Oct 15–21):**

1. **Preparation (Oct 15–16)**
   - [ ] Copy unified workflows to pilot repos
   - [ ] Create per-repo `schema.yml` override file
   - [ ] Document any repo-specific custom labels
   - [ ] Enable workflows on separate branch first

2. **Staged Rollout (Oct 17–18)**
   - [ ] Deploy to `staging/` branch only (no production impact)
   - [ ] Run test PRs/issues in pilot repos
   - [ ] Compare with legacy labeling behavior
   - [ ] Document differences and special cases

3. **Validation & Feedback (Oct 19–21)**
   - [ ] Gather feedback from pilot repo maintainers:
     - Are labels correct?
     - Any unexpected behavior?
     - Performance acceptable?
     - Schema rules making sense?
   - [ ] Create issue for each piece of feedback
   - [ ] Prioritize critical vs. nice-to-have fixes
   - [ ] Make quick fixes, redeploy to staging

### 3.4 Full Plugin Rollout (Oct 22–28)

**Phase B-Full (Oct 22–28):**

1. **Preparation (Oct 22–24)**
   - [ ] Merge staging branch to main in pilot repos (if validated)
   - [ ] Process feedback; fix any critical issues discovered
   - [ ] Create issue checklist for rollout to non-pilot plugin repos
   - [ ] Prepare per-repo schema overrides for remaining repos

2. **Deploy to All Plugin Repos (Oct 25–26)**
   - [ ] Deploy consolidated workflows to remaining plugin repos
   - [ ] Enable schema validator GitHub Action
   - [ ] Run smoke tests per repo
   - [ ] Verify label consistency across all plugin repos

3. **Monitoring & Stabilization (Oct 27–28)**
   - [ ] 24-hour monitoring period per repo
   - [ ] Create quick-fix checklist for common issues
   - [ ] Communicate status to team

### 3.5 Success Criteria (Phase B)

- [ ] ≥95% label accuracy across all plugin repos
- [ ] ≥99% workflow success rate (errors <1%)
- [ ] Schema compliance: 100% of new labels valid
- [ ] Pilot feedback processed and addressed
- [ ] Zero critical issues remaining
- [ ] Documentation updated for plugin maintainers

---

## 4. Phase C: WordPress Themes

### 4.1 Timeline

**Phase C Duration:** 2 weeks (Nov 5–18)

```
Nov 5-11   (Week 1): Pilot deployment (1-2 repos)
├─ Nov 5-6: Select & prepare pilot repos
├─ Nov 7-8: Deploy to pilot
└─ Nov 9-11: Validate & feedback

Nov 12-18  (Week 2): Full rollout + stabilization
├─ Nov 12-14: Deploy to all theme repos
├─ Nov 15-16: Monitoring
└─ Nov 17-18: Cleanup & documentation
```

### 4.2 Pilot & Full Rollout

**Pilot Selection (1–2 theme repos):**
- GeneratePress (flagship theme, high volume)
- GenerateBlocks or other active theme

**Deployment Approach:** Similar to Phase B but with shorter timeline (confidence higher after plugins)

**Phase C-Pilot (Nov 5–11):**
- Deploy to staging branch
- Run test cycle (2 days)
- Gather feedback (1 day)

**Phase C-Full (Nov 12–18):**
- Deploy to all theme repos (no staging necessary; copy approach from plugins)
- Expect faster validation (inherit plugin lessons learned)
- Monitoring period: 48 hours per repo batch

### 4.3 Success Criteria (Phase C)

- [ ] All theme repos using consolidated labeling agent
- [ ] Label consistency maintained across 20+ repos
- [ ] Schema compliance: 100% across org
- [ ] Pilot → full rollout feedback loop complete
- [ ] Zero critical issues from theme repos
- [ ] Full documentation available for all repo types

---

## 5. Retroactive Labeling Strategy

### 5.1 Unlabeled Items Problem

**Situation:** Existing unlabeled PRs/issues remain unlabeled after agent deployment

**Options Considered:**

| Option | Effort | Risk | Chosen? |
|--------|--------|------|---------|
| Auto-label all historical items | High | Medium (false positives) | ❌ No |
| Provide manual labeling tools | Medium | Low | ✅ Yes (Phase 1) |
| Label only new items forward | Low | Low | ✅ Yes (default) |
| Batch label template mode | Low | Low | ✅ Yes (Phase 2) |

### 5.2 Chosen Approach: Phased Strategy

**Phase 1: New Items Only**
- Unified agent labels all new PRs/issues automatically
- Existing unlabeled items remain unlabeled
- No false-positive risk
- **Timeline:** Oct 1+ (ongoing)

**Phase 2: Manual Tools Available** (Nov+)
- Provide batch labeling script:
  ```bash
  npm run tools:batch-label -- --repo lightspeedwp/plugin-x --dry-run
  ```
- Maintainers can opt-in per repo
- Support for custom filtering, preview-before-apply
- Documentation with examples

**Phase 3: Assisted Auto-Labeling** (Dec+, if needed)
- If significant unlabeled backlog remains
- Use ML model trained on manually labeled items
- Apply with confidence threshold (≥85% only)
- Always allow manual review before applying

### 5.3 Batch Labeling Tool

**Feature:** CLI tool for mass-labeling existing PRs/issues

```bash
# Dry-run: show what would be labeled
npm run tools:batch-label -- \
  --repo lightspeedwp/lsb-blocks \
  --type "pr" \
  --state "open" \
  --since "2026-01-01" \
  --dry-run

# Apply labels
npm run tools:batch-label -- \
  --repo lightspeedwp/lsb-blocks \
  --type "pr" \
  --state "open" \
  --since "2026-01-01" \
  --apply

# Custom filter
npm run tools:batch-label -- \
  --repo lightspeedwp/lsb-blocks \
  --filter 'title ~ "bug"' \
  --labels "type:bug,priority:high" \
  --apply
```

**Implementation Location:** `scripts/labeling/batch-labeler.js`  
**Permissions Required:** `repo:admin` (only for batch operations)

---

## 6. Repo-Specific Configuration

### 6.1 Per-Repo Schema Override File

**Location:** `.github/schema.yml` (in each repo)

**Example (Plugin Repo):**
```yaml
version: "1.0.0"
extends: canonical

# Import all canonical labels (type:*, status:*, priority:*, release:*, core area:*)
# Plus define repo-specific custom labels

custom_labels:
  # Plugin-specific area labels
  - name: area:lsb-blocks
    color: "#1f6feb"
    description: LightSpeed Blocks plugin
    family: area
    metadata:
      repo_specific: true
      required_repos: [lsb-blocks]
  
  - name: area:marketplace-integration
    color: "#1f6feb"
    description: Marketplace integration features
    family: area
    metadata:
      repo_specific: true
      required_repos: [lsb-blocks]
  
  # Custom component labels
  - name: comp:button-block
    color: "#6f42c1"
    description: Button block component
    family: comp
    metadata:
      repo_specific: true
```

**Example (Theme Repo):**
```yaml
version: "1.0.0"
extends: canonical

custom_labels:
  - name: area:generatepress-theme
    color: "#1f6feb"
    description: GeneratePress theme features
    family: area
  
  - name: area:child-theme-support
    color: "#1f6feb"
    description: Child theme compatibility
    family: area
  
  - name: comp:customization
    color: "#6f42c1"
    description: Theme customization options
    family: comp
```

### 6.2 Validation at Deployment

**Schema Validator Action** runs on all PRs to check:
1. All canonical labels present in repo
2. No conflicting custom label names
3. Custom labels follow naming convention
4. Metadata complete for all labels
5. Documentation references in schema.yml

---

## 7. Cross-Repo Consistency Monitoring

### 7.1 Label Sync Validation

**Automated Check (Daily):**
```bash
npm run validate:label-consistency -- --all-repos
```

**Generates Report:**
- Canonical labels present in all repos ✅/❌
- Custom labels per repo documented ✅/❌
- Color consistency for same-name labels ✅/❌
- Schema compliance per repo ✅/❌

**Issue Creation:** If any check fails, create GitHub issue in `.github` repo

### 7.2 Metrics Collection

**Label Usage Tracking (Weekly):**
- Most-used labels per repo
- Labels that conflict with schema
- Custom labels accumulating (validate necessity)
- Unlabeled PR/issue backlog

**Dashboard Location:** `.github/reports/labeling/` (generated weekly)

---

## 8. Communication & Training

### 8.1 Rollout Announcements

**Phase A (Oct 5):**
- Announce new unified labeling in `.github` repo
- Share link to documentation
- Invite feedback and bug reports

**Phase B (Oct 15):**
- Announce plugin pilot selection
- Invitation for maintainers to participate in feedback
- Timeline and success criteria

**Phase B-Full (Oct 25):**
- Announce rollout to all plugin repos
- Summary of pilot feedback and changes made
- Instructions for repo maintainers

**Phase C (Nov 5+):**
- Announce theme pilot and full rollout
- Final documentation and support resources

### 8.2 Documentation & Training

**Created Documentation:**
- [ ] Quick-start guide for repo maintainers (2-page)
- [ ] Labeling rules per repo type (1-page per type)
- [ ] Custom label request process (0.5-page)
- [ ] Troubleshooting guide (2-page)
- [ ] FAQ for common questions (1-page)

**Location:** `docs/LABELING_ROLLOUT_*.md`

**Training Delivery:**
- Quick async video (2 min) showing new labeling in action
- Recorded Q&A session from pilot phase
- Slack channel for ongoing questions (`#labeling-rollout`)

---

## 9. Risk Assessment & Mitigation

### 9.1 Risk Matrix

| Risk | Impact | Prob. | Mitigation |
|------|--------|-------|-----------|
| **Incorrect labels break workflows** | High | Low | Test in staging, smoke tests before prod |
| **Performance degradation on large repos** | High | Low | Benchmark before rollout, optimize if needed |
| **Schema validation blocks legitimate PRs** | Medium | Low | Soft validation first (warnings), hard validation later |
| **Repo-specific extensions conflict** | Medium | Medium | Central registry of custom labels, conflict checker |
| **Maintainers resist changes** | Medium | Medium | Pilot feedback loop, address concerns early |
| **Rollback takes too long** | Low | Low | Old workflows stay in git, quick re-enable possible |

### 9.2 Mitigation Strategies

**Testing:**
- Full test suite >80% coverage before each phase
- Staging environment validation required
- Production smoke tests on each phase

**Communication:**
- Early involvement of pilot repos
- Clear documentation and examples
- Quick response to feedback

**Technical Safeguards:**
- Feature flags for new validation rules (soft → hard rollout)
- Parallel running capability (old + new workflows simultaneously)
- Comprehensive error logging and alerting

---

## 10. Success Metrics & Acceptance Criteria

### 10.1 Phase A (Control Plane)

- [ ] 100% workflow success rate in staging
- [ ] ≥95% label accuracy on test PRs
- [ ] Schema compliance: 100%
- [ ] No critical bugs post-deployment
- [ ] Team sign-off on documentation

### 10.2 Phase B (Plugins)

- [ ] Pilot validation complete (2+ weeks in production)
- [ ] ≥95% label accuracy across all plugin repos
- [ ] ≥99% workflow success rate
- [ ] Pilot feedback processed
- [ ] Custom labels for all pilot repos documented
- [ ] Full plugin repo rollout complete

### 10.3 Phase C (Themes)

- [ ] All theme repos using unified labeling
- [ ] ≥95% label accuracy across themes
- [ ] Schema compliance: 100% across all 20+ repos
- [ ] Post-rollout report generated
- [ ] Documentation complete and accessible
- [ ] Team trained and confident

### 10.4 Overall Success

- [ ] 60%+ reduction in workflow files (11 → 5 or fewer)
- [ ] 40%+ reduction in YAML lines (1,535 → 925)
- [ ] 100% label consistency across org
- [ ] Maintenance time reduced 50%+ (measured Oct–Jan)
- [ ] Zero critical production issues from rollout
- [ ] Positive team feedback (≥4/5 satisfaction)

---

## 11. Post-Rollout Operations

### 11.1 Ongoing Maintenance

**Monthly:**
- Review label consistency metrics
- Process custom label requests (with approval)
- Update documentation as needed

**Quarterly:**
- Audit label usage patterns
- Recommend deprecations for unused labels
- Plan improvements based on feedback

**Annually:**
- Full schema audit and versioning
- Deprecation of truly unused labels
- Major updates to agent logic if needed

### 11.2 Continuous Improvement

**Feedback Loop:**
1. Collect issues/requests from repo maintainers
2. Triage and prioritize
3. Implement improvements in minor versions
4. Roll out incremental updates

**Metrics-Driven:**
- Track label accuracy trends
- Identify where agent struggles
- Improve detection rules based on data

---

## References

- [PLANNING.md](./PLANNING.md) — Overall project timeline
- [RESEARCH_FINDINGS.md](./RESEARCH_FINDINGS.md) — Repo type analysis (Q1-3)
- [AUDIT_FINDINGS.md](./AUDIT_FINDINGS.md) — Current workflow audit
- [OPENSPEC.md](./OPENSPEC.md) — Architecture overview
- [WORKFLOW_CONSOLIDATION_PLAN.md](./WORKFLOW_CONSOLIDATION_PLAN.md) — Workflow restructuring
- [.github/AGENTS.md](../../AGENTS.md) — Agent ecosystem context

---

**Plan Version:** 1.0.0  
**Created:** 2026-09-03  
**Last Updated:** 2026-09-03  
**Maintained By:** Claude
