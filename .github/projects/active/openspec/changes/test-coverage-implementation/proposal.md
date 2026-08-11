## GitHub Coordination

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#1743](../../../../issues/1743) | epic | Test Coverage Expansion to 80%+ — Master epic | 🟢 Open |
| [#1744](../../../../issues/1744) | task | Phase 1: Test Coverage Expansion | 🟢 Open |
| [#1745](../../../../issues/1745) | task | Phase 2: Test Coverage Expansion | ⏳ Planned |
| [#1746](../../../../issues/1746) | task | Phase 3: Test Coverage Expansion | ⏳ Planned |
| [#1747](../../../../issues/1747) | task | Phase 4: Test Coverage Expansion | ⏳ Planned |
| [#1748](../../../../issues/1748) | task | Phase 5: Test Coverage Expansion | ⏳ Planned |
| [#1749](../../../../issues/1749) | task | Phase 6: Test Coverage Expansion | ⏳ Planned |

## Why

The test coverage implementation programme is currently a detailed task list but not yet a governed issue chain. Without a tracked parent issue and phase issues, the coverage work can drift, remain partially done, or get closed with incomplete checklists.

## What Changes

- Create a parent epic for the coverage programme.
- Create six phase issues that cover all 62 tasks listed in the active project README.
- Keep the strict issue files, issue register, and run log aligned with the live GitHub issues.
- Update the repo workflow so the PR and issue closeout path only finishes once the checklists are complete.

## Capabilities

### New Capabilities

- `coverage-programme-issue-chain`: A governed parent/phase issue structure for the coverage implementation plan.

### Modified Capabilities

- None.

## Impact

- Affected files: `.github/projects/active/test-coverage-implementation/**`, `openspec/changes/test-coverage-implementation/**`.
- Affected systems: GitHub issue planning, PR closeout, and coverage reporting.
- Dependencies: repo issue templates, OpenSpec parsing, and the current test tooling path.
