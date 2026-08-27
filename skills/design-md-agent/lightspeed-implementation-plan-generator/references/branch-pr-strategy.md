# Branch and PR Strategy

## Default approach

- Use a feature branch per GitHub issue or small group of tightly related issues.
- Keep PRs reviewable and independently testable.
- Link each PR back to issue, acceptance criteria and QA notes.
- Avoid mixing theme, plugin, content migration and tracking changes in one PR unless unavoidable.

## Suggested branch naming

- `feature/theme-token-foundations`
- `feature/header-template-part`
- `feature/service-page-patterns`
- `feature/block-card-grid`
- `fix/dark-mode-contrast`
- `qa/prelaunch-accessibility-fixes`

## PR review checklist

- Scope matches issue.
- Acceptance criteria are addressed.
- WordPress standards are followed.
- Accessibility impact is considered.
- Performance impact is considered.
- Editor experience is tested.
- Responsive states are checked.
- QA notes are included.
