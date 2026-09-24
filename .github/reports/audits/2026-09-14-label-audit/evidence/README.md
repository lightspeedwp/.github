# Label Audit Evidence

Supporting data for `007-audit-report.md`, `duplicates-analysis.md` and `workflow-analysis.md` (spec 008, task T033). Label data is the 2026-09-14 snapshot; the tests in `scripts/validation/__tests__/label-audit-evidence.test.js` check that these files agree with each other and with the report.

33 files.

| File                                          | Task                 | What it holds                                                                                                 |
| --------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------- |
| `all-findings.json`                           | T019                 | Both findings as one feed, with a summary                                                                     |
| `archived-workflows.json`                     | T011                 | Names of the 11 archived labelling workflows                                                                  |
| `automation-gaps.json`                        | T029                 | 14 labelling jobs no active workflow covers                                                                   |
| `canonical-labels.json`                       | T006                 | All 169 labels in `labels.yml` at the 2026-09-14 snapshot, with families                                      |
| `change-requests.json`                        | T040a / T040b / T050 | Approval issues and their status (#3530, #3556, #3557)                                                        |
| `consolidation-recommendations.json`          | T023                 | Action, label to keep, impact files and rollout for each pair                                                 |
| `documentation-coverage.json`                 | T018                 | Which canonical labels the label documents mention (142 of 169)                                               |
| `documentation-references.json`               | T010                 | The 18 label documentation files audited                                                                      |
| `duplicate-candidates.json`                   | T021                 | 23 candidate duplicate pairs with confidence                                                                  |
| `duplicate-consolidation-analysis.json`       | T022                 | Decision matrix: document, automation and policy counts; usage counts pending T041/T042                       |
| `github-api-labels.json`                      | T009 / T041          | Live GitHub label inventory; empty placeholder until T041 runs                                                |
| `governance-gaps.json`                        | T014                 | The 12 never-delete labels missing from `labels.yml`, with line numbers and equivalents (Finding 2)           |
| `governance-policy.json`                      | T008                 | The 57-label never-delete list at the snapshot                                                                |
| `governance-vs-canonical.json`                | T013                 | Never-delete list compared with `labels.yml`                                                                  |
| `issue-types.json`                            | T007                 | The 25 issue-type label mappings from `issue-types.yml`                                                       |
| `label-families.json`                         | T012                 | Every canonical label grouped by its 15 families                                                              |
| `labeling-gaps.json`                          | T024                 | 36 gaps: labels in documents or the old never-delete list but not in `labels.yml`                             |
| `native-issue-types.json`                     | T041a / T040c        | The organisation's native issue types and the changes T040c makes (issue counts pending T041a)                |
| `renamed-label-references.json`               | T044                 | Files that mention labels being renamed, merged or retired                                                    |
| `type-labels-validation.json`                 | T015                 | Type label checks: 25 mapped, `type:decision` unmapped at the snapshot (Finding 1)                            |
| `workflow-archival-analysis.json`             | T027                 | Why each archived workflow was archived, with commit evidence                                                 |
| `workflow-batch-label-prs.json`               | T026                 | Per-workflow analysis of `batch-label-prs.yml`: triggers, jobs, scripts, labels, failure points               |
| `workflow-issue-labeling-automation.json`     | T026                 | Per-workflow analysis of `issue-labeling-automation.yml`: triggers, jobs, scripts, labels, failure points     |
| `workflow-label-audit-report.json`            | T026                 | Per-workflow analysis of `label-audit-report.yml`: triggers, jobs, scripts, labels, failure points            |
| `workflow-labeling-governance.json`           | T026                 | Per-workflow analysis of `labeling-governance.yml`: triggers, jobs, scripts, labels, failure points           |
| `workflow-labeling.json`                      | T026                 | Per-workflow analysis of `labeling.yml`: triggers, jobs, scripts, labels, failure points                      |
| `workflow-manage-blocking-status-labels.json` | T026                 | Per-workflow analysis of `manage-blocking-status-labels.yml`: triggers, jobs, scripts, labels, failure points |
| `workflow-meta-labels-sync.json`              | T026                 | Per-workflow analysis of `meta-labels-sync.yml`: triggers, jobs, scripts, labels, failure points              |
| `workflow-openspec-sync-labels.json`          | T026                 | Per-workflow analysis of `openspec-sync-labels.yml`: triggers, jobs, scripts, labels, failure points          |
| `workflow-openspec-validate-labels.json`      | T026                 | Per-workflow analysis of `openspec-validate-labels.yml`: triggers, jobs, scripts, labels, failure points      |
| `workflow-remediate-bare-labels.json`         | T026                 | Per-workflow analysis of `remediate-bare-labels.yml`: triggers, jobs, scripts, labels, failure points         |
| `workflow-restoration-feasibility.json`       | T028                 | Restore, rebuild or retire, with effort, for each archived workflow                                           |
| `workflow-validate-issue-labels.json`         | T026                 | Per-workflow analysis of `validate-issue-labels.yml`: triggers, jobs, scripts, labels, failure points         |

Still to come: `linear-labels.json` (T042, T043) and `dry-run/{repo}.json` (T062, T065).
