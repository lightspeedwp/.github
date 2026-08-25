---
file_type: documentation
title: "GitHub Issue Type & Metadata Automation Solution Design"
description: "Project documentation"
last_updated: "2026-08-25"
status: draft
---

# Solution Design: Issue Type & Metadata Automation

**Purpose:** Design a comprehensive solution to automatically populate issue metadata (type, labels, assignee, project, custom fields, status) at creation, enforce Definition of Done across both issues and PRs, and prevent silent issue reopening.

**Scope:**

- Fix 5 critical workflow gaps
- Implement 3 new validation workflows
- Add 40+ labeling rules
- Update 7 configuration files
- Create AI agent guidance document

---

## Executive Solution Summary

### The Core Problem

```
When an issue is created (by AI agent or human):
  Current State:
    ✅ Body has template sections
    ❌ Issue type not set (guessed from keywords)
    ❌ Area/component labels not applied
    ❌ Assignee not set
    ❌ Project not assigned
    ❌ Custom fields empty
    ❌ Status shows "open" with no context

  Result: Issue requires manual cleanup before processing
```

### The Proposed Solution

```
When an issue is created:
  New State:
    ✅ Body has template sections (unchanged)
    ✅ Issue type automatically set from template selection
    ✅ Area/component labels inferred from body keywords
    ✅ Assignee defaults to code owner (from CODEOWNERS)
    ✅ Project assigned to .github (ID #33)
    ✅ Custom fields auto-populated (Risk, Impact, Domain, etc.)
    ✅ Status set to "status:needs-triage" (ready for triage)

  Result: Issue ready for processing immediately
```

---

## Part 1: Critical Fixes (Priority 1)

### Fix 1.1: Remove Non-existent Label Reference

**File:** `.github/label-governance-policy.yml`  
**Change:** Remove `comp:help-tabs` from `never_delete_labels` (line 61)  
**Effort:** 5 minutes  
**Verification:** Validate config with `scripts/validation/validate-labeling-configs.cjs`

```diff
# label-governance-policy.yml
never_delete_labels:
  - type:bug
  - type:feature
  - ... (other labels)
  - meta:dependabot-security
- - comp:help-tabs  # ← REMOVE THIS LINE (label doesn't exist in labels.yml)
  - meta:duplicate
```

---

### Fix 1.2: Add Missing Type Label Aliases

**File:** `.github/labels.yml`  
**Changes:** Add alias mappings for 8 type labels that lack them  
**Effort:** 30 minutes  
**Impact:** Bare labels like `feature`, `task`, `chore` will be preserved/migrated instead of deleted

```diff
# labels.yml

- name: type:feature
  color: 1A7F37
+ aliases:
+   - feature
+   - feat
+   - enhancement
+   - feature-request

- name: type:task
  color: 6E7781
+ aliases:
+   - task
+   - todo

- name: type:chore
  color: D29922
+ aliases:
+   - chore
+   - housekeeping

- name: type:refactor
  color: A371F7
+ aliases:
+   - refactor
+   - cleanup
+   - refactoring

- name: type:improve
  color: 3FB950
+ aliases:
+   - improve
+   - improvement
+   - enhancement

- name: type:ci
  color: 0969DA
+ aliases:
+   - ci
+   - ci/cd

- name: type:build
  color: 0969DA
+ aliases:
+   - build
+   - build-system

- name: type:epic
  color: A371F7
+ aliases:
+   - epic
```

---

### Fix 1.3: Implement Issue-Body Labeling Rules

**File:** `.github/labeler.yml`  
**Changes:** Add `issues:` section with 25+ issue-based rules  
**Effort:** 3-4 hours  
**Impact:** Issues created from templates automatically get correct `type:*`, `area:*`, and `priority:*` labels

**Logic:**

```yaml
# Add to labeler.yml after 'pull_requests:' section

issues:
  # Type label detection (by body content & template keywords)
  - body-contains:
      - regex: 'bug|defect|regression|error|crash|failed'
      - weight: 10
    label: type:bug
    
  - body-contains:
      - regex: 'feature|enhancement|new capability|new feature'
      - weight: 10
    label: type:feature
    
  - body-contains:
      - regex: 'chore|housekeeping|cleanup|maintenance'
      - weight: 8
    label: type:chore
    
  - body-contains:
      - regex: 'refactor|code quality|simplify|restructure'
      - weight: 8
    label: type:refactor
    
  - body-contains:
      - regex: 'epic|initiative|phase|milestone|delivery|roadmap'
      - weight: 10
    label: type:epic
    
  - body-contains:
      - regex: 'story|user story|narrative|acceptance criteria'
      - weight: 9
    label: type:story
    
  - body-contains:
      - regex: 'task|work item|TODO|action item'
      - weight: 7
    label: type:task
    
  # ... continue for all 32 types (see full implementation in Part 3)
  
  # Area label detection (by keywords/scope)
  - body-contains:
      - regex: 'block-editor|gutenberg|blocks|block variation|block support'
      - weight: 10
    label: area:block-editor
    
  - body-contains:
      - regex: 'theme\.json|theme|styles|style engine'
      - weight: 10
    label: area:theme
    
  # ... continue for all 20+ area labels
  
  # Priority inference (by type/severity)
  - labels-contain:
      - type:security
    add-label: priority:critical
    
  - labels-contain:
      - type:bug
    add-label: priority:high
    
  # ... continue for priority rules
```

**Template-Specific Signals:**

```yaml
  # When body contains evidence of specific template usage
  - body-contains:
      - regex: '## Definition of Ready \(DoR\).*## Definition of Done \(DoD\)'
    label: meta:template-compliant
    
  - body-contains:
      - regex: '## Acceptance Criteria'
    label: meta:has-ac
    
  - body-contains:
      - regex: '## Steps to Reproduce'
    label: meta:has-repro
```

---

### Fix 1.4: Fix Template-Enforcement Issue Reopening

**File:** `.github/workflows/template-enforcement.yml`  
**Changes:** Replace silent reopening with detailed guidance  
**Effort:** 2-3 hours  
**Impact:** Users get actionable feedback instead of silent reopening

**Current problematic code (lines 211-221):**

```javascript
if (missingSections.length > 0 && !hasNeedsMoreInfo) {
  await github.rest.issues.update({
    issue_number: issue.number,
    state: 'open',  // ← SILENT REOPEN
  });
  // Posts generic comment
}
```

**Proposed replacement:**

```javascript
// Instead of REOPENING, POST DETAILED GUIDANCE
if (missingSections.length > 0 && !hasNeedsMoreInfo) {
  const detailedMessage = `
  ⚠️ **Issue Missing Required Sections**
  
  This issue cannot remain closed until it includes all required template sections.
  
  **Missing sections:**
  ${missingSections.map(s => `- [ ] ${s}`).join('\n')}
  
  **What to do:**
  1. Click "Edit" to reopen the issue and update the body
  2. Add the missing sections using the [issue template](/.github/ISSUE_TEMPLATE/)
  3. Keep the Definition of Ready (DoR) and Definition of Done (DoD) sections
  4. Close the issue again when complete
  
  **Template reference:**
  - [Bug Template](/.github/ISSUE_TEMPLATE/01-bug.md)
  - [Feature Template](/.github/ISSUE_TEMPLATE/03-feature.md)
  - [Task Template](/.github/ISSUE_TEMPLATE/08-task.md)
  - [All Templates](/.github/ISSUE_TEMPLATE/)
  
  If you intentionally closed this without a full template, add the \`meta:force-close\` label to override.
  `;
  
  // POST COMMENT WITH GUIDANCE (don't reopen)
  await github.rest.issues.createComment({
    issue_number: issue.number,
    body: detailedMessage
  });
  
  // ADD LABEL TO SIGNAL INCOMPLETE
  await github.rest.issues.addLabels({
    issue_number: issue.number,
    labels: ['status:needs-template-fix']
  });
  
  // DO NOT REOPEN - let user decide
  // This prevents the "silent reopening" frustration
}
```

**Key Changes:**

- ❌ Don't reopen silently
- ✅ Post detailed comment explaining WHAT'S missing
- ✅ Add label `status:needs-template-fix` for visibility
- ✅ Link to template examples
- ✅ Provide "force-close" escape hatch (via `meta:force-close` label)
- ✅ Set commit status to FAILURE for visibility in commit history

---

### Fix 1.5: Add Issue DoD Validation Before Close

**File:** `.github/workflows/validate-issue-dod-before-close.yml` (NEW)  
**Changes:** Create new workflow to prevent issues from closing with unchecked DoD items  
**Effort:** 2-3 hours  
**Impact:** Issues can only be closed when all DoD checklist items are marked `[x]`

**Workflow trigger:**

```yaml
name: Validate Issue DoD Before Close

on:
  issues:
    types: [closed]

jobs:
  validate-dod:
    runs-on: ubuntu-latest
    steps:
      - name: Check DoD Checklist Completion
        uses: actions/github-script@v7
        with:
          script: |
            const issue = context.payload.issue;
            
            // Extract DoD section from issue body
            const dodMatch = issue.body?.match(
              /## Definition of Done \(DoD\)([\s\S]*?)(?=##|$)/
            );
            
            if (!dodMatch) {
              // No DoD section - check if meta:force-close label present
              const labels = issue.labels.map(l => l.name);
              if (labels.includes('meta:force-close')) {
                return; // Allowed to close without DoD
              }
              
              // Reopen with guidance
              await github.rest.issues.update({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: issue.number,
                state: 'open'
              });
              
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: issue.number,
                body: '⚠️ This issue is missing a Definition of Done (DoD) checklist. Please add one before closing.'
              });
              
              core.setFailed('Issue missing DoD section');
              return;
            }
            
            // Parse DoD items
            const dodSection = dodMatch[1];
            const checkboxes = dodSection.match(/- \[([ xX])\]/g) || [];
            const uncheckedItems = checkboxes.filter(
              item => item.includes('[ ]')
            ).length;
            
            if (uncheckedItems > 0) {
              const labels = issue.labels.map(l => l.name);
              
              // If meta:force-close label present, allow closing
              if (labels.includes('meta:force-close')) {
                console.log('Force-close enabled, allowing close with incomplete DoD');
                return;
              }
              
              // Otherwise, reopen
              await github.rest.issues.update({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: issue.number,
                state: 'open'
              });
              
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: issue.number,
                body: `⚠️ Cannot close this issue with incomplete Definition of Done.
                
**Incomplete items:** ${uncheckedItems}/${checkboxes.length}

Please mark all items as complete (\`[x]\`) before closing, or add the \`meta:force-close\` label if you're intentionally skipping DoD.`
              });
              
              core.setFailed(`Issue has ${uncheckedItems} incomplete DoD items`);
              return;
            }
            
            // All DoD items complete - allow close
            console.log('Issue DoD complete, close allowed');
```

---

## Part 2: Enhanced Automation (Priority 2)

### Feature 2.1: PR Merge Blocker (DoD Validation)

**File:** `.github/workflows/validate-linked-issue-dod-on-pr.yml` (NEW)  
**Changes:** Create workflow to block PR merge if linked issue has incomplete DoD  
**Effort:** 3-4 hours  
**Impact:** PRs cannot merge until linked issue's DoD is complete

**Key Logic:**

```yaml
name: Validate Linked Issue DoD for PR Merge

on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]

jobs:
  check-linked-issue-dod:
    runs-on: ubuntu-latest
    steps:
      - name: Find Linked Issues
        id: find-issues
        uses: actions/github-script@v7
        with:
          script: |
            const pr = context.payload.pull_request;
            
            // Parse PR body for linked issues (closes #123, fixes #456)
            const linkedIssuesRegex = /(?:closes|fixes|resolves)\s+#(\d+)/gi;
            const matches = [...pr.body.matchAll(linkedIssuesRegex)];
            const issueNumbers = matches.map(m => parseInt(m[1]));
            
            return issueNumbers;
      
      - name: Validate Each Linked Issue DoD
        uses: actions/github-script@v7
        with:
          script: |
            const linkedIssues = ${{ steps.find-issues.outputs.result }};
            let blockedReasons = [];
            
            for (const issueNumber of linkedIssues) {
              const issue = await github.rest.issues.get({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: issueNumber
              });
              
              // Check if issue has incomplete DoD
              const dodMatch = issue.data.body?.match(
                /## Definition of Done \(DoD\)([\s\S]*?)(?=##|$)/
              );
              
              if (!dodMatch) {
                blockedReasons.push(`Issue #${issueNumber} missing DoD section`);
                continue;
              }
              
              const checkboxes = dodMatch[1].match(/- \[([ xX])\]/g) || [];
              const unchecked = checkboxes.filter(
                item => item.includes('[ ]')
              ).length;
              
              if (unchecked > 0) {
                blockedReasons.push(
                  `Issue #${issueNumber} has ${unchecked}/${checkboxes.length} incomplete DoD items`
                );
              }
            }
            
            if (blockedReasons.length > 0) {
              core.setFailed(blockedReasons.join('\n'));
              
              // Post PR comment
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.issue.number,
                body: `❌ **Cannot merge: Linked issue(s) incomplete**\n\n${blockedReasons.map(r => `- ${r}`).join('\n')}\n\nComplete the linked issue(s) before merging this PR.`
              });
            }
```

---

### Feature 2.2: Custom Field Auto-Population

**File:** `.github/workflows/populate-custom-fields-on-create.yml` (NEW)  
**Changes:** Auto-populate 7 custom fields based on issue type and content  
**Effort:** 4-5 hours  
**Impact:** Custom fields (Risk, Impact, Domain, Team, Effort, etc.) pre-filled, reducing manual work

**Logic:**

```javascript
// Logic for custom field inference:

function inferCustomFields(issue, labels) {
  const fields = {};
  
  // Risk: High if security; Medium if bug; Low if task
  if (labels.includes('type:security')) {
    fields.Risk = 'High';
  } else if (labels.includes('type:bug')) {
    fields.Risk = 'Medium';
  } else {
    fields.Risk = 'Low';
  }
  
  // Customer Impact: Infer from type + keywords
  if (labels.includes('type:bug') || labels.includes('priority:critical')) {
    fields.CustomerImpact = 'High';
  } else if (labels.includes('type:feature') || labels.includes('type:enhancement')) {
    fields.CustomerImpact = 'Medium';
  } else {
    fields.CustomerImpact = 'Low';
  }
  
  // Technical Impact: Same as Customer Impact for this domain
  fields.TechnicalImpact = fields.CustomerImpact;
  
  // Domain: Infer from area label
  const areaLabel = labels.find(l => l.startsWith('area:'));
  if (areaLabel) {
    const areaDomain = {
      'area:block-editor': 'wordpress-block-theme',
      'area:theme': 'wordpress-block-theme',
      'area:woocommerce': 'wordpress-block-plugin',
      // ... map all areas to domains
    };
    fields.Domain = areaDomain[areaLabel] || 'dotgithub';
  } else {
    fields.Domain = 'dotgithub'; // default
  }
  
  // Team: Infer from area label + CODEOWNERS
  const areaToTeam = {
    'area:block-editor': 'Blocks',
    'area:theme': 'Theming',
    'area:ci': 'DevOps',
    // ... map areas to teams
  };
  fields.Team = areaToTeam[areaLabel] || 'General';
  
  // Effort: Rough estimation from type + body length
  const bodyLength = issue.body?.length || 0;
  if (labels.includes('type:epic')) {
    fields.Effort = bodyLength > 500 ? '13' : '8';
  } else if (labels.includes('type:story')) {
    fields.Effort = bodyLength > 300 ? '8' : '5';
  } else if (labels.includes('type:task')) {
    fields.Effort = bodyLength > 200 ? '3' : '2';
  } else if (labels.includes('type:bug')) {
    fields.Effort = bodyLength > 300 ? '5' : '3';
  } else {
    fields.Effort = '2'; // default
  }
  
  return fields;
}
```

---

### Feature 2.3: Template-Aware Type Assignment

**File:** `.github/workflows/issues.yml` (ENHANCED)  
**Changes:** Improve type detection to use template signals  
**Effort:** 1-2 hours  
**Impact:** Issue type more accurately detected from template selection

**Current logic (to replace):**

```javascript
// OLD: Keyword-only detection
const typeFromKeywords = detectTypeFromKeywords(issue.body);
if (typeFromKeywords) {
  labels.push(typeFromKeywords);
} else {
  labels.push('type:task'); // fallback
}
```

**Proposed logic:**

```javascript
// NEW: Template-aware + keyword detection
let typeLabel = null;

// First: Try to detect from template metadata
// (If issue body contains "Created from: XX.md" comment)
const templateMatch = issue.body?.match(/Created from:\s+(.+?)\.md/);
if (templateMatch) {
  const templateName = templateMatch[1];
  const templateToType = {
    '01-bug': 'type:bug',
    '03-feature': 'type:feature',
    '02-code-refactor': 'type:refactor',
    '08-task': 'type:task',
    '09-chore': 'type:chore',
    '05-epic': 'type:epic',
    '06-story': 'type:story',
    // ... map all 25 templates
  };
  typeLabel = templateToType[templateName];
}

// Second: Fall back to keyword detection
if (!typeLabel) {
  typeLabel = detectTypeFromKeywords(issue.body);
}

// Third: Final fallback
if (!typeLabel) {
  typeLabel = 'type:task';
}

labels.push(typeLabel);
```

---

## Part 3: AI Agent Guidance Documentation

### New File: `.github/ISSUE_CREATION_GUIDE.md`

**Purpose:** Clear instructions for AI agents (and humans) on creating issues with correct metadata  
**Sections:**

1. Required sections (DoR, DoD)
2. Template selection guide
3. Keyword mapping (for label inference)
4. Custom field population
5. Examples for each issue type
6. Validation checklist

---

## Part 4: Implementation Checklist

### Phase 1: Critical Fixes (Weeks 1-2)

- [ ] **Fix 1.1** - Remove non-existent label
  - File: `.github/label-governance-policy.yml`
  - PR: `fix/remove-nonexistent-label`
  - Tests: Run label validation script

- [ ] **Fix 1.2** - Add missing type label aliases
  - File: `.github/labels.yml`
  - PR: `fix/add-missing-type-aliases`
  - Tests: Verify alias migration works in labeling.yml

- [ ] **Fix 1.3** - Implement issue-body labeling rules
  - File: `.github/labeler.yml`
  - PR: `feat/issue-based-labeling-rules`
  - Tests: Create test issues, verify labels applied

- [ ] **Fix 1.4** - Fix template-enforcement reopening
  - File: `.github/workflows/template-enforcement.yml`
  - PR: `fix/template-enforcement-detailed-guidance`
  - Tests: Create incomplete issue, verify comment + label instead of reopen

- [ ] **Fix 1.5** - Add issue DoD validation
  - File: `.github/workflows/validate-issue-dod-before-close.yml` (NEW)
  - PR: `feat/validate-issue-dod-before-close`
  - Tests: Create issue with incomplete DoD, verify close blocked

### Phase 2: Enhanced Automation (Weeks 3-4)

- [ ] **Feature 2.1** - PR merge blocker
  - File: `.github/workflows/validate-linked-issue-dod-on-pr.yml` (NEW)
  - PR: `feat/validate-linked-issue-dod-on-pr`
  - Tests: Create PR linking incomplete issue, verify merge blocked

- [ ] **Feature 2.2** - Custom field population
  - File: `.github/workflows/populate-custom-fields-on-create.yml` (NEW)
  - PR: `feat/populate-custom-fields`
  - Tests: Create issues of each type, verify fields auto-populated

- [ ] **Feature 2.3** - Template-aware type detection
  - File: `.github/workflows/issues.yml` (ENHANCED)
  - PR: `feat/template-aware-type-detection`
  - Tests: Create issues from each template, verify correct type

### Phase 3: Documentation (Week 4-5)

- [ ] **Create AI Agent Guidance**
  - File: `.github/ISSUE_CREATION_GUIDE.md` (NEW)
  - PR: `docs/issue-creation-guide`
  - Tests: N/A (documentation)

- [ ] **Update AGENTS.md**
  - File: `AGENTS.md`
  - Add section: "Issue Creation Best Practices"
  - PR: `docs/update-agents-issue-guidance`
  - Tests: N/A (documentation)

- [ ] **Create Test Suite**
  - File: `scripts/test/issue-automation.test.js` (NEW)
  - PR: `test/issue-automation-test-suite`
  - Tests: Run full test suite

### Phase 4: Validation & Rollout (Week 5)

- [ ] **End-to-End Testing**
  - Test all workflows together
  - Create issues from each of 25 templates
  - Verify all metadata auto-populated
  - Test PR merge blocking
  - Test DoD validation

- [ ] **Documentation Review**
  - Review issue creation guide
  - Review AGENTS.md updates
  - Verify all links work

- [ ] **Merge & Deploy**
  - Merge all PRs to develop
  - Verify CI/CD passes
  - Deploy to production

---

## Part 5: Testing Strategy

### Test Matrix

| Test Case | Input | Expected Output | Validation |
|-----------|-------|---|---|
| Bug template | Create issue from bug.md | type:bug + area:* + priority:high | Labels correct |
| Feature template | Create issue from feature.md | type:feature + area:* | Labels correct |
| Epic template | Create issue from epic.md | type:epic | Labels correct |
| Incomplete DoD | Create issue, try to close with unchecked DoD | Issue reopens, comment posted | Issue remains open |
| PR merge blocked | Create PR linking issue with incomplete DoD | PR merge blocked | Merge button disabled + comment |
| Custom fields | Create issue of type:bug | Risk=Medium, Impact=Medium | Fields populated |
| Force-close | Add meta:force-close label, close issue | Issue closes despite incomplete DoD | Close allowed |

### Test Issues to Create

1. **Bug issue** from bug.md template
   - Expected: type:bug, priority:high, area:[detected], Risk=Medium

2. **Feature issue** from feature.md template
   - Expected: type:feature, area:[detected], Risk=Low

3. **Epic issue** from epic.md template
   - Expected: type:epic

4. **Issue with incomplete DoD** (manual template, missing [x])
   - Expected: Cannot close; reopen + comment

5. **PR linking incomplete issue**
   - Expected: Merge blocked + PR comment

6. **Issue with security keyword**
   - Expected: type:security, priority:critical, Risk=High

---

## Part 6: Risk Assessment & Mitigation

### Risk: Breaking Existing Issues

**Impact:** HIGH | **Likelihood:** LOW | **Mitigation:**

- Add `meta:legacy-issue` label to issues created before rollout
- Exclude legacy issues from DoD enforcement
- Provide data migration script to retroactively add missing sections to existing issues

### Risk: Over-Aggressive Labeling

**Impact:** MEDIUM | **Likelihood:** MEDIUM | **Mitigation:**

- Use weight/confidence scores in labeling rules
- Require manual review for ambiguous cases
- Implement label suggestion (readonly comments) instead of auto-apply for low-confidence matches

### Risk: Custom Field Inference Errors

**Impact:** MEDIUM | **Likelihood:** LOW | **Mitigation:**

- Provide sensible defaults (fields can always be manually updated)
- Log all inferences for audit/review
- Include comment in issue body explaining how fields were auto-populated

### Risk: Workflow Performance (too many checks)

**Impact:** MEDIUM | **Likelihood:** LOW | **Mitigation:**

- Optimize GitHub Script usage (batch API calls where possible)
- Use webhooks instead of polling where applicable
- Monitor workflow execution times and set SLAs

---

## Conclusion

This solution design comprehensively addresses all 5 critical issues and 5 major gaps identified in the audit. Implementation follows a phased approach:

1. **Phase 1** (Weeks 1-2): Fix critical issues blocking AI agent usage
2. **Phase 2** (Weeks 3-4): Add enhanced automation
3. **Phase 3** (Week 4-5): Document and test
4. **Phase 4** (Week 5): Validate and deploy

**Total Effort:** ~37.5 hours | **Timeline:** 5 weeks | **Risk:** LOW with proposed mitigations

**Success Criteria:**

- ✅ Issues created by AI agents have correct metadata at creation
- ✅ Issue types applied from template selection
- ✅ All custom fields auto-populated
- ✅ DoD enforced on both issues and PRs
- ✅ PR merges blocked if linked issues incomplete
- ✅ No silent issue reopening (clear guidance provided)
- ✅ All 158 labels protected in governance
- ✅ Documented best practices for AI agents

---

**Report Prepared By:** Architecture Review  
**Date:** 2026-07-23  
**Status:** Ready for Implementation Phase  
**Next Steps:** Review design, approve changes, begin Phase 1 implementation
