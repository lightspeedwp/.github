# task: label-consolidation - Use canonical labels in the AI Operations PR template [TEMPLATE-UPDATE-REQUEST]

> Draft issue body for spec 008 task T046b (FR-011; research R18). Not opened yet: T050 opens it. Checked against `develop` (`d9c27f5a`) on 2026-10-01.

## Task Summary

`[TEMPLATE-UPDATE-REQUEST]` (constitution §II): change the frontmatter of the locked PR template `.github/PULL_REQUEST_TEMPLATE/pr_aiops.md` so it applies only labels that exist in `.github/labels.yml`.

`pr_aiops.md` currently sets:

```yaml
labels: ["type:ai-ops", "status:needs-review", "priority:normal", "area:ai", "meta:needs-review"]
recommended_issue_type: "type:ai-ops"
```

Two of those labels are not in `labels.yml`:

- `type:ai-ops`. The canonical type label is already `type:aiops` (`labels.yml` line 217), and `issue-types.yml`, `branch-labels.yml` and `issue-fields.yml` all use `type:aiops`.
- `meta:needs-review`. The canonical review label is `status:needs-review`, which the template already sets.

`node scripts/validation/validate-labels-before-creation.cjs --scan-templates` reports both as "grandfathered non-canonical" labels in `pr_aiops.md`, pending a template governance update. This request is that update.

Requested change:

```yaml
labels: ["type:aiops", "status:needs-review", "priority:normal", "area:ai"]
recommended_issue_type: "type:aiops"
```

The title prefix stays `aiops: {scope} - {short description}`, and routing is unchanged: `aiops/`, `codex/` and `proto/` branches still route to `pr_aiops.md` (`.github/PULL_REQUEST_TEMPLATE/config.yml`, `.github/branch-types.yml`).

## Linked Stories/Tasks

- Spec: `.github/specs/008-label-audit-consolidation/spec.md` (FR-011, FR-022); tasks T046b, T050, T057a
- Ships in: the spec 008 Stage 2 configuration PR (T059), together with the `ai-ops:*` → `aiops:*` label renames
- Epic: #449

## Milestones & Timeline

- Approve before the Stage 2 configuration PR is opened.

## Acceptance Criteria

- [ ] @ashley approves the new frontmatter (comment on this issue)
- [ ] `pr_aiops.md` applies only labels in `labels.yml`, and `validate-labels-before-creation.cjs --scan-templates` no longer reports it
- [ ] An `aiops/` branch PR receives `type:aiops` and no `type:ai-ops` label
- [ ] `npm run validate:frontmatter` passes

## Steps / Checklist

- [ ] Review the requested frontmatter
- [ ] Approve here
- [ ] Apply in the Stage 2 configuration PR (T057a)
- [ ] Record the approval in `.github/reports/audits/2026-09-14-label-audit/evidence/change-requests.json`

## Dependencies

- T040n: full sign-off on #3556 and #3557 comes first, because no further locked-file change ships until that gap is closed (plan.md, Constitution Check, 2026-10-01).

## Additional Context

### Other PR templates with the same problem (optional, for your decision)

The same scan reports five more grandfathered labels in locked PR templates. They are outside T046b, but they can be approved in this request so all PR templates are fixed in one change:

| Template | Non-canonical label | Canonical replacement |
| --- | --- | --- |
| `pr_chore.md` | `meta:needs-review` | Remove (`status:needs-review` is already set) |
| `pr_ci.md` | `meta:needs-review` | Remove (`status:needs-review` is already set) |
| `pr_task.md` | `meta:needs-review` | Remove (`status:needs-review` is already set) |
| `pr_test.md` | `meta:needs-review` | Remove (`status:needs-review` is already set) |
| `pr_docs.md` | `type:documentation` | `type:docs` |

`type:documentation` is one of the labels the labelling agent used to apply before #3564 fixed it. Leaving it in `pr_docs.md` means every docs PR starts with a non-canonical type label.

### Impact analysis

- Dependent systems: PR template routing (`.github/workflows/pr-template-routing.yml`) applies template labels to new PRs; the labelling agent and the weekly drift check (FR-017) will treat `type:ai-ops` and `meta:needs-review` as unapproved once Stage 3 starts.
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
