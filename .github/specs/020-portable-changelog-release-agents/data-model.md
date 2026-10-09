# Data Model: Portable Changelog and WordPress Release Preparation Agents

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

Entities are conceptual. They describe what each agent must know and the states it moves through, not storage schemas.

## Target repository

| Field | Meaning |
|-------|---------|
| `repoRoot` | Explicit absolute path supplied by the caller. Never defaulted from the process working directory. |
| `componentType` | `plugin`, `theme`, `enhancement` or `unknown`. `unknown` is a stop, not a guess. An enhancement is recognised only when the target's own instructions declare it and name its version fields. |
| `instructionsFound` | Whether the target's own instructions name authoritative version fields. |

**Rules**: an ordinary repository that merely contains `.github/`, `package.json` and `VERSION` is not a governance repository (FR-003). Detection must never require `VERSION`.

## Version source

| Field | Meaning |
|-------|---------|
| `kind` | plugin header, readme stable tag, theme stylesheet, package, `VERSION`. |
| `path` | Repository-relative path, validated to stay inside `repoRoot`. |
| `value` | Detected version string. |
| `authoritative` | True only when the target's instructions designate it. |

**Rules**: if no source is designated, every detected value is reported and the result is `ambiguous` (FR-004). Differing values across sources are `drift`.

## Readiness report

See [contracts/readiness-report.md](./contracts/readiness-report.md). States:

```text
not-run -> ready | not-ready
```

`ready` requires: component detected, no drift, no ambiguity, clean tree, safe paths, no conflicting tag evidence, no `missing-check` blocker, and (when the handoff is in play) recorded changelog verification success.

## Preparation edit

| Field | Meaning |
|-------|---------|
| `path` | Allowlisted version-field file. |
| `from`, `to` | Current and target version. |
| `approval` | Digest of the exact proposed edit, supplied by the maintainer (FR-029). Absent or non-matching means the edit must not run. |
| `backup` | Recovery point captured before the edit. |

States: `proposed -> approved -> applied | failed-recovered`. A `failed` edit that cannot be recovered is never reported as ready.

## Changelog entry

| Field | Meaning |
|-------|---------|
| `category` | One of Added, Changed, Deprecated, Removed, Fixed, Security. |
| `text` | Entry text, subject to the repository's length and link rules. |
| `link` | Pull request or issue reference where required. |
| `section` | `Unreleased` or a version heading. |

**Rules**: historic sections and links are preserved byte-for-byte; Unreleased handling is idempotent.

## Verification handoff

See [contracts/verification-handoff.md](./contracts/verification-handoff.md). States:

```text
requested -> verified | failed | missing

`missing` means no response was returned within the same invocation; no timer applies (FR-014).
```

Only `verified` with evidence allows the release agent to report ready. `failed`, `missing` and no response all yield not-ready.

## Delivery slice

| Field | Meaning |
|-------|---------|
| `id` | Profile code from the delivery plan (S, F, R1, C2, DEC, DOC, SETUP, DIST, WFLOW, ROLLBACK). |
| `issues` | Full GitHub issue URLs, and the Linear identifier once confirmed. |
| `branch`, `base`, `template` | As recorded in `delivery-plan.md` once written. |
| `closure` | Which issues the slice may close; partial work uses reference-only wording. |
