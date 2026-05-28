# GitHub Workflow Consolidation (2026-05-28)

## Scope

Consolidate GitHub workflow governance into one lean, current spec that reflects live automation.

This pack tracks:

- Unified GitHub Project template guidance with profile presets.
- Branching strategy slimdown and alignment to current `labeler.yml` automation.
- Issue/PR metadata automation contract aligned to current workflows.
- Targeted template/doc drift fixes only.

## Goals

- Reduce documentation bloat and legacy duplication.
- Keep `labels -> project fields` behaviour explicit and current.
- Keep automation compatibility intact with no structural workflow refactors.

## Sequencing

1. Publish canonical operations spec.
2. Align existing docs to canonical spec.
3. Apply targeted PR template wording fix for changelog skip label.
4. Run validations and publish drift report.

## Canonical References

- `docs/GITHUB_PROJECT_OPERATIONS_SPEC.md`
- `.github/issue-fields.yml`
- `.github/labels.yml`
- `.github/labeler.yml`
- `.github/workflows/labeling.yml`
- `.github/workflows/project-meta-sync.yml`

## Deliverables

- Parent epic issue and six child issue specs under `issues/`.
- Updated docs and PR templates.
- Validation evidence from markdown, labels, fields, and workflow checks.
