# GitHub Actions & Automation Audit — 2026-09-25

**Audit date**: 2026-09-25
**Snapshot**: `origin/develop` = `25179a560e44feefa9e611126657a4c269fd0fd3` (default branch `develop`)
**Scope**: active workflows, composite actions, workflow/composite test coverage, action pinning, trigger trust boundaries, and the open issue/PR corpus
**Result**: one new issue (#3570). Several initially-reported findings were **disproven** on verification and are recorded below so they are not re-raised.

`develop` advanced twice during the audit (`43d46862` → `25179a56` via #3549 and #3515). Every finding was re-verified against the final tip; the harness, composite and test findings were unaffected by both merges.

This report supersedes nothing. `.github/reports/audits/WORKFLOW_AUDIT_REPORT.md` (2025-12-07) audited 11 workflow files under a different architecture and is left as history.

---

## Method

Everything below was verified by execution, not inference:

| Check | Method |
| --- | --- |
| Workflow registration | `GET /repos/lightspeedwp/.github/actions/workflows` |
| File existence on `develop` | `git ls-tree` / `git cat-file` against `origin/develop` |
| Test discovery + outcome | `npx jest --config .jest.config.cjs --listTests`, then a full run |
| Workflow validity | `actionlint 1.7.12` (the exact version `workflow-lint.yml` pins) |
| Action pinning | `git grep -nE "uses: [a-z0-9_-]+/[a-z0-9_.-]+@v[0-9]"` |
| Permissions | per-file `git show \| grep -n '^permissions:'` |
| Corpus overlap | all 998 open issues, 39 open PRs, 1,778 closed PRs |

All results below were reproduced at the final tip `25179a56`. `actionlint 1.7.12` → 0 findings on the 12 active workflows; `jest` → 44/44 passing in the contract suite.

### Methodology trap worth recording

`GET /actions/workflows` returned **59** workflows. Only **12** exist on `develop`. The endpoint lists workflows from *every* branch, so in-flight PR branches (`validation-unified`, `testing-unified`, `linting-unified`, `quality-gates`, `tests`, `checks`, and ~45 more) appear as `active`.

Any audit that trusts that list will report dozens of phantom findings. Use `git ls-tree origin/develop .github/workflows/` as the source of truth.

A second trap: `gh api … --jq '.name'` renders a 404 body as the string `null`, so a shell `[[ -n "$out" ]]` existence test reports success. Verify with the exit code, not stdout content.

---

## Findings that survived verification

### F1 — The workflow test harness has never run and cannot run · HIGH

`.github/tests/workflow-harness.yml` and `.github/tests/error-isolation-test.yml` declare `on:` triggers (`workflow-harness.yml:4-13`, `error-isolation-test.yml:5-6`) but live in `.github/tests/`.

- Registry returns **0** workflows under `tests/`.
- `gh workflow run` cannot reach them (resolves under `.github/workflows/`).
- No script, `package.json` entry, or active workflow references them.

The placement is inherited from the spec, not an execution slip — `.github/specs/011-workflow-consolidation-phase-2/plan.md:60-62` puts them in `.github/tests/`. Spec 011 is **Active** (`CATALOG.md:40`) with **0 of 122 tasks checked**, so the spec records these as unbuilt while the files sit on `develop`.

### F2 — The contract tests run, and pass, asserting the fiction · HIGH

`.jest.config.cjs` matches `**/__tests__/**/*.test.js`, so the suite is genuinely discovered and run:

```
Tests: 44 passed, 44 total
```

The harness tests at `workflow-consolidation-actions.test.js:454-481` assert only structure — job names, matrix contents, `needs` arrays, dispatch options. They never check that the file is in `.github/workflows/`, that its triggers fire, or that its targets exist. A suite whose subject is "the workflow harness works" is green while the harness has never executed.

Today the only Jest gated in CI is a different file (`labeling-unified.yml:66` → `scripts/agents/__tests__/label-contracts.test.js`).

### F3 — Two composite actions have no caller and were promised removal · MEDIUM

`#3478` required deleting them; it was closed **COMPLETED** by #3483, which touched shellcheck and examples only.

| Composite | Workflow callers | Referenced by |
| --- | --- | --- |
| `.github/actions/aggregate-tests/action.yml` | none | `COMPOSITE_ACTIONS.md:173,300` |
| `.github/actions/validate-check/action.yml` | none | `COMPOSITE_ACTIONS.md:116,289` |

`COMPOSITE_ACTIONS.md:312` states "All composite actions tested in workflow-harness.yml" — untrue, and pointing at a file that cannot run.

### F4 — The harness targets a superseded design · MEDIUM

Its five-type matrix is the 71→5 consolidation plan (PR #3359, open). Four of the five workflows exist only on `refactor/workflow-consolidation-phase-2`. #3488 replaces that design with a single reusable "PR checks" workflow, so the matrix cannot become correct without contradicting current direction.

### F5 — Count and path drift · LOW

- `README.md:13` and `archived/INDEX.md:19,27` both state **71** archived workflows; `git ls-tree -r | grep -c '\.yml$'` returns **72**.
- `workflow-lint.yml` filters `push` on `.github/actionlint.yaml`, which does not exist. Harmless, but implies a config file that isn't there.

### F6 — Repo pinning policy is unenforced, though currently satisfied · LOW

`GET /repos/lightspeedwp/.github/actions/permissions` → `sha_pinning_required: false`, `allowed_actions: "all"`.

Every active workflow *is* SHA-pinned, so this is latent rather than active risk. Two mitigating facts: #3515 added `.github/dependabot.yml` with the `github-actions` ecosystem, so pinned refs are now proposed for updates automatically; and the only floating pins in the tree are the 11 `actions/checkout@v4` refs inside `.github/tests/*.yml` (F1) — files that cannot run and would be deleted under #3570.

A pinning gate would still catch the next workflow that reaches for a tag, so this stays on the list as a policy gap rather than a defect.

---

## Reported findings that did NOT survive verification

Recorded so they are not re-raised. Each was checked and disproven against `develop`.

| Reported claim | Verdict | Evidence |
| --- | --- | --- |
| `changelog-unified.yml` uses a mutable `actions/checkout@v4` | ❌ False | `git grep -nE "uses: [a-z0-9_-]+/[a-z0-9_.-]+@v[0-9]"` over active workflows → **0 hits** |
| `changelog-unified.yml` / `documentation.yml` lack `permissions:` | ❌ False | **All 12** active workflows have a top-level `permissions:` block |
| `documentation.yml` interpolates untrusted context into `run:` | ❌ False | `actionlint 1.7.12` (includes its script-injection check) → **0 findings**; #3483 already moved interpolations into `env:` |
| `documentation.yml` creates issues without awaiting | ❌ Unsubstantiated | No `github-script` issue creation on that path |
| `pull_request_target` is a live privilege-escalation risk | ❌ False as stated | All three users (`ai-feedback-validation`, `orchestrate-phase-progression`, `phase-progression`) check out `ref: ${{ job.workflow_sha }}` — the trusted base ref, never the PR head — and `orchestrate-phase-progression.yml:109-116` gates on same-repo/trusted author |
| Workflows declare no shellcheck findings | ✅ True, and stronger than claimed | `actionlint 1.7.12` clean on all 12 |
| 68 archived workflows | ⚠️ Off by four | Actual: 72 |
| Active workflow README claims "22 active" | ❌ No such claim | No count claim found in `.github/README.md` |
| No test runner in CI | ⚠️ Partly true | No *general* runner; `labeling-unified.yml:66` runs one targeted suite |

Root cause of most false positives: a pass that inspected only the first 40 lines of a workflow for `^permissions:` (the real blocks sit at lines 51+), and a pass that read the all-branches workflow registry as if it were `develop`.

---

## Owner intent

Alignment checked against the repo owner's stated direction rather than inferred.

`#3488` (owner-attributed goal, 2026-09-23) sets two constraints that decide this audit's only open question:

> 7. **Nothing counts as working until it is tested.** Each shared workflow needs unit tests for its scripts…, a recorded passing and failing caller run, and a documented caller snippet.

> Inventory all workflows … Decide keep-local, reusable, template-only or delete for each.

F1/F2 are exactly the "counts as working without being tested" case the owner named. The prescribed verb is *delete*, so #3570 resolves the harness to deletion rather than relocation — relocating would resurrect a matrix for a superseded design (F4). F3 is a literal unfulfilled clause from #3478.

No recommendation here contradicts the current plan; #3570 is scoped to sit alongside #3488 and #3359, not to pre-empt them.

---

## Tracked in #3570

`#3570` — inert workflow test harness and dead composite actions give false CI assurance.
Labels `type:build-ci`, `area:ci-cd`, `area:workflows`, `meta:tech-debt`, `priority:high`, `status:needs-triage`.

## Already covered elsewhere — deliberately not re-raised

| Area | Tracked as |
| --- | --- |
| Reusable workflow layer, callers, rulesets, Dependabot, templates | #3488 |
| 71→5 consolidation workflows | #3359 |
| Jest CI gate | #3479 / #3487 |
| Jest discovery conventions | #3469 |
| `.test.cjs` files matching no runner | #3560 |
| Label authority conflict | #3545 / #3549 |
| Unpinned `pull_request_target` migration policy | platform-level, not repo-level |

## Suggested follow-ups not filed

- **The all-branches registry trap is unautomatable.** A CI check that `git ls-tree HEAD .github/workflows/` matches the expected active set would prevent the phantom-finding class. Small, self-contained, no owner decision needed.
- **F5 drift** is a one-line count correction in two files.
- **Spec 011 hygiene** — 0/122 tasks with outputs already on `develop` — makes `CATALOG.md` unreliable as a status source. Consider closing or re-baselining the spec; that is an owner call, not an audit call.
