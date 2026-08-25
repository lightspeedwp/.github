# PR Template Validation Fixtures

This fixture pack supports validation of PR template enforcement logic.

## Structure

- `valid/`: one fixture per active PR template type.
- `invalid/`: malformed fixtures used to test failure paths.

## Active template coverage

- `pr_feature.md`
- `pr_bug.md`
- `pr_hotfix.md`
- `pr_refactor.md`
- `pr_chore.md`
- `pr_docs.md`
- `pr_ci.md`
- `pr_dep_update.md`
- `pr_release.md`

## Usage

1. Load fixture body into local validator or workflow test harness.
2. Assert pass/fail expectations for linked issues, changelog, and checklist blocks.
3. Use invalid fixtures to verify error messaging and failure status behaviour.
