---
title: "Label Prefix Enforcement Implementation Guide"
description: "Step-by-step implementation procedures for all 5 phases"
file_type: "documentation"
version: "1.0.0"
created_date: "2026-08-07"
last_updated: "2026-08-07"
author: "Claude Code"
maintainer: "LightSpeed Team"
domain: "governance"
status: "active"
tags:
  - implementation
  - procedures
  - phase-execution
---

# Implementation Guide: Label Prefix Enforcement Project

**Document Purpose**: Detailed step-by-step procedures for executing all 5 phases  
**Target Audience**: Project leads, DevOps, Governance team  
**Success Measure**: All procedures documented and executable  

---

## Phase 1: Stop New Violations (TODAY) — Detailed Procedures

### Phase 1.1: Update CLAUDE.md with Label Rules

**Timeline**: 30 minutes  
**Owner**: Governance Lead  
**Reviewers**: Engineering Lead, DevOps  

#### Step 1: Prepare the Content

**File to modify**: `CLAUDE.md` (root)  
**Location**: Add new section "Label Creation Rules (CRITICAL)" after "Key Conventions" section  

**Content Block**:

```markdown
## Label Creation Rules (CRITICAL)

When creating issues or PRs programmatically (via CLI, API, or workflow), **ALL labels MUST be from the canonical set in `.github/labels.yml` with their required family prefix**.

### Valid Label Examples (Prefixed)

- `type:bug`, `type:feature`, `type:task`, `type:documentation`
- `status:needs-triage`, `status:in-progress`, `status:done`
- `priority:critical`, `priority:important`, `priority:normal`
- `area:ci`, `area:docs`, `area:security`, `area:labels`
- `meta:needs-changelog`, `meta:has-pr`

### INVALID Label Examples (Bare — DO NOT USE)

- ❌ `bug` — use `type:bug`
- ❌ `feature` — use `type:feature`
- ❌ `urgent` — use `priority:critical`
- ❌ `ci` — use `area:ci`

### Reference

- Source of truth: `.github/labels.yml` (158 canonical labels)
- Labeling guide: `docs/LABELING.md`
- Label taxonomy: `docs/LABEL_STRATEGY.md`
- Root cause analysis: `.github/projects/active/label-prefix-audit-2026-08-05/`
```

#### Step 2: Make the Edit

1. Open `CLAUDE.md` in editor
2. Find section: "Key Conventions"
3. Add new section immediately after
4. Paste the content block above
5. Verify formatting (markdown, bullet points, code blocks)

#### Step 3: Validate

```bash
# Run markdown linter
npm run lint:md CLAUDE.md

# Verify YAML frontmatter (if present)
npm run validate:frontmatter CLAUDE.md
```

#### Step 4: Commit & Push

```bash
git add CLAUDE.md
git commit -m "docs: Add label creation rules to CLAUDE.md (Phase 1 enforcement)"
git push origin $(git rev-parse --abbrev-ref HEAD)
```

#### Step 5: Verification Checklist

- [ ] Section added to CLAUDE.md
- [ ] Markdown linting passes
- [ ] Frontmatter validates (if applicable)
- [ ] Commit message follows convention
- [ ] Push successful
- [ ] PR created/updated with this change

---

### Phase 1.2: Update AGENTS.md with Governance Section

**Timeline**: 30 minutes  
**Owner**: Governance Lead  
**Reviewers**: Engineering Lead, Agent Owners  

#### Step 1: Locate and Prepare Content

**File to modify**: `AGENTS.md` (root)  
**Location**: Add new subsection under "Governance & Standards" section (if exists), or create new section  

**Content Block**:

```markdown
### Label Creation for Programmatic Issue Creation

When your code creates issues via `gh issue create` or GitHub API:

1. **Always validate labels against canonical set** (`.github/labels.yml`)
2. **Use required family prefixes** (e.g., `type:bug`, not `bug`)
3. **Verify one-hot per family** (except `meta:` and `comp:` which allow multiples)
4. **Check reference** in `docs/LABELING.md` if unsure

#### Labeling Agent Implementation

The labeling agent in `.github/scripts/agents/labeling.agent.js` is the authoritative implementation. Use this as template for any custom label creation.

**Correct pattern**:
```yaml
labels:
  - type:bug           # Problem classification
  - status:needs-triage  # Workflow state
  - priority:normal    # Urgency
  - area:ci           # Domain/component
```

**Incorrect pattern** (DO NOT USE):

```yaml
labels:
  - bug               # Bare label (missing type: prefix)
  - needs-triage      # Bare label (missing status: prefix)
  - urgent            # Bare label (missing priority: prefix)
```

#### Enforcement & Validation

- **Pre-creation**: Validate labels before calling `gh issue create`
- **Workflow-level**: GitHub Actions workflows validate labels on issue events
- **Governance**: CLAUDE.md documents rules; AGENTS.md documents implementation

**Reference**: `.github/scripts/validation/validate-labels-before-creation.cjs`

```

#### Step 2: Make the Edit

1. Open `AGENTS.md` in editor
2. Find appropriate section (Governance, Standards, or AI Governance)
3. Add subsection with content block above
4. Verify indentation and code block formatting

#### Step 3: Validate

```bash
# Markdown linting
npm run lint:md AGENTS.md

# Verify all inline code blocks have proper syntax highlighting
```

#### Step 4: Commit & Push

```bash
git add AGENTS.md
git commit -m "docs: Add label creation governance to AGENTS.md (Phase 1 enforcement)"
git push origin $(git rev-parse --abbrev-ref HEAD)
```

#### Step 5: Verification Checklist

- [ ] Subsection added to AGENTS.md
- [ ] Code blocks properly formatted
- [ ] Markdown linting passes
- [ ] Commit message follows convention
- [ ] Push successful

---

### Phase 1.3: Delete Defective Code

**Timeline**: 15 minutes  
**Owner**: DevOps/Engineering  
**Reviewers**: Security, Code Quality  

#### Step 1: Identify the Defective File

**Location**: `scripts/agents/includes/labeling-agent.js`  
**Issue**: Creates bare labels without family prefixes  
**Status**: Superseded by `.github/scripts/agents/labeling.agent.js`  

#### Step 2: Verify Supersession

Before deletion, confirm the correct implementation exists:

```bash
# Check both files exist
test -f scripts/agents/includes/labeling-agent.js && echo "Defective file exists"
test -f .github/scripts/agents/labeling.agent.js && echo "Correct implementation exists"

# Check for any imports/references
grep -r "labeling-agent.js" --include="*.js" --include="*.yml" --include="*.yaml" .github/ || echo "No references found"
grep -r "scripts/agents/includes/labeling-agent" --include="*.js" --include="*.yml" --include="*.yaml" . || echo "No references found"
```

#### Step 3: Create Removal Commit

```bash
git rm scripts/agents/includes/labeling-agent.js
git commit -m "fix: Remove defective labeling-agent.js creating bare labels (Phase 1 enforcement)"
git push origin $(git rev-parse --abbrev-ref HEAD)
```

#### Step 4: Verification

```bash
# Verify file is removed
! test -f scripts/agents/includes/labeling-agent.js && echo "✓ File removed"

# Check git history
git log --oneline -5 | grep "Remove defective"
```

#### Step 5: Verification Checklist

- [ ] Correct implementation verified (`.github/scripts/agents/labeling.agent.js` exists)
- [ ] No references to defective file found
- [ ] File removed via `git rm`
- [ ] Commit created and pushed
- [ ] File no longer exists in working directory

---

### Phase 1.4: Verification & Sign-Off

**Timeline**: 15 minutes  
**Owner**: Governance Lead  
**Sign-off**: Engineering Lead + DevOps  

#### Verification Checklist

- [ ] CLAUDE.md updated with label rules section
- [ ] AGENTS.md updated with implementation guidance
- [ ] Defective code file deleted
- [ ] All commits pushed
- [ ] No new violations created since Phase 1 start

#### Success Criteria for Phase 1

- **Zero new non-canonical labels created** (audit to confirm)
- **Documentation updated** (CLAUDE.md + AGENTS.md complete)
- **Code cleaned** (defective file removed)
- **Governance enforced** (rules documented in AI instructions)

---

## Phase 2: Fix Existing Issues (24–48 hours)

### Phase 2.1: Bulk Remediation Strategy

**Timeline**: 3–5 hours  
**Owner**: DevOps/Automation  
**Impact**: ~100 issues in #1500–#1600 range  

#### Step 1: Create Remediation Script

**Script purpose**: Bulk update issue labels from bare to canonical form  

**Input**: List of issues with bare labels  
**Output**: Updated issues with canonical labels  
**Rollback**: Full git history preserved; can revert via git if needed  

#### Step 2: Run Validation First

```bash
# Pre-remediation audit
npm run audit:labels -- --mode dry-run

# Expected output: List of issues + proposed changes
# Review all proposed changes before proceeding
```

#### Step 3: Execute Remediation

```bash
# Run with confirmation prompts
npm run remediate:labels -- --mode interactive

# Or run directly (use only after manual review)
npm run remediate:labels -- --mode direct --issues-range 1500-1600
```

#### Step 4: Post-Remediation Audit

```bash
# Run full audit
npm run audit:labels

# Expected: 0 violations
# Document results in Phase 2 completion report
```

### Phase 2.2: Manual Review for Edge Cases

**Timeline**: 1–2 hours  
**Owner**: Engineering Team Lead  

#### Step 1: Identify Edge Cases

Issues that automated script cannot handle:

- Custom labels not in canonical set
- Issues needing reclassification
- Complex multi-label scenarios

#### Step 2: Manual Updates

For each edge case issue:

1. Open issue in GitHub
2. Review current labels
3. Determine correct canonical labels
4. Update labels manually
5. Document change in spreadsheet

#### Step 3: Verification

```bash
# Re-run audit after manual fixes
npm run audit:labels

# Should report 0 violations
```

### Phase 2.3: Verification & Reporting

- [ ] All ~100 issues remediated
- [ ] Re-audit confirms 0 violations
- [ ] No automation failures
- [ ] Edge cases manually reviewed
- [ ] Completion report generated

---

## Phase 3: Enforce Validation in Workflows (3–5 days)

### Phase 3.1: Pre-Creation Validation Integration

**Timeline**: 2 hours  
**Owner**: DevOps  

#### Implementation Steps

1. **Review validation script**: `.github/scripts/validation/validate-labels-before-creation.cjs`
2. **Integrate into issue creation workflows**: `.github/workflows/issue-*.yml`
3. **Test with dry-run**: Create test issue and verify validation
4. **Document**: Update workflow documentation

#### Validation Rules Checklist

- [ ] Label must exist in `.github/labels.yml`
- [ ] Label must include family prefix (no bare labels)
- [ ] One-hot per family (except meta, comp)
- [ ] Type label always required

### Phase 3.2: Workflow-Level Validation

**Timeline**: 2–3 hours  
**Owner**: DevOps  

1. Add validation job to issue event workflows
2. Add validation checks to PR labeling workflows
3. Add documentation for developers
4. Test edge cases

### Phase 3.3: Error Handling & Rollback

- Invalid labels rejected
- Helpful error messages provided
- Workflow logs document violations
- Can re-run after label fixes

---

## Phase 4: Documentation Updates (5–7 days)

### Phase 4.1: Expand LABELING.md

Add:

- Troubleshooting guide
- Common mistakes (bare labels)
- Examples per family
- Scripts reference

### Phase 4.2: Create FAQ Document

Questions to address:

- What are prefixed labels?
- How do I add a new label?
- What if I see an error?
- Where do I find the canonical list?

### Phase 4.3: Update README References

Ensure all READMEs reference new governance rules.

---

## Phase 5: Team Training & Communication (Ongoing)

### Phase 5.1: Slack Announcement

Post in #engineering and #governance:

- What changed and why
- Where to find documentation
- How to report issues

### Phase 5.2: Team Meeting

- Demonstrate the system
- Answer questions
- Gather feedback

### Phase 5.3: Monitoring

- Weekly audits for 1 month
- Track new violations
- Adjust documentation as needed

---

## Rollback Procedures

### If Phase 1 needs to rollback

```bash
git revert <commit-hash>
```

### If Phase 2 issues need fixing

```bash
# Revert remediation
git revert <remediation-commit>

# Fix manually
# Then re-apply with corrections
```

### If Phase 3 validation is too strict

1. Review error cases
2. Update validation rules
3. Re-deploy workflows
4. Test edge cases

---

## Success Metrics by Phase

| Phase | Metric | Target |
|-------|--------|--------|
| 1 | New violations created | 0 |
| 2 | Issues fixed | 100 |
| 3 | Validation failures handled | 100% |
| 4 | Documentation coverage | 100% |
| 5 | Team understanding | 90%+ |

---

## Contact & Escalation

- **Phase Lead**: [Name]
- **Technical Contact**: [Name]
- **Escalation**: [Process]

---

*Built with ☕ and 🚀 by LightSpeedWP Governance Team*
