# Label Audit Summary

**For**: @ashley and the label governance reviewers  
**Audit date**: 2026-09-14 (label snapshot); summary 2026-09-24  
**Full reports**: `007-audit-report.md`, `duplicates-analysis.md`, `workflow-analysis.md`, `validation-results.md`

## What Was Audited

The 169 labels in `.github/labels.yml` (15 families), the 25 issue types in `.github/issue-types.yml`, the 57-label never-delete list in `.github/label-governance-policy.yml`, 18 label documents, and the 11 labelling workflows in `.github/workflows/archived/2026-09-11/labeling/`. The live GitHub label inventory and the Linear export are still to come.

## What Was Found

| Area                   | Result                                                                                                                                                                                                                        |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Findings               | 2: one HIGH (`type:decision` had no issue type) and one MEDIUM (12 never-delete labels were not in `labels.yml`). The first is decided (#3530) and implemented in #3534; the second is fixed on the spec branch               |
| Duplicate labels       | 23 pairs checked: 2 merges already approved, 8 proposals needing a decision, the rest kept on purpose                                                                                                                         |
| Labelling gaps         | 36 labels named in documents or the old never-delete list but not in `labels.yml`, including three that `CLAUDE.md` lists as valid (`area:labels`, `meta:duplicate`, `meta:needs-audit`)                                      |
| Archived workflows     | 11 analysed: 2 to restore, 5 to rebuild, 4 to retire; 14 labelling jobs no active workflow covers                                                                                                                             |
| Active labelling agent | Removes every label not in `labels.yml` from the issues and PRs it processes (there are no aliases, so nothing is migrated), ignores its dry-run setting, and applies three `type:*` labels that `labels.yml` does not define |
| Documentation          | 142 of 169 labels documented; `docs/LABEL_INVENTORY.md` family counts are out of date                                                                                                                                         |

## Top Actions

1. **Fix the active labelling agent** before it strips more labels: honour `DRY_RUN`, use canonical type labels (`type:docs`, `type:dependency`, `type:a11y`), and migrate labels through aliases instead of removing them (`workflow-analysis.md`, roadmap P1).
2. **Record decisions on #3556 and #3557**, then merge #3534 (Stage 0a).
3. **Run the live inventory** (T041) and the Linear export (T042) so the orphan-label check and the duplicate ranking can finish.
4. **Decide the 8 duplicate proposals** and the three `CLAUDE.md` labels in the Stage 1 `[LABEL-UPDATE-REQUEST]` (T046).
5. **Restore the two cheap workflows** (`meta-labels-sync.yml`, `label-audit-report.yml`) with new schedules, and fold the governance checks into `labeling-unified.yml`.
