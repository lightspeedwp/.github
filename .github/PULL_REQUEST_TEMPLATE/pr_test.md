---
file_type: pr-template
name: "Test"
about: "Add or update tests, test infrastructure, or testing framework"
title: "test: {scope}"
labels: ["type:test", "status:needs-review", "priority:normal", "area:testing"]
recommended_issue_type: "type:test"
---

# Test Pull Request

> This repository enforces changelog, release, and label automation for all PRs and issues.  
> See the organisation-wide [Automation Governance & Release Strategy](https://github.com/lightspeedwp/.github/blob/HEAD/docs/AUTOMATION_GOVERNANCE.md) for contributor rules.

## Linked issues

Link this PR to the testing issue(s) it addresses:

- `Closes #123` — use for issues this PR resolves (auto-closes on merge)
- `Relates to #123` — for related but not directly resolved issues
- `Part of #456` — for PRs that are part of a larger testing initiative

Closes #

## Test Coverage

What tests are being added or updated?

- **Type:** (Unit / Integration / E2E / Performance / etc.)
- **Components/Functions covered:**
- **Test framework:** (Jest / Playwright / etc.)

## Testing Strategy

Explain the testing approach:

- What scenarios are being tested
- Edge cases covered
- Mocking strategy (if applicable)

## Test Results

Include test output or summary:

```
# Run tests locally with:
npm test
```

- [ ] All new tests pass
- [ ] All existing tests pass
- [ ] Test coverage maintained or improved
- [ ] No flaky tests introduced

## Coverage Impact

- Current coverage: X%
- New coverage: Y%
- Coverage change: +/- Z%

## Changelog

<!--
Required for release automation.
Format: Keep a Changelog.
Categories: Added, Changed, Fixed, Removed.
User-facing notes only. Internal-only PRs may use the skip-changelog label.
-->

### Added

- Test: {description}

## Checklist

- [ ] Tests follow project testing standards
- [ ] All tests are deterministic (no flakiness)
- [ ] Coverage is appropriate for changes
- [ ] No hardcoded test data
- [ ] Test names clearly describe what is tested
- [ ] Related issues linked above
- [ ] Changelog entry added

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
