# .github/PR_LABELS — v1.1

**Date:** 13-10-2025 — **Version:** v1.1

## Purpose

Provide high‑signal, automated **PR labels** for review routing, release hygiene, and search—without introducing `type:*` PR labels.

## How labels are applied

1) **Paths → labels** via `.github/labeler.yml`:
   - `area:ci`, `area:dependencies`, `area:block-editor`, `area:theme`, `area:integration` …
   - `lang:php`, `lang:javascript`, `lang:css`, `lang:md` …
2) **Branch prefixes → status** (on PR open):
   - `feat/`, `fix/`, `docs/`, `chore/`, `build/` → add **`status:needs-review`** by default.

### Optional branch→type mapping (for Projects)

When the Project **Type** field is present, workflows may map PR branches to **Type**:

- `feat/`→`Feature` · `fix/`→`Bug` · `docs/`→`Documentation` · `chore/|build/`→`Task`.

## Changelog hygiene

- On PR open, if no changelog marker exists, add **`meta:needs-changelog`**.
- Remove it after updating changelog/README (or apply `meta:no-changelog` if internal‑only).

## Status rules (PRs)

- Keep **exactly one** `status:*`. The workflow adds `status:needs-review` if none exists and fails if multiple are present.

## Dependabot PRs

- Path rules label dependency updates (e.g. `area:dependencies`) to help batching and release notes.

## Files powering this

- `.github/labeler.yml` — path & branch rules.
- `.github/workflows/labels-issues-prs.yml` — defaults, status enforcement, changelog nudge.
