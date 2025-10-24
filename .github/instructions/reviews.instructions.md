# Code Review Instructions

## Goals
Catch defects early, improve maintainability, and uphold a11y/security.

## Reviewer Checklist
- **Scope**: Focused PR? Linked issues? Clear description?
- **A11y**: Keyboard paths, semantics, alt text, contrast.
- **Security**: Escape, sanitize, capabilities/nonce checks.
- **Performance**: No heavy re-renders; minimal CSS/JS; lazy-load where possible.
- **Tests**: Updated/added Playwright, axe checks, PHPUnit/Jest as needed.
- **Docs**: README or pattern docs updated; CHANGELOG entry prepared.
- **Release readiness**: CI green; no TODOs left.

## Author Checklist (pre-PR)
- Self-review; run linters/tests; include before/after visuals.
