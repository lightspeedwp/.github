# Quickstart: Code Review & PR Governance Validation Scenarios

**Phase 1 Design Deliverable** | **Date**: 2026-09-17 | **Scope**: End-to-end validation of code review instructions + PR governance automation

---

## Overview

This document provides step-by-step validation scenarios proving the enhanced CodeRabbit configuration works end-to-end across:

1. Code review instructions (FR-001 through FR-015)
2. PR governance automation (FR-016 through FR-019)

Each scenario includes prerequisites, setup commands, test/run commands, and expected outcomes.

---

## Scenario 1: Code Review Instructions - SpecKit Files

**Feature**: Code reviewers get specific guidance when reviewing `.specify/spec.md` files

**Priority**: P1 (User Story 1 & 4)

**Prerequisites**:

- Enhanced `.coderabbit.yml` deployed to organization
- Test repository with `.specify/spec.md` file
- GitHub Actions enabled for PR workflow

**Test Steps**:

1. **Create feature branch**:

   ```bash
   git checkout -b feat/speckit-review-test
   ```

2. **Create test specification file** (`.specify/spec.md`):

   ```markdown
   # Test Feature Specification
   
   ## User Scenarios & Testing
   
   ### User Story 1 - Test Story
   As a user, I need X, so that Y.
   
   **Why this priority**: P1
   **Independent Test**: Can test by doing Z
   
   **Acceptance Scenarios**:
   1. **Given** A, **When** B, **Then** C
   
   ## Requirements
   
   - **FR-001**: Something MUST do X
   
   ## Success Criteria
   
   - **SC-001**: Outcome is measurable and testable
   ```

3. **Create PR**:

   ```bash
   git add .specify/spec.md
   git commit -m "feat: add test specification"
   git push -u origin feat/speckit-review-test
   gh pr create --title "feat: add test specification" --body "Test PR for specification review"
   ```

4. **Observe CodeRabbit review**:
   - CodeRabbit should post review comments citing:
     - "## Specification Review" instruction block
     - Focus Area 1: Completeness checks
     - Focus Area 2: Clarity checks
     - Focus Area 3: Consistency checks

**Expected Outcome**: ✅ CodeRabbit cites specification-specific guidance (FR-007, SC-007, SC-009)

---

## Scenario 2: Code Review Instructions - Branch Type Context

**Feature**: Code reviewers receive context-appropriate guidance based on branch type

**Priority**: P2 (User Story 3)

**Prerequisites**:

- Enhanced `.coderabbit.yml` with branch context documentation
- Test repositories for multiple branch types
- Branch naming strategy enforced (CLAUDE.md)

**Test Steps**:

1. **Security branch with authentication changes**:

   ```bash
   git checkout -b security/auth-validation-fix
   # Modify authentication code file
   git commit -m "security: fix auth validation vulnerability"
   git push -u origin security/auth-validation-fix
   gh pr create --title "security: fix auth validation" --body "CVE fix for authentication validation"
   ```

   **Expected**: CodeRabbit emphasizes security focus areas (threat modeling, access control, secrets handling)

2. **Feature branch with code changes**:

   ```bash
   git checkout -b feat/user-preferences-panel
   # Modify feature code
   git commit -m "feat: add user preferences panel"
   git push -u origin feat/user-preferences-panel
   gh pr create --title "feat: user preferences panel" --body "New user-facing feature"
   ```

   **Expected**: CodeRabbit emphasizes feature-specific guidance (testing, documentation, changelog)

3. **Documentation branch**:

   ```bash
   git checkout -b docs/branching-strategy-guide
   # Modify documentation
   git commit -m "docs: expand branching strategy guide"
   git push -u origin docs/branching-strategy-guide
   gh pr create --title "docs: expand branching guide" --body "Documentation improvements"
   ```

   **Expected**: CodeRabbit emphasizes documentation-specific guidance (clarity, structure, links)

**Expected Outcome**: ✅ Reviews reference branch-type-specific priorities from `docs/BRANCHING_STRATEGY.md` Section 5.3 (FR-006, FR-013, SC-011)

---

## Scenario 3: PR Governance - Template Validation

**Feature**: CodeRabbit validates PR descriptions include required sections and correct format

**Priority**: P1 (FR-016, SC-014)

**Prerequisites**:

- PR governance automation enabled in `.coderabbit.yml`
- PR templates in `.github/PULL_REQUEST_TEMPLATE/` matching branch types
- test Repository with GitHub Actions

**Test Steps**:

1. **Well-formed PR** (should pass validation):

   ```bash
   git checkout -b feat/well-formed-test
   echo "# Test Feature" > test-file.md
   git add test-file.md
   git commit -m "feat: test feature"
   git push -u origin feat/well-formed-test
   gh pr create --title "feat: test feature" --body "
   ## Linked Issues
   
   Fixes #1234
   
   ## Changelog
   
   Added new test feature for validation
   
   ## Checklist
   
   - [x] Code tested locally
   - [x] Documentation updated
   - [x] Changelog entry added
   "
   ```

   **Expected**: ✅ CodeRabbit posts approval comment (template valid)

2. **Incomplete PR** (should fail validation):

   ```bash
   git checkout -b feat/incomplete-test
   echo "# Incomplete Test" > test-file.md
   git add test-file.md
   git commit -m "feat: incomplete test"
   git push -u origin feat/incomplete-test
   gh pr create --title "feat: incomplete test" --body "
   ## Linked Issues
   
   TODO: add issue link
   
   ## Changelog
   
   TODO: add changelog
   
   ## Checklist
   
   - [ ] Code tested locally
   - [ ] Documentation updated
   "
   ```

   **Expected**: ❌ CodeRabbit posts warning (missing: valid issue link, placeholder changelog, unchecked items)

**Expected Outcome**: ✅ Template validation flags incomplete/placeholder PRs (SC-014 ≥95% accuracy)

---

## Scenario 4: PR Governance - Label Enforcement

**Feature**: CodeRabbit validates labels follow canonical prefix structure and suggests missing labels

**Priority**: P1 (FR-017, SC-015)

**Prerequisites**:

- Label enforcement enabled in `.coderabbit.yml`
- Canonical labels defined in `.github/labels.yml`
- PR without any labels initially

**Test Steps**:

1. **Create PR without labels**:

   ```bash
   git checkout -b feat/label-test
   echo "# Feature" > test.md
   git add test.md
   git commit -m "feat: test feature"
   git push -u origin feat/label-test
   gh pr create --title "feat: test feature" --body "Test PR for label enforcement"
   # Do NOT add any labels
   ```

   **Expected**: CodeRabbit posts comment suggesting:
   - `type:feature` (from branch prefix feat/)
   - `status:needs-triage` (default for new PR)
   - `area:testing` (if changed files suggest test-related area)

2. **Create PR with partial labels**:

   ```bash
   git checkout -b fix/label-partial
   echo "# Bug fix" > bug-fix.md
   git add bug-fix.md
   git commit -m "fix: resolve bug"
   git push -u origin fix/label-partial
   gh pr create --title "fix: resolve bug" --body "Bug fix PR"
   gh pr edit --add-label "type:bug"
   # PR has type:bug but missing status:* and area:*
   ```

   **Expected**: CodeRabbit suggests:
   - `status:needs-triage` (missing required status family)
   - `area:testing` (optional, but suggested based on changed files)

**Expected Outcome**: ✅ Label enforcement validates families and suggests missing labels (SC-015 ≥85% accuracy)

---

## Scenario 5: PR Governance - DoD Checklist Automation

**Feature**: CodeRabbit populates PR description with Definition of Done checklist items

**Priority**: P2 (FR-018, SC-016)

**Prerequisites**:

- DoD automation enabled in `.coderabbit.yml`
- Checklist templates defined for feature, bugfix, docs scopes

**Test Steps**:

1. **Feature PR without DoD section**:

   ```bash
   git checkout -b feat/dod-test
   echo "# Feature" > feature.md
   git add feature.md
   git commit -m "feat: new feature"
   git push -u origin feat/dod-test
   gh pr create --title "feat: new feature" --body "
   ## Summary
   
   New feature implementation
   "
   ```

   **Expected**: CodeRabbit appends:

   ```markdown
   ## Definition of Done
   
   - [ ] Code changes tested locally (manual or automated)
   - [ ] Accessibility (WCAG 2.2 AA) verified
   - [ ] Performance impact assessed
   - [ ] Security review completed
   - [ ] Documentation updated
   - [ ] Changelog entry added
   - [ ] Related issues linked
   ```

2. **Bug fix PR**:

   ```bash
   git checkout -b fix/dod-test
   echo "# Bug fix" > bug.md
   git add bug.md
   git commit -m "fix: resolve bug"
   git push -u origin fix/dod-test
   gh pr create --title "fix: resolve bug" --body "Bug fix description"
   ```

   **Expected**: CodeRabbit appends bugfix-specific checklist (5 items: root cause, verification, regression test, changelog, linked issues)

**Expected Outcome**: ✅ DoD checklist auto-populated; maintainers report ≥90% relevance (SC-016)

---

## Scenario 6: PR Governance - Documentation Validation Failure Handling

**Feature**: CodeRabbit handles documentation validation failures gracefully with actionable commentary

**Priority**: P2 (FR-019, SC-017)

**Prerequisites**:

- Documentation validation enabled in `.coderabbit.yml`
- Linter CI workflow configured (e.g., markdownlint)
- Test documentation files with intentional violations

**Test Steps**:

1. **Critical file with broken links** (should block):

   ```bash
   git checkout -b fix/docs-links
   echo "# Documentation\n\n[Broken Link](https://internal-url-404.com)" > README.md
   git add README.md
   git commit -m "fix: update documentation"
   git push -u origin fix/docs-links
   gh pr create --title "fix: update docs" --body "Documentation fix"
   ```

   **Expected**: Linter detects broken link → CodeRabbit posts:
   - "❌ Documentation validation failed: broken links in README.md"
   - "This is a critical file; broken links must be fixed"
   - "Fix suggestion: Run markdownlint and verify all links return 200 OK"
   - Review blocked until resolved

2. **Non-critical file with linting error** (should warn):

   ```bash
   git checkout -b docs/style-guide
   echo "# Style Guide\n\n## No space heading" > docs/STYLE.md
   git add docs/STYLE.md
   git commit -m "docs: add style guide"
   git push -u origin docs/style-guide
   gh pr create --title "docs: style guide" --body "Documentation guide"
   ```

   **Expected**: Linter detects linting error → CodeRabbit posts:
   - "⚠️ Documentation validation warning: linting error in docs/STYLE.md"
   - "This is non-critical; not blocking review"
   - "Fix suggestion: Run `npm run lint:md` and fix violations"

3. **Auto-generated file with violations** (should skip):

   ```bash
   git checkout -b chore/generated-docs
   echo "# Auto-generated\n\nLinter violations here" > generated-docs.md
   git add generated-docs.md
   git commit -m "chore: update generated docs"
   git push -u origin chore/generated-docs
   gh pr create --title "chore: update generated docs" --body "Auto-generated update"
   ```

   **Expected**: Linter detects violations but CodeRabbit skips (file in skip_paths):
   - No comment posted (file excluded from validation)

**Expected Outcome**: ✅ Documentation validation actionable; zero silent failures (SC-017)

---

## Scenario 7: Cross-Repository Validation

**Feature**: Configuration applies consistently across diverse repository types

**Priority**: P2 (FR-001, SC-001)

**Prerequisites**:

- Enhanced `.coderabbit.yml` deployed to organization
- Multiple test repositories:
  - WordPress plugin (PHP)
  - Node.js/TypeScript package
  - Infrastructure-as-code (Terraform)
  - CLI tool
  - MCP server

**Test Steps**:

1. **WordPress plugin repository**:

   ```bash
   # Create PR with PHP code changes
   git checkout -b feat/plugin-feature
   echo "<?php // Plugin code" > plugin-file.php
   git commit -m "feat: new plugin feature"
   git push -u origin feat/plugin-feature
   gh pr create --title "feat: new plugin feature" --body "Plugin feature PR"
   ```

   **Expected**: CodeRabbit applies universal code quality guidance (technology-agnostic)

2. **Node.js/TypeScript repository**:

   ```bash
   git checkout -b feat/api-endpoint
   echo "export const handler = () => {}" > handler.ts
   git commit -m "feat: new API endpoint"
   git push -u origin feat/api-endpoint
   gh pr create --title "feat: new API endpoint" --body "API feature PR"
   ```

   **Expected**: CodeRabbit applies same universal guidance (not TS/Node-specific)

3. **Infrastructure-as-code repository**:

   ```bash
   git checkout -b feat/vpc-update
   echo "resource 'aws_vpc' 'main' { }" > vpc.tf
   git commit -m "feat: update VPC configuration"
   git push -u origin feat/vpc-update
   gh pr create --title "feat: update VPC" --body "Infrastructure update"
   ```

   **Expected**: CodeRabbit applies universal guidance (not Terraform-specific)

**Expected Outcome**: ✅ Configuration consistent across all project types; guidance is technology-agnostic (FR-006, SC-001, Constitution Principle IV)

---

## Validation Checklist

Run this checklist to verify implementation completeness:

**Code Review Instructions** (FR-001 through FR-015):

- [ ] Scenario 1 passes: SpecKit files get specific guidance
- [ ] Scenario 2 passes: Branch types inform review priorities
- [ ] ≥95% file type coverage (FR-001, SC-001)
- [ ] Each instruction block has ≥3 focus areas (FR-002, SC-002)
- [ ] No framework/language-specific guidance (FR-006, Constitution IV)
- [ ] Path pattern priority documented and working (FR-014, SC-012)
- [ ] Audit guide created (FR-015, SC-013)

**PR Governance Automation** (FR-016 through FR-019):

- [ ] Scenario 3 passes: Template validation works for well/incomplete PRs
- [ ] Scenario 4 passes: Label enforcement validates families and suggests missing labels
- [ ] Scenario 5 passes: DoD checklist auto-populated for each scope
- [ ] Scenario 6 passes: Documentation validation handles failures gracefully
- [ ] Template validation accuracy ≥95%/≥90% (SC-014)
- [ ] Label suggestion accuracy ≥85% (SC-015)
- [ ] DoD checklist relevance ≥90% (SC-016)
- [ ] Documentation validation zero silent failures (SC-017)

**Cross-Repository** (FR-001, SC-001):

- [ ] Scenario 7 passes: Configuration consistent across 5+ repo types
- [ ] Reviews cite relevant guidance (SC-009 ≥85%)
- [ ] All improvements additive (no breaking changes)

---

## Troubleshooting

**CodeRabbit not posting reviews**:

- Verify CodeRabbit app installed on repository
- Check that `.coderabbit.yml` is merged to main branch
- Confirm reviews.approve/request_changes settings correct

**Template validation not catching issues**:

- Verify PR template section headers match config rules
- Test with simpler section headers (e.g., "## Issues" vs "## Linked Issues")

**Label suggestions inaccurate**:

- Check branch-type mappings in label_enforcement.families.type.mapping
- Verify all suggestion labels exist in `.github/labels.yml`

**DoD checklist not appearing**:

- Verify dod_automation.enabled = true
- Check scope_detection matches actual PR scope
- Confirm templates have items defined for the detected scope

---

**Status**: ✅ QUICKSTART COMPLETE | Ready for implementation and testing
