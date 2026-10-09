# Quickstart: Validating Spec 020

**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

This guide describes how a reviewer proves the specification and, later, the implementation slices. It contains no implementation code. Fixture names are placeholders for the implementation slices to create.

## Prerequisites

- A clean working tree on a branch based on refreshed `develop`.
- Node.js and the repository's installed dependencies (`npm ci`).
- Fixture repositories for: plugin, theme, enhancement, ordinary `.github` target, optional `VERSION`, ambiguous headers, drift, repeated runs, invalid paths.

## Specification checks (this PR)

1. Lint the changed Markdown: `npm run lint:md`.
2. Confirm the catalog row exists and links resolve: run the catalog validation Bats suite under `tests/bash`.
3. Confirm numbering: `bash .specify/scripts/bash/audit-specs.sh`. Expected today: a gap at 019 until the reserved Qodo spec merges or the owner approves another resolution.
4. Confirm no change to locked governance files, source code, manifests, root version or root changelog (SC-010): `git diff --name-only origin/develop` lists only files under `.github/specs/`.

## Release readiness scenarios (R1 slice)

| Scenario | Expected |
|----------|----------|
| Consistent plugin, working directory elsewhere | `ready`; operations applied to the requested root; zero writes. |
| Theme with no `VERSION` file | Detected and `ready` using authoritative fields. |
| Ordinary repo with `.github`, `package.json`, `VERSION` | Not classified as governance. |
| Drift or ambiguity | `not-ready` with `version-drift` or `version-ambiguous`, sources named. |
| Dirty tree, unsafe path, tag conflict | `not-ready` with the matching blocker; nothing staged or stashed. |
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
| `verified` with evidence | Readiness may complete. |
| `failed`, missing, malformed or unavailable responder | `not-ready` with `changelog-unverified`. |

Contracts: [readiness-report](./contracts/readiness-report.md), [verification-handoff](./contracts/verification-handoff.md), [agent-package-layout](./contracts/agent-package-layout.md). Entities: [data-model.md](./data-model.md).
