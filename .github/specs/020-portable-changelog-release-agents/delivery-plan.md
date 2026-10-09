# Delivery Plan: Spec 020 Branch and PR Strategy

**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Issue map**: [issue-map.md](./issue-map.md)

**Read on**: 2026-10-09. Proposed branches are plans, not branches that already exist, unless marked EXISTING. All new PR numbers are TBD until a PR is created: none is invented here. The only real PR numbers used are [#3881](https://github.com/lightspeedwp/.github/pull/3881) (existing consolidation) and [#3883](https://github.com/lightspeedwp/.github/pull/3883) (this specification). No branch, PR, label, assignee or issue was created or changed by writing this plan.

Preserved from the source brief: delivery priority is release preparation first (priority 1), changelog second (priority 2), followed by an explicit blocking verification handoff. Priority is not a code dependency.

## Rules applied to every profile

- Base and target is `develop` (a `release/*` or `hotfix/*` PR may target `main`; none is proposed here).
- Start each branch from refreshed `develop` after its prerequisites merge, unless the conditional stack below is justified and approved.
- Use the live template body and checklists for the branch type; omit its frontmatter. Reference real issue URLs in the PR body, not the title.
- Use `Closes` only for fully delivered accepted scope. Use `Ref` or `Relates to` for design contributions, partial adapters and deferred work. Never auto-close [#1546](https://github.com/lightspeedwp/.github/issues/1546).
- Exactly one changelog disposition per PR (`meta:needs-changelog` or `meta:no-changelog`), never both.
- Runtime-shipping PRs need exactly one appropriate `release:*` label after reviewed impact. Patch, minor or major is not decided beforehand.
- Verify labels again before applying: they come from `.github/labels.yml`, which is locked.

### Label sets (GitHub only)

| Set | Labels | Use |
|-----|--------|-----|
| D | `type:docs`, `area:documentation`, `status:needs-review`, and `meta:no-changelog` only when a documentation exemption is valid | Documentation and specification PRs |
| A | `type:aiops`, `area:agents`, `status:needs-review`, `meta:needs-changelog` for runtime or user-visible change | AI operations and agent PRs |
| X | `type:refactor`, `status:needs-review`, `meta:needs-changelog`, plus a relevant existing `area:` label only with scope evidence | Refactor PRs |

### Template and routing conflict (maintainer resolution, no edit in spec 020)

`.github/branch-types.yml` routes `docs` to `pr_docs`, `aiops` and `automation` to `pr_aiops`, and `refactor` to `pr_refactor`; there is no `pr_automation.md`. The live templates still carry legacy labels: `pr_docs.md` lists `type:documentation` and `pr_aiops.md` lists `type:ai-ops` and `meta:needs-review`, which conflict with the canonical `type:docs`, `type:aiops` and `status:needs-review`. The constitution records this as pending a `[TEMPLATE-UPDATE-REQUEST]`. Do not apply both a legacy and a canonical type, and do not copy template labels blindly. The file labeler owns area routing; preserve existing useful labels and inspect automation output. On [#3883](https://github.com/lightspeedwp/.github/pull/3883) the router applied only `type:docs`.

## Per-slice profiles

| Profile | Issue(s) | Branch | Base | Proposed PR title | Template | Labels | Assignee | Closure rule | Prerequisites |
|---------|----------|--------|------|-------------------|----------|--------|----------|--------------|---------------|
| S | [#1555](https://github.com/lightspeedwp/.github/issues/1555) with #1553, #1554, #1556, #1557 | `docs/portable-changelog-release-agents` (EXISTING, PR #3883, draft) | `develop` | `docs: release-agents - Specify portable changelog and release agents` | `pr_docs.md` | D | ashleyshaw (proposed; not yet set) | `Relates to` all; `Closes #1555` only if the owner confirms specification delivery. #1546 never closed. | 019 numbering gap resolved (see below) |
| F | [#3880](https://github.com/lightspeedwp/.github/issues/3880) | `aiops/git-2623-consolidate-release-changelog-agents` (EXISTING, PR #3881) | `develop` | Keep the existing title until normalisation is approved to `aiops: release-agents - Consolidate canonical agent guidance` | `pr_aiops.md` | Preserve current labels; propose canonical reconciliation separately | Preserve ZaredRogers | Existing `Closes #3880` | Read the actual diff and checks; reviews and the reason for `blocked` are unread |
| R1 | [#1563](https://github.com/lightspeedwp/.github/issues/1563), acceptance traced from [#1565](https://github.com/lightspeedwp/.github/issues/1565) and [#1566](https://github.com/lightspeedwp/.github/issues/1566) | `aiops/release-agent-portable-mvp` | `develop` (or the F head if the conditional stack applies) | `aiops: release-agent - Deliver portable preparation MVP` | `pr_aiops.md` | A | ashleyshaw | `Closes #1563` only when its accepted scope is delivered; `Ref` #1565 and #1566 unless fully covered | Spec approved; F normally merged; final ready state blocked on C2 handoff evidence |
| C2 | [#2653](https://github.com/lightspeedwp/.github/issues/2653) | `aiops/changelog-agent-portable-mvp` | `develop` | `aiops: changelog-agent - Deliver portable changelog MVP` | `pr_aiops.md` | A | ashleyshaw for the requested authored PR; preserve Chris's Linear ownership | `Closes #2653` when its accepted scope is delivered | F and spec dependencies |
| DEC | [#3470](https://github.com/lightspeedwp/.github/issues/3470) | `docs/changelog-agent-spec-findings` | `develop` | `docs: changelog-agent - Document specification decisions` | `pr_docs.md` | D | ashleyshaw | `Closes #3470` only if all owner decisions are recorded; otherwise `Ref` | Owner decisions resolved; no runtime remediation approval inferred |
| DOC | [#1558](https://github.com/lightspeedwp/.github/issues/1558) with #1568, #1569, #1570 | `docs/portable-agents-reference-guidance` | `develop` | `docs: portable-agents - Restructure and complete guidance` | `pr_docs.md` | D, or an alternative changelog disposition justified by impact | ashleyshaw | `Closes` each issue only where its guide is delivered | Affected structure and code merged first; no competing docs PRs |
| SETUP | [#3873](https://github.com/lightspeedwp/.github/issues/3873) | `docs/portable-agents-local-setup` | `develop` | `docs: portable-agents - Document verified local setup` | `pr_docs.md` | D | ashleyshaw as the PR author of this governance PR; preserve Warwick's issue ownership | `Ref` unless fully delivered | Setup contract verified; documentation only, no installer implementation |
| DIST | [#3468](https://github.com/lightspeedwp/.github/issues/3468) | `aiops/agent-distribution-portable-marketplace` | `develop` | `aiops: agent-distribution - Validate the portable marketplace` | `pr_aiops.md` | A | Future ownership to be confirmed | `Ref` | Setup and source contract first; LS-4233 versus GIT-2306 overlap resolved |
| WFLOW | [#1560](https://github.com/lightspeedwp/.github/issues/1560) | `automation/release-workflow-portable-validation` | `develop` | `automation: release-workflow - Validate portable release gates` | `pr_aiops.md` | Confirm the primary automation classification and routing before metadata; no incompatible two-type set | To be confirmed | `Ref` | Later scope, not spec 020 implementation; archived workflow reviewed and tested first |
| ROLLBACK | [#1562](https://github.com/lightspeedwp/.github/issues/1562) | `automation/release-workflow-safe-rollback` | `develop` | `automation: release-workflow - Add approved rollback safeguards` | `pr_aiops.md` | Confirm automation type, routing and actual release impact | To be confirmed | `Ref` | Later; workflow contract first |

**Optional adapter slices** (only if the plugin and theme adapters are independently reviewable; prefer one coherent R1 adapter with both acceptance mappings): `aiops/release-agent-plugin-version-adapter` titled `aiops: release-agent - Validate plugin version fields` for #1565, and `aiops/release-agent-theme-version-adapter` titled `aiops: release-agent - Validate theme version fields` for #1566, both `pr_aiops.md` with label set A and impact checks. Split to make a unit reviewable, not to create more PRs.

### Roadmap-only agent slices (not spec 020 tasks)

Each is a later, independently reviewable PR against `develop`. Confirm a real GitHub issue exists before any closure keyword; do not infer cross-repository number identity.

| Agent and records | Proposed branch | Proposed PR title | Template and labels |
|-------------------|-----------------|-------------------|---------------------|
| PRD (#1248 / GIT-1123, unread) | `docs/prd-agent-portable-handoff` | `docs: prd-agent - Record verified portable handoff` | `pr_docs.md`, D; preserve parent and completed evidence |
| Linting (#1818 / GIT-1456, unread) | `aiops/linting-agent-repo-configuration` | `aiops: linting-agent - Configure repository-aware checks` | `pr_aiops.md`, A |
| PR agent ([GIT-701](https://linear.app/lightspeedwp/issue/GIT-701/aiops-pr-agent-complete-portable-consolidation); GitHub number unresolved) | `aiops/pr-agent-portable-consolidation` | `aiops: pr-agent - Complete portable consolidation` | `pr_aiops.md`, A; reuse merged PR 3400, 3401, 3403 evidence |
| Reviewer (#1802 / GIT-1446, unread) | `aiops/reviewer-agent-portable-contract` | `aiops: reviewer-agent - Define portable review boundaries` | `pr_aiops.md`, A |
| Testing (#1344 / GIT-1190, unread) | `aiops/testing-agent-portable-package` | `aiops: testing-agent - Consolidate the portable package` | `pr_aiops.md`, A; reconcile legacy Playwright path |
| PageSpeed (#1343 / GIT-1189, unread) | `aiops/pagespeed-agent-portable-package` | `aiops: pagespeed-agent - Consolidate the portable package` | `pr_aiops.md`, A |
| Design partner (#1341 / GIT-1187, unread) | `aiops/design-partner-agent-portable-package` | `aiops: design-partner-agent - Consolidate after Figma audit` | `pr_aiops.md`, A; preserve audit dependency |
| Issue agent ([GIT-106](https://linear.app/lightspeedwp/issue/GIT-106/refactor-issue-agent-verify-portable-source-migration); GitHub #2826 unread) | `refactor/issue-agent-portable-source` | `refactor: issue-agent - Verify portable source migration` | `pr_refactor.md`, X |
| Reporting (#1901 / GIT-1506, unread) | `aiops/reporting-agent-portable-contract` | `aiops: reporting-agent - Validate portable reporting` | `pr_aiops.md`, A |

## Existing PR reuse

| PR | State at read | Use |
|----|---------------|-----|
| [#3881](https://github.com/lightspeedwp/.github/pull/3881) | Open, not draft, mergeable state `blocked`, head `7e0bcaab55703f0866d1c063c0b6e7530b97b747`, 27 files, `Closes #3880` | Reused as profile F. No test results from it are claimed here. |
| [#3820](https://github.com/lightspeedwp/.github/pull/3820) | Merged | Changelog spec, skill and index alignment is reused, not redone. |
| [#2655](https://github.com/lightspeedwp/.github/pull/2655) | Closed unmerged | Not delivery proof. |
| [#3532](https://github.com/lightspeedwp/.github/pull/3532) | Reserves Qodo 019 | Unrelated to 020 and not a required stack base. |
| [#3883](https://github.com/lightspeedwp/.github/pull/3883) | Draft | Profile S. |

## Stack plan (conditional, not automatic)

**Default**: S is independent. Finish the existing F. Branch R1 and C2 from refreshed `develop`. R1 and C2 may be sibling PRs if their files and contracts permit. R1's readiness inventory may land first but must fail closed until changelog evidence exists.

**Optional stack, only if R1 imports canonical layout or tooling available solely in the unmerged #3881**:

1. Lower: existing #3881, `aiops/git-2623-consolidate-release-changelog-agents` into `develop`.
2. Upper: R1 `aiops/release-agent-portable-mvp` based on that exact head, with the lower branch as PR base.
3. Record lower and upper links, ownership, inherited diff and the blocked merge. Merge the lower first; then retarget or rebase the upper onto updated `develop`, rerun tests and review, and inspect the remaining diff before merge.

Do not duplicate F's migration, do not stack spec 020 on the Qodo PR #3532, and do not put all agent PRs in one chain.

**If final handoff integration fits neither independent slice**: propose one small follow-on integration PR under #1563 after R1 merges, dependent on C2. Exact preview, not yet requested: branch `aiops/release-agent-changelog-handoff`, base `develop`, template `pr_aiops.md`, label set A, scope limited to the remaining handoff acceptance criteria. Do not create a new issue or PR automatically.

Documentation (DOC, SETUP) uses merged contracts and never stacks on unfinished implementation merely for speed.

## Merge order

1. S (#3883), once the 019 numbering gap is resolved. It is independent of the rest.
2. F (#3881), after its diff, checks and reviews are read and its blocker is understood.
3. R1 and C2 as siblings from refreshed `develop`; R1 is not reported ready until C2 evidence exists.
4. Optional follow-on handoff integration PR, if needed, after R1 merges and depending on C2.
5. DEC, then DOC, then SETUP, using merged contracts.
6. DIST, then WFLOW, then ROLLBACK as later phases.

## Blockers and open items

| Item | Detail |
|------|--------|
| 019 numbering gap | The spec audit requires contiguous numbers and 019 is reserved on the unmerged `aiops/qodo-pr-agent-integration` branch, so S fails Specification Validation until the 019 spec merges or the owner approves another resolution. |
| "AI Feedback Validation" check | Requests a `Closes` or `Resolves` link and a `FEEDBACK_RESPONSE.md`. S currently uses `Relates to`. The owner decides whether `Closes #1555` is acceptable. |
| PR #3881 blocker | Reviews and the cause of `blocked` were not read. |
| Linear parenting | GIT-1310, GIT-1744 and GIT-2623 have no parent; reparenting is an approval item (A9 in the issue map). |
| Pilots | Warwick (krugazul) on to-faq and Zared (ZaredRogers) on sd-theme-2026 and sd-enhancements-2026 are proposed, not verified. Enhancement repository access previously returned 403 and is a permission boundary: affected checks stay blocked. No pilot or FAQ architecture is decided, and no code transfer is planned in spec 020. Each target repository's own rules must be read first; `pr_aiops.md` must not be imported into them silently. |

## Deferred phases

Provider installation and marketplace distribution (DIST), release workflow validation (WFLOW), rollback automation (ROLLBACK), the roadmap agent slices above, pilot rollouts and the later documentation restructure (DOC) are not executable spec 020 MVP tasks. Live environment, version, deployment and rollback decisions remain unresolved and are not inferred.
