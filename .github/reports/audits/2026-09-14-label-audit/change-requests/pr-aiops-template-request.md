# task: label-consolidation - Use canonical labels in six PR templates [TEMPLATE-UPDATE-REQUEST]

> Draft issue body for spec 008 task T046b (FR-011; research R18). Not opened yet: T050 opens it. Checked against `develop` (`d9c27f5a`) on 2026-10-01. Covers all six PR templates with non-canonical labels, as decided in the spec 008 clarification of 2026-10-01 (one request, not six).

## Task Summary

`[TEMPLATE-UPDATE-REQUEST]` (constitution §II): change the frontmatter of six locked PR templates in `.github/PULL_REQUEST_TEMPLATE/` so they apply only labels that exist in `.github/labels.yml`.

`node scripts/validation/validate-labels-before-creation.cjs --scan-templates` reports seven "grandfathered non-canonical" labels in these templates, pending a template governance update. This request is that update. No other PR template is reported.

| Template | Non-canonical value | Canonical replacement |
| --- | --- | --- |
| `pr_aiops.md` | `type:ai-ops` (label and `recommended_issue_type`) | `type:aiops` |
| `pr_aiops.md` | `meta:needs-review` | Remove (`status:needs-review` is already set) |
| `pr_chore.md` | `meta:needs-review` | Remove (`status:needs-review` is already set) |
| `pr_ci.md` | `meta:needs-review` | Remove (`status:needs-review` is already set) |
| `pr_task.md` | `meta:needs-review` | Remove (`status:needs-review` is already set) |
| `pr_test.md` | `meta:needs-review` | Remove (`status:needs-review` is already set) |
| `pr_docs.md` | `type:documentation` (label and `recommended_issue_type`) | `type:docs` |

Why these replacements:

- `type:aiops` is already the canonical type label (`labels.yml` line 217), and `issue-types.yml`, `branch-labels.yml` and `issue-fields.yml` all use it.
- `type:docs` is the canonical documentation label (`labels.yml` line 201), and the Documentation issue type in `issue-types.yml` uses `label: type:docs`. `type:documentation` is one of the labels the labelling agent used to apply before #3564 fixed it, so leaving it in `pr_docs.md` means every docs PR starts with a non-canonical type label.
- `status:needs-review` is the canonical review label, and every affected template already sets it.

## Requested change

Only the `labels` and `recommended_issue_type` lines change. Other frontmatter, the body and routing stay as they are.

```yaml
# pr_aiops.md
labels: ["type:aiops", "status:needs-review", "priority:normal", "area:ai"]
recommended_issue_type: "type:aiops"

# pr_chore.md
labels: ["type:chore", "status:needs-review", "priority:minor", "area:core"]

# pr_ci.md
labels: ["type:ci", "status:needs-review", "priority:normal", "area:ci"]

# pr_task.md
labels: ["type:task", "status:needs-review", "priority:normal", "area:core"]

# pr_test.md
labels: ["type:test", "status:needs-review", "priority:normal", "area:testing"]

# pr_docs.md
labels: ["type:docs", "status:needs-review", "priority:minor", "area:documentation", "meta:no-changelog"]
recommended_issue_type: "type:docs"
```

The title prefixes stay the same, and routing is unchanged; for example `aiops/`, `codex/` and `proto/` branches still route to `pr_aiops.md` (`.github/PULL_REQUEST_TEMPLATE/config.yml`, `.github/branch-types.yml`).

## Linked Stories/Tasks

- Spec: `.github/specs/008-label-audit-consolidation/spec.md` (FR-011, FR-022); tasks T046b, T050, T057a
- Ships in: the spec 008 Stage 2 configuration PR (T059), together with the `ai-ops:*` → `aiops:*` label renames
- Epic: #449

## Milestones & Timeline

- Approve before the Stage 2 configuration PR is opened.

## Acceptance Criteria

- [ ] @ashley approves the new frontmatter for all six templates (comment on this issue)
- [ ] `validate-labels-before-creation.cjs --scan-templates` reports no grandfathered labels
- [ ] An `aiops/` branch PR receives `type:aiops` and no `type:ai-ops` label
- [ ] A `docs/` branch PR receives `type:docs` and no `type:documentation` label
- [ ] No new PR receives `meta:needs-review`
- [ ] `npm run validate:frontmatter` passes

## Steps / Checklist

- [ ] Review the requested frontmatter
- [ ] Approve here
- [ ] Apply in the Stage 2 configuration PR (T057a)
- [ ] Record the approval in `.github/reports/audits/2026-09-14-label-audit/evidence/change-requests.json`

## Dependencies

- T040n: full sign-off on #3556 and #3557 comes first, because no further locked-file change ships until that gap is closed (plan.md, Constitution Check, 2026-10-01).

## Additional Context

### Impact analysis

- Dependent systems: PR template routing (`.github/workflows/pr-template-routing.yml`) applies template labels to new PRs; the labelling agent and the weekly drift check (FR-017) will treat `type:ai-ops`, `type:documentation` and `meta:needs-review` as unapproved once Stage 3 starts.
- Breaking changes: none. Open PRs keep their labels until Stage 3 relabels them.
- Rollback: restore the previous frontmatter in a follow-up PR.

---

## Definition of Ready (DoR)

- [x] Task described and scoped
- [x] Change set and impact analysis included
- [x] Acceptance criteria mapped
- [ ] Estimate added if relevant

## Definition of Done (DoD)

- [ ] Approved by @ashley and recorded in `evidence/change-requests.json`
- [ ] Stage 2 configuration PR merged with the new frontmatter
- [ ] Task completed and documented
- [ ] Changelog entry prepared for PR
- [ ] PR uses correct branch prefix
- [ ] Branch deleted after merge
- [ ] Linked issue(s) updated with latest status and closed after merge
- [ ] The related epic (#449) is not closed; it is updated with a comment reflecting the closed issue
