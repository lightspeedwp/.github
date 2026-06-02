# Drift Report - 2026-05-28

## Scope

GitHub workflow consolidation deliverables for docs, templates, and active project issue pack.

## Rule-to-Source Trace

- Canonical labels: `.github/labels.yml`
- Branch/file label automation: `.github/labeler.yml`
- Issue type mappings: `.github/issue-types.yml`
- Project field mappings/defaults: `.github/issue-fields.yml`
- Label automation workflow: `.github/workflows/labeling.yml`
- Project field sync workflow: `.github/workflows/project-meta-sync.yml`

## Drift Fixed

1. Added canonical operations spec:
   - `docs/GITHUB_PROJECT_OPERATIONS_SPEC.md`
2. Updated contributor docs to reference canonical spec:
   - `docs/BRANCHING_STRATEGY.md`
   - `docs/ISSUE-FIELDS.md`
   - `docs/PR_LABELS.md`
   - `docs/LABEL_STRATEGY.md`
3. Normalised changelog skip wording in PR templates to canonical label:
   - `meta:no-changelog`
4. Created active issue pack:
   - `.github/projects/active/github-workflow-consolidation-2026-05-28/`

## Validation Evidence

- `npx markdownlint-cli2 "**/*.md"` -> pass
- `git diff --check` -> pass
- `node scripts/agents/includes/check-template-labels.js` -> pass
- `node scripts/validation/validate-labeling-configs.cjs` -> pass
- `node scripts/validation/validate-issue-fields.cjs` -> pass
- `npm run validate:workflows` -> pass (warnings only; no failures)

## Notes

Workflow validation warnings are existing optimisation and hygiene suggestions (for example concurrency/caching naming guidance), not hard failures introduced by this change set.
