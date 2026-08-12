# GitHub Issues: Phase 1A Quick Wins

**Use these templates to create Phase 1A child issues. Copy each section below into separate GitHub issues.**

---

# Issue 1.A.1: Remove Legacy testing.yml

## Title

```
chore: Remove legacy testing.yml (duplicate of checks.yml)
```

## Issue Type

Select: **Task** (from `.github/ISSUE_TEMPLATE/08-task.md`)

## Description (Copy this entire markdown block)

```markdown
## Definition of Ready (DoR)

- [x] Audit confirms testing.yml duplicates checks.yml
- [x] No external repos reference this workflow
- [x] checks.yml covers all required test scenarios

## Problem

The `.github/workflows/testing.yml` workflow is a legacy duplicate of `checks.yml`. Running this workflow wastes ~2-3% of monthly GitHub Actions minutes by duplicating CI checks.

## Solution

Remove `testing.yml` entirely. `checks.yml` is the authoritative CI workflow and covers all validation needs.

## Acceptance Criteria

- [ ] File `.github/workflows/testing.yml` is deleted
- [ ] Git history shows clean file deletion
- [ ] No documentation references to testing.yml remain
- [ ] Verified no external repos depend on this workflow
- [ ] `checks.yml` still covers all test scenarios
- [ ] PR merged to develop

## Implementation Steps

1. [ ] Delete `.github/workflows/testing.yml`
2. [ ] Search docs for any references to testing.yml
3. [ ] Update any references to point to checks.yml
4. [ ] Verify checks.yml has all necessary validations
5. [ ] Create PR and request review
6. [ ] Merge to develop

## Definition of Done (DoD)

- [ ] Code changes follow repository style guidelines
- [ ] All references updated
- [ ] No breaking changes
- [ ] Manual verification: Workflows still trigger as expected
- [ ] Documentation updated if needed
- [ ] PR merged to develop
```

## Labels

```
type:task
effort:minimal
area:workflows
```

## Milestone

Set to current/next sprint

## Assignee

Assign to: Team member starting this phase

## Linked Issues

- Link to Epic: #1227

---

# Issue 1.A.2: Extract Template Validation Helpers

## Title

```
refactor: Extract template validation helpers to shared script
```

## Issue Type

Select: **Code Refactor** (from `.github/ISSUE_TEMPLATE/02-code-refactor.md`)

## Description (Copy this entire markdown block)

```markdown
## Definition of Ready (DoR)

- [x] Audit identifies code duplication in validate-pr-template.yml and template-enforcement.yml
- [x] Lines identified: validate-pr-template.yml lines 98-164, template-enforcement.yml lines 352-416
- [x] Jest testing infrastructure exists and is functional
- [x] Both workflows currently pass all tests

## Problem

The template validation logic is duplicated across two GitHub workflows:
- `validate-pr-template.yml` - validates PR body against required template sections
- `template-enforcement.yml` - validates issue body for DoR/DoD sections

Both workflows contain identical helper functions:
- `stripHtmlComments(text)` - removes HTML comments from text
- `sectionBody(body, headingRegex)` - extracts content between Markdown headings
- `hasIssueReference(sectionText)` - checks for issue references (#123)
- `hasChangelogEntry(sectionText)` - checks for changelog entries
- `hasCompletedChecklist(sectionText)` - checks for completed checkbox items
- `validatePullRequestBody(body, labels, headRef)` - orchestrates validation

This duplication creates a maintenance burden. The comment at line 98 of `validate-pr-template.yml` explicitly acknowledges this:
> "Keep these helpers in sync with .github/workflows/template-enforcement.yml until they are extracted into a shared script."

## Solution

Extract the shared validation helpers into a single shared script that both workflows import. This creates a single source of truth for validation logic.

## Scope

### New Files to Create
- `scripts/validation/template-helpers.cjs` - Contains extracted helper functions
- `scripts/validation/__tests__/template-helpers.test.js` - Unit tests for helpers

### Files to Modify
- `.github/workflows/validate-pr-template.yml` - Import helpers instead of defining them
- `.github/workflows/template-enforcement.yml` - Import helpers instead of defining them

## Implementation Steps

1. [ ] Create `scripts/validation/template-helpers.cjs` with all helper functions
2. [ ] Create `scripts/validation/__tests__/template-helpers.test.js` with >90% coverage tests
3. [ ] Update `validate-pr-template.yml` to import from shared script
4. [ ] Update `template-enforcement.yml` to import from shared script
5. [ ] Run unit tests: `npm test -- scripts/validation`
6. [ ] Manual testing: Create PR with invalid template and verify error
7. [ ] Manual testing: Create issue with invalid template and verify error
8. [ ] Run full test suite: `npm test`
9. [ ] Ensure linting passes: `npm run lint`

## Acceptance Criteria

- [ ] `scripts/validation/template-helpers.cjs` created with all helper functions
- [ ] `scripts/validation/__tests__/template-helpers.test.js` created with >90% coverage
- [ ] Both workflows import from shared script
- [ ] All helper functions removed from both workflows
- [ ] Both workflows still validate templates correctly
- [ ] PR and issue validation workflows post error comments correctly
- [ ] No changes to error message format
- [ ] All tests pass locally
- [ ] Linting passes
- [ ] PR merged to develop

## Definition of Done (DoD)

- [ ] Code changes follow repository style guidelines
- [ ] All new code has >90% test coverage
- [ ] No regression in template validation behavior
- [ ] Manual verification completed successfully
- [ ] No breaking changes to workflow output
- [ ] Documentation updated if needed
- [ ] PR merged to develop
```

## Labels

```
type:refactor
effort:medium
area:workflows
area:validation
```

## Milestone

Set to current/next sprint

## Assignee

Assign to: Team member continuing from Issue 1.A.1

## Linked Issues

- Link to Epic: #1227
- Mark as: "Blocked by" Issue 1.A.1 (if sequential)
- Mark as: "Blocks" Issue 1.B.1 (future: Consolidate changelog)

---

## How to Create These Issues

1. Go to: <https://github.com/lightspeedwp/.github/issues/new/choose>
2. Select issue type: **Task** (for 1.A.1) or **Code Refactor** (for 1.A.2)
3. Copy the entire markdown block from the Description section above
4. Update title and labels as specified
5. Link to Epic #1227
6. Assign to team member
7. Set milestone
8. Click "Submit new issue"

---

**Next Step:** After both Phase 1A issues are created and assigned, proceed to implement Issue 1.A.1

**Related:** See `.github/projects/active/workflows-consolidation-2026-q3/EXECUTION_PLAYBOOK.md` for detailed implementation guidance
