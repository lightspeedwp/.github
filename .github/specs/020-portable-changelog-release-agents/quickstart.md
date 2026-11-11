# Quickstart: Validating Spec 020

**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

This guide describes how a reviewer proves the specification and, later, the implementation slices. It contains no implementation code. Fixture names are placeholders for the implementation slices to create.

## Prerequisites

- A clean working tree on a branch based on refreshed `develop`.
- Node.js and the repository's installed dependencies (`npm ci`).
- Fixture repositories for: plugin, theme, enhancement, ordinary `.github` target, optional `VERSION`, ambiguous headers, drift, repeated runs, invalid paths.

## Test environment (for the implementation slices)

Fixtures are committed files under each agent's `tests/fixtures/`. Names below are placeholders; the slices decide the final layout.

- **Release agent fixtures**: plugin, theme, enhancement with a declaration in the target's own instructions, enhancement without one (expect `component-unknown`), ordinary `.github` target that is not governance, no `VERSION` file, ambiguous headers, version drift, repeated run, invalid paths (symlink, `..` escape, special characters), tag conflict.
- **Changelog agent fixtures**: valid Unreleased section, entry outside the allowed categories, empty Unreleased, only released sections, entry over the length limit, no workflow files present, hand edit between draft and apply.

### Portable-install check (T046, T047)

1. Copy only the agent package into a fresh temporary directory outside the repository checkout.
2. Run the readiness (release) or verify (changelog) operation against a copied fixture, with an explicit `repoRoot`.
3. Expected: every resource (bundled engine, skills, adapters) resolves from inside the copied package, and the result names the engine version where one is used.

### Repeated-run check

1. Run the same read-only operation twice against an unchanged fixture.
2. Expected: identical output and no file changes.

### Hand edit between draft and apply (SC-011)

1. Run the draft operation on a copied fixture and record the digest it shows.
2. Edit the copied `CHANGELOG.md` by hand.
3. Attempt the approved apply with the recorded digest.
4. Expected: digest mismatch is reported and the copy is byte-identical to its state after the hand edit. Always work on a temporary copy, never the committed fixture.

## Specification checks (this PR)

1. Lint the changed Markdown: `npm run lint:md`.
2. Confirm the catalog row exists and links resolve: run the catalog validation Bats suite under `tests/bash`.
3. Confirm numbering: `bash .specify/scripts/bash/audit-specs.sh`. Expected today: a gap at 019 until the reserved Qodo spec merges or the owner approves another resolution.
4. Confirm no change to locked governance files, source code, manifests, root version or root changelog (SC-010): `git diff --name-only origin/develop` lists only files under `.github/specs/`.

## Release readiness scenarios (R1 slice)

| Scenario | Expected |
|----------|----------|
| Consistent plugin, working directory elsewhere | Readiness checks pass with no blocker other than `changelog-unverified`; operations applied to the requested root; zero writes. Overall `ready` only after the US3 handoff records verification success; until then `not-ready` with `changelog-unverified`. |
| Theme with no `VERSION` file | Detected, and readiness checks pass using authoritative fields; overall `ready` follows the same US3 rule. |
| Ordinary repo with `.github`, `package.json`, `VERSION` | Not classified as governance. |
| Drift or ambiguity | `not-ready` with `version-drift` or `version-ambiguous`, sources named. |
| Dirty tree, unsafe path, tag conflict | `not-ready` with the matching blocker; nothing staged or stashed. |
| Target names no required checks | `not-ready` with `missing-check`. |
| Enhancement whose instructions do not declare it | `not-ready` with `component-unknown`. |
| Interrupted approved edit | Repository recoverable; not reported ready. |
| Approval digest does not match the edit about to be applied | Zero files written; mismatch reported. |

## Changelog scenarios (C2 slice)

| Scenario | Expected |
|----------|----------|
| Valid Unreleased entries | Draft proposed; no file change. |
| Invalid category | Reported with the six allowed categories. |
| Approved apply | Historic entries and links byte-identical. |
| Second run, no new entries | No change. |
| No `changelog.yml` or `release.yml` present | All MVP behaviour works. |

## Handoff scenarios

| Scenario | Expected |
|----------|----------|
| `verified` handback meeting every contract rule, with independently trusted execution evidence | Readiness may complete. |
| `failed`, missing, malformed or unavailable responder | `not-ready` with `changelog-unverified`. |
| Forged matching evidence (hashes match, execution not independently verified) | `not-ready`; matching hashes bind content but do not prove execution. |
| Stale snapshot (target changed after the request) | `not-ready`; no files change. |
| Missing or skipped required check | `not-ready`. |

"Verified with evidence" alone does not establish readiness. Until required link verification and independently trusted execution are available, populated release candidates remain `not-ready`. Every failure leaves `proposedEdits` and `writeSet` empty and `writes` at `0`.

Fixture expectations are not delivery evidence; record only observed results.

Contracts: [readiness-report](./contracts/readiness-report.md), [verification-handoff](./contracts/verification-handoff.md), [agent-package-layout](./contracts/agent-package-layout.md). Entities: [data-model.md](./data-model.md).
