---
title: Repository Maintenance
description: Procedures and guidelines for maintaining the .github control plane repository
file_type: documentation
created_date: '2026-07-24'
last_updated: '2026-08-21'
owners:
  - LightSpeed Team
tags:
  - maintenance
  - repository
  - operations
  - automation
status: active
stability: stable
domain: governance
language: en
---

# Repository Maintenance

This document outlines the regular maintenance procedures, tools, and best practices for keeping the `.github` control plane repository healthy, performant, and well-organized.

## Maintenance Calendar

| Task | Frequency | Owner | Duration | Priority |
|------|-----------|-------|----------|----------|
| Branch cleanup | Monthly (1st) | Maintainers | 15–30 min | High |
| Dependency updates (Dependabot) | As PR created | Automation | 5–10 min | High |
| Issue & PR labeling | Weekly | Automation | N/A (CI/CD) | Medium |
| Metrics snapshot | Weekly (Monday) | Automation | N/A (CI/CD) | Low |
| Changelog audit | Quarterly | Maintainers | 30–45 min | Medium |
| Documentation review | Quarterly | Maintainers | 1–2 hours | Medium |
| Security audit | Quarterly | Security Team | 2–3 hours | High |
| Performance audit | Semi-annually | DevOps | 2–4 hours | Low |

---

## Core Maintenance Procedures

### 1. **Branch Cleanup** (Monthly)

**When:** First of each month  
**Time:** 15–30 minutes  
**Complexity:** Low

Identify and safely remove stale, merged branches that have been inactive for 30+ days.

**Reference:** [BRANCH_CLEANUP.md](./BRANCH_CLEANUP.md)

**Quick steps:**

```bash
# 1. Generate report (no changes)
npm run cleanup:report

# 2. Review report at .github/reports/stale-branches-*.md

# 3. Execute cleanup (with confirmations)
node .github/scripts/cleanup-branches.js --dryRun=false

# 4. Sync local repo
git fetch origin --prune
```

---

### 2. **Dependency Updates** (As Needed)

**When:** Automated via Dependabot (daily checks)  
**Time:** 5–10 minutes per PR  
**Complexity:** Low

Dependabot creates PRs for security and feature updates. Review, test, and merge regularly.

**Key points:**

- Security updates: Merge same day
- Minor updates: Merge within 1 week
- Major updates: Batch and coordinate
- Test impacts via CI before merging

---

### 3. **Changelog Audit** (Quarterly)

**When:** End of each quarter (or before release)  
**Time:** 30–45 minutes  
**Complexity:** Medium

Review the `[Unreleased]` section of CHANGELOG.md for:

- Completeness (all commits documented)
- Verbosity (unnecessary repetition)
- Accuracy (PR/issue references correct)
- Structure (follows Keep a Changelog format)

**Audit template:**

```markdown
## Changelog Audit — Q3 2026

### Completeness Check
- [ ] All merged PRs since last audit documented
- [ ] No duplicate entries
- [ ] All PR/issue links valid

### Structure Check
- [ ] Added section consolidated (if duplicates exist)
- [ ] Fixed section consolidated (if duplicates exist)
- [ ] Changed section properly organized
- [ ] All sections have proper formatting

### Consolidation (if needed)
- [ ] Removed duplicate section headers
- [ ] Grouped related entries
- [ ] Condensed verbose descriptions
- [ ] Verified PR/issue references preserved
```

**Reference:** [CHANGELOG-CONSOLIDATION-AUDIT.md](../.github/CHANGELOG-CONSOLIDATION-AUDIT.md)

---

### 4. **Documentation Review** (Quarterly)

**When:** End of each quarter  
**Time:** 1–2 hours  
**Complexity:** Medium

Audit key documentation files for:

- Accuracy (does it reflect current state?)
- Completeness (are there gaps?)
- Links (are they still valid?)
- Examples (are they still working?)

**Files to review:**

- `docs/*.md` — Core documentation
- `.github/CLAUDE.md` — AI governance
- `CONTRIBUTING.md` — Contributor guide
- `.github/README.md` — Repository overview
- `README.md` — Project-level README

---

### 5. **Security Audit** (Quarterly)

**When:** End of each quarter or after incidents  
**Time:** 2–3 hours  
**Complexity:** High

Verify security posture:

- Branch protection rules active
- Secrets properly configured
- No credentials in git history
- CI/CD permissions appropriate
- Workflow permissions minimal

**Checklist:**

- [ ] Branch protection on `main` and `develop`
- [ ] Required status checks enabled
- [ ] No stale tokens or secrets in use
- [ ] GitHub App permissions audited
- [ ] OAuth scopes minimal
- [ ] Third-party integrations reviewed

---

## Automated Maintenance Tasks

The repository has several automated maintenance procedures that run without manual intervention:

### Workflows

| Workflow | Trigger | Frequency | Action |
|----------|---------|-----------|--------|
| `checks.yml` | PR/push to develop | On change | Lint, test, validate |
| `cleanup-branches.yml` | Scheduled | Monthly (1st) | Remove stale branches |
| `issue-automation.yml` | New issue | On event | Auto-label, auto-assign |
| `meta.yml` | Push to develop | On change | Update frontmatter, badges |
| `metrics-summary.yml` | Scheduled | Weekly (Mon) | Snapshot metrics |
| `mermaid-validation.yml` | PR with .md changes | On PR | Validate diagrams |
| `validate-*.yml` | Push to develop | On change | Validate config/scripts |

### Scripts

| Script | Usage | Purpose |
|--------|-------|---------|
| `cleanup-branches.js` | `npm run cleanup:report` | Generate stale branch report |
| `label-sync.js` | (auto via workflow) | Keep `.github/labels.yml` in sync |
| `metrics.agent.js` | (auto via workflow) | Generate metrics snapshots |
| `validate-*.js` | `npm run validate:*` | Validate files/configs |

---

## Health Checks

### Repository Health Dashboard

Run this command periodically to assess health:

```bash
# Comprehensive health check
npm run validate:all
npm test
npm run lint:all

# Git health
git status
git log --oneline -10
git branch -v | grep '\[gone\]' | wc -l  # Should be 0 after cleanup
```

### Key Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Stale branches | 0 | ? | Check with `git branch -v \| grep '\[gone\]'` |
| Test coverage | ≥80% | ? | `npm test -- --coverage` |
| Linting errors | 0 | ? | `npm run lint:all` |
| Broken docs links | 0 | ? | Manual spot-check or CI validation |
| Dependabot PRs pending | ≤5 | ? | Check PR list (high-priority security first) |

---

## Troubleshooting Common Issues

### Issue: Repository Clone is Slow

**Cause:** Large or corrupt git history

**Solution:**

```bash
git gc --aggressive
git repack -Ad
```

### Issue: Workflow Running Slow or Timing Out

**Cause:** Accumulated cache, large runner load, or inefficient steps

**Solution:**

1. Clear workflow cache: GitHub Settings > Caches > Clear all
2. Optimize workflow steps (remove unnecessary ones)
3. Upgrade runner or increase timeout (if applicable)

### Issue: Dependabot PRs Not Auto-Merging

**Cause:** Missing auto-merge configuration, failed status checks, or permission issues

**Solution:**

- Verify Mergify rule exists for Dependabot
- Check CI status on PR
- Verify GitHub App permissions

### Issue: Commits Breaking CI (Pre-commit Hook Failures)

**Cause:** Uncommitted changes detected, linting failures, or validation errors

**Solution:**

```bash
# Fix linting issues
npm run lint:all --fix

# Run pre-commit manually
npm run precommit

# Retry commit
git commit -m "your message"
```

---

## Tools & Scripts Reference

### Installation & Setup

```bash
# Install dependencies
npm ci

# Run all validations
npm run validate:all

# Run all tests
npm test

# Lint all files
npm run lint:all
```

### Common Commands

```bash
# Generate branch cleanup report
npm run cleanup:report

# Execute branch cleanup (interactive)
node .github/scripts/cleanup-branches.js --dryRun=false

# Validate branch names
npm run validate:branch-name

# Validate frontmatter
npm run validate:frontmatter

# Validate Mermaid diagrams
npm run validate:mermaid-contrast
```

---

## When to Escalate

| Issue | When | To Whom |
|-------|------|---------|
| Security vulnerability | Immediately | Security Team + Maintainers |
| Build failure blocking all PRs | Immediately | DevOps + Maintainers |
| Major docs out of sync | Within 1 week | Maintainers |
| Stale Dependabot backlog (>20 PRs) | Within 1 week | Maintainers |
| Failed quarterly audit | Within 2 weeks | Responsible team |

---

## Related Documentation

- [BRANCH_CLEANUP.md](./BRANCH_CLEANUP.md) — Detailed branch cleanup procedures
- [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) — Branch naming and protection policies
- [CONTRIBUTING.md](../CONTRIBUTING.md) — Contributor guidelines
- [AUTOMATION.md](./AUTOMATION.md) — Automation and workflow infrastructure

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
