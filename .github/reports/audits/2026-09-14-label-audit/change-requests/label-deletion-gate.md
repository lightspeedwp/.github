# task: label-consolidation - Approve label deletion per repository (gate)

> Draft issue body for spec 008 task T049 (FR-016, FR-023). Not opened yet: T050 opens it. Its issue number then replaces `gated_by_issue: 95` in `.github/label-governance-policy.yml` (T055). Checked against `develop` (`d9c27f5a`) on 2026-10-01.

## Task Summary

This issue is the approval gate for deleting labels in `lightspeedwp` repositories (spec 008 Stage 4). It replaces closed issue #95. Nothing is deleted from a repository until @ashleyshaw approves that repository's dry run in a comment on this issue.

`destructive_cleanup.enabled` in `.github/label-governance-policy.yml` stays `false`. Deletion is authorised per run instead:

- the run uses `scripts/automation/label-consolidate.js --apply --confirm-gate <this issue number>`;
- the tool refuses any repository whose dry-run approval is not `approved`.

## How approval works

1. **Dry run.** For each repository, the tool writes `.github/reports/audits/2026-09-14-label-audit/evidence/dry-run/{repo}.json` (format: `.github/specs/008-label-audit-consolidation/contracts/dry-run-and-drift-report-schema.md`) and posts its summary here. The summary lists the labels to delete, create and rename, and the open items that move to another label.
2. **Approval.** @ashleyshaw approves one repository at a time with a comment that reads exactly:

   ```text
   Approved: lightspeedwp/{repo} dry run {generated_at}
   ```

   The repository and timestamp must match the dry-run file. A repository without this comment is skipped, and nothing is deleted from it.
3. **Stale dry runs.** An approval no longer counts if the dry run changes or `labels.yml` on `develop` no longer matches the file's `approved_set_commit`. Just before deleting, the tool also re-reads the repository. If its labels, or the items carrying a listed label, differ from the dry run, it skips the repository, says why here, and needs a new dry run and approval.
4. **Run.** The run migrates open issues, PRs and Discussions to their target labels, and migrates closed items where the label has a mapping target. It then deletes the listed labels. Every change is appended to `evidence/consolidation-log.jsonl`, and each run posts one summary comment here.
5. **Resume.** A repository finished for a stage records `executed_at` for that stage and is skipped when that stage is re-run. A stopped or rate-limited run resumes with the repositories that have no `executed_at` for its stage. A run that was killed is resumed with `--resume <run_id>`, never by deleting its lock.
6. **Rollback.** Only when @ashleyshaw asks for it here. A deleted label is recreated from its dry-run snapshot (name, colour, description) and reapplied to the recorded items.

## Before the first dry run

- [ ] Every item in `.github/specs/008-label-audit-consolidation/checklists/destructive-changes.md` reviewed (T064c)
- [ ] Stage 3 finished: renames, creates and relabels applied, and every item has exactly one `type:*` label (T064)
- [ ] Open `type:question` issues converted to Discussions in every repository (T063)
- [ ] Label creation restricted in Linear's GitHub integration (T071)
- [ ] The owning team of each repository named in a comment here (no waiting period)

## Linked Stories/Tasks

- Spec: `.github/specs/008-label-audit-consolidation/spec.md` (FR-016, FR-023, SC-011, SC-012); tasks T049, T050, T055, T064c, T065–T067a
- Replaces: #95
- Epic: #449

## Acceptance Criteria

- [ ] Every repository has an approved, executed or skipped dry run
- [ ] Labels were deleted only in approved repositories (quickstart Test 12)
- [ ] Every item that had a `type:*` label before Stage 3 has exactly one afterwards (SC-011)
- [ ] Every deleted label has a snapshot entry with name, colour, description and item kinds and numbers (SC-012)
- [ ] `destructive_cleanup.enabled` is still `false`

## Additional Context

- Scope: non-archived `lightspeedwp` repositories where the organisation GitHub App is installed, including template repositories. Archived repositories and forks are excluded and listed in the gate issue. A repository without the App blocks its own deletion until the App is installed or @ashley excludes it here. No repository is otherwise exempt (FR-016).
- Credentials: the deletion run uses a fine-grained token valid for 7 days or less, from @ashleyshaw's session, and never runs in CI (FR-018).
- Linear clean-up (Stage 5) starts only after this gate's deletions finish, so the Linear GitHub integration cannot recreate deleted labels.

---

## Definition of Ready (DoR)

- [x] Task described and scoped
- [x] Approval flow and wording defined
- [x] Acceptance criteria mapped
- [ ] Estimate added if relevant

## Definition of Done (DoD)

- [ ] Every repository's dry run approved and executed, or skipped
- [ ] `consolidation-log.jsonl` and the run summaries complete
- [ ] `label-governance-policy.yml` points to this issue
- [ ] Linked issue(s) updated with latest status and closed after merge
- [ ] The related epic (#449) is not closed; it is updated with a comment reflecting the closed issue
