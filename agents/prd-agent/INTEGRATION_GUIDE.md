# Integration Guide: PRD Agent v2.1 in Workflows

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![allocate-pr-issue-to-milestone](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![badges-documentation-update](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml)
[![badges-health-check](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml)
[![badges-readme-status](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml)
[![badges-workflow-audit](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
[![docs-maintenance](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml)
[![docs-validation](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![gitleaks-reusable](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml)
[![gitleaks-update](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml)
[![gitleaks](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml)
[![issue-create-enhanced](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml)
[![issue-create-enhanced](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml)
[![issue-fields-backfill](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml)
[![issue-health-audit](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml)
[![issue-labeling-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml)
[![issue-project-field-sync](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml)
[![issue-remediation-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml)
[![issue-remediation-bulk](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![label-audit-report](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml)
[![labeling-governance](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![manage-blocking-status-labels](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml)
[![meta-agent-validation](https://github.com/lightspeedwp/.github/actions/workflows/meta-agent-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-agent-validation.yml)
[![meta-labels-sync](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-pipeline](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml)
[![metrics-reporting](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml)
[![openspec-progress-phase](https://github.com/lightspeedwp/.github/actions/workflows/openspec-progress-phase.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-progress-phase.yml)
[![openspec-report-progression](https://github.com/lightspeedwp/.github/actions/workflows/openspec-report-progression.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-report-progression.yml)
[![openspec-sync-labels](https://github.com/lightspeedwp/.github/actions/workflows/openspec-sync-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-sync-labels.yml)
[![openspec-validate-labels](https://github.com/lightspeedwp/.github/actions/workflows/openspec-validate-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-validate-labels.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![pr-template-validation](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-validation.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-maintenance-nightly](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml)
[![project-maintenance-on-demand](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![validate-blocking-issue-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml)
[![validate-blocking-status-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml)
[![validate-dor-dod-sections](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml)
[![validate-issue-dod-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
[![validate-project-linking](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml)
<!-- BADGES-END -->

This guide shows how to integrate the PRD Agent v2.1 into your GitHub workflows, CI/CD pipelines, and project planning processes.

---

## Common Integration Patterns Summary

| Pattern | Trigger | Result | Use Case |
|---------|---------|--------|----------|
| **Auto-PRD Generation** | Issue created with label | PRD as comment | Quick PRD creation |
| **PR Validation** | PR opened | Check PR against PRD | Ensure requirements met |
| **Roadmap Generation** | PRD updated | ROADMAP.md generated | Communicate timeline |
| **Milestone Sync** | PRD phases updated | GitHub milestones created | Project planning |
| **Compatibility Check** | Code changes | WP version compatibility check | Ensure version support |
| **Accessibility Check** | Blocks modified | Accessibility reminder | Compliance assurance |

---

## Pattern 1: GitHub Issue Auto-PRD Generation

**Trigger:** Create an issue with the `needs-prd` label  
**Result:** Agent automatically generates PRD as a comment, ready to refine  

### Issue Template for PRD Generation

**File:** `.github/ISSUE_TEMPLATE/prd-request.yml`

```yaml
name: PRD Request
description: Request a Product Requirement Document
labels: ["needs-prd", "planning"]
body:
  - type: textarea
    id: project-description
    attributes:
      label: Project Description
      description: What are you building? What's the goal?
      placeholder: "We're building a custom gallery block plugin..."
    validations:
      required: true
  
  - type: textarea
    id: objectives
    attributes:
      label: Objectives & Success Criteria
      description: How will you know this is successful?
      placeholder: "1. Site builders can add custom galleries\n2. WCAG accessible..."
    validations:
      required: true
  
  - type: dropdown
    id: project-type
    attributes:
      label: Project Type (optional)
      description: Help us detect the right PRD template
      options:
        - Auto-detect from repo
        - Block Plugin
        - Block Theme
        - Hybrid (Plugin + Theme)
        - Custom/Other
    validations:
      required: false
  
  - type: textarea
    id: constraints
    attributes:
      label: Constraints & Assumptions
      description: Any specific WordPress versions, dependencies, or timeline?
      placeholder: "Target WP 6.5+, PHP 8.0+, needs to launch in 6 weeks..."
    validations:
      required: false
```

---

## Pattern 2: PR Validation Against PRD Template

**Trigger:** PR opened with code changes  
**Check:** Verify PR description includes version compatibility, accessibility requirements  
**Result:** Pass/fail check on PR; suggestions for improvements

### Example: `prd-validation.yml`

```yaml
name: Validate PR Against PRD Requirements
on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  validate-prd-alignment:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Check PR description for required sections
        id: check
        run: |
          PR_BODY="${{ github.event.pull_request.body }}"
          
          # Check for WordPress version info
          if echo "$PR_BODY" | grep -qi "wordpress version\|wp.*version\|compatibility"; then
            echo "has_wp_version=true" >> $GITHUB_OUTPUT
          else
            echo "has_wp_version=false" >> $GITHUB_OUTPUT
          fi
          
          # Check for accessibility info
          if echo "$PR_BODY" | grep -qi "wcag\|accessibility\|a11y"; then
            echo "has_accessibility=true" >> $GITHUB_OUTPUT
          else
            echo "has_accessibility=false" >> $GITHUB_OUTPUT
          fi
          
          # Check for testing info
          if echo "$PR_BODY" | grep -qi "testing\|tested\|test plan"; then
            echo "has_testing=true" >> $GITHUB_OUTPUT
          else
            echo "has_testing=false" >> $GITHUB_OUTPUT
          fi
      
      - name: Comment with suggestions
        if: |
          steps.check.outputs.has_wp_version != 'true' ||
          steps.check.outputs.has_accessibility != 'true' ||
          steps.check.outputs.has_testing != 'true'
        uses: actions/github-script@v7
        with:
          script: |
            const suggestions = [];
            
            if ('${{ steps.check.outputs.has_wp_version }}' !== 'true') {
              suggestions.push('⚠️ **WordPress Version Info** — Add which WordPress versions this PR tests against');
            }
            
            if ('${{ steps.check.outputs.has_accessibility }}' !== 'true') {
              suggestions.push('⚠️ **Accessibility** — Confirm WCAG 2.2 AA compliance or limitations of this change');
            }
            
            if ('${{ steps.check.outputs.has_testing }}' !== 'true') {
              suggestions.push('⚠️ **Testing Plan** — Describe testing across required WordPress versions');
            }
            
            if (suggestions.length > 0) {
              github.rest.issues.createComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: `## 📋 PRD Alignment Check\n\nTo align with PRD requirements, consider adding:\n\n${suggestions.join('\n')}`
              });
            }
```

---

## Pattern 3: WordPress Version Compatibility Check

**Trigger:** PR with code changes that affect blocks or themes  
**Check:** Verify code meets stated WordPress version requirements  
**Result:** Compatibility check pass/fail on PR  

### Example: `check-wp-compatibility.yml`

```yaml
name: Check WordPress Compatibility
on:
  pull_request:
    paths:
      - 'blocks/**'
      - 'src/**'
      - 'lib/**'
      - 'package.json'
      - 'composer.json'

jobs:
  check-compatibility:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        wordpress-version: ['6.4', '6.5', '6.6']
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup WordPress ${{ matrix.wordpress-version }}
        uses: lightspeedwp/actions/setup-wordpress@v1
        with:
          version: ${{ matrix.wordpress-version }}
      
      - name: Install dependencies
        run: |
          npm install
          composer install
      
      - name: Run tests
        run: npm run test
      
      - name: Check block registration
        run: npm run validate:blocks
      
      - name: Report compatibility
        if: failure()
        run: |
          echo "❌ Compatibility check failed for WP ${{ matrix.wordpress-version }}"
          exit 1
```

---

## Pattern 4: Accessibility Requirement Validation

**Trigger:** PR with code or documentation changes  
**Check:** Verify accessibility requirements are documented and met  
**Result:** Accessibility checklist on PR  

### Example: `accessibility-check.yml`

```yaml
name: Accessibility Requirements Check
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  check-accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Check for accessibility docs
        id: check
        run: |
          MODIFIED_FILES=$(git diff --name-only origin/main HEAD)
          
          # Check if any block files were modified
          if echo "$MODIFIED_FILES" | grep -q "blocks/"; then
            echo "blocks_modified=true" >> $GITHUB_OUTPUT
          fi
          
          # Check for accessibility documentation
          if grep -r "wcag\|accessibility\|a11y\|aria\|keyboard" . --include="*.md" | grep -q .; then
            echo "has_a11y_docs=true" >> $GITHUB_OUTPUT
          else
            echo "has_a11y_docs=false" >> $GITHUB_OUTPUT
          fi
      
      - name: Post accessibility reminder
        if: steps.check.outputs.blocks_modified == 'true' && steps.check.outputs.has_a11y_docs != 'true'
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## ♿ Accessibility Checklist\n\nBlock changes require accessibility documentation:\n\n- [ ] Keyboard navigation verified\n- [ ] Screen reader labels (ARIA) included\n- [ ] Color contrast meets WCAG AA\n- [ ] Focus indicators visible\n- [ ] Alt text for images\n\nPlease add accessibility documentation to PR description.`
            });
```

---

## Best Practices for Workflow Integration

### ✅ Do

- ✅ Auto-generate initial PRD, then refine with team input
- ✅ Validate PRs against PRD requirements (version, accessibility, testing)
- ✅ Sync PRD phases to GitHub milestones automatically
- ✅ Run compatibility tests for WordPress versions stated in PRD
- ✅ Document accessibility requirements explicitly
- ✅ Compare PRD versions when making significant changes

### ❌ Don't

- ❌ Auto-merge based on PRD validation (humans decide)
- ❌ Create GitHub issues from PRD sections automatically (too noisy)
- ❌ Assume workflow success means requirements are met (workflows check documentation, not implementation)
- ❌ Require all patterns for every repo (start with 1-2 that matter most)

---

## Setup Instructions

### Step 1: Copy Workflow Files

```bash
# Copy workflow examples to your repo
cp examples/workflows/*.yml .github/workflows/

# Copy issue template
cp examples/issue-templates/prd-request.yml .github/ISSUE_TEMPLATE/
```

### Step 2: Enable Workflows

```bash
# Make sure workflows are enabled in GitHub Actions settings
gh workflow enable prd-validation.yml
gh workflow enable check-wp-compatibility.yml
gh workflow enable accessibility-check.yml
```

---

## Related Documentation

- **[README.md](README.md)** — Quick start and usage examples
- **[ORGANIZATION_CONTEXT.md](ORGANIZATION_CONTEXT.md)** — Org-wide portability details
- **[CONTEXT_DETECTION.md](CONTEXT_DETECTION.md)** — Technical detection logic
- **[shared/core-prompt.md](shared/core-prompt.md)** — Complete agent prompt

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
