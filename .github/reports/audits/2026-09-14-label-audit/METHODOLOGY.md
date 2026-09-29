# Label Audit Methodology

**Audit date**: 2026-09-14 (label snapshot); methodology recorded 2026-09-24  
**Specification**: `.github/specs/008-label-audit-consolidation/` (User Stories 1–3; task T038)

This page says how the audit was done, so that its numbers can be reproduced and checked.

## Data Sources

| Source                                | What was read                                                                                                                                      | Snapshot                                                                                         |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `.github/labels.yml`                  | Every label: name, colour, description (169 labels, 15 families)                                                                                   | `evidence/canonical-labels.json`, `evidence/label-families.json`                                 |
| `.github/issue-types.yml`             | The 25 issue types and their `type:*` labels                                                                                                       | `evidence/issue-types.json`                                                                      |
| `.github/label-governance-policy.yml` | The never-delete list (57 labels)                                                                                                                  | `evidence/governance-policy.json`                                                                |
| Label documentation                   | 18 files: `docs/LABEL_*.md`, `docs/ISSUE_*.md`, `docs/PR_*.md`; `CLAUDE.md` and `AGENTS.md` for the gap scan                                       | `evidence/documentation-references.json`, `evidence/documentation-coverage.json`                 |
| Archived workflows                    | The 11 files in `.github/workflows/archived/2026-09-11/labeling/`, compared with `.github/workflows/labeling-unified.yml` and the scripts it calls | `evidence/archived-workflows.json`, `evidence/workflow-*.json`                                   |
| Automation references                 | `scripts/`, `.github/workflows/`, labeler and field configuration, `agents/`, `packages/` (reports and archived files excluded)                    | `evidence/renamed-label-references.json`, `evidence/consolidation-recommendations.json`          |
| GitHub API                            | Live labels on every repository                                                                                                                    | Not yet obtained: `evidence/github-api-labels.json` is an empty placeholder until task T041 runs |
| Linear                                | Workspace labels and issue counts                                                                                                                  | Spot checks only (for the #3554 labels); the full export is task T042                            |

The label snapshot is fixed at the 2026-09-14 state of `labels.yml`. Later consolidation changes the live files, so the evidence tests (`scripts/validation/__tests__/label-audit-evidence.test.js`) compare the evidence with itself, not with the live files.

## Comparison Logic

1. **Canonical inventory**: parse `labels.yml`; check names are unique and every label belongs to a family (`family:name`).
2. **Issue types**: every `issue-types.yml` entry must name a `type:*` label that exists; any `type:*` label without an issue type is recorded (`type:decision` at the audit).
3. **Never-delete list**: every protected label must exist in `labels.yml`; each missing one is recorded with the closest canonical equivalent (`evidence/governance-gaps.json`).
4. **Documentation**: every canonical label is searched for in the label documents (documented or undocumented), and every `family:name` token in the documents whose family exists is checked against `labels.yml` (documentation-only gaps).
5. **Duplicates**: labels are compared within and across families by name and meaning; each pair gets a confidence (high, medium, low) and is checked against the approved FR-012 merge table.
6. **Archived workflows**: each file is read for purpose, triggers, scripts called, labels referenced and failure points, then compared with the active labeling workflow.

## Finding Classification

| Severity | Meaning                                                                    |
| -------- | -------------------------------------------------------------------------- |
| CRITICAL | Breaks automation or governance now; blocks release                        |
| HIGH     | A governance rule is not met (for example a type label with no issue type) |
| MEDIUM   | Configuration files disagree but nothing breaks yet                        |
| LOW      | Wording, documentation or tidy-up                                          |

A **finding** is a rule broken in the source files. A **gap** is a label named in one place (documentation or policy) but not in `labels.yml`. A **candidate** is a possible duplicate that still needs a decision.

## Evidence Standards

- Every finding names the source file and line (in the 2026-09-14 snapshot where lines have since moved).
- Counts in the report are taken from the evidence JSON, and the evidence tests check that the report, inventories and evidence agree.
- Counts that need live data (issue and PR usage, orphan labels) are marked "pending" instead of estimated.
- The audit phase is read-only; configuration changes happen only in the consolidation phase after approval (spec FR-009).
